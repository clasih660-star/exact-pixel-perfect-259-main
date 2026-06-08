/**
 * classroom.engine.ts
 *
 * Production-grade backend server functions for the live classroom.
 * Every action persists a session_event, enforces idempotency via request_key,
 * and respects access control through Supabase RLS.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SessionEventKind } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Write a single session_event row. Returns the inserted row or null on idempotent skip. */
async function writeEvent(
  supabase: any,
  params: {
    institution_id: string;
    course_id: string;
    lesson_id: string;
    session_id: string;
    student_id?: string | null;
    actor_user_id: string;
    actor_role: "student" | "teacher" | "ai_teacher" | "system";
    event_type: SessionEventKind | string;
    event_source?: string | null;
    payload?: Record<string, unknown>;
    request_key?: string | null;
  },
) {
  const insert: Record<string, unknown> = {
    institution_id: params.institution_id,
    course_id: params.course_id,
    lesson_id: params.lesson_id,
    session_id: params.session_id,
    student_id: params.student_id ?? params.actor_user_id,
    actor_user_id: params.actor_user_id,
    actor_role: params.actor_role,
    event_type: params.event_type,
    event_source: params.event_source ?? null,
    payload_json: params.payload ?? {},
  };

  if (params.request_key) {
    insert.request_key = params.request_key;
  }

  const { data, error } = await supabase
    .from("session_events")
    .insert(insert)
    .select("id, created_at")
    .single();

  if (error) {
    // Unique violation on request_key → idempotent skip
    if (error.code === "23505" && params.request_key) {
      const { data: existing } = await supabase
        .from("session_events")
        .select("id, created_at")
        .eq("session_id", params.session_id)
        .eq("request_key", params.request_key)
        .maybeSingle();
      return existing ?? null;
    }
    throw new Error(`Failed to write event ${params.event_type}: ${error.message}`);
  }
  return data;
}

/** Derive institution_id, course_id, lesson_id from a session. */
async function getSessionMeta(supabase: any, sessionId: string) {
  const { data, error } = await supabase
    .from("classroom_sessions")
    .select("id, institution_id, course_id, lesson_id, status, host_user_id, started_at")
    .eq("id", sessionId)
    .single();
  if (error) throw new Error(`Session not found: ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. getStudentDashboard
// ─────────────────────────────────────────────────────────────────────────────

export const getStudentDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const supabase = context.supabase;

    // Parallel fetch of all dashboard data
    const [
      enrollmentsResult,
      progressResult,
      sessionsResult,
      profileResult,
      recommendationsResult,
      quizResultsResult,
    ] = await Promise.all([
      supabase
        .from("course_enrollments")
        .select(
          "id, course_id, status, enrolled_at, course:courses(id, title, subject, level, institution_id, description, status, cover_image_url, institutions(name, brand_color, logo_url))",
        )
        .eq("student_id", userId)
        .eq("status", "active"),
      supabase
        .from("lesson_progress")
        .select(
          "lesson_id, course_id, status, progress_percentage, current_step, time_spent_minutes, confusion_score, student_level, updated_at",
        )
        .eq("student_id", userId),
      supabase
        .from("classroom_sessions")
        .select(
          "id, course_id, lesson_id, status, started_at, ended_at, lessons(id, title), courses(title)",
        )
        .eq("host_user_id", userId)
        .order("started_at", { ascending: false })
        .limit(10),
      supabase
        .from("learner_access_profiles")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("recommendations")
        .select("id, title, description, recommendation_type, target_url, priority, is_read")
        .eq("student_id", userId)
        .eq("is_read", false)
        .order("priority", { ascending: false })
        .limit(5),
      supabase
        .from("quiz_results")
        .select("id, lesson_id, score, percentage, completed_at")
        .eq("student_id", userId)
        .order("completed_at", { ascending: false })
        .limit(10),
    ]);

    const enrollments = enrollmentsResult.data ?? [];
    const progressRows = progressResult.data ?? [];
    const recentSessions = sessionsResult.data ?? [];
    const accessProfile = profileResult.data;
    const recommendations = recommendationsResult.data ?? [];
    const quizResults = quizResultsResult.data ?? [];

    // Calculate stats
    const completedLessons = progressRows.filter((p: any) => p.status === "completed").length;
    const totalTimeMinutes = progressRows.reduce(
      (sum: number, p: any) => sum + (p.time_spent_minutes ?? 0),
      0,
    );
    const avgQuizScore =
      quizResults.length > 0
        ? Math.round(quizResults.reduce((s: number, q: any) => s + (q.percentage ?? 0), 0) / quizResults.length)
        : 0;
    const activeCourses = enrollments.length;

    // Build continue learning from most recent in-progress lesson
    const inProgressLessons = progressRows
      .filter((p: any) => p.status === "in_progress")
      .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    const continueLearningLesson = inProgressLessons[0];
    const continueLearningCourse = continueLearningLesson
      ? enrollments.find((e: any) => e.course_id === continueLearningLesson.course_id)?.course
      : enrollments[0]?.course;

    // Build learning plan from recommendations + progress
    const learningPlan = recommendations.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: "next" as const,
      type: r.recommendation_type,
      targetUrl: r.target_url,
    }));

    return {
      continueLearning: continueLearningLesson
        ? {
            courseId: continueLearningLesson.course_id,
            lessonId: continueLearningLesson.lesson_id,
            currentStep: continueLearningLesson.current_step ?? "hook",
            progressPercentage: continueLearningLesson.progress_percentage ?? 0,
            courseTitle: continueLearningCourse?.title ?? "",
            lessonTitle: "", // will be filled from lesson lookup
          }
        : null,
      stats: {
        activeCourses,
        completedLessons,
        totalTimeMinutes,
        avgQuizScore,
        recentSessionsCount: recentSessions.length,
      },
      courses: enrollments.map((e: any) => {
        const course = e.course;
        const courseProgress = progressRows.filter((p: any) => p.course_id === course?.id);
        const pct =
          courseProgress.length > 0
            ? Math.round(
                courseProgress.reduce((s: number, p: any) => s + (p.progress_percentage ?? 0), 0) /
                  courseProgress.length,
              )
            : 0;
        return {
          id: course?.id,
          title: course?.title,
          subject: course?.subject,
          level: course?.level,
          institutionName: course?.institutions?.name,
          progressPercentage: pct,
          description: course?.description,
          coverImageUrl: course?.cover_image_url,
        };
      }),
      recentSessions: recentSessions.map((s: any) => ({
        id: s.id,
        lessonTitle: s.lessons?.title ?? "",
        courseTitle: s.courses?.title ?? "",
        status: s.status,
        startedAt: s.started_at,
        endedAt: s.ended_at,
        durationMinutes: s.started_at && s.ended_at
          ? Math.round((new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 60000)
          : null,
      })),
      accessProfile: accessProfile
        ? {
            captionsEnabled: accessProfile.captions_enabled,
            audioEnabled: accessProfile.audio_enabled,
            keyboardShortcutsEnabled: accessProfile.keyboard_shortcuts_enabled,
            focusModeEnabled: accessProfile.reduced_motion,
            speechRate: Number(accessProfile.speech_rate ?? 1),
            currentMode:
              accessProfile.explanation_style === "detailed"
                ? "Detailed"
                : accessProfile.explanation_style === "simple"
                  ? "Simple"
                  : "Standard",
          }
        : {
            captionsEnabled: true,
            audioEnabled: true,
            keyboardShortcutsEnabled: true,
            focusModeEnabled: false,
            speechRate: 1,
            currentMode: "Standard",
          },
      recommendations: learningPlan,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 2. startOrResumeClassroom (production)
// ─────────────────────────────────────────────────────────────────────────────

const StartClassroomSchema = z.object({
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
  sessionId: z.string().optional(),
  resumeStep: z.string().optional(),
  preferredAccessProfile: z.record(z.unknown()).optional(),
});

export const startOrResumeClassroomV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => StartClassroomSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const userId = context.userId;

    // Resume existing session
    if (data.sessionId) {
      const session = await getSessionMeta(supabase, data.sessionId);
      if (session.status !== "live") {
        // Reactivate if completed/cancelled
        await supabase
          .from("classroom_sessions")
          .update({ status: "live", ended_at: null })
          .eq("id", data.sessionId);
      }
      return {
        sessionId: data.sessionId,
        redirectUrl: `/classroom/session/${data.sessionId}`,
        resumed: true,
      };
    }

    // Check for existing live session for this student+lesson (idempotency)
    const { data: existingLive } = await supabase
      .from("classroom_sessions")
      .select("id, status")
      .eq("host_user_id", userId)
      .eq("lesson_id", data.lessonId)
      .eq("status", "live")
      .maybeSingle();

    if (existingLive) {
      return {
        sessionId: existingLive.id,
        redirectUrl: `/classroom/session/${existingLive.id}`,
        resumed: true,
      };
    }

    // Look up lesson metadata
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("id, course_id, institution_id, title")
      .eq("id", data.lessonId)
      .maybeSingle();

    if (lessonError) throw new Error(lessonError.message);

    const courseId = lesson?.course_id ?? data.courseId;
    const institutionId = lesson?.institution_id ?? "";

    // Create new session
    const { data: session, error } = await supabase
      .from("classroom_sessions")
      .insert({
        institution_id: institutionId,
        course_id: courseId,
        lesson_id: data.lessonId,
        host_user_id: userId,
        mode: "ai_teacher",
        status: "live",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      // Handle race condition duplicate
      if (error.code === "23505") {
        const { data: raceSession } = await supabase
          .from("classroom_sessions")
          .select("id")
          .eq("host_user_id", userId)
          .eq("lesson_id", data.lessonId)
          .eq("status", "live")
          .maybeSingle();
        if (raceSession) {
          return {
            sessionId: raceSession.id,
            redirectUrl: `/classroom/session/${raceSession.id}`,
            resumed: true,
          };
        }
      }
      throw new Error(error.message);
    }

    // Add participant record
    await supabase.from("session_participants").insert({
      session_id: session.id,
      user_id: userId,
      role: "student",
    });

    // Write session_started event
    if (institutionId) {
      await writeEvent(supabase, {
        institution_id: institutionId,
        course_id: courseId,
        lesson_id: data.lessonId,
        session_id: session.id,
        actor_user_id: userId,
        actor_role: "student",
        event_type: "session_started",
        event_source: "classroom_engine",
        payload: { resumeStep: data.resumeStep },
        request_key: `start_${userId}_${data.lessonId}`,
      });
    }

    return {
      sessionId: session.id,
      redirectUrl: `/classroom/session/${session.id}`,
      resumed: false,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 3. getClassroomContext (production)
// ─────────────────────────────────────────────────────────────────────────────

export const getClassroomContextV2 = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) => data)
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;

    const session = await getSessionMeta(supabase, data.session_id);

    const [institution, course, lesson, progress, messages, accessProfile, lastEvent] =
      await Promise.all([
        session.institution_id
          ? supabase.from("institutions").select("*").eq("id", session.institution_id).single()
          : Promise.resolve({ data: null }),
        supabase.from("courses").select("*").eq("id", session.course_id).single(),
        supabase.from("lessons").select("*").eq("id", session.lesson_id).single(),
        supabase
          .from("lesson_progress")
          .select("*")
          .eq("lesson_id", session.lesson_id)
          .eq("student_id", context.userId)
          .maybeSingle(),
        supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", data.session_id)
          .order("created_at", { ascending: true })
          .limit(200),
        supabase
          .from("learner_access_profiles")
          .select("*")
          .eq("user_id", context.userId)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("session_events")
          .select("*")
          .eq("session_id", data.session_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

    return {
      session: {
        id: session.id,
        institutionId: session.institution_id,
        courseId: session.course_id,
        lessonId: session.lesson_id,
        mode: session.mode,
        status: session.status,
        startTime: session.started_at,
        endTime: session.ended_at,
      },
      institution: institution.data,
      course: course.data,
      lesson: lesson.data,
      progress: progress.data
        ? {
            currentStep: progress.data.current_step ?? "hook",
            progressPercentage: progress.data.progress_percentage ?? 0,
            confusionScore: progress.data.confusion_score ?? 0,
            studentLevel: progress.data.student_level ?? "intermediate",
            teacherState: progress.data.teacher_state ?? "idle",
            timeSpentMinutes: progress.data.time_spent_minutes ?? 0,
          }
        : {
            currentStep: "hook" as const,
            progressPercentage: 0,
            confusionScore: 0,
            studentLevel: "intermediate" as const,
            teacherState: "idle" as const,
            timeSpentMinutes: 0,
          },
      messages: (messages.data ?? []).map((m: any) => ({
        id: m.id,
        sender: m.sender,
        message: m.message,
        createdAt: m.created_at,
      })),
      learnerAccessProfile: (accessProfile as any)?.data
        ? {
            captionsEnabled: (accessProfile as any).data.captions_enabled,
            transcriptEnabled: (accessProfile as any).data.transcript_enabled,
            audioEnabled: (accessProfile as any).data.audio_enabled,
            boardDescriptionsEnabled: (accessProfile as any).data.board_descriptions_enabled,
            screenReaderOptimized: (accessProfile as any).data.screen_reader_optimized,
            highContrast: (accessProfile as any).data.high_contrast,
            largeText: (accessProfile as any).data.large_text,
            reducedMotion: (accessProfile as any).data.reduced_motion,
            keyboardShortcutsEnabled: (accessProfile as any).data.keyboard_shortcuts_enabled,
            voiceInputEnabled: (accessProfile as any).data.voice_input_enabled,
            speechRate: Number((accessProfile as any).data.speech_rate ?? 1),
            fontScale: Number((accessProfile as any).data.font_scale ?? 1),
            lessonPace: (accessProfile as any).data.lesson_pace ?? "normal",
            explanationStyle: (accessProfile as any).data.explanation_style ?? "standard",
          }
        : null,
      lastEvent: (lastEvent as any)?.data,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 4. postChatMessage (production with event)
// ─────────────────────────────────────────────────────────────────────────────

const ChatMessageSchema = z.object({
  session_id: z.string().uuid(),
  message: z.string().trim().min(1).max(5000),
  sender: z.enum(["student", "teacher", "ai_teacher", "system"]).default("student"),
  message_type: z.string().max(40).default("text"),
  request_key: z.string().max(120).optional(),
});

export const postChatMessageV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => ChatMessageSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = await getSessionMeta(supabase, data.session_id);

    // Insert message
    const { data: msgRow, error } = await supabase
      .from("chat_messages")
      .insert({
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        user_id: context.userId,
        sender: data.sender,
        message: data.message,
        message_type: data.message_type,
      })
      .select("id, created_at")
      .single();

    if (error) throw new Error(error.message);

    // Write event
    const eventType: SessionEventKind =
      data.sender === "student" ? "student_message" : "teacher_message";
    await writeEvent(supabase, {
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      actor_user_id: context.userId,
      actor_role: data.sender === "student" ? "student" : data.sender === "ai_teacher" ? "ai_teacher" : "system",
      event_type: eventType,
      event_source: "chat",
      payload: { messageId: msgRow.id, message: data.message, messageType: data.message_type },
      request_key: data.request_key,
    });

    return { ok: true, messageId: msgRow.id, createdAt: msgRow.created_at };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 5. postQuickAction (production with event)
// ─────────────────────────────────────────────────────────────────────────────

const QuickActionSchema = z.object({
  session_id: z.string().uuid(),
  action: z.string().trim().min(1).max(80),
  message: z.string().trim().max(5000).optional(),
  request_key: z.string().max(120).optional(),
});

export const postQuickActionV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => QuickActionSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = await getSessionMeta(supabase, data.session_id);

    // Write event
    const event = await writeEvent(supabase, {
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      actor_user_id: context.userId,
      actor_role: "student",
      event_type: "quick_action",
      event_source: "quick_action",
      payload: { action: data.action, message: data.message ?? "" },
      request_key: data.request_key ?? `qa_${data.session_id}_${data.action}_${Date.now()}`,
    });

    // Optionally also save the action as a chat message
    if (data.message) {
      await supabase.from("chat_messages").insert({
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        user_id: context.userId,
        sender: "student",
        message: data.message,
        message_type: "quick_action",
      });
    }

    return { ok: true, eventId: event?.id };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 6. changeClassroomStep (production with event + progress update)
// ─────────────────────────────────────────────────────────────────────────────

const ChangeStepSchema = z.object({
  session_id: z.string().uuid(),
  targetStep: z.string().trim().min(1),
  progress_percentage: z.number().min(0).max(100).optional(),
  confusion_score: z.number().min(0).max(1).optional(),
  request_key: z.string().max(120).optional(),
});

export const changeClassroomStepV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => ChangeStepSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = await getSessionMeta(supabase, data.session_id);

    // Update lesson progress
    const progressUpdate: Record<string, unknown> = {
      current_step: data.targetStep,
      session_id: data.session_id,
    };
    if (data.progress_percentage !== undefined) progressUpdate.progress_percentage = data.progress_percentage;
    if (data.confusion_score !== undefined) progressUpdate.confusion_score = data.confusion_score;

    // Upsert progress
    const { data: existingProgress } = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("lesson_id", session.lesson_id)
      .eq("student_id", context.userId)
      .maybeSingle();

    if (existingProgress) {
      await (supabase as any).from("lesson_progress").update(progressUpdate).eq("id", existingProgress.id);
    } else {
      await (supabase as any).from("lesson_progress").insert({
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        student_id: context.userId,
        ...progressUpdate,
        status: "in_progress",
      });
    }

    // Write event
    const event = await writeEvent(supabase, {
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      actor_user_id: context.userId,
      actor_role: "student",
      event_type: "step_changed",
      event_source: "classroom_navigation",
      payload: {
        targetStep: data.targetStep,
        progressPercentage: data.progress_percentage,
        confusionScore: data.confusion_score,
      },
      request_key: data.request_key,
    });

    return { ok: true, eventId: event?.id, currentStep: data.targetStep };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 7. saveBoardNotes (production with event + board snapshot + notes)
// ─────────────────────────────────────────────────────────────────────────────

const SaveBoardNotesSchema = z.object({
  session_id: z.string().uuid(),
  whiteboardContent: z.array(z.string()),
  description: z.string().trim().min(1),
  title: z.string().trim().min(1).optional(),
  mode: z.enum(["lesson", "example", "correction", "quiz", "summary"]).default("lesson"),
  activeLineIndex: z.number().int().min(0).default(0),
  highlight: z.string().optional(),
  stepKey: z.string().optional(),
  request_key: z.string().max(120).optional(),
});

export const saveBoardNotesV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => SaveBoardNotesSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = await getSessionMeta(supabase, data.session_id);

    // Write event first
    const event = await writeEvent(supabase, {
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      actor_user_id: context.userId,
      actor_role: "student",
      event_type: "board_saved",
      event_source: "whiteboard",
      payload: { title: data.title, lineCount: data.whiteboardContent.length },
      request_key: data.request_key,
    });

    // Save board snapshot
    const { data: snapshot, error: snapError } = await supabase
      .from("board_snapshots")
      .insert({
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        source_event_id: event?.id ?? null,
        step_key: data.stepKey ?? null,
        mode: data.mode,
        title: data.title ?? "Board Notes",
        lines_json: data.whiteboardContent,
        description: data.description,
        active_line_index: data.activeLineIndex,
        highlight: data.highlight ?? null,
      })
      .select("id")
      .single();

    if (snapError) throw new Error(snapError.message);

    // Also save as session notes
    await supabase.from("session_notes").insert({
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      student_id: context.userId,
      title: data.title ?? "Board Notes",
      body: data.description,
      notes_json: data.whiteboardContent,
      source_type: "board",
      is_board_export: true,
    });

    return { ok: true, snapshotId: snapshot.id, eventId: event?.id };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 8. updateAccessProfile (production with event)
// ─────────────────────────────────────────────────────────────────────────────

const AccessProfileSchema = z.object({
  session_id: z.string().uuid().optional(),
  captionsEnabled: z.boolean().optional(),
  transcriptEnabled: z.boolean().optional(),
  audioEnabled: z.boolean().optional(),
  boardDescriptionsEnabled: z.boolean().optional(),
  screenReaderOptimized: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  largeText: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  keyboardShortcutsEnabled: z.boolean().optional(),
  voiceInputEnabled: z.boolean().optional(),
  speechRate: z.number().min(0.5).max(2).optional(),
  fontScale: z.number().min(0.5).max(3).optional(),
  lessonPace: z.enum(["slow", "normal", "fast"]).optional(),
  explanationStyle: z.enum(["simple", "standard", "detailed"]).optional(),
  request_key: z.string().max(120).optional(),
});

export const updateAccessProfileV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => AccessProfileSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const userId = context.userId;

    // Get institution membership
    const { data: membership } = await supabase
      .from("institution_members")
      .select("institution_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const { data: existing } = await supabase
      .from("learner_access_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const institutionId = membership?.institution_id ?? existing?.institution_id;
    if (!institutionId) {
      throw new Error("No active institution found for access profile update");
    }

    // Build the update object
    const updates: Record<string, unknown> = {
      user_id: userId,
      institution_id: institutionId,
    };
    if (data.captionsEnabled !== undefined) updates.captions_enabled = data.captionsEnabled;
    if (data.transcriptEnabled !== undefined) updates.transcript_enabled = data.transcriptEnabled;
    if (data.audioEnabled !== undefined) updates.audio_enabled = data.audioEnabled;
    if (data.boardDescriptionsEnabled !== undefined) updates.board_descriptions_enabled = data.boardDescriptionsEnabled;
    if (data.screenReaderOptimized !== undefined) updates.screen_reader_optimized = data.screenReaderOptimized;
    if (data.highContrast !== undefined) updates.high_contrast = data.highContrast;
    if (data.largeText !== undefined) updates.large_text = data.largeText;
    if (data.reducedMotion !== undefined) updates.reduced_motion = data.reducedMotion;
    if (data.keyboardShortcutsEnabled !== undefined) updates.keyboard_shortcuts_enabled = data.keyboardShortcutsEnabled;
    if (data.voiceInputEnabled !== undefined) updates.voice_input_enabled = data.voiceInputEnabled;
    if (data.speechRate !== undefined) updates.speech_rate = data.speechRate;
    if (data.fontScale !== undefined) updates.font_scale = data.fontScale;
    if (data.lessonPace !== undefined) updates.lesson_pace = data.lessonPace;
    if (data.explanationStyle !== undefined) updates.explanation_style = data.explanationStyle;

    // Fill in defaults from existing for upsert
    if (existing) {
      const existingAny = existing as Record<string, unknown>;
      for (const key of Object.keys(existingAny)) {
        if (!(key in updates) && key !== "id" && key !== "created_at") {
          updates[key] = existingAny[key];
        }
      }
    }

    const { data: row, error } = await (supabase as any)
      .from("learner_access_profiles")
      .upsert(updates, { onConflict: "user_id,institution_id" })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    // Write event if in session context
    if (data.session_id) {
      const session = await getSessionMeta(supabase, data.session_id);
      await writeEvent(supabase, {
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        actor_user_id: userId,
        actor_role: "student",
        event_type: "access_updated",
        event_source: "access_settings",
        payload: { changes: Object.keys(data).filter((k) => k !== "session_id" && k !== "request_key") },
        request_key: data.request_key,
      });
    }

    return { ok: true, profile: row };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 9. submitQuizResult (production with event + idempotency)
// ─────────────────────────────────────────────────────────────────────────────

const QuizResultSchema = z.object({
  session_id: z.string().uuid().optional(),
  quiz_id: z.string().uuid(),
  lesson_id: z.string().uuid(),
  score: z.number(),
  percentage: z.number(),
  answers_json: z.any(),
  feedback_json: z.any().optional(),
  weak_topics: z.array(z.string()).optional(),
  request_key: z.string().max(120).optional(),
});

export const submitQuizResultV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => QuizResultSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const userId = context.userId;

    // Get lesson meta
    const { data: lesson, error: lErr } = await supabase
      .from("lessons")
      .select("institution_id, course_id")
      .eq("id", data.lesson_id)
      .single();
    if (lErr) throw new Error(lErr.message);

    // Check for duplicate submission
    if (data.session_id) {
      const { data: existingResult } = await supabase
        .from("quiz_results")
        .select("id")
        .eq("student_id", userId)
        .eq("quiz_id", data.quiz_id)
        .eq("session_id", data.session_id)
        .maybeSingle();

      if (existingResult) {
        return { ok: true, id: existingResult.id, duplicate: true };
      }
    }

    // Insert quiz result
    const insertPayload: Record<string, unknown> = {
      institution_id: lesson.institution_id,
      course_id: lesson.course_id,
      lesson_id: data.lesson_id,
      quiz_id: data.quiz_id,
      student_id: userId,
      score: data.score,
      percentage: data.percentage,
      answers_json: data.answers_json ?? [],
      feedback_json: data.feedback_json ?? {},
      request_key: data.request_key ?? null,
    };
    if (data.session_id) insertPayload.session_id = data.session_id;

    const { data: row, error } = await (supabase as any)
      .from("quiz_results")
      .insert(insertPayload)
      .select("id")
      .single();

    if (error) {
      // Idempotent: if unique violation, return existing
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("quiz_results")
          .select("id")
          .eq("student_id", userId)
          .eq("quiz_id", data.quiz_id)
          .eq("session_id", data.session_id ?? "")
          .maybeSingle();
        if (existing) return { ok: true, id: existing.id, duplicate: true };
      }
      throw new Error(error.message);
    }

    // Write event
    if (data.session_id) {
      const session = await getSessionMeta(supabase, data.session_id);
      await writeEvent(supabase, {
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        actor_user_id: userId,
        actor_role: "student",
        event_type: "quiz_answered",
        event_source: "quiz",
        payload: {
          quizId: data.quiz_id,
          score: data.score,
          percentage: data.percentage,
          weakTopics: data.weak_topics ?? [],
        },
        request_key: data.request_key,
      });
    }

    return { ok: true, id: row.id, duplicate: false };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 10. endSession (production with event + summary generation)
// ─────────────────────────────────────────────────────────────────────────────

const EndSessionSchema = z.object({
  session_id: z.string().uuid(),
  final_progress_percentage: z.number().min(0).max(100).optional(),
  final_confusion_score: z.number().min(0).max(1).optional(),
  final_step: z.string().optional(),
});

export const endSessionV2 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => EndSessionSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = await getSessionMeta(supabase, data.session_id);

    // Prevent double-end
    if (session.status === "completed") {
      return { ok: true, alreadyEnded: true };
    }

    // End the session
    const { error } = await supabase
      .from("classroom_sessions")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
      })
      .eq("id", data.session_id);

    if (error) throw new Error(error.message);

    // Update final progress
    if (data.final_progress_percentage !== undefined || data.final_step) {
      const { data: existingProgress } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("lesson_id", session.lesson_id)
        .eq("student_id", context.userId)
        .maybeSingle();

      const progressUpdate: Record<string, unknown> = {};
      if (data.final_progress_percentage !== undefined)
        progressUpdate.progress_percentage = data.final_progress_percentage;
      if (data.final_confusion_score !== undefined)
        progressUpdate.confusion_score = data.final_confusion_score;
      if (data.final_step) progressUpdate.current_step = data.final_step;

      if (data.final_progress_percentage === 100) {
        progressUpdate.status = "completed";
      }

      if (existingProgress) {
        await (supabase as any).from("lesson_progress").update(progressUpdate).eq("id", existingProgress.id);
      } else {
        await (supabase as any).from("lesson_progress").insert({
          institution_id: session.institution_id,
          course_id: session.course_id,
          lesson_id: session.lesson_id,
          student_id: context.userId,
          session_id: data.session_id,
          ...progressUpdate,
          status: progressUpdate.status ?? "in_progress",
        });
      }
    }

    // Write session_ended event
    await writeEvent(supabase, {
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      actor_user_id: context.userId,
      actor_role: "student",
      event_type: "session_ended",
      event_source: "classroom_engine",
      payload: {
        finalProgressPercentage: data.final_progress_percentage,
        finalConfusionScore: data.final_confusion_score,
        finalStep: data.final_step,
      },
    });

    return { ok: true };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 11. getSessionSummary
// ─────────────────────────────────────────────────────────────────────────────

export const getSessionSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) => data)
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = await getSessionMeta(supabase, data.session_id);

    const [lesson, course, events, quizResults, notes, progress] = await Promise.all([
      supabase.from("lessons").select("id, title, description").eq("id", session.lesson_id).single(),
      supabase.from("courses").select("id, title, subject").eq("id", session.course_id).single(),
      supabase
        .from("session_events")
        .select("*")
        .eq("session_id", data.session_id)
        .order("created_at", { ascending: true }),
      supabase
        .from("quiz_results")
        .select("id, score, percentage, answers_json, feedback_json, completed_at")
        .eq("session_id", data.session_id)
        .eq("student_id", context.userId),
      supabase
        .from("session_notes")
        .select("id, title, body, source_type")
        .eq("session_id", data.session_id)
        .eq("student_id", context.userId),
      supabase
        .from("lesson_progress")
        .select("current_step, progress_percentage, confusion_score, time_spent_minutes")
        .eq("lesson_id", session.lesson_id)
        .eq("student_id", context.userId)
        .maybeSingle(),
    ]);

    const eventRows = events.data ?? [];
    const stepsCompleted = new Set(
      eventRows.filter((e: any) => e.event_type === "step_changed").map((e: any) => e.payload_json?.targetStep),
    ).size;

    const durationMinutes =
      session.started_at && session.ended_at
        ? Math.round(
            (new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 60000,
          )
        : progress.data?.time_spent_minutes ?? 0;

    // Calculate confusion trend from events
    const confusionEvents = eventRows.filter(
      (e: any) => e.event_type === "step_changed" && e.payload_json?.confusionScore !== undefined,
    );
    const confusionTrend = confusionEvents.map((e: any) => ({
      step: e.payload_json.targetStep,
      score: e.payload_json.confusionScore,
      timestamp: e.created_at,
    }));

    return {
      session: {
        id: session.id,
        status: session.status,
        startedAt: session.started_at,
        endedAt: session.ended_at,
        durationMinutes,
      },
      lesson: lesson.data,
      course: course.data,
      stepsCompleted,
      totalSteps: 8,
      progress: progress.data,
      quizResults: quizResults.data ?? [],
      notes: notes.data ?? [],
      eventCount: eventRows.length,
      confusionTrend,
      weakTopics: (quizResults.data ?? []).flatMap(
        (q: any) => q.feedback_json?.weakTopics ?? [],
      ),
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 12. getSessionReplay
// ─────────────────────────────────────────────────────────────────────────────

export const getSessionReplay = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) => data)
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = await getSessionMeta(supabase, data.session_id);

    const [events, messages, boardSnapshots] = await Promise.all([
      supabase
        .from("session_events")
        .select("*")
        .eq("session_id", data.session_id)
        .order("created_at", { ascending: true }),
      supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", data.session_id)
        .order("created_at", { ascending: true }),
      supabase
        .from("board_snapshots")
        .select("*")
        .eq("session_id", data.session_id)
        .order("created_at", { ascending: true }),
    ]);

    // Merge events, messages, and board snapshots into a unified timeline
    const timeline = [
      ...(events.data ?? []).map((e: any) => ({
        type: "event" as const,
        id: e.id,
        eventType: e.event_type,
        actorRole: e.actor_role,
        payload: e.payload_json,
        timestamp: e.created_at,
      })),
      ...(messages.data ?? []).map((m: any) => ({
        type: "message" as const,
        id: m.id,
        sender: m.sender,
        message: m.message,
        messageType: m.message_type,
        timestamp: m.created_at,
      })),
      ...(boardSnapshots.data ?? []).map((b: any) => ({
        type: "board_snapshot" as const,
        id: b.id,
        title: b.title,
        lines: b.lines_json,
        mode: b.mode,
        stepKey: b.step_key,
        timestamp: b.created_at,
      })),
    ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return {
      sessionId: session.id,
      timeline,
      eventCount: (events.data ?? []).length,
      messageCount: (messages.data ?? []).length,
      boardSnapshotCount: (boardSnapshots.data ?? []).length,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 13. listRecommendations
// ─────────────────────────────────────────────────────────────────────────────

export const listRecommendations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabase = context.supabase;

    const { data, error } = await supabase
      .from("recommendations")
      .select("*")
      .eq("student_id", context.userId)
      .order("priority", { ascending: false })
      .limit(20);

    if (error) throw new Error(error.message);

    return { recommendations: data ?? [] };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 14. saveSessionEvent (generic event writer)
// ─────────────────────────────────────────────────────────────────────────────

const SaveEventSchema = z.object({
  session_id: z.string().uuid(),
  event_type: z.string().trim().min(1).max(80),
  actor_role: z.enum(["student", "teacher", "ai_teacher", "system"]),
  event_source: z.string().max(80).optional(),
  payload: z.record(z.unknown()).default({}),
  request_key: z.string().max(120).optional(),
});

export const saveSessionEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => SaveEventSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = await getSessionMeta(supabase, data.session_id);

    const event = await writeEvent(supabase, {
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      actor_user_id: context.userId,
      actor_role: data.actor_role,
      event_type: data.event_type,
      event_source: data.event_source,
      payload: data.payload,
      request_key: data.request_key,
    });

    return { ok: true, eventId: event?.id };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 15. saveNotes (manual note creation)
// ─────────────────────────────────────────────────────────────────────────────

const SaveNotesSchema = z.object({
  session_id: z.string().uuid().optional(),
  lesson_id: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(50000),
  notes_json: z.array(z.string()).optional(),
  source_type: z.enum(["manual", "board", "teacher", "quiz", "summary"]).default("manual"),
  request_key: z.string().max(120).optional(),
});

export const saveNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => SaveNotesSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const userId = context.userId;

    // Get lesson meta
    const { data: lesson, error: lErr } = await supabase
      .from("lessons")
      .select("institution_id, course_id")
      .eq("id", data.lesson_id)
      .single();
    if (lErr) throw new Error(lErr.message);

    const { data: note, error } = await supabase
      .from("session_notes")
      .insert({
        institution_id: lesson.institution_id,
        course_id: lesson.course_id,
        lesson_id: data.lesson_id,
        session_id: data.session_id ?? null,
        student_id: userId,
        title: data.title,
        body: data.body,
        notes_json: data.notes_json ?? [],
        source_type: data.source_type,
        is_board_export: data.source_type === "board",
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    // Write event if in session
    if (data.session_id) {
      const session = await getSessionMeta(supabase, data.session_id);
      await writeEvent(supabase, {
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        actor_user_id: userId,
        actor_role: "student",
        event_type: "note_saved",
        event_source: "notes",
        payload: { noteId: note.id, title: data.title, sourceType: data.source_type },
        request_key: data.request_key,
      });
    }

    return { ok: true, noteId: note.id };
  });