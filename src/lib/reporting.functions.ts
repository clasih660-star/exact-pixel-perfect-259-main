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
  const preferred =
    data.find((m: any) => ["owner", "admin"].includes(m.role)) ?? data[0];
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
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const institution = await resolveInstitution(supabase, userId);
    if (!institution) {
      return { institution: null, stats: null, courses: [], activeSessions: [], recentMaterials: [], activity: [] };
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
      supabase.from("courses").select("id, title, subject, status, created_at").eq("institution_id", instId),
      supabase.from("lessons").select("id, course_id, status").eq("institution_id", instId),
      supabase.from("course_enrollments").select("course_id, student_id, status").eq("institution_id", instId),
      supabase.from("institution_members").select("role").eq("institution_id", instId).eq("status", "active"),
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
      supabase.from("learning_results").select("progress_percentage, status").eq("institution_id", instId),
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

    const uniqueStudents = new Set(enrollments.filter((e) => !e.status || e.status === "active").map((e) => e.student_id));
    const teacherCount = members.filter((m) => m.role === "teacher").length;
    const avgProgress =
      results.length > 0
        ? Math.round(results.reduce((s, r) => s + (r.progress_percentage ?? 0), 0) / results.length)
        : 0;

    const courseSummaries = courses
      .slice()
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
      .slice(0, 6)
      .map((c) => ({
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
        publishedCourses: courses.filter((c) => c.status === "published").length,
        lessons: lessons.length,
        publishedLessons: lessons.filter((l) => l.status === "published").length,
        students: uniqueStudents.size,
        teachers: teacherCount,
        materials: materialsRes.count ?? (materialsRes.data?.length ?? 0),
        liveSessions: (sessionsRes.data ?? []).filter((s) => s.status === "live").length,
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

/**
 * Per-course learner progress report — who is enrolled, how far they've reached,
 * how much time they've spent, and how many questions they've asked.
 */
export const getCourseProgressReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id: string }) =>
    z.object({ course_id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const [enrollRes, resultsRes, questionsRes] = await Promise.all([
      supabase
        .from("course_enrollments")
        .select("student_id, status, profile:profiles(full_name, email)")
        .eq("course_id", data.course_id),
      supabase
        .from("learning_results")
        .select("student_id, progress_percentage, status, time_spent_seconds, questions_asked, practice_attempts, practice_correct, last_active_at")
        .eq("course_id", data.course_id),
      supabase.from("learner_questions").select("student_id").eq("course_id", data.course_id),
    ]);

    const results = resultsRes.data ?? [];
    const questions = questionsRes.data ?? [];

    // Aggregate results per student (a student may have several sessions).
    const byStudent = new Map<string, { progress: number; timeSec: number; questions: number; practiceAttempts: number; practiceCorrect: number; lastActive: string | null; sessions: number }>();
    for (const r of results) {
      const cur = byStudent.get(r.student_id) ?? { progress: 0, timeSec: 0, questions: 0, practiceAttempts: 0, practiceCorrect: 0, lastActive: null, sessions: 0 };
      cur.progress = Math.max(cur.progress, r.progress_percentage ?? 0);
      cur.timeSec += r.time_spent_seconds ?? 0;
      cur.questions += r.questions_asked ?? 0;
      cur.practiceAttempts += r.practice_attempts ?? 0;
      cur.practiceCorrect += r.practice_correct ?? 0;
      cur.sessions += 1;
      if (!cur.lastActive || (r.last_active_at ?? "") > cur.lastActive) cur.lastActive = r.last_active_at ?? cur.lastActive;
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

    const active = learners.filter((l) => l.progress > 0);
    return {
      learners,
      summary: {
        enrolled: learners.length,
        active: active.length,
        avgProgress: active.length ? Math.round(active.reduce((s, l) => s + l.progress, 0) / active.length) : 0,
        totalQuestions: questions.length,
        totalTimeMinutes: learners.reduce((s, l) => s + l.timeMinutes, 0),
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
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from("learner_questions")
      .select("id, course_id, lesson_id, question_text, answer_text, answer_source, section_type, learning_mode, created_at")
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
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
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
    const courseIds = courses.map((c) => c.id);

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
            .select("id, course_id, lesson_id, question_text, answer_text, answer_source, created_at")
            .in("course_id", courseIds)
            .order("created_at", { ascending: false })
            .limit(15)
        : Promise.resolve({ data: [] as any[] }),
      courseIds.length
        ? supabase.from("learning_results").select("student_id, progress_percentage, status").in("course_id", courseIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const results = (resultsRes as any).data ?? [];
    const activeLearners = new Set(results.filter((r: any) => (r.progress_percentage ?? 0) > 0).map((r: any) => r.student_id));

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
