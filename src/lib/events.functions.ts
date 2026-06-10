import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Event Recording System
 * ----------------------
 * The audit trail / proof-of-delivery layer for the AI teacher. Every meaningful
 * thing that happens inside a classroom session is recorded to `session_events`
 * so institutions can later report on, replay, and trust what was taught.
 *
 * Canonical event_type values (free-form text, but keep to this vocabulary):
 *   session_started, session_resumed, session_completed,
 *   section_started, board_written, teacher_explained,
 *   question_asked, question_answered, checkpoint_triggered,
 *   practice_attempted, practice_correct, hand_raised,
 *   notes_saved, misconception_detected
 */

const ACTOR_ROLES = ["student", "teacher", "ai_teacher", "system"] as const;

const RecordSchema = z.object({
  session_id: z.string().uuid(),
  event_type: z.string().trim().min(1).max(80),
  actor_role: z.enum(ACTOR_ROLES).default("ai_teacher"),
  event_source: z.string().trim().max(60).optional(),
  student_id: z.string().uuid().optional(),
  payload: z.record(z.any()).optional(),
});

/**
 * Record a single classroom event. Derives institution/course/lesson from the
 * session so callers only need the session_id plus the event details.
 */
export const recordSessionEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => RecordSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: session, error: sErr } = await context.supabase
      .from("classroom_sessions")
      .select("institution_id, course_id, lesson_id")
      .eq("id", data.session_id)
      .single();
    if (sErr) throw new Error(sErr.message);

    const { data: row, error } = await context.supabase
      .from("session_events")
      .insert({
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        student_id: data.student_id ?? context.userId,
        actor_user_id: context.userId,
        actor_role: data.actor_role,
        event_type: data.event_type,
        event_source: data.event_source ?? "classroom",
        payload_json: data.payload ?? {},
      })
      .select("id, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, created_at: row.created_at };
  });

/**
 * Full ordered event log for one session — drives session replay & audit.
 */
export const listSessionEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) =>
    z.object({ session_id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("session_events")
      .select("id, event_type, actor_role, event_source, payload_json, student_id, created_at")
      .eq("session_id", data.session_id)
      .order("created_at", { ascending: true })
      .limit(2000);
    if (error) throw new Error(error.message);
    return { events: rows ?? [] };
  });

/**
 * Recent activity feed for an institution dashboard — the latest events across
 * every course/session, newest first.
 */
export const getInstitutionActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string; limit?: number }) =>
    z
      .object({
        institution_id: z.string().uuid(),
        limit: z.number().int().min(1).max(100).default(20),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("session_events")
      .select("id, event_type, actor_role, course_id, lesson_id, session_id, payload_json, created_at")
      .eq("institution_id", data.institution_id)
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return { events: rows ?? [] };
  });
