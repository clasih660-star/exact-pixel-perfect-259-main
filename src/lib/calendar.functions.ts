import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAuditLog, requireInstitutionStaffAccess } from "@/lib/institution-admin.foundation";
import { queueEmailJob } from "@/lib/onboarding.foundation";

export const listCalendarEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string; course_id?: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await requireInstitutionStaffAccess(supabaseAdmin, data.institution_id, context.userId);
    let query = supabaseAdmin
      .from("calendar_events")
      .select("*")
      .eq("institution_id", data.institution_id)
      .order("starts_at", { ascending: true });
    if (data.course_id) query = query.eq("course_id", data.course_id);
    const { data: events, error } = await query;
    if (error) throw new Error(error.message);
    return { events: events ?? [] };
  });

export const scheduleInstitutionSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        institution_id: z.string().uuid(),
        course_id: z.string().uuid(),
        lesson_id: z.string().uuid(),
        title: z.string().trim().min(1).max(200),
        description: z.string().trim().max(4000).optional(),
        starts_at: z.string().datetime(),
        ends_at: z.string().datetime().optional(),
        timezone: z.string().trim().min(1).max(100).default("UTC"),
        mode: z.enum(["ai_teacher", "human_teacher", "hybrid"]).default("ai_teacher"),
        reminder_offsets_minutes: z.array(z.number().int().min(5).max(10080)).default([1440, 60]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const access = await requireInstitutionStaffAccess(
      supabaseAdmin,
      data.institution_id,
      context.userId,
    );

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("classroom_sessions")
      .insert({
        institution_id: data.institution_id,
        course_id: data.course_id,
        lesson_id: data.lesson_id,
        host_user_id: context.userId,
        mode: data.mode,
        status: "scheduled",
        scheduled_start_at: data.starts_at,
      })
      .select("*")
      .single();
    if (sessionError || !session)
      throw new Error(sessionError?.message || "Could not schedule session.");

    const { data: event, error: eventError } = await supabaseAdmin
      .from("calendar_events")
      .insert({
        institution_id: data.institution_id,
        course_id: data.course_id,
        lesson_id: data.lesson_id,
        session_id: session.id,
        created_by: context.userId,
        title: data.title,
        description: data.description ?? null,
        starts_at: data.starts_at,
        ends_at: data.ends_at ?? null,
        timezone: data.timezone,
        audience: "institution",
        status: "scheduled",
      })
      .select("*")
      .single();
    if (eventError || !event)
      throw new Error(eventError?.message || "Could not create calendar event.");

    const { data: enrollments } = await supabaseAdmin
      .from("course_enrollments")
      .select("student_id, profile:profiles(email, full_name)")
      .eq("course_id", data.course_id)
      .eq("status", "active");

    const reminderRows: any[] = [];
    for (const enrollment of enrollments ?? []) {
      const profile = Array.isArray(enrollment.profile)
        ? enrollment.profile[0]
        : enrollment.profile;
      for (const offset of data.reminder_offsets_minutes) {
        const scheduledFor = new Date(
          new Date(data.starts_at).getTime() - offset * 60 * 1000,
        ).toISOString();
        let emailJobId: string | null = null;

        if (profile?.email) {
          const emailJob = await queueEmailJob(supabaseAdmin, {
            institutionId: data.institution_id,
            relatedUserId: enrollment.student_id,
            kind: "session_reminder",
            templateKey: "session_reminder",
            toEmail: profile.email,
            toName: profile.full_name ?? null,
            subject: `Upcoming Klassruum session: ${data.title}`,
            idempotencyKey: `session:${session.id}:student:${enrollment.student_id}:offset:${offset}`,
            scheduledFor,
            payload: {
              session_id: session.id,
              calendar_event_id: event.id,
              title: data.title,
              starts_at: data.starts_at,
              offset_minutes: offset,
            },
          });
          emailJobId = emailJob.id;
        }

        reminderRows.push({
          institution_id: data.institution_id,
          session_id: session.id,
          calendar_event_id: event.id,
          user_id: enrollment.student_id,
          reminder_type: `email_${offset}_minutes_before`,
          scheduled_for: scheduledFor,
          status: "queued",
          payload_json: { offset_minutes: offset },
          email_job_id: emailJobId,
        });
      }
    }

    if (reminderRows.length > 0) {
      const { error: reminderError } = await supabaseAdmin
        .from("session_reminders")
        .insert(reminderRows);
      if (reminderError) throw new Error(reminderError.message);
    }

    await createAuditLog(supabaseAdmin, {
      institutionId: data.institution_id,
      actorUserId: context.userId,
      actorRole: access.role,
      action: "calendar_event.scheduled",
      entityType: "calendar_event",
      entityId: event.id,
      summary: `Scheduled session ${data.title}`,
      details: { session_id: session.id, reminder_count: reminderRows.length },
    });

    return { session, event, reminder_count: reminderRows.length };
  });
