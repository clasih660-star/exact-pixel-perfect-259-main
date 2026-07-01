import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Institution & Teacher Reporting
 * -------------------------------
 * Real, backend-computed views over the platform's activity so institutions can
 * see what their hired AI teacher is actually delivering: course coverage,
 * learner progress, questions asked, live sessions. Replaces the hardcoded demo
 * data that the dashboards previously rendered.
 */

/** Resolve the institution the current user administers/teaches at. */
async function resolveInstitution(
  supabase: any,
  userId: string,
): Promise<{ id: string; name: string; role: string } | null> {
  const { data, error } = await supabase
    .from("institution_members")
    .select("role, institution:institutions(id, name)")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(10);
  if (error || !data?.length) return null;
  // Prefer an admin/owner membership, otherwise the first active one.
  const preferred = data.find((m: any) => ["owner", "admin"].includes(m.role)) ?? data[0];
  const inst = preferred.institution;
  if (!inst) return null;
  return { id: inst.id, name: inst.name, role: preferred.role };
}

/**
 * Everything the institution dashboard needs in a single round trip: KPIs,
 * recent courses (with real enrollment & lesson counts), live sessions, recent
 * materials, and a recent activity feed.
 */
export const getInstitutionDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const { supabase, userId } = context;

    // Demo mode — return empty data
    if (!supabase) {
      return {
        institution: null,
        stats: null,
        courses: [],
        activeSessions: [],
        recentMaterials: [],
        activity: [],
      };
    }

    const institution = await resolveInstitution(supabase, userId);
    if (!institution) {
      return {
        institution: null,
        stats: null,
        courses: [],
        activeSessions: [],
        recentMaterials: [],
        activity: [],
      };
    }
    const instId = institution.id;

    const [
      coursesRes,
      lessonsRes,
      enrollmentsRes,
      membersRes,
      materialsRes,
      sessionsRes,
      resultsRes,
      activityRes,
    ] = await Promise.all([
      supabase
        .from("courses")
        .select("id, title, subject, status, created_at")
        .eq("institution_id", instId),
      supabase.from("lessons").select("id, course_id, status").eq("institution_id", instId),
      supabase
        .from("course_enrollments")
        .select("course_id, student_id, status")
        .eq("institution_id", instId),
      supabase
        .from("institution_members")
        .select("role")
        .eq("institution_id", instId)
        .eq("status", "active"),
      supabase
        .from("course_materials")
        .select("id, title, type, processing_status, created_at")
        .eq("institution_id", instId)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("classroom_sessions")
        .select("id, lesson_id, mode, status, started_at, lessons(title)")
        .eq("institution_id", instId)
        .in("status", ["live", "scheduled"])
        .order("started_at", { ascending: false })
        .limit(8),
      supabase
        .from("learning_results")
        .select("progress_percentage, status")
        .eq("institution_id", instId),
      supabase
        .from("session_events")
        .select("id, event_type, actor_role, course_id, lesson_id, created_at")
        .eq("institution_id", instId)
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

    const courses = coursesRes.data ?? [];
    const lessons = lessonsRes.data ?? [];
    const enrollments = enrollmentsRes.data ?? [];
    const members = membersRes.data ?? [];
    const results = resultsRes.data ?? [];

    const enrollmentByCourse = new Map<string, Set<string>>();
    for (const e of enrollments) {
      if (e.status && e.status !== "active") continue;
      if (!enrollmentByCourse.has(e.course_id)) enrollmentByCourse.set(e.course_id, new Set());
      enrollmentByCourse.get(e.course_id)!.add(e.student_id);
    }
    const lessonCountByCourse = new Map<string, number>();
    for (const l of lessons) {
      lessonCountByCourse.set(l.course_id, (lessonCountByCourse.get(l.course_id) ?? 0) + 1);
    }

    const uniqueStudents = new Set(
      enrollments
        .filter((e: any) => !e.status || e.status === "active")
        .map((e: any) => e.student_id),
    );
    const teacherCount = members.filter((m: any) => m.role === "teacher").length;
    const avgProgress =
      results.length > 0
        ? Math.round(
            results.reduce((s: any, r: any) => s + (r.progress_percentage ?? 0), 0) /
              results.length,
          )
        : 0;

    const courseSummaries = courses
      .slice()
      .sort((a: any, b: any) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
      .slice(0, 6)
      .map((c: any) => ({
        id: c.id,
        title: c.title,
        subject: c.subject,
        status: c.status,
        students: enrollmentByCourse.get(c.id)?.size ?? 0,
        lessons: lessonCountByCourse.get(c.id) ?? 0,
      }));

    return {
      institution,
      stats: {
        courses: courses.length,
        publishedCourses: courses.filter((c: any) => c.status === "published").length,
        lessons: lessons.length,
        publishedLessons: lessons.filter((l: any) => l.status === "published").length,
        students: uniqueStudents.size,
        teachers: teacherCount,
        materials: materialsRes.count ?? materialsRes.data?.length ?? 0,
        liveSessions: (sessionsRes.data ?? []).filter((s: any) => s.status === "live").length,
        avgProgress,
      },
      courses: courseSummaries,
      activeSessions: (sessionsRes.data ?? []).map((s: any) => ({
        id: s.id,
        lessonId: s.lesson_id,
        title: s.lessons?.title ?? "Lesson",
        mode: s.mode,
        status: s.status,
        startedAt: s.started_at,
      })),
      recentMaterials: materialsRes.data ?? [],
      activity: activityRes.data ?? [],
    };
  });

export const getPlatformAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const { supabase } = context;

    if (!supabase) {
      return {
        stats: {
          institutions: 0,
          users: 0,
          activeSessions: 0,
          activeSubscriptions: 0,
          lessonsGenerating: 0,
          supportTickets: 0,
        },
        live: {
          usersOnline: 0,
          activeClassrooms: 0,
          institutionsLive: 0,
          lessonsGenerating: 0,
        },
        recentActivity: [],
      };
    }

    const onlineCutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const [
      institutionCountRes,
      activeInstitutionCountRes,
      userCountRes,
      activeSessionsCountRes,
      subscriptionCountRes,
      generatingJobsCountRes,
      onlineLearnersRes,
      liveSessionsRes,
      recentInstitutionsRes,
      recentSessionsRes,
      recentJobsRes,
    ] = await Promise.all([
      supabase.from("institutions").select("id", { count: "exact", head: true }),
      supabase
        .from("institutions")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("classroom_sessions")
        .select("id", { count: "exact", head: true })
        .in("status", ["live", "active"]),
      supabase
        .from("institution_subscriptions")
        .select("id", { count: "exact", head: true })
        .in("status", ["active", "trialing"]),
      supabase
        .from("lesson_generation_jobs")
        .select("id", { count: "exact", head: true })
        .in("status", ["queued", "running", "processing"]),
      supabase
        .from("learning_results")
        .select("student_id, institution_id, last_active_at")
        .gte("last_active_at", onlineCutoff)
        .limit(1000),
      supabase
        .from("classroom_sessions")
        .select("id, institution_id, lesson_id, course_id, status, started_at, lessons(title), courses(title)")
        .in("status", ["live", "active"])
        .order("started_at", { ascending: false })
        .limit(8),
      supabase
        .from("institutions")
        .select("id, name, created_at, status")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("session_events")
        .select("id, event_type, actor_role, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("lesson_generation_jobs")
        .select("id, status, created_at, total_lessons_generated, total_lessons_requested")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const onlineLearners = new Set((onlineLearnersRes.data ?? []).map((row: any) => row.student_id));
    const liveInstitutionIds = new Set(
      (liveSessionsRes.data ?? []).map((row: any) => row.institution_id).filter(Boolean),
    );

    const institutionActivity = (recentInstitutionsRes.data ?? []).map((row: any) => ({
      id: `institution-${row.id}`,
      type: "institution",
      title: "Institution registered",
      description: row.name,
      timestamp: row.created_at,
    }));

    const sessionActivity = (recentSessionsRes.data ?? []).map((row: any) => ({
      id: `event-${row.id}`,
      type: "session",
      title: compactStatus(row.event_type),
      description: `${compactStatus(row.actor_role)} activity recorded`,
      timestamp: row.created_at,
    }));

    const jobActivity = (recentJobsRes.data ?? []).map((row: any) => ({
      id: `job-${row.id}`,
      type: "job",
      title: `Lesson generation ${compactStatus(row.status)}`,
      description: `${row.total_lessons_generated ?? 0}/${row.total_lessons_requested ?? 0} lessons`,
      timestamp: row.created_at,
    }));

    return {
      stats: {
        institutions: institutionCountRes.count ?? 0,
        users: userCountRes.count ?? 0,
        activeSessions: activeSessionsCountRes.count ?? 0,
        activeSubscriptions: subscriptionCountRes.count ?? 0,
        lessonsGenerating: generatingJobsCountRes.count ?? 0,
        supportTickets: 0,
      },
      live: {
        usersOnline: onlineLearners.size,
        activeClassrooms: activeSessionsCountRes.count ?? 0,
        institutionsLive: liveInstitutionIds.size || activeInstitutionCountRes.count || 0,
        lessonsGenerating: generatingJobsCountRes.count ?? 0,
      },
      recentActivity: [...institutionActivity, ...sessionActivity, ...jobActivity]
        .sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? ""))
        .slice(0, 6),
    };
  });

/**
 * Per-course learner progress report — who is enrolled, how far they've reached,
 * how much time they've spent, and how many questions they've asked.
 */
export const getCourseProgressReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id: string }) =>
    z.object({ course_id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { supabase } = context;

    if (!supabase) return { enrollments: [], results: [], questions: [] };

    const [enrollRes, resultsRes, questionsRes] = await Promise.all([
      supabase
        .from("course_enrollments")
        .select("student_id, status, profile:profiles(full_name, email)")
        .eq("course_id", data.course_id),
      supabase
        .from("learning_results")
        .select(
          "student_id, progress_percentage, status, time_spent_seconds, questions_asked, practice_attempts, practice_correct, last_active_at",
        )
        .eq("course_id", data.course_id),
      supabase.from("learner_questions").select("student_id").eq("course_id", data.course_id),
    ]);

    const results = resultsRes.data ?? [];
    const questions = questionsRes.data ?? [];

    // Aggregate results per student (a student may have several sessions).
    const byStudent = new Map<
      string,
      {
        progress: number;
        timeSec: number;
        questions: number;
        practiceAttempts: number;
        practiceCorrect: number;
        lastActive: string | null;
        sessions: number;
      }
    >();
    for (const r of results) {
      const cur = byStudent.get(r.student_id) ?? {
        progress: 0,
        timeSec: 0,
        questions: 0,
        practiceAttempts: 0,
        practiceCorrect: 0,
        lastActive: null,
        sessions: 0,
      };
      cur.progress = Math.max(cur.progress, r.progress_percentage ?? 0);
      cur.timeSec += r.time_spent_seconds ?? 0;
      cur.questions += r.questions_asked ?? 0;
      cur.practiceAttempts += r.practice_attempts ?? 0;
      cur.practiceCorrect += r.practice_correct ?? 0;
      cur.sessions += 1;
      if (!cur.lastActive || (r.last_active_at ?? "") > cur.lastActive)
        cur.lastActive = r.last_active_at ?? cur.lastActive;
      byStudent.set(r.student_id, cur);
    }
    const questionCountByStudent = new Map<string, number>();
    for (const q of questions) {
      questionCountByStudent.set(q.student_id, (questionCountByStudent.get(q.student_id) ?? 0) + 1);
    }

    const learners = (enrollRes.data ?? []).map((e: any) => {
      const agg = byStudent.get(e.student_id);
      return {
        studentId: e.student_id,
        name: e.profile?.full_name || e.profile?.email || e.student_id.slice(0, 8),
        email: e.profile?.email ?? null,
        enrollmentStatus: e.status,
        progress: agg?.progress ?? 0,
        timeMinutes: Math.round((agg?.timeSec ?? 0) / 60),
        questionsAsked: questionCountByStudent.get(e.student_id) ?? agg?.questions ?? 0,
        practiceAttempts: agg?.practiceAttempts ?? 0,
        practiceCorrect: agg?.practiceCorrect ?? 0,
        sessions: agg?.sessions ?? 0,
        lastActive: agg?.lastActive ?? null,
      };
    });

    const active = learners.filter((l: any) => l.progress > 0);
    return {
      learners,
      summary: {
        enrolled: learners.length,
        active: active.length,
        avgProgress: active.length
          ? Math.round(active.reduce((s: any, l: any) => s + l.progress, 0) / active.length)
          : 0,
        totalQuestions: questions.length,
        totalTimeMinutes: learners.reduce((s: any, l: any) => s + l.timeMinutes, 0),
      },
    };
  });

/**
 * Questions asked across the institution (or a specific course) — the "what are
 * learners struggling with" feed for admins and teachers.
 */
export const getInstitutionQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string; course_id?: string; limit?: number }) =>
    z
      .object({
        institution_id: z.string().uuid(),
        course_id: z.string().uuid().optional(),
        limit: z.number().int().min(1).max(200).default(50),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) return { questions: [] };

    let query = context.supabase
      .from("learner_questions")
      .select(
        "id, course_id, lesson_id, question_text, answer_text, answer_source, section_type, learning_mode, created_at",
      )
      .eq("institution_id", data.institution_id)
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.course_id) query = query.eq("course_id", data.course_id);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { questions: rows ?? [] };
  });

/**
 * Teacher supervision view: the courses a teacher owns, live sessions in those
 * courses right now, and the most recent learner questions to review.
 */
export const getTeacherSupervision = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) {
      return { institution: null, courses: [], liveSessions: [], recentQuestions: [], stats: null };
    }

    const institution = await resolveInstitution(supabase, userId);
    if (!institution) {
      return { institution: null, courses: [], liveSessions: [], recentQuestions: [], stats: null };
    }
    const instId = institution.id;

    // Courses taught by this teacher (created_by) — fall back to all institution
    // courses if none are explicitly owned (e.g. an admin acting as supervisor).
    const ownedRes = await supabase
      .from("courses")
      .select("id, title, subject, status")
      .eq("institution_id", instId)
      .eq("created_by", userId);
    let courses = ownedRes.data ?? [];
    if (courses.length === 0) {
      const allRes = await supabase
        .from("courses")
        .select("id, title, subject, status")
        .eq("institution_id", instId)
        .limit(50);
      courses = allRes.data ?? [];
    }
    const courseIds = courses.map((c: any) => c.id);

    const [liveRes, questionsRes, resultsRes] = await Promise.all([
      courseIds.length
        ? supabase
            .from("classroom_sessions")
            .select("id, lesson_id, course_id, status, started_at, lessons(title)")
            .in("course_id", courseIds)
            .eq("status", "live")
            .order("started_at", { ascending: false })
            .limit(20)
        : Promise.resolve({ data: [] as any[] }),
      courseIds.length
        ? supabase
            .from("learner_questions")
            .select(
              "id, course_id, lesson_id, question_text, answer_text, answer_source, created_at",
            )
            .in("course_id", courseIds)
            .order("created_at", { ascending: false })
            .limit(15)
        : Promise.resolve({ data: [] as any[] }),
      courseIds.length
        ? supabase
            .from("learning_results")
            .select("student_id, progress_percentage, status")
            .in("course_id", courseIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const results = (resultsRes as any).data ?? [];
    const activeLearners = new Set(
      results.filter((r: any) => (r.progress_percentage ?? 0) > 0).map((r: any) => r.student_id),
    );

    return {
      institution,
      courses,
      liveSessions: ((liveRes as any).data ?? []).map((s: any) => ({
        id: s.id,
        lessonId: s.lesson_id,
        courseId: s.course_id,
        title: s.lessons?.title ?? "Lesson",
        startedAt: s.started_at,
      })),
      recentQuestions: (questionsRes as any).data ?? [],
      stats: {
        courses: courses.length,
        liveSessions: ((liveRes as any).data ?? []).length,
        activeLearners: activeLearners.size,
        questionsToReview: ((questionsRes as any).data ?? []).length,
      },
    };
  });

function isLessonReady(status: string | null | undefined): boolean {
  return ["approved", "published", "ready"].includes((status ?? "").toLowerCase());
}

function compactStatus(status: string | null | undefined): string {
  if (!status) return "Draft";
  return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function sessionTime(session: any): string | null {
  return session?.scheduled_start_at ?? session?.started_at ?? null;
}

function relatedTitle(relation: any): string | undefined {
  if (Array.isArray(relation)) return relation[0]?.title;
  return relation?.title;
}

/**
 * Teacher dashboard overview: one payload for the first screen, computed from
 * course assignments, enrollments, lessons, sessions, results, and events.
 */
export const getTeacherDashboardOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const { supabase, userId } = context;

    if (!supabase) {
      return {
        institution: null,
        metrics: {
          assignedCourses: 0,
          totalStudents: 0,
          lessonsReady: 0,
          pendingReview: 0,
          sessionsToday: 0,
        },
        upcomingSession: null,
        courses: [],
        upcomingSessions: [],
        lessonReview: [],
        activity: [],
        live: { onlineStudents: 0, activeThisHour: 0 },
        attention: {
          title: "No live data connected",
          description: "Connect Supabase data to see courses, lessons, sessions, and learners here.",
        },
      };
    }

    const institution = await resolveInstitution(supabase, userId);
    if (!institution) {
      return {
        institution: null,
        metrics: {
          assignedCourses: 0,
          totalStudents: 0,
          lessonsReady: 0,
          pendingReview: 0,
          sessionsToday: 0,
        },
        upcomingSession: null,
        courses: [],
        upcomingSessions: [],
        lessonReview: [],
        activity: [],
        live: { onlineStudents: 0, activeThisHour: 0 },
        attention: {
          title: "No institution found",
          description: "Join or register an institution to see your teaching dashboard.",
        },
      };
    }

    const instId = institution.id;
    const [assignedRes, ownedRes] = await Promise.all([
      supabase.from("course_teachers").select("course_id").eq("teacher_id", userId),
      supabase
        .from("courses")
        .select("id, title, subject, status, target_lesson_count, created_at")
        .eq("institution_id", instId)
        .eq("created_by", userId)
        .limit(100),
    ]);

    const assignedCourseIds = new Set((assignedRes.data ?? []).map((row: any) => row.course_id));
    let courses = ownedRes.data ?? [];

    if (assignedCourseIds.size > 0) {
      const assignedCoursesRes = await supabase
        .from("courses")
        .select("id, title, subject, status, target_lesson_count, created_at")
        .eq("institution_id", instId)
        .in("id", Array.from(assignedCourseIds))
        .limit(100);

      const byId = new Map<string, any>();
      for (const course of [...courses, ...(assignedCoursesRes.data ?? [])]) {
        byId.set(course.id, course);
      }
      courses = Array.from(byId.values());
    }

    if (courses.length === 0 && ["owner", "admin"].includes(institution.role)) {
      const allRes = await supabase
        .from("courses")
        .select("id, title, subject, status, target_lesson_count, created_at")
        .eq("institution_id", instId)
        .order("created_at", { ascending: false })
        .limit(50);
      courses = allRes.data ?? [];
    }

    const courseIds = courses.map((course: any) => course.id);
    const emptyPayload = {
      institution,
      metrics: {
        assignedCourses: 0,
        totalStudents: 0,
        lessonsReady: 0,
        pendingReview: 0,
        sessionsToday: 0,
      },
      upcomingSession: null,
      courses: [],
      upcomingSessions: [],
      lessonReview: [],
      activity: [],
      live: { onlineStudents: 0, activeThisHour: 0 },
      attention: {
        title: "No courses assigned yet",
        description: "Assigned courses, lessons, sessions, and learner activity will appear here.",
      },
    };

    if (courseIds.length === 0) return emptyPayload;

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    const onlineCutoff = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
    const activeHourCutoff = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const [lessonsRes, enrollmentsRes, sessionsRes, resultsRes, questionsRes, eventsRes] =
      await Promise.all([
        supabase
          .from("lessons")
          .select("id, course_id, title, status, updated_at, created_at")
          .in("course_id", courseIds)
          .order("updated_at", { ascending: false })
          .limit(250),
        supabase
          .from("course_enrollments")
          .select("course_id, student_id, status")
          .in("course_id", courseIds)
          .limit(1000),
        supabase
          .from("classroom_sessions")
          .select(
            "id, course_id, lesson_id, mode, status, scheduled_start_at, started_at, lessons(title), courses(title)",
          )
          .in("course_id", courseIds)
          .in("status", ["scheduled", "live", "active"])
          .order("scheduled_start_at", { ascending: true, nullsFirst: false })
          .limit(100),
        supabase
          .from("learning_results")
          .select("course_id, student_id, progress_percentage, last_active_at")
          .in("course_id", courseIds)
          .limit(2000),
        supabase
          .from("learner_questions")
          .select("id, course_id, question_text, answer_source, created_at")
          .in("course_id", courseIds)
          .order("created_at", { ascending: false })
          .limit(25),
        supabase
          .from("session_events")
          .select("id, course_id, event_type, actor_role, created_at")
          .in("course_id", courseIds)
          .order("created_at", { ascending: false })
          .limit(25),
      ]);

    const lessons = lessonsRes.data ?? [];
    const enrollments = (enrollmentsRes.data ?? []).filter(
      (row: any) => !row.status || row.status === "active",
    );
    const sessions = sessionsRes.data ?? [];
    const results = resultsRes.data ?? [];
    const questions = questionsRes.data ?? [];
    const events = eventsRes.data ?? [];

    const lessonsByCourse = new Map<string, any[]>();
    const studentsByCourse = new Map<string, Set<string>>();
    const progressByCourse = new Map<string, number[]>();
    const uniqueStudents = new Set<string>();

    for (const lesson of lessons) {
      lessonsByCourse.set(lesson.course_id, [...(lessonsByCourse.get(lesson.course_id) ?? []), lesson]);
    }

    for (const enrollment of enrollments) {
      uniqueStudents.add(enrollment.student_id);
      const students = studentsByCourse.get(enrollment.course_id) ?? new Set<string>();
      students.add(enrollment.student_id);
      studentsByCourse.set(enrollment.course_id, students);
    }

    const onlineStudents = new Set<string>();
    const activeThisHour = new Set<string>();
    for (const result of results) {
      const courseProgress = progressByCourse.get(result.course_id) ?? [];
      courseProgress.push(result.progress_percentage ?? 0);
      progressByCourse.set(result.course_id, courseProgress);
      if ((result.last_active_at ?? "") >= onlineCutoff) onlineStudents.add(result.student_id);
      if ((result.last_active_at ?? "") >= activeHourCutoff) activeThisHour.add(result.student_id);
    }

    const upcomingSessions = sessions
      .filter((session: any) => {
        const at = sessionTime(session);
        return session.status === "live" || session.status === "active" || !at || at >= now.toISOString();
      })
      .slice()
      .sort((a: any, b: any) => {
        if (a.status === "live" && b.status !== "live") return -1;
        if (b.status === "live" && a.status !== "live") return 1;
        return (sessionTime(a) ?? "").localeCompare(sessionTime(b) ?? "");
      });

    const firstSession = upcomingSessions[0] ?? null;
    const courseById = new Map<string, { title?: string }>(
      courses.map((course: any) => [course.id, course]),
    );
    const lessonById = new Map<string, { title?: string }>(
      lessons.map((lesson: any) => [lesson.id, lesson]),
    );

    const lessonReview = lessons
      .filter((lesson: any) => !isLessonReady(lesson.status))
      .slice(0, 4)
      .map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        course: courseById.get(lesson.course_id)?.title ?? "Course",
        description: compactStatus(lesson.status),
        status: lesson.status ?? "draft",
        href: `/teacher/lessons/${lesson.id}`,
      }));

    const lessonsReady = lessons.filter((lesson: any) => isLessonReady(lesson.status)).length;
    const pendingReview = Math.max(lessons.length - lessonsReady, 0);
    const sessionsToday = sessions.filter((session: any) => {
      const at = sessionTime(session);
      return !!at && at >= startOfToday.toISOString() && at < endOfToday.toISOString();
    }).length;

    const courseSummaries = courses
      .slice()
      .sort((a: any, b: any) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
      .slice(0, 6)
      .map((course: any) => {
        const courseLessons = lessonsByCourse.get(course.id) ?? [];
        const ready = courseLessons.filter((lesson: any) => isLessonReady(lesson.status)).length;
        const totalLessons = course.target_lesson_count || courseLessons.length || 0;
        const progressValues = progressByCourse.get(course.id) ?? [];
        const avgProgress = progressValues.length
          ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
          : totalLessons
            ? Math.round((ready / totalLessons) * 100)
            : 0;

        return {
          id: course.id,
          title: course.title,
          institution: institution.name,
          stats: [
            { label: "Students", value: String(studentsByCourse.get(course.id)?.size ?? 0) },
            { label: "Lessons", value: `${ready}/${totalLessons}` },
          ],
          progress: Math.min(100, Math.max(0, avgProgress)),
          href: `/teacher/courses/${course.id}`,
        };
      });

    const mappedSessions = upcomingSessions.slice(0, 5).map((session: any) => ({
      id: session.id,
      title:
        relatedTitle(session.lessons) ??
        lessonById.get(session.lesson_id)?.title ??
        (session.status === "live" ? "Live lesson" : "Scheduled lesson"),
      course: relatedTitle(session.courses) ?? courseById.get(session.course_id)?.title ?? "Course",
      time: sessionTime(session),
      status: session.status,
      participantCount: studentsByCourse.get(session.course_id)?.size ?? 0,
      href: `/teacher/sessions/${session.id}`,
    }));

    const questionActivity = questions.slice(0, 4).map((question: any) => ({
      id: `question-${question.id}`,
      action: "Student question",
      description: question.question_text,
      timestamp: question.created_at,
    }));

    const eventActivity = events.slice(0, 4).map((event: any) => ({
      id: `event-${event.id}`,
      action: compactStatus(event.event_type),
      description: `${compactStatus(event.actor_role)} activity recorded`,
      timestamp: event.created_at,
    }));

    const activity = [...questionActivity, ...eventActivity]
      .sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? ""))
      .slice(0, 4);

    return {
      institution,
      metrics: {
        assignedCourses: courses.length,
        totalStudents: uniqueStudents.size,
        lessonsReady,
        pendingReview,
        sessionsToday,
      },
      upcomingSession: firstSession
        ? {
            id: firstSession.id,
            title:
              relatedTitle(firstSession.lessons) ??
              lessonById.get(firstSession.lesson_id)?.title ??
              "Teaching session",
            course:
              relatedTitle(firstSession.courses) ??
              courseById.get(firstSession.course_id)?.title ??
              "Course",
            time: sessionTime(firstSession),
            mode: compactStatus(firstSession.mode),
            expectedStudents: studentsByCourse.get(firstSession.course_id)?.size ?? 0,
            href: `/teacher/sessions/${firstSession.id}`,
          }
        : null,
      courses: courseSummaries,
      upcomingSessions: mappedSessions,
      lessonReview,
      activity,
      live: {
        onlineStudents: onlineStudents.size,
        activeThisHour: activeThisHour.size,
      },
      attention: {
        title:
          pendingReview > 0
            ? `${pendingReview} lesson${pendingReview === 1 ? "" : "s"} need review`
            : "Lesson queue is up to date",
        description:
          pendingReview > 0
            ? "Review draft and generated lessons before they are opened for classroom delivery."
            : "Published lessons, active sessions, and learner activity are being refreshed from the database.",
      },
    };
  });
