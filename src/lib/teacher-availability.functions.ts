/**
 * teacher-availability.functions.ts
 *
 * Server functions for teachers to set their available time slots and for
 * students to browse and book sessions in available classrooms.
 *
 * Tables touched:
 *   - teacher_weekly_availability (teacher's weekly/open slots)
 *   - classroom_sessions (scheduled, live, completed)
 *   - session_participants (student bookings)
 *   - virtual_classrooms (capacity enforcement)
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------------------------------------------------------------------------
// Teacher: set available slots
// ---------------------------------------------------------------------------

const SlotSchema = z.object({
  day_of_week: z.number().int().min(0).max(6), // 0=Sun, 6=Sat
  start_time: z.string().regex(/^\d{2}:\d{2}$/), // "09:00"
  end_time: z.string().regex(/^\d{2}:\d{2}$/), // "11:00"
  timezone: z.string().default("UTC"),
});

export const setTeacherAvailability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        institution_id: z.string().uuid(),
        slots: z.array(SlotSchema).min(1),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) {
      return { ok: true, slots: data.slots.length };
    }

    // Delete existing slots for this teacher/institution, then insert new ones
    const db = supabase as any;
    await db
      .from("teacher_weekly_availability")
      .delete()
      .eq("teacher_id", userId)
      .eq("institution_id", data.institution_id);

    const rows = data.slots.map((slot: { day_of_week: number; start_time: string; end_time: string; timezone: string }) => ({
      teacher_id: userId,
      institution_id: data.institution_id,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      timezone: slot.timezone,
      is_active: true,
    }));

    const { error } = await db.from("teacher_weekly_availability").insert(rows);
    if (error) throw new Error(error.message);

    return { ok: true, slots: rows.length };
  });

// ---------------------------------------------------------------------------
// Teacher: get own availability
// ---------------------------------------------------------------------------

export const getTeacherAvailability = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) {
      return { slots: [] };
    }

    const { data: rows, error } = await (supabase as any)
      .from("teacher_weekly_availability")
      .select("*")
      .eq("teacher_id", userId)
      .eq("institution_id", data.institution_id)
      .eq("is_active", true)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw new Error(error.message);
    return { slots: rows ?? [] };
  });

// ---------------------------------------------------------------------------
// Student: browse ALL bookable sessions across their enrolled courses
// ---------------------------------------------------------------------------

export const listAllBookableSessionsForStudent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { window_days?: number }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) {
      return { sessions: [] };
    }

    const db = supabase as any;
    const horizon = new Date(
      Date.now() + (data.window_days ?? 14) * 24 * 3_600_000,
    ).toISOString();

    // Get all courses the student is enrolled in.
    const { data: enrollments } = await db
      .from("course_enrollments")
      .select("course_id")
      .eq("student_id", userId)
      .eq("status", "active");

    const courseIds = (enrollments ?? []).map((e: any) => e.course_id);
    if (courseIds.length === 0) return { sessions: [] };

    // Get scheduled + live sessions for these courses.
    const { data: sessions, error } = await db
      .from("classroom_sessions")
      .select(
        `id, lesson_id, mode, status, scheduled_start_at, started_at,
         course_id, host_user_id,
         lessons(title), courses(title), virtual_classrooms(name, capacity),
         profiles:host_user_id(full_name)`,
      )
      .in("course_id", courseIds)
      .in("status", ["scheduled", "live"])
      .lte("scheduled_start_at", horizon)
      .order("scheduled_start_at", { ascending: true })
      .limit(50);

    if (error) throw new Error(error.message);

    // Enrich with participant counts.
    const enriched = await Promise.all(
      (sessions ?? []).map(async (s: any) => {
        const { count } = await db
          .from("session_participants")
          .select("id", { count: "exact", head: true })
          .eq("session_id", s.id)
          .is("left_at", null);

        const lesson = Array.isArray(s.lessons) ? s.lessons[0] : s.lessons;
        const course = Array.isArray(s.courses) ? s.courses[0] : s.courses;
        const vc = Array.isArray(s.virtual_classrooms)
          ? s.virtual_classrooms[0]
          : s.virtual_classrooms;
        const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;

        return {
          id: s.id,
          lesson_title: lesson?.title ?? "Lesson",
          course_title: course?.title ?? "Course",
          mode: s.mode,
          status: s.status,
          scheduled_start_at: s.scheduled_start_at,
          started_at: s.started_at,
          teacher_name: profile?.full_name ?? null,
          classroom_name: vc?.name ?? null,
          capacity: vc?.capacity ?? null,
          enrolled_count: count ?? 0,
        };
      }),
    );

    return { sessions: enriched };
  });

// ---------------------------------------------------------------------------
// Student: browse bookable sessions for a single course
// ---------------------------------------------------------------------------

export const listBookableSessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabase } = context;

    if (!supabase) {
      return { sessions: [] };
    }

    // Get scheduled + live sessions for this course
    const { data: sessions, error } = await (supabase as any)
      .from("classroom_sessions")
      .select(
        `id, lesson_id, mode, status, scheduled_start_at, started_at,
         host_user_id, lessons(title), virtual_classrooms(name, capacity)`,
      )
      .eq("course_id", data.course_id)
      .in("status", ["scheduled", "live"])
      .order("scheduled_start_at", { ascending: true });

    if (error) throw new Error(error.message);

    // For each session, count current participants
    const db = supabase as any;
    const enriched = await Promise.all(
      (sessions ?? []).map(async (s: any) => {
        const { count } = await db
          .from("session_participants")
          .select("id", { count: "exact", head: true })
          .eq("session_id", s.id)
          .is("left_at", null);

        const lesson = Array.isArray(s.lessons) ? s.lessons[0] : s.lessons;
        const vc = Array.isArray(s.virtual_classrooms) ? s.virtual_classrooms[0] : s.virtual_classrooms;

        return {
          id: s.id as string,
          lessonId: s.lesson_id as string,
          lessonTitle: lesson?.title ?? "Lesson",
          mode: s.mode as string,
          status: s.status as string,
          scheduledStartAt: s.scheduled_start_at as string | null,
          startedAt: s.started_at as string | null,
          hostUserId: s.host_user_id as string,
          classroomName: vc?.name ?? null,
          capacity: vc?.capacity as number | null,
          currentParticipants: count ?? 0,
        };
      }),
    );

    return { sessions: enriched };
  });

// ---------------------------------------------------------------------------
// Student: join / book a session (with capacity enforcement)
// ---------------------------------------------------------------------------

export const joinSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({ session_id: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) {
      return { ok: true, joined: true };
    }

    const db = supabase as any;

    // 1. Get the session and its capacity (from virtual_classrooms if linked)
    const { data: session, error: sessionError } = await db
      .from("classroom_sessions")
      .select("id, status, institution_id, course_id, lesson_id")
      .eq("id", data.session_id)
      .single();

    if (sessionError || !session) throw new Error("Session not found");

    if (session.status === "completed") {
      throw new Error("This session has already ended.");
    }

    // 2. Check capacity if the session is linked to a virtual classroom
    const { data: vc } = await db
      .from("virtual_classrooms")
      .select("capacity")
      .eq("institution_id", session.institution_id)
      .limit(1)
      .maybeSingle();

    if (vc?.capacity) {
      const { count } = await db
        .from("session_participants")
        .select("id", { count: "exact", head: true })
        .eq("session_id", data.session_id)
        .is("left_at", null);

      if ((count ?? 0) >= vc.capacity) {
        throw new Error(
          `This classroom is full (${vc.capacity} learners max). Please try another session.`,
        );
      }
    }

    // 3. Upsert participant (join or rejoin)
    const { error: joinError } = await db.from("session_participants").upsert(
      {
        session_id: data.session_id,
        user_id: userId,
        role: "student",
        joined_at: new Date().toISOString(),
        left_at: null,
      },
      { onConflict: "session_id,user_id" },
    );

    if (joinError) throw new Error(joinError.message);

    // 4. Log the join event
    await db.from("session_events").insert({
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      student_id: userId,
      actor_user_id: userId,
      actor_role: "student",
      event_type: "student_joined",
      event_source: "teacher-availability.functions.joinSession",
      payload_json: {},
    });

    return { ok: true, joined: true };
  });

// ---------------------------------------------------------------------------
// Student: check if already joined a session
// ---------------------------------------------------------------------------

export const checkSessionMembership = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) return { joined: false, role: null };

    const { data: row } = await (supabase as any)
      .from("session_participants")
      .select("role, left_at")
      .eq("session_id", data.session_id)
      .eq("user_id", userId)
      .maybeSingle();

    return {
      joined: row != null && row.left_at == null,
      role: row?.role ?? null,
    };
  });
