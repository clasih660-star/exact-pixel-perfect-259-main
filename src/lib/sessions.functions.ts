import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  assertActorCanAccessLesson,
  assertActorCanAccessSession,
  getServerActorResolution,
} from "@/lib/server-authorization";

function isStaffActor(role: string | null | undefined) {
  return (
    role === "teacher" ||
    role === "institution_admin" ||
    role === "owner" ||
    role === "platform_admin"
  );
}

function classroomRedirectUrl(sessionId: string, role: string | null | undefined) {
  return isStaffActor(role) ? `/teacher/sessions/${sessionId}` : `/classroom/session/${sessionId}`;
}

export const startSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ lesson_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) {
      return {
        session: {
          id: `demo-session-${Date.now()}`,
          institution_id: "demo-institution",
          course_id: "demo-course",
          lesson_id: data.lesson_id,
          host_user_id: context.userId,
          mode: "ai_teacher",
          status: "live",
          started_at: new Date().toISOString(),
        },
      };
    }

    const lesson = await assertActorCanAccessLesson(context, data.lesson_id);
    const actor = await getServerActorResolution(context);
    const participantRole = isStaffActor(actor.role) ? "teacher" : "student";

    const { data: session, error } = await context.supabase
      .from("classroom_sessions")
      .insert({
        institution_id: lesson.institution_id,
        course_id: lesson.course_id,
        lesson_id: lesson.id,
        host_user_id: context.userId,
        mode: "ai_teacher",
        status: "live",
        started_at: new Date().toISOString(),
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await context.supabase.from("session_participants").insert({
      session_id: session.id,
      user_id: context.userId,
      role: participantRole,
    });

    // Audit trail: record that the class began.
    await context.supabase.from("session_events").insert({
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: session.id,
      student_id: context.userId,
      actor_user_id: context.userId,
      actor_role: participantRole,
      event_type: "session_started",
      event_source: "sessions.startSession",
      payload_json: {},
    });

    return { session };
  });

export const startOrResumeClassroom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        courseId: z.string().min(1),
        lessonId: z.string().min(1),
        sessionId: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const actor = await getServerActorResolution(context);

    if (!context.supabase) {
      const sessionId = data.sessionId ?? `demo-session-${Date.now()}`;
      return {
        sessionId,
        redirectUrl: classroomRedirectUrl(sessionId, actor.role),
      };
    }

    if (data.sessionId) {
      await assertActorCanAccessSession(context, data.sessionId);
      return {
        sessionId: data.sessionId,
        redirectUrl: classroomRedirectUrl(data.sessionId, actor.role),
      };
    }

    const lesson = await assertActorCanAccessLesson(context, data.lessonId);

    const courseId = lesson?.course_id ?? data.courseId;
    const institutionId = lesson?.institution_id ?? null;

    if (!institutionId) throw new Error("Lesson is not linked to an institution.");

    const { data: session, error } = await context.supabase
      .from("classroom_sessions")
      .insert({
        institution_id: institutionId,
        course_id: courseId,
        lesson_id: data.lessonId,
        host_user_id: context.userId,
        mode: "ai_teacher",
        status: "live",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await context.supabase.from("session_participants").insert({
      session_id: session.id,
      user_id: context.userId,
      role: isStaffActor(actor.role) ? "teacher" : "student",
    });

    if (institutionId) {
      await context.supabase.from("session_events").insert({
        institution_id: institutionId,
        course_id: courseId,
        lesson_id: data.lessonId,
        session_id: session.id,
        student_id: context.userId,
        actor_user_id: context.userId,
        actor_role: isStaffActor(actor.role) ? "teacher" : "student",
        event_type: "session_started",
        event_source: "sessions.startOrResumeClassroom",
        payload_json: {},
      });
    }

    return { sessionId: session.id, redirectUrl: classroomRedirectUrl(session.id, actor.role) };
  });

export const getClassroomContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) {
      const actor = await getServerActorResolution(context);
      return {
        session: {
          id: data.session_id,
          institution_id: "demo-institution",
          course_id: "demo-course",
          lesson_id: "demo-lesson",
          host_user_id: context.userId,
          mode: "ai_teacher",
          status: "live",
          started_at: new Date().toISOString(),
        },
        viewer: {
          role: actor.role,
          persona: actor.persona,
          isSessionHost: true,
          isInstitutionStaff: false,
          isEnrolledLearner: true,
        },
        institution: { id: "demo-institution", name: "Klassruum Demo Academy" },
        course: { id: "demo-course", title: "Demo Course" },
        lesson: { id: "demo-lesson", title: "Demo Lesson" },
        enrollment: null,
        messages: [],
        participants: [],
      };
    }

    const session = await assertActorCanAccessSession(context, data.session_id);
    const actor = await getServerActorResolution(context);

    const [institution, course, lesson, enrollment, messages, participants] = await Promise.all([
      context.supabase.from("institutions").select("*").eq("id", session.institution_id).single(),
      context.supabase.from("courses").select("*").eq("id", session.course_id).single(),
      context.supabase.from("lessons").select("*").eq("id", session.lesson_id).single(),
      context.supabase
        .from("course_enrollments")
        .select("*")
        .eq("course_id", session.course_id)
        .eq("student_id", context.userId)
        .maybeSingle(),
      context.supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", data.session_id)
        .order("created_at", { ascending: true })
        .limit(200),
      context.supabase
        .from("session_participants")
        .select("user_id, role, status, joined_at, left_at")
        .eq("session_id", data.session_id)
        .order("joined_at", { ascending: true }),
    ]);

    const institutionMembership = actor.memberships.find(
      (item) => item.institution_id === session.institution_id,
    );
    const isSessionHost = session.host_user_id === context.userId;
    const isInstitutionStaff = Boolean(
      actor.role === "platform_admin" ||
      isSessionHost ||
      (institutionMembership && ["owner", "admin", "teacher"].includes(institutionMembership.role)),
    );

    return {
      session,
      viewer: {
        role: actor.role,
        persona: actor.persona,
        isSessionHost,
        isInstitutionStaff,
        isEnrolledLearner: Boolean(enrollment.data),
      },
      institution: institution.data,
      course: course.data,
      lesson: lesson.data,
      enrollment: enrollment.data,
      messages: messages.data ?? [],
      participants: participants.data ?? [],
    };
  });

export const postChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        session_id: z.string().uuid(),
        message: z.string().trim().min(1).max(5000),
        sender: z.enum(["student", "teacher", "ai_teacher", "system"]).default("student"),
        message_type: z.string().max(40).default("text"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    // Get session to derive institution_id, course_id, lesson_id
    const session = await assertActorCanAccessSession(context, data.session_id);

    const { error } = await context.supabase.from("chat_messages").insert({
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      user_id: context.userId,
      sender: data.sender,
      message: data.message,
      message_type: data.message_type,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const submitQuizResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        session_id: z.string().uuid().optional(),
        quiz_id: z.string().uuid(),
        lesson_id: z.string().uuid(),
        score: z.number(),
        percentage: z.number(),
        answers_json: z.any(),
        feedback_json: z.any().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    // Derive institution_id and course_id from the lesson
    if (data.session_id) {
      await assertActorCanAccessSession(context, data.session_id);
    }

    const lesson = await assertActorCanAccessLesson(context, data.lesson_id);

    const { data: row, error } = await context.supabase
      .from("quiz_results")
      .insert({
        institution_id: lesson.institution_id,
        course_id: lesson.course_id,
        lesson_id: data.lesson_id,
        quiz_id: data.quiz_id,
        session_id: data.session_id ?? null,
        student_id: context.userId,
        score: data.score,
        percentage: data.percentage,
        answers_json: data.answers_json ?? [],
        feedback_json: data.feedback_json ?? {},
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const endSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ session_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    const session = await assertActorCanAccessSession(context, data.session_id, {
      requireModerator: true,
    });

    const { error } = await context.supabase
      .from("classroom_sessions")
      .update({ status: "completed", ended_at: new Date().toISOString() })
      .eq("id", data.session_id);
    if (error) throw new Error(error.message);

    if (session) {
      await context.supabase.from("session_events").insert({
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        student_id: context.userId,
        actor_user_id: context.userId,
        actor_role: "system",
        event_type: "session_completed",
        event_source: "sessions.endSession",
        payload_json: {},
      });
    }

    return { ok: true };
  });
