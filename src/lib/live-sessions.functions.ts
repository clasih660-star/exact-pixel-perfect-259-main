/**
 * live-sessions.functions.ts — Phase 2 classroom session lifecycle.
 *
 * A "session" is one delivery of a lesson inside the classroom. For AI-teacher
 * mode each learner gets their own session (so progress, notes, transcript, and
 * events attach to a real `classroom_sessions` row). Human-live / hybrid sessions
 * are created by a teacher and joined by many learners.
 *
 * This service runs on tables that already exist (classroom_sessions,
 * session_participants) — it does NOT depend on the newer Phase 2 tables — so it
 * works today and gives the rest of the live/hybrid layer a stable foundation.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Start (or resume) an AI-teacher session for the current learner on a lesson. */
export const startLearnerSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ lesson_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: lesson, error: lErr } = await supabase
      .from("lessons")
      .select("id, course_id, institution_id")
      .eq("id", data.lesson_id)
      .single();
    if (lErr || !lesson) throw new Error(lErr?.message ?? "Lesson not found");

    // Reuse a still-live session this learner already owns for this lesson.
    const { data: existing } = await supabase
      .from("classroom_sessions")
      .select("id, status")
      .eq("lesson_id", data.lesson_id)
      .eq("host_user_id", userId)
      .eq("status", "live")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let sessionId = existing?.id as string | undefined;
    if (!sessionId) {
      const { data: row, error } = await supabase
        .from("classroom_sessions")
        .insert({
          institution_id: lesson.institution_id,
          course_id: lesson.course_id,
          lesson_id: lesson.id,
          host_user_id: userId,
          mode: "ai_teacher",
          status: "live",
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      sessionId = row.id;
    }

    // Record the learner as a participant (idempotent on session+user).
    const db = supabase as any;
    await db
      .from("session_participants")
      .upsert(
        {
          session_id: sessionId,
          user_id: userId,
          role: "student",
          status: "joined",
          joined_at: new Date().toISOString(),
        },
        { onConflict: "session_id,user_id" },
      );

    return { sessionId };
  });

/** A teacher creates a live or hybrid session for a lesson (scheduled or live). */
export const createTeacherSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        lesson_id: z.string().uuid(),
        mode: z.enum(["ai_teacher", "human_teacher", "hybrid"]).default("human_teacher"),
        scheduled_start_at: z.string().datetime().optional(),
        start_now: z.boolean().default(false),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: lesson, error: lErr } = await supabase
      .from("lessons")
      .select("id, course_id, institution_id")
      .eq("id", data.lesson_id)
      .single();
    if (lErr || !lesson) throw new Error(lErr?.message ?? "Lesson not found");

    const { data: row, error } = await supabase
      .from("classroom_sessions")
      .insert({
        institution_id: lesson.institution_id,
        course_id: lesson.course_id,
        lesson_id: lesson.id,
        host_user_id: userId,
        mode: data.mode,
        status: data.start_now ? "live" : "scheduled",
        scheduled_start_at: data.scheduled_start_at ?? null,
        started_at: data.start_now ? new Date().toISOString() : null,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { session: row };
  });

/** End a session: mark completed and stamp the leave time for participants. */
export const endSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ session_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const nowIso = new Date().toISOString();

    const { error } = await supabase
      .from("classroom_sessions")
      .update({ status: "completed", ended_at: nowIso })
      .eq("id", data.session_id);
    if (error) throw new Error(error.message);

    const db = supabase as any;
    await db
      .from("session_participants")
      .update({ status: "left", left_at: nowIso })
      .eq("session_id", data.session_id)
      .eq("user_id", userId)
      .is("left_at", null);

    return { ok: true };
  });

/** Mark the current user as having left a session (without ending it for others). */
export const leaveSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ session_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    await db
      .from("session_participants")
      .update({ status: "left", left_at: new Date().toISOString() })
      .eq("session_id", data.session_id)
      .eq("user_id", context.userId);
    return { ok: true };
  });

/** Institution monitoring: currently-live classrooms with participant counts. */
export const listActiveSessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: sessions, error } = await supabase
      .from("classroom_sessions")
      .select("id, course_id, lesson_id, mode, status, started_at, host_user_id, lessons(title), courses(title)")
      .eq("institution_id", data.institution_id)
      .eq("status", "live")
      .order("started_at", { ascending: false });
    if (error) throw new Error(error.message);

    const rows = (sessions ?? []) as any[];
    // Attach a live participant count per session (best-effort).
    const db = supabase as any;
    const withCounts = await Promise.all(
      rows.map(async (s) => {
        const { count } = await db
          .from("session_participants")
          .select("id", { count: "exact", head: true })
          .eq("session_id", s.id)
          .eq("status", "joined");
        const lesson = Array.isArray(s.lessons) ? s.lessons[0] : s.lessons;
        const course = Array.isArray(s.courses) ? s.courses[0] : s.courses;
        return {
          id: s.id as string,
          courseId: s.course_id as string,
          lessonId: s.lesson_id as string,
          mode: s.mode as string,
          startedAt: s.started_at as string | null,
          lessonTitle: lesson?.title ?? "Lesson",
          courseTitle: course?.title ?? "Course",
          participantCount: count ?? 0,
        };
      }),
    );
    return { sessions: withCounts };
  });
