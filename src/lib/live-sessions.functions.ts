/**
 * live-sessions.functions.ts — Phase 2 classroom session lifecycle.
 *
 * In demo mode (Supabase not configured), all functions return mock data
 * so the classroom works without a database.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  assertActorCanAccessInstitution,
  assertActorCanAccessLesson,
  assertActorCanAccessSession,
} from "@/lib/server-authorization";

/** Start (or resume) an AI-teacher session for the current learner on a lesson. */
export const startLearnerSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ lesson_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    // Demo mode — return a mock session ID
    if (!supabase) {
      return { sessionId: `demo-session-${Date.now()}` };
    }

    const lesson = await assertActorCanAccessLesson(context, data.lesson_id);

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

    const db = supabase as any;
    await db.from("session_participants").upsert(
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

/** A teacher creates a live or hybrid session for a lesson. */
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
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) {
      return {
        session: {
          id: `demo-session-${Date.now()}`,
          mode: data.mode,
          status: data.start_now ? "live" : "scheduled",
          started_at: data.start_now ? new Date().toISOString() : null,
        },
      };
    }

    const lesson = await assertActorCanAccessLesson(context, data.lesson_id, {
      requireStaff: true,
      allowEnrolledStudent: false,
    });

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

/** End a session. */
export const endSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ session_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) return { ok: true };

    await assertActorCanAccessSession(context, data.session_id, { requireModerator: true });

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

/** Mark the current user as having left a session. */
export const leaveSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ session_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) return { ok: true };
    await assertActorCanAccessSession(context, data.session_id);
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
  .handler(async ({ data, context }: any) => {
    const { supabase } = context;

    if (!supabase) {
      return { sessions: [] };
    }

    await assertActorCanAccessInstitution(context, data.institution_id, { requireStaff: true });

    const { data: sessions, error } = await supabase
      .from("classroom_sessions")
      .select(
        "id, course_id, lesson_id, mode, status, started_at, host_user_id, lessons(title), courses(title)",
      )
      .eq("institution_id", data.institution_id)
      .eq("status", "live")
      .order("started_at", { ascending: false });
    if (error) throw new Error(error.message);

    const rows = (sessions ?? []) as any[];
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
