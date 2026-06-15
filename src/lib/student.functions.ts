import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type LearningPlanItem = {
  id: string;
  title: string;
  description?: string;
  status: "next" | "todo" | "optional";
};

export type StudentDashboardV2 = {
  continueLearning: {
    courseId: string;
    lessonId: string;
    sessionId?: string;
    lessonTitle: string;
    courseTitle: string;
    currentStep: string;
    progressPercentage: number;
  };
  learningPlan: LearningPlanItem[];
  courses: Array<{
    id: string;
    institutionId: string;
    institutionName: string;
    title: string;
    subject: string;
    level: string;
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    currentLessonTitle: string;
    currentStep: string;
    teacherMode: string;
    accessibilityStatus: string;
    lastActivity: string;
    nextRecommendedAction: string;
    estimatedTimeLeft: string;
    lessonId: string;
    sessionId?: string;
  }>;
  recentSessions: Array<{
    id: string;
    lessonTitle: string;
    courseTitle: string;
    status: "live" | "completed" | "scheduled";
    durationMinutes?: number;
    startedAt?: string;
    summaryId?: string;
    quizId?: string;
  }>;
  accessProfile: {
    currentMode: string;
    captionsEnabled: boolean;
    audioEnabled: boolean;
    keyboardShortcutsEnabled: boolean;
    focusModeEnabled: boolean;
    speechRate: number;
  };
};

export const getMyEnrolledCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const { data, error } = await context.supabase
      .from("course_enrollments")
      .select(
        "id, status, enrolled_at, course:courses(id, title, subject, level, description, status, institution_id, institutions(name, brand_color, logo_url))",
      )
      .eq("student_id", context.userId)
      .eq("status", "active");
    if (error) throw new Error(error.message);
    return { enrollments: data ?? [] };
  });

export const getStudentDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    // ── Parallel fetch all dashboard data from real tables ─────────────
    const [
      enrollmentsResult,
      progressResult,
      sessionsResult,
      profileResult,
      recommendationsResult,
      quizResultsResult,
    ] = await Promise.all([
      context.supabase
        .from("course_enrollments")
        .select(
          "id, course_id, status, enrolled_at, course:courses(id, title, subject, level, institution_id, description, status, cover_image_url, institutions(name, brand_color, logo_url))",
        )
        .eq("student_id", context.userId)
        .eq("status", "active"),
      context.supabase
        .from("lesson_progress")
        .select(
          "lesson_id, course_id, status, progress_percentage, current_step, time_spent_minutes, updated_at",
        )
        .eq("student_id", context.userId),
      context.supabase
        .from("classroom_sessions")
        .select(
          "id, course_id, lesson_id, status, started_at, ended_at, lessons(id, title), courses(title)",
        )
        .eq("host_user_id", context.userId)
        .order("started_at", { ascending: false })
        .limit(10),
      context.supabase
        .from("learner_access_profiles")
        .select("*")
        .eq("user_id", context.userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      context.supabase
        .from("recommendations")
        .select("id, title, description, recommendation_type, target_url, priority")
        .eq("student_id", context.userId)
        .eq("is_read", false)
        .order("priority", { ascending: false })
        .limit(5),
      context.supabase
        .from("quiz_results")
        .select("id, lesson_id, percentage, completed_at")
        .eq("student_id", context.userId)
        .order("completed_at", { ascending: false })
        .limit(10),
    ]);

    const enrollments = enrollmentsResult.data ?? [];
    const progressRows = progressResult.data ?? [];
    const recentSessionsRaw = sessionsResult.data ?? [];
    const recommendations = recommendationsResult.data ?? [];
    const quizResults = quizResultsResult.data ?? [];

    // ── Access profile ─────────────────────────────────────────────────
    const accessProfile = profileResult.data
      ? {
          currentMode:
            profileResult.data.explanation_style === "detailed"
              ? "Detailed"
              : profileResult.data.explanation_style === "simple"
                ? "Simple"
                : "Standard",
          captionsEnabled: profileResult.data.captions_enabled,
          audioEnabled: profileResult.data.audio_enabled,
          keyboardShortcutsEnabled: profileResult.data.keyboard_shortcuts_enabled,
          focusModeEnabled: profileResult.data.reduced_motion,
          speechRate: Number(profileResult.data.speech_rate ?? 1),
        }
      : {
          currentMode: "Standard",
          captionsEnabled: true,
          audioEnabled: true,
          keyboardShortcutsEnabled: true,
          focusModeEnabled: false,
          speechRate: 1,
        };

    // ── Fetch lesson counts per course ─────────────────────────────────
    const courseIds = enrollments.map((e: any) => e.course_id).filter(Boolean);
    const lessonCounts: Record<string, number> = {};
    if (courseIds.length > 0) {
      const { data: lessonsData } = await context.supabase
        .from("lessons")
        .select("course_id")
        .in("course_id", courseIds);
      if (lessonsData) {
        for (const row of lessonsData) {
          lessonCounts[row.course_id] = (lessonCounts[row.course_id] ?? 0) + 1;
        }
      }
    }

    // ── Continue learning: most recent in-progress lesson ──────────────
    const inProgressLessons = progressRows
      .filter((p: any) => p.status === "in_progress")
      .sort(
        (a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    const continueLesson = inProgressLessons[0] ?? progressRows[0] ?? null;
    const continueCourse = continueLesson
      ? enrollments.find((e: any) => e.course_id === continueLesson.course_id)?.course
      : (enrollments[0]?.course ?? null);

    // Fetch lesson title for continue learning
    let continueLessonTitle = "";
    if (continueLesson?.lesson_id) {
      const { data: lessonData } = await context.supabase
        .from("lessons")
        .select("title")
        .eq("id", continueLesson.lesson_id)
        .maybeSingle();
      continueLessonTitle = lessonData?.title ?? "";
    }

    // Fetch active session for continue learning
    let continueSessionId: string | undefined;
    if (continueLesson?.course_id) {
      const { data: activeSession } = await context.supabase
        .from("classroom_sessions")
        .select("id")
        .eq("host_user_id", context.userId)
        .eq("course_id", continueLesson.course_id)
        .eq("status", "active")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      continueSessionId = activeSession?.id ?? undefined;
    }

    const continueLearning = continueLesson
      ? {
          courseId: continueLesson.course_id,
          lessonId: continueLesson.lesson_id,
          sessionId: continueSessionId,
          lessonTitle: continueLessonTitle,
          courseTitle: continueCourse?.title ?? "",
          currentStep: continueLesson.current_step ?? "hook",
          progressPercentage: continueLesson.progress_percentage ?? 0,
        }
      : {
          courseId: continueCourse?.id ?? "",
          lessonId: "",
          lessonTitle: "",
          courseTitle: continueCourse?.title ?? "",
          currentStep: "hook",
          progressPercentage: 0,
        };

    // ── Learning plan from recommendations ─────────────────────────────
    const learningPlan: LearningPlanItem[] =
      recommendations.length > 0
        ? recommendations.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description ?? undefined,
            status: "next" as const,
          }))
        : [];

    // ── Courses with real progress ─────────────────────────────────────
    const courses = enrollments.map((enrollment: any) => {
      const course = enrollment.course;
      const progressForCourse = progressRows.filter((row: any) => row.course_id === course.id);
      const progressPercentage =
        progressForCourse.length > 0
          ? Math.round(
              progressForCourse.reduce(
                (sum: number, row: any) => sum + (row.progress_percentage ?? 0),
                0,
              ) / progressForCourse.length,
            )
          : 0;
      const completedCount = progressForCourse.filter(
        (row: any) => row.status === "completed",
      ).length;
      const totalLessons = lessonCounts[course.id] ?? Math.max(progressForCourse.length, 1);
      const latestProgress = progressForCourse.sort(
        (a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )[0];

      // Calculate last activity relative time
      const lastUpdated = latestProgress?.updated_at
        ? getRelativeTime(new Date(latestProgress.updated_at))
        : "No activity yet";

      return {
        id: course.id,
        institutionId: course.institution_id ?? "",
        institutionName: course.institutions?.name ?? "",
        title: course.title,
        subject: course.subject ?? "General",
        level: course.level ?? "Beginner",
        progressPercentage,
        completedLessons: completedCount,
        totalLessons,
        currentLessonTitle: continueLessonTitle,
        currentStep: latestProgress?.current_step ?? "hook",
        teacherMode: "AI Teacher",
        accessibilityStatus: accessProfile.captionsEnabled ? "Captions On" : "Standard",
        lastActivity: lastUpdated,
        nextRecommendedAction: progressPercentage > 0 ? "Continue lesson" : "Start course",
        estimatedTimeLeft: `${Math.max(1, totalLessons - completedCount) * 15} min`,
        lessonId: latestProgress?.lesson_id ?? "",
        sessionId: continueSessionId,
      };
    });

    // ── Recent sessions from real data ─────────────────────────────────
    const recentSessions = recentSessionsRaw.map((session: any) => {
      const endedAt = session.ended_at ? new Date(session.ended_at) : null;
      const startedAt = session.started_at ? new Date(session.started_at) : null;
      const durationMinutes =
        endedAt && startedAt ? Math.round((endedAt.getTime() - startedAt.getTime()) / 60000) : null;

      return {
        id: session.id,
        lessonTitle: session.lessons?.title ?? "Untitled Lesson",
        courseTitle: session.courses?.title ?? "Untitled Course",
        status:
          session.status === "active"
            ? ("live" as const)
            : session.status === "completed"
              ? ("completed" as const)
              : ("scheduled" as const),
        durationMinutes,
        startedAt: session.started_at ?? undefined,
      };
    });

    return {
      continueLearning,
      learningPlan,
      courses,
      recentSessions,
      accessProfile,
    } satisfies StudentDashboardV2;
  });

/** Returns a human-readable relative time string. */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export const updateLearnerAccessProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        captionsEnabled: z.boolean().optional(),
        audioEnabled: z.boolean().optional(),
        keyboardShortcutsEnabled: z.boolean().optional(),
        focusModeEnabled: z.boolean().optional(),
        speechRate: z.number().min(0.5).max(2).optional(),
        currentMode: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const [membershipResult, existingProfileResult] = await Promise.all([
      context.supabase
        .from("institution_members")
        .select("institution_id")
        .eq("user_id", context.userId)
        .eq("status", "active")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      context.supabase
        .from("learner_access_profiles")
        .select("*")
        .eq("user_id", context.userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const institutionId =
      membershipResult.data?.institution_id ?? existingProfileResult.data?.institution_id;
    if (!institutionId) {
      throw new Error("No active institution found for access profile update");
    }

    const existing = existingProfileResult.data;
    const { data: row, error } = await context.supabase
      .from("learner_access_profiles")
      .upsert(
        {
          user_id: context.userId,
          institution_id: institutionId,
          accessibility_modes_json: existing?.accessibility_modes_json ?? [],
          captions_enabled: data.captionsEnabled ?? existing?.captions_enabled ?? true,
          transcript_enabled: existing?.transcript_enabled ?? true,
          audio_enabled: data.audioEnabled ?? existing?.audio_enabled ?? true,
          board_descriptions_enabled: existing?.board_descriptions_enabled ?? true,
          screen_reader_optimized: existing?.screen_reader_optimized ?? false,
          high_contrast: existing?.high_contrast ?? false,
          large_text: existing?.large_text ?? false,
          reduced_motion: data.focusModeEnabled ?? existing?.reduced_motion ?? false,
          keyboard_shortcuts_enabled:
            data.keyboardShortcutsEnabled ?? existing?.keyboard_shortcuts_enabled ?? true,
          voice_input_enabled: existing?.voice_input_enabled ?? true,
          speech_rate: data.speechRate ?? existing?.speech_rate ?? 1,
          font_scale: existing?.font_scale ?? 1,
          lesson_pace: existing?.lesson_pace ?? (data.focusModeEnabled ? "slow" : "normal"),
          explanation_style:
            data.currentMode?.toLowerCase() === "simple"
              ? "simple"
              : data.currentMode?.toLowerCase() === "detailed"
                ? "detailed"
                : (existing?.explanation_style ?? "standard"),
        },
        { onConflict: "user_id,institution_id" },
      )
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    return { ok: true, profile: row };
  });

export const getCourseForStudent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const [course, lessons, progress] = await Promise.all([
      context.supabase
        .from("courses")
        .select("*, institutions(name, brand_color)")
        .eq("id", data.course_id)
        .single(),
      context.supabase
        .from("lessons")
        .select("*")
        .eq("course_id", data.course_id)
        .eq("status", "published")
        .order("order_index"),
      context.supabase
        .from("lesson_progress")
        .select("lesson_id, status, progress_percentage")
        .eq("course_id", data.course_id)
        .eq("student_id", context.userId),
    ]);
    if (course.error) throw new Error(course.error.message);
    const progressMap = Object.fromEntries((progress.data ?? []).map((p: any) => [p.lesson_id, p]));
    return {
      course: course.data,
      lessons: (lessons.data ?? []).map((l: any) => ({
        ...l,
        progress: progressMap[l.id] ?? null,
      })),
    };
  });

export const updateLessonProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        lesson_id: z.string().uuid(),
        course_id: z.string().uuid(),
        institution_id: z.string().uuid(),
        session_id: z.string().uuid().optional(),
        current_step: z.string().optional(),
        progress_percentage: z.number().int().min(0).max(100).optional(),
        confusion_score: z.number().min(0).max(1).optional(),
        student_level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        status: z.enum(["not_started", "in_progress", "completed"]).optional(),
        time_spent_minutes: z.number().int().min(0).optional(),
      })
      .passthrough()
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { lesson_id, course_id, institution_id, session_id, ...updates } = data;
    // Use upsert: insert if not exists, update if it does
    const { data: existing } = await context.supabase
      .from("lesson_progress")
      .select("id")
      .eq("lesson_id", lesson_id)
      .eq("student_id", context.userId)
      .maybeSingle();

    if (existing) {
      const { error } = await context.supabase
        .from("lesson_progress")
        .update({ ...updates, session_id: session_id ?? undefined })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }

    const { error } = await context.supabase.from("lesson_progress").insert({
      institution_id,
      course_id,
      lesson_id,
      student_id: context.userId,
      session_id: session_id ?? null,
      current_step: updates.current_step ?? null,
      progress_percentage: updates.progress_percentage ?? 0,
      confusion_score: updates.confusion_score ?? 0,
      student_level: updates.student_level ?? "intermediate",
      status: updates.status ?? "in_progress",
      time_spent_minutes: updates.time_spent_minutes ?? 0,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    // Get all enrollments
    const { data: enrollments, error: eErr } = await context.supabase
      .from("course_enrollments")
      .select(
        "id, course_id, status, course:courses(id, title, subject, level, institutions(name, brand_color))",
      )
      .eq("student_id", context.userId)
      .eq("status", "active");
    if (eErr) throw new Error(eErr.message);

    // Get all lesson progress for this student
    const { data: progress, error: pErr } = await context.supabase
      .from("lesson_progress")
      .select(
        "lesson_id, course_id, status, progress_percentage, current_step, confusion_score, student_level, time_spent_minutes, updated_at",
      )
      .eq("student_id", context.userId);
    if (pErr) throw new Error(pErr.message);

    // Get all quiz results
    const { data: quizResults, error: qErr } = await context.supabase
      .from("quiz_results")
      .select("id, lesson_id, course_id, score, percentage, completed_at")
      .eq("student_id", context.userId)
      .order("completed_at", { ascending: false });
    if (qErr) throw new Error(qErr.message);

    // Group progress by course
    const progressByCourse: Record<string, typeof progress> = {};
    for (const p of progress ?? []) {
      (progressByCourse[p.course_id] ??= []).push(p);
    }
    const quizzesByCourse: Record<string, typeof quizResults> = {};
    for (const q of quizResults ?? []) {
      (quizzesByCourse[q.course_id] ??= []).push(q);
    }

    // Get lesson counts per course
    const courseIds = (enrollments ?? []).map((e: any) => e.course_id).filter(Boolean);
    const lessonCounts: Record<string, number> = {};
    if (courseIds.length > 0) {
      const { data: lessons } = await context.supabase
        .from("lessons")
        .select("course_id")
        .in("course_id", courseIds)
        .eq("status", "published");
      for (const l of lessons ?? []) {
        lessonCounts[(l as any).course_id] = (lessonCounts[(l as any).course_id] ?? 0) + 1;
      }
    }

    return {
      enrollments: enrollments ?? [],
      progressByCourse,
      quizzesByCourse,
      lessonCounts,
      totalProgress: progress ?? [],
      totalQuizzes: quizResults ?? [],
    };
  });
