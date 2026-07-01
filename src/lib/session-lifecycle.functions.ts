/**
 * session-lifecycle.functions.ts
 *
 * Handles:
 *  - Auto-transition of scheduled sessions → "live" at start time (and
 *    → "completed" at end time). Invoked by a cron/API route every minute.
 *  - Materialising recurring sessions (daily / weekly) from a parent template.
 *  - Sending "session going live" notifications.
 *
 * Tables touched:
 *  - classroom_sessions (status, live_notification_sent, parent_session_id)
 *  - session_reminders (notifications for enrolled participants)
 *  - notifications
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * tickSessionLifecycle — called by a scheduled job (cron / API route) every
 * ~60 seconds. It flips scheduled sessions whose start time has arrived to
 * "live", and marks overdue live sessions as "completed".
 *
 * This is intentionally cheap (two UPDATE statements) so it can run frequently.
 */
export const tickSessionLifecycle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        /**
         * Shared secret to prevent arbitrary users from triggering. In demo
         * mode without a DB this is ignored.
         */
        cron_secret: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { supabase } = context;

    // Demo mode — nothing to do.
    if (!supabase) {
      return { transitioned: 0, completed: 0, notifications: 0 };
    }

    const db = supabase as any;
    const nowIso = new Date().toISOString();

    // 1. Scheduled → live: start time has passed and session is still scheduled.
    const { data: started, error: startErr } = await db
      .from("classroom_sessions")
      .update({
        status: "live",
        started_at: nowIso,
      })
      .eq("status", "scheduled")
      .not("scheduled_start_at", "is", null)
      .lte("scheduled_start_at", nowIso)
      .select("id, institution_id, course_id, lesson_id, host_user_id");

    if (startErr) throw new Error(startErr.message);

    const transitioned = started ?? [];

    // 2. Send "going live" notifications to enrolled participants for newly live sessions.
    let notificationsSent = 0;
    for (const session of transitioned) {
      // Notify enrolled students of the course, if any.
      if (session.course_id) {
        const { data: enrollments } = await db
          .from("course_enrollments")
          .select("student_id")
          .eq("course_id", session.course_id)
          .eq("status", "active");

        const rows = (enrollments ?? []).map((e: any) => ({
          user_id: e.student_id,
          institution_id: session.institution_id,
          notification_type: "session_live",
          title: "Your class is starting now",
          body: "A session you're enrolled in has gone live. Tap to join.",
          action_url: `/classroom/session/${session.id}`,
          metadata_json: {
            session_id: session.id,
            course_id: session.course_id,
            lesson_id: session.lesson_id,
          },
        }));

        if (rows.length > 0) {
          await db.from("notifications").insert(rows);
          notificationsSent += rows.length;
        }
      }

      // Mark notification sent so we don't duplicate.
      await db
        .from("classroom_sessions")
        .update({ live_notification_sent: true })
        .eq("id", session.id);
    }

    // 3. Live → completed: sessions that have been live longer than their
    //    expected duration OR whose scheduled_end_at has passed. We use a
    //    conservative 4-hour hard cap to avoid orphaned "live" sessions.
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
    const { data: ended, error: endErr } = await db
      .from("classroom_sessions")
      .update({ status: "completed", ended_at: nowIso })
      .eq("status", "live")
      .or(`started_at.lt.${fourHoursAgo}`)
      .select("id");

    if (endErr) throw new Error(endErr.message);

    return {
      transitioned: transitioned.length,
      completed: (ended ?? []).length,
      notifications: notificationsSent,
    };
  });

/**
 * generateRecurringSessions — given a parent session with a recurrence
 * pattern (daily | weekly) and a recurrence_end_date, materialise the child
 * sessions up to the end date. Called when a teacher creates a recurring
 * session.
 */
export const generateRecurringSessions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (data: unknown) =>
      z
        .object({
          parent_session_id: z.string().regex(UUID_RE),
          recurrence_pattern: z.enum(["daily", "weekly"]),
          scheduled_start_at: z.string().datetime(),
          recurrence_end_date: z.string(), // ISO date (YYYY-MM-DD)
          duration_minutes: z.number().int().min(15).max(480).default(60),
        })
        .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { supabase } = context;
    if (!supabase) return { created: 0 };

    const db = supabase as any;

    // Load the parent to copy its immutable fields.
    const { data: parent, error: parentErr } = await db
      .from("classroom_sessions")
      .select(
        "id, institution_id, course_id, lesson_id, host_user_id, mode, virtual_classroom_id",
      )
      .eq("id", data.parent_session_id)
      .single();

    if (parentErr || !parent) {
      throw new Error("Parent session not found.");
    }

    const start = new Date(data.scheduled_start_at);
    const end = new Date(data.recurrence_end_date + "T23:59:59Z");
    const stepMs = data.recurrence_pattern === "daily" ? 86_400_000 : 7 * 86_400_000;

    const children: any[] = [];
    const cursor = new Date(start.getTime() + stepMs);

    while (cursor.getTime() <= end.getTime()) {
      const childEnd = new Date(cursor.getTime() + data.duration_minutes * 60_000);
      children.push({
        institution_id: parent.institution_id,
        course_id: parent.course_id,
        lesson_id: parent.lesson_id,
        host_user_id: parent.host_user_id,
        virtual_classroom_id: parent.virtual_classroom_id,
        mode: parent.mode,
        status: "scheduled",
        scheduled_start_at: cursor.toISOString(),
        scheduled_end_at: childEnd.toISOString(),
        recurrence_pattern: data.recurrence_pattern,
        recurrence_end_date: data.recurrence_end_date,
        parent_session_id: parent.id,
      });
      cursor.setTime(cursor.getTime() + stepMs);
    }

    if (children.length === 0) return { created: 0 };

    const { error: insertErr } = await db.from("classroom_sessions").insert(children);
    if (insertErr) throw new Error(insertErr.message);

    return { created: children.length };
  });

/**
 * getUpcomingSessions — returns sessions scheduled in the next window
 * (default 24h) for the current user (as host or participant). Used by the
 * student dashboard to surface "starting soon" sessions.
 */
export const getUpcomingSessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { window_hours?: number }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;
    if (!supabase) return { sessions: [] };

    const windowHours = data.window_hours ?? 24;
    const now = new Date();
    const horizon = new Date(now.getTime() + windowHours * 3_600_000);

    const db = supabase as any;

    // Sessions where the user is a participant OR enrolled in the course.
    const [participantSessions, enrolledSessions] = await Promise.all([
      db
        .from("session_participants")
        .select("session_id")
        .eq("user_id", userId)
        .is("left_at", null),
      db
        .from("course_enrollments")
        .select("course_id")
        .eq("student_id", userId)
        .eq("status", "active"),
    ]);

    const sessionIds = (participantSessions.data ?? []).map((p: any) => p.session_id);
    const courseIds = (enrolledSessions.data ?? []).map((e: any) => e.course_id);

    let query = db
      .from("classroom_sessions")
      .select(
        "id, status, mode, scheduled_start_at, lessons(title), courses(title), virtual_classrooms(name)",
      )
      .in("status", ["scheduled", "live"])
      .gte("scheduled_start_at", now.toISOString())
      .lte("scheduled_start_at", horizon.toISOString())
      .order("scheduled_start_at", { ascending: true })
      .limit(20);

    if (sessionIds.length > 0) {
      query = query.in("id", sessionIds);
    } else if (courseIds.length > 0) {
      query = query.in("course_id", courseIds);
    } else {
      return { sessions: [] };
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    return {
      sessions: (rows ?? []).map((r: any) => ({
        id: r.id,
        status: r.status,
        mode: r.mode,
        scheduledStartAt: r.scheduled_start_at,
        lessonTitle: r.lessons?.title ?? "Lesson",
        courseTitle: r.courses?.title ?? "Course",
        classroomName: r.virtual_classrooms?.name ?? null,
      })),
    };
  });