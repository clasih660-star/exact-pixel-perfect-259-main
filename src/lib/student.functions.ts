import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEMO_DASHBOARD_DATA } from "@/lib/demo-data";

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
  .handler(async ({ context }) => {
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
  .handler(async ({ context }) => {
    const [enrollmentsResult, progressResult] = await Promise.all([
      context.supabase
        .from("course_enrollments")
        .select(
          "id, course_id, status, course:courses(id, title, subject, level, institution_id, institutions(name, brand_color, logo_url))",
        )
        .eq("student_id", context.userId)
        .eq("status", "active"),
      context.supabase
        .from("lesson_progress")
        .select(
          "lesson_id, course_id, status, progress_percentage, current_step, time_spent_minutes, updated_at",
        )
        .eq("student_id", context.userId),
    ]);

    const enrollments = enrollmentsResult.data ?? [];
    const progressRows = progressResult.data ?? [];
    const [membershipResult, profileResult] = await Promise.all([
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
    const firstCourse = enrollments[0]?.course;
    const accessProfile = profileResult.data
      ? {
          currentMode: profileResult.data.explanation_style === "detailed"
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
    const continueLearning = {
      courseId: firstCourse?.id ?? DEMO_DASHBOARD_DATA.courses[0].id,
      lessonId: progressRows[0]?.lesson_id ?? "lesson-quadratic",
      sessionId: "session-demo",
      lessonTitle: "Introduction to Quadratic Equations",
      courseTitle: firstCourse?.title ?? DEMO_DASHBOARD_DATA.courses[0].title,
      currentStep: "Worked Example",
      progressPercentage: 42,
    };

    return {
      continueLearning,
      learningPlan: [
        {
          id: "plan-1",
          title: "Continue Quadratic Equations",
          status: "next" as const,
          description: "Pick up at the worked example step.",
        },
        {
          id: "plan-2",
          title: "Complete 4-question quiz",
          status: "todo" as const,
          description: "Check understanding before the next lesson.",
        },
        {
          id: "plan-3",
          title: "Review one weak topic: Factoring",
          status: "optional" as const,
          description: "A short review to strengthen recall.",
        },
      ],
      courses: (enrollments.length > 0
        ? enrollments
        : DEMO_DASHBOARD_DATA.courses.map((course) => ({ id: course.id, course }))
      ).map((enrollment: any, index: number) => {
        const course = enrollment.course ?? enrollment;
        const progressForCourse = progressRows.filter((row: any) => row.course_id === course.id);
        const progressPercentage =
          progressForCourse.length > 0
            ? Math.round(
                progressForCourse.reduce(
                  (sum: number, row: any) => sum + (row.progress_percentage ?? 0),
                  0,
                ) / progressForCourse.length,
              )
            : (DEMO_DASHBOARD_DATA.courses[index]?.progressPercentage ?? 42);
        return {
          id: course.id,
          institutionId: course.institution_id ?? course.institutionId ?? "inst-1",
          institutionName: course.institutions?.name ?? "Klassruum Demo Academy",
          title: course.title,
          subject: course.subject ?? "General",
          level: course.level ?? "Intermediate",
          progressPercentage,
          completedLessons:
            progressForCourse.filter((row: any) => row.status === "completed").length ||
            DEMO_DASHBOARD_DATA.courses[index]?.completedLessons ||
            0,
          totalLessons:
            DEMO_DASHBOARD_DATA.courses[index]?.totalLessons ??
            Math.max(progressForCourse.length + 3, 6),
          currentLessonTitle: continueLearning.lessonTitle,
          currentStep: continueLearning.currentStep,
          teacherMode: "AI Teacher",
          accessibilityStatus: "Captions On",
          lastActivity: "2 hours ago",
          nextRecommendedAction: "Enter classroom",
          estimatedTimeLeft: "18 min",
          lessonId: continueLearning.lessonId,
          sessionId: continueLearning.sessionId,
        };
      }),
      recentSessions: DEMO_DASHBOARD_DATA.recentSessions.map((session, index) => ({
        id: session.id,
        lessonTitle: session.title,
        courseTitle: session.courseTitle,
        status: session.status === "completed" ? "completed" : "live",
        durationMinutes: Number.parseInt(session.duration, 10) || 0,
        startedAt: session.timestamp,
        summaryId: `summary-${index + 1}`,
        quizId: `quiz-${index + 1}`,
      })),
      accessProfile,
    } satisfies StudentDashboardV2;
  });

export const updateLearnerAccessProfile = createServerFn({ method: "PATCH" })
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
  .handler(async ({ data, context }) => {
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
      membershipResult.data?.institution_id ??
      existingProfileResult.data?.institution_id;
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
          lesson_pace:
            existing?.lesson_pace ??
            (data.focusModeEnabled ? "slow" : "normal"),
          explanation_style:
            data.currentMode?.toLowerCase() === "simple"
              ? "simple"
              : data.currentMode?.toLowerCase() === "detailed"
                ? "detailed"
                : existing?.explanation_style ?? "standard",
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
  .handler(async ({ data, context }) => {
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
    const progressMap = Object.fromEntries((progress.data ?? []).map((p) => [p.lesson_id, p]));
    return {
      course: course.data,
      lessons: (lessons.data ?? []).map((l) => ({ ...l, progress: progressMap[l.id] ?? null })),
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
  .handler(async ({ data, context }) => {
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
  .handler(async ({ context }) => {
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
