import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const startSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ lesson_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    const { data: lesson, error: lErr } = await context.supabase
      .from("lessons")
      .select("id, course_id, institution_id")
      .eq("id", data.lesson_id)
      .single();
    if (lErr) throw new Error(lErr.message);

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
      role: "student",
    });

    // Audit trail: record that the class began.
    await context.supabase.from("session_events").insert({
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: session.id,
      student_id: context.userId,
      actor_user_id: context.userId,
      actor_role: "system",
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
    if (data.sessionId) {
      return { sessionId: data.sessionId, redirectUrl: `/classroom/session/${data.sessionId}` };
    }

    const { data: lesson, error: lessonError } = await context.supabase
      .from("lessons")
      .select("id, course_id, institution_id")
      .eq("id", data.lessonId)
      .maybeSingle();

    if (lessonError) throw new Error(lessonError.message);

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

    if (institutionId) {
      await context.supabase.from("session_events").insert({
        institution_id: institutionId,
        course_id: courseId,
        lesson_id: data.lessonId,
        session_id: session.id,
        student_id: context.userId,
        actor_user_id: context.userId,
        actor_role: "system",
        event_type: "session_started",
        event_source: "sessions.startOrResumeClassroom",
        payload_json: {},
      });
    }

    return { sessionId: session.id, redirectUrl: `/classroom/session/${session.id}` };
  });

export const getClassroomContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { data: session, error } = await context.supabase
      .from("classroom_sessions")
      .select("*")
      .eq("id", data.session_id)
      .single();
    if (error) throw new Error(error.message);

    const [institution, course, lesson, enrollment, messages] = await Promise.all([
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
    ]);

    return {
      session,
      institution: institution.data,
      course: course.data,
      lesson: lesson.data,
      enrollment: enrollment.data,
      messages: messages.data ?? [],
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
    const { data: session, error: sErr } = await context.supabase
      .from("classroom_sessions")
      .select("institution_id, course_id, lesson_id")
      .eq("id", data.session_id)
      .single();
    if (sErr) throw new Error(sErr.message);

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
    const { data: lesson, error: lErr } = await context.supabase
      .from("lessons")
      .select("institution_id, course_id")
      .eq("id", data.lesson_id)
      .single();
    if (lErr) throw new Error(lErr.message);

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
    const { data: session } = await context.supabase
      .from("classroom_sessions")
      .select("institution_id, course_id, lesson_id")
      .eq("id", data.session_id)
      .single();

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
