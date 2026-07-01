import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";

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
  kpis: {
    classroomCount: number;
    completedLessonsThisMonth: number;
    studyTimeMinutesThisWeek: number;
    quizAverage: number;
    currentStreakDays: number;
  };
};

const EMPTY_KPIS = {
  classroomCount: 0,
  completedLessonsThisMonth: 0,
  studyTimeMinutesThisWeek: 0,
  quizAverage: 0,
  currentStreakDays: 0,
};

function startOfWeekUTC(now: Date): Date {
  const d = new Date(now);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d;
}

function computeStreakDays(updatedTimestamps: string[]): number {
  if (updatedTimestamps.length === 0) return 0;
  const days = new Set(
    updatedTimestamps
      .filter(Boolean)
      .map((ts) => new Date(ts).toISOString().slice(0, 10)),
  );
  if (days.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  // Allow the streak to count from today; if no activity today, start from yesterday.
  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export const getMyEnrolledCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { enrollments: [] };

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
    if (!context.supabase) {
      return {
        continueLearning: {
          courseId: "",
          lessonId: "",
          lessonTitle: "",
          courseTitle: "",
          currentStep: "hook",
          progressPercentage: 0,
        },
        learningPlan: [],
        courses: [],
        recentSessions: [],
        accessProfile: {
          currentMode: "Standard",
          captionsEnabled: true,
          audioEnabled: true,
          keyboardShortcutsEnabled: true,
          focusModeEnabled: false,
          speechRate: 1,
        },
        kpis: EMPTY_KPIS,
      } satisfies StudentDashboardV2;
    }

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
    const enrollmentsWithCourses = enrollments.filter((enrollment: any) =>
      Boolean(enrollment.course),
    );
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
    const courseIds = enrollmentsWithCourses.map((e: any) => e.course_id).filter(Boolean);
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
      ? enrollmentsWithCourses.find((e: any) => e.course_id === continueLesson.course_id)?.course
      : (enrollmentsWithCourses[0]?.course ?? null);

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
        .eq("status", "live")
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
    const courses = enrollmentsWithCourses.map((enrollment: any) => {
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
          session.status === "live"
            ? ("live" as const)
            : session.status === "completed"
              ? ("completed" as const)
              : ("scheduled" as const),
        durationMinutes,
        startedAt: session.started_at ?? undefined,
      };
    });

    // ── KPIs ───────────────────────────────────────────────────────────
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const weekStart = startOfWeekUTC(now);

    const completedLessonsThisMonth = progressRows.filter(
      (p: any) =>
        p.status === "completed" && new Date(p.updated_at).getTime() >= monthStart.getTime(),
    ).length;

    const studyTimeMinutesThisWeek = progressRows
      .filter((p: any) => new Date(p.updated_at).getTime() >= weekStart.getTime())
      .reduce((sum: number, p: any) => sum + (p.time_spent_minutes ?? 0), 0);

    const quizAverage =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce((sum: number, q: any) => sum + (q.percentage ?? 0), 0) /
              quizResults.length,
          )
        : 0;

    const kpis = {
      classroomCount: enrollmentsWithCourses.length,
      completedLessonsThisMonth,
      studyTimeMinutesThisWeek,
      quizAverage,
      currentStreakDays: computeStreakDays(progressRows.map((p: any) => p.updated_at)),
    };

    return {
      continueLearning,
      learningPlan,
      courses,
      recentSessions,
      accessProfile,
      kpis,
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

export type StudentSession = {
  id: string;
  lessonTitle: string;
  courseTitle: string;
  status: "live" | "completed" | "scheduled";
  startedAt: string | null;
  endedAt: string | null;
  durationMinutes: number | null;
  notesCount: number;
};

export const getStudentSessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { sessions: [] as StudentSession[] };

    const [sessionsResult, notesResult] = await Promise.all([
      context.supabase
        .from("classroom_sessions")
        .select(
          "id, course_id, lesson_id, status, started_at, ended_at, lessons(title), courses(title)",
        )
        .eq("host_user_id", context.userId)
        .order("started_at", { ascending: false })
        .limit(50),
      context.supabase
        .from("session_notes")
        .select("id, session_id")
        .eq("student_id", context.userId),
    ]);

    const notesBySession = new Map<string, number>();
    for (const n of notesResult.data ?? []) {
      if (n.session_id) notesBySession.set(n.session_id, (notesBySession.get(n.session_id) ?? 0) + 1);
    }

    const sessions: StudentSession[] = (sessionsResult.data ?? []).map((s: any) => {
      const startedAt = s.started_at ? new Date(s.started_at) : null;
      const endedAt = s.ended_at ? new Date(s.ended_at) : null;
      const durationMinutes =
        startedAt && endedAt ? Math.round((endedAt.getTime() - startedAt.getTime()) / 60000) : null;
      const status: StudentSession["status"] =
        s.status === "live" ? "live" : s.status === "completed" ? "completed" : "scheduled";
      return {
        id: s.id,
        lessonTitle: s.lessons?.title ?? "Untitled Lesson",
        courseTitle: s.courses?.title ?? "Untitled Course",
        status,
        startedAt: s.started_at ?? null,
        endedAt: s.ended_at ?? null,
        durationMinutes,
        notesCount: s.id ? notesBySession.get(s.id) ?? 0 : 0,
      };
    });

    return { sessions };
  });

export type StudentQuiz = {
  id: string;
  title: string;
  course: string;
  date: string | null;
  score: number;
  percentage: number;
};

export const getStudentQuizzes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { quizzes: [] as StudentQuiz[] };

    const { data, error } = await context.supabase
      .from("quiz_results")
      .select("id, score, percentage, completed_at, lessons(title), courses(title)")
      .eq("student_id", context.userId)
      .order("completed_at", { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    const quizzes: StudentQuiz[] = (data ?? []).map((q: any) => ({
      id: q.id,
      title: q.lessons?.title ?? "Quiz",
      course: q.courses?.title ?? "General",
      date: q.completed_at ?? null,
      score: q.score ?? 0,
      percentage: q.percentage ?? 0,
    }));

    return { quizzes };
  });

export type StudentNote = {
  id: string;
  title: string;
  courseTitle: string;
  lessonTitle: string;
  date: string | null;
  body: string;
  notesJson: Json;
};

export const getStudentNotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { notes: [] as StudentNote[] };

    const { data, error } = await context.supabase
      .from("session_notes")
      .select("id, title, body, notes_json, created_at, lessons(title), courses(title)")
      .eq("student_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    const notes: StudentNote[] = (data ?? []).map((n: any) => ({
      id: n.id,
      title: n.title ?? "Session Notes",
      courseTitle: n.courses?.title ?? "General",
      lessonTitle: n.lessons?.title ?? "Lesson",
      date: n.created_at ?? null,
      body: n.body ?? "",
      notesJson: n.notes_json ?? [],
    }));

    return { notes };
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

// ───────────────────────────────────────────────────────────────────────────
// Phase 3: additional student data functions (lessons, resources, achievements,
// assignments, messages, learning plan, search, transcript, session summary,
// profile).
// ───────────────────────────────────────────────────────────────────────────

async function enrolledCourseIds(supabase: any, userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .eq("student_id", userId)
    .eq("status", "active");
  return (data ?? []).map((e: any) => e.course_id).filter(Boolean);
}

export type StudentLessonRow = {
  id: string;
  title: string;
  courseTitle: string;
  courseId: string;
  orderIndex: number;
  durationMinutes: number;
  progressStatus: string | null;
};

export const getStudentLessons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { lessons: [] as StudentLessonRow[] };
    const courseIds = await enrolledCourseIds(context.supabase, context.userId);
    if (courseIds.length === 0) return { lessons: [] as StudentLessonRow[] };

    const [lessonsRes, progressRes] = await Promise.all([
      context.supabase
        .from("lessons")
        .select("id, title, course_id, order_index, duration_minutes, status, courses(title)")
        .in("course_id", courseIds)
        .eq("status", "published")
        .order("order_index", { ascending: true })
        .limit(100),
      context.supabase
        .from("lesson_progress")
        .select("lesson_id, status")
        .eq("student_id", context.userId),
    ]);

    const statusByLesson = new Map<string, string>();
    for (const p of progressRes.data ?? []) statusByLesson.set(p.lesson_id, p.status);

    const lessons: StudentLessonRow[] = (lessonsRes.data ?? []).map((l: any) => ({
      id: l.id,
      title: l.title ?? "Untitled lesson",
      courseTitle: l.courses?.title ?? "Course",
      courseId: l.course_id,
      orderIndex: l.order_index ?? 0,
      durationMinutes: l.duration_minutes ?? 20,
      progressStatus: statusByLesson.get(l.id) ?? null,
    }));

    return { lessons };
  });

export type StudentResourceRow = {
  id: string;
  title: string;
  type: string;
  courseTitle: string;
  fileUrl: string | null;
  linkUrl: string | null;
};

export const getStudentResources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { resources: [] as StudentResourceRow[] };
    const courseIds = await enrolledCourseIds(context.supabase, context.userId);
    if (courseIds.length === 0) return { resources: [] as StudentResourceRow[] };

    const { data, error } = await context.supabase
      .from("course_materials")
      .select("id, title, type, file_url, link_url, courses(title)")
      .in("course_id", courseIds)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);

    const resources: StudentResourceRow[] = (data ?? []).map((m: any) => ({
      id: m.id,
      title: m.title ?? "Resource",
      type: m.type ?? "document",
      courseTitle: m.courses?.title ?? "Course",
      fileUrl: m.file_url ?? null,
      linkUrl: m.link_url ?? null,
    }));

    return { resources };
  });

export type StudentAchievementRow = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  earnedAt: string | null;
  achievementType: string;
};

export const getStudentAchievements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { achievements: [] as StudentAchievementRow[] };
    const { data, error } = await context.supabase
      .from("achievements")
      .select("id, title, description, icon, earned_at, achievement_type")
      .eq("student_id", context.userId)
      .order("earned_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    const achievements: StudentAchievementRow[] = (data ?? []).map((a: any) => ({
      id: a.id,
      title: a.title ?? "Achievement",
      description: a.description ?? null,
      icon: a.icon ?? "🏆",
      earnedAt: a.earned_at ?? null,
      achievementType: a.achievement_type ?? "milestone",
    }));
    return { achievements };
  });

export type StudentAssignmentRow = {
  id: string;
  title: string;
  description: string | null;
  dueAt: string | null;
  status: string;
  courseTitle: string;
};

export const getStudentAssignments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { assignments: [] as StudentAssignmentRow[] };
    const { data, error } = await context.supabase
      .from("assignments")
      .select("id, title, description, due_at, status, courses(title)")
      .eq("student_id", context.userId)
      .order("due_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    const assignments: StudentAssignmentRow[] = (data ?? []).map((a: any) => ({
      id: a.id,
      title: a.title ?? "Assignment",
      description: a.description ?? null,
      dueAt: a.due_at ?? null,
      status: a.status ?? "pending",
      courseTitle: a.courses?.title ?? "Course",
    }));
    return { assignments };
  });

export type StudentMessageRow = {
  id: string;
  body: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  isMine: boolean;
  readAt: string | null;
  createdAt: string | null;
  institutionId: string;
  courseId: string | null;
};

export const getStudentMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { messages: [] as StudentMessageRow[] };
    const { data, error } = await context.supabase
      .from("messages")
      .select("id, body, sender_id, recipient_id, read_at, created_at, institution_id, course_id")
      .or(`sender_id.eq.${context.userId},recipient_id.eq.${context.userId}`)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);

    const peerIds = Array.from(
      new Set(
        (data ?? []).flatMap((m: any) => [m.sender_id, m.recipient_id]).filter((id: string) => id),
      ),
    );
    const nameById = new Map<string, string>();
    if (peerIds.length > 0) {
      const { data: profiles } = await context.supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", peerIds);
      for (const p of profiles ?? []) {
        nameById.set(p.id, p.full_name || p.email || "User");
      }
    }

    const messages: StudentMessageRow[] = (data ?? []).map((m: any) => ({
      id: m.id,
      body: m.body ?? "",
      senderId: m.sender_id,
      recipientId: m.recipient_id,
      senderName: nameById.get(m.sender_id) ?? "User",
      isMine: m.sender_id === context.userId,
      readAt: m.read_at ?? null,
      createdAt: m.created_at ?? null,
      institutionId: m.institution_id,
      courseId: m.course_id ?? null,
    }));

    return { messages };
  });

export const sendStudentMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({
      recipientId: z.string().uuid(),
      institutionId: z.string().uuid(),
      body: z.string().min(1).max(4000),
      courseId: z.string().uuid().nullable().optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) throw new Error("Database not configured.");
    const { error } = await context.supabase.from("messages").insert({
      institution_id: data.institutionId,
      course_id: data.courseId ?? null,
      sender_id: context.userId,
      recipient_id: data.recipientId,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type StudentPlanItem = {
  id: string;
  title: string;
  description: string | null;
  targetUrl: string | null;
  priority: number;
  recommendationType: string;
};

export const getStudentLearningPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { items: [] as StudentPlanItem[] };
    const { data, error } = await context.supabase
      .from("recommendations")
      .select("id, title, description, target_url, priority, recommendation_type")
      .eq("student_id", context.userId)
      .order("priority", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    const items: StudentPlanItem[] = (data ?? []).map((r: any) => ({
      id: r.id,
      title: r.title ?? "Task",
      description: r.description ?? null,
      targetUrl: r.target_url ?? null,
      priority: r.priority ?? 0,
      recommendationType: r.recommendation_type ?? "task",
    }));
    return { items };
  });

export const dismissRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) throw new Error("Database not configured.");
    const { error } = await context.supabase
      .from("recommendations")
      .update({ is_read: true })
      .eq("id", data.id)
      .eq("student_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const searchStudentContent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { query: string }) => z.object({ query: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) return { lessons: [], materials: [] };
    const courseIds = await enrolledCourseIds(context.supabase, context.userId);
    if (courseIds.length === 0) return { lessons: [], materials: [] };
    const like = `%${data.query}%`;

    const [lessonsRes, materialsRes] = await Promise.all([
      context.supabase
        .from("lessons")
        .select("id, title, course_id, courses(title)")
        .in("course_id", courseIds)
        .ilike("title", like)
        .limit(20),
      context.supabase
        .from("course_materials")
        .select("id, title, type, courses(title)")
        .in("course_id", courseIds)
        .ilike("title", like)
        .limit(20),
    ]);

    return {
      lessons: (lessonsRes.data ?? []).map((l: any) => ({
        id: l.id,
        title: l.title,
        courseTitle: l.courses?.title ?? "Course",
        courseId: l.course_id,
      })),
      materials: (materialsRes.data ?? []).map((m: any) => ({
        id: m.id,
        title: m.title,
        type: m.type,
        courseTitle: m.courses?.title ?? "Course",
      })),
    };
  });

export type StudentTranscript = {
  totalSessions: number;
  completedSessions: number;
  lessonsCompleted: number;
  avgQuiz: number;
  totalStudyMinutes: number;
  byCourse: Array<{ courseTitle: string; lessonsCompleted: number; avgProgress: number }>;
};

export const getStudentTranscript = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return {
      totalSessions: 0,
      completedSessions: 0,
      lessonsCompleted: 0,
      avgQuiz: 0,
      totalStudyMinutes: 0,
      byCourse: [],
    } satisfies StudentTranscript;

    const [sessionsRes, progressRes, quizRes, enrollRes] = await Promise.all([
      context.supabase
        .from("classroom_sessions")
        .select("id, status")
        .eq("host_user_id", context.userId),
      context.supabase
        .from("lesson_progress")
        .select("lesson_id, course_id, status, progress_percentage, time_spent_minutes")
        .eq("student_id", context.userId),
      context.supabase
        .from("quiz_results")
        .select("percentage")
        .eq("student_id", context.userId),
      context.supabase
        .from("course_enrollments")
        .select("course_id, course:courses(id, title)")
        .eq("student_id", context.userId)
        .eq("status", "active"),
    ]);

    const sessions = sessionsRes.data ?? [];
    const progress = progressRes.data ?? [];
    const quizzes = quizRes.data ?? [];
    const enrollments = enrollRes.data ?? [];

    const totalStudyMinutes = progress.reduce(
      (s: number, p: any) => s + (p.time_spent_minutes ?? 0),
      0,
    );
    const lessonsCompleted = progress.filter((p: any) => p.status === "completed").length;
    const avgQuiz = quizzes.length
      ? Math.round(quizzes.reduce((s: number, q: any) => s + (q.percentage ?? 0), 0) / quizzes.length)
      : 0;

    const byCourse = (enrollments as any[])
      .filter((e) => e.course)
      .map((e: any) => {
        const rows = progress.filter((p: any) => p.course_id === e.course.id);
        const completed = rows.filter((p: any) => p.status === "completed").length;
        const avgProgress = rows.length
          ? Math.round(rows.reduce((s: number, p: any) => s + (p.progress_percentage ?? 0), 0) / rows.length)
          : 0;
        return {
          courseTitle: e.course.title ?? "Course",
          lessonsCompleted: completed,
          avgProgress,
        };
      });

    return {
      totalSessions: sessions.length,
      completedSessions: sessions.filter((s: any) => s.status === "completed").length,
      lessonsCompleted,
      avgQuiz,
      totalStudyMinutes,
      byCourse,
    } satisfies StudentTranscript;
  });

export type SessionSummary = {
  id: string;
  lessonTitle: string;
  courseTitle: string;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
  durationMinutes: number | null;
  eventCount: number;
  questionsAsked: number;
  notes: Array<{ id: string; title: string; body: string }>;
};

export const getSessionSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) => z.object({ session_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) throw new Error("Database not configured.");
    const [sessionRes, eventsRes, notesRes] = await Promise.all([
      context.supabase
        .from("classroom_sessions")
        .select("id, status, started_at, ended_at, lessons(title), courses(title)")
        .eq("id", data.session_id)
        .eq("host_user_id", context.userId)
        .maybeSingle(),
      context.supabase
        .from("session_events")
        .select("id, event_type")
        .eq("session_id", data.session_id),
      context.supabase
        .from("session_notes")
        .select("id, title, body")
        .eq("session_id", data.session_id)
        .eq("student_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    if (sessionRes.error) throw new Error(sessionRes.error.message);
    const s = sessionRes.data;
    if (!s) throw new Error("Session not found.");

    const startedAt = s.started_at ? new Date(s.started_at) : null;
    const endedAt = s.ended_at ? new Date(s.ended_at) : null;
    const durationMinutes =
      startedAt && endedAt ? Math.round((endedAt.getTime() - startedAt.getTime()) / 60000) : null;

    const events = eventsRes.data ?? [];
    const questionsAsked = events.filter((e: any) =>
      String(e.event_type ?? "").includes("question"),
    ).length;

    const summary: SessionSummary = {
      id: s.id,
      lessonTitle: s.lessons?.title ?? "Lesson",
      courseTitle: s.courses?.title ?? "Course",
      status: s.status ?? "completed",
      startedAt: s.started_at ?? null,
      endedAt: s.ended_at ?? null,
      durationMinutes,
      eventCount: events.length,
      questionsAsked,
      notes: (notesRes.data ?? []).map((n: any) => ({
        id: n.id,
        title: n.title ?? "Note",
        body: n.body ?? "",
      })),
    };

    return summary;
  });

export type StudentProfile = {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
};

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { fullName: null, email: null, phone: null, avatarUrl: null } satisfies StudentProfile;
    const { data, error } = await context.supabase
      .from("profiles")
      .select("full_name, email, phone, avatar_url")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      fullName: data?.full_name ?? null,
      email: data?.email ?? null,
      phone: data?.phone ?? null,
      avatarUrl: data?.avatar_url ?? null,
    } satisfies StudentProfile;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        fullName: z.string().min(1).max(120).optional(),
        phone: z.string().max(40).nullable().optional(),
        avatarUrl: z.string().url().nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) throw new Error("Database not configured.");
    const patch: Record<string, unknown> = {};
    if (data.fullName !== undefined) patch.full_name = data.fullName;
    if (data.phone !== undefined) patch.phone = data.phone;
    if (data.avatarUrl !== undefined) patch.avatar_url = data.avatarUrl;
    const { error } = await context.supabase
      .from("profiles")
      .update(patch)
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
