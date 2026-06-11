import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BookOpen, FileText, TrendingUp, Users, Video, Monitor, BarChart3, Star, AlertTriangle } from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";

const config = dashboardConfigs.teacher;

const courses = [
  { title: "Mathematics Form 2", students: 32, lessons: 12, nextSession: "Today", progress: 65 },
  { title: "KCSE Chemistry Revision", students: 45, lessons: 18, nextSession: "Tomorrow", progress: 42 },
  { title: "Computer Studies Basics", students: 28, lessons: 9, nextSession: "Friday", progress: 78 },
];

const lessonPreps = [
  { title: "Quadratic Equations", status: "Ready" as const, meta: "Quiz attached" },
  { title: "Chemical Bonding", status: "Draft" as const, meta: "Needs captions" },
  { title: "HTML Forms", status: "Draft" as const, meta: "Needs quiz" },
];

const upcomingSessions = [
  { title: "Quadratic Equations", course: "Mathematics Form 2", time: "10:30 AM", mode: "AI-Assisted", students: 32 },
  { title: "Chemical Reactions", course: "KCSE Chemistry", time: "2:00 PM", mode: "Live", students: 45 },
  { title: "HTML Basics", course: "Computer Studies", time: "Tomorrow 9:00 AM", mode: "Hybrid", students: 28 },
];

const studentAlerts = [
  "8 students need factoring support",
  "5 students missed last quiz",
  "3 students requested slower pace",
];

export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <DashboardShell config={config} activePath="/teacher/dashboard">
        <DashboardLoadingState type="skeleton" />
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell config={config} activePath="/teacher/dashboard">
        <DashboardLoadingState type="error" message={error} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell config={config} activePath="/teacher/dashboard">
      <Header />
      <TeachingTodayHero />
      <KpiSection />
      <MainContentGrid />
    </DashboardShell>
  );
}

function Header() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-green-600">Teaching workspace</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--gray-900)] lg:text-4xl">
          Prepare, teach, and support your learners
        </h1>
        <p className="mt-1 text-sm text-[var(--gray-500)]">
          Your next video-based classroom session is ready to start.
        </p>
      </div>
      <Link
        to="/teacher/sessions"
        className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl bg-green-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700"
      >
        <Video className="h-4 w-4" />
        Start Class
      </Link>
    </div>
  );
}

function TeachingTodayHero() {
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-green-200 bg-gradient-to-br from-white via-green-50 to-white p-7 shadow-lg">
      <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-green-500/5 blur-3xl" />
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <StatusBadge variant="success">Next Session</StatusBadge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--gray-900)] lg:text-3xl">
            Introduction to Quadratic Equations
          </h2>
          <p className="mt-1 text-sm text-[var(--gray-500)]">
            Mathematics Form 2 · Today at 10:30 AM
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--gray-600)] shadow-sm">
              Mode: AI-Assisted
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--gray-600)] shadow-sm">
              Expected: 32 students
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--gray-600)] shadow-sm">
              Accessibility: Captions prepared
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:items-end">
          <Link
            to="/classroom/$lessonId"
            params={{ lessonId: "session_demo_math" }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-green-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 lg:w-auto"
          >
            <Video className="h-4 w-4" />
            Start Class
          </Link>
          <Link
            to="/teacher/lessons/$lessonId/edit"
            params={{ lessonId: "lesson_quadratic_001" }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-green-200 bg-white px-6 text-sm font-bold text-green-700 transition-all hover:bg-green-50 lg:w-auto"
          >
            <FileText className="h-4 w-4" />
            Preview Lesson
          </Link>
          <Link
            to="/teacher/courses/$courseId/students"
            params={{ courseId: "course_math_form_2" }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-green-200 bg-white px-6 text-sm font-bold text-green-700 transition-all hover:bg-green-50 lg:w-auto"
          >
            <Users className="h-4 w-4" />
            View Students
          </Link>
        </div>
      </div>
    </section>
  );
}

function KpiSection() {
  return (
    <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <KpiCard title="Assigned Courses" value="5" subtitle="Active courses" href="/teacher/courses" icon={BookOpen} />
      <KpiCard title="Upcoming Sessions" value="8" subtitle="This week" href="/teacher/sessions" icon={Video} />
      <KpiCard title="Draft Lessons" value="6" subtitle="Need review" href="/teacher/lessons" icon={FileText} />
      <KpiCard title="Students Taught" value="214" subtitle="Across courses" href="/teacher/students" icon={Users} />
      <KpiCard title="Avg Quiz Score" value="81%" subtitle="This month" href="/teacher/analytics" icon={Star} trend="+3%" />
    </section>
  );
}

function MainContentGrid() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.85fr]">
      <div className="space-y-6 lg:row-span-2">
        <MyCoursesPanel />
      </div>
      <LessonPreparationPanel />
      <UpcomingSessionsPanel />
      <StudentAlertsPanel />
    </section>
  );
}

function MyCoursesPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--gray-900)]">My Courses</h2>
          <p className="mt-0.5 text-sm text-[var(--gray-500)]">Courses assigned to you.</p>
        </div>
        <Link to="/teacher/courses" className="text-sm font-bold text-[var(--primary)] hover:underline">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {courses.map((c) => (
          <article
            key={c.title}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--gray-200)] bg-white p-4 transition-all hover:border-[var(--primary)]/20 hover:shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-green-400 text-sm font-bold text-white">
              {c.title.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[var(--gray-900)]">{c.title}</h3>
              <p className="text-xs text-[var(--gray-500)]">
                {c.students} students · {c.lessons} lessons · Next: {c.nextSession}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-[var(--gray-100)]">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[var(--gray-500)]">{c.progress}%</span>
              </div>
            </div>
            <Link
              to="/teacher/courses/$courseId"
              params={{ courseId: `course_${c.title.toLowerCase().replace(/\s+/g, "_")}` }}
              className="inline-flex h-9 items-center rounded-xl border border-[var(--primary)]/20 px-4 text-xs font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
            >
              Open
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

function LessonPreparationPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Lesson Preparation</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Lessons needing attention.</p>
      <div className="mt-4 space-y-2">
        {lessonPreps.map((l) => (
          <Link
            key={l.title}
            to="/teacher/lessons/$lessonId/edit"
            params={{ lessonId: l.title.toLowerCase().replace(/\s+/g, "_") }}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3 transition-all hover:bg-[var(--gray-50)]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--gray-900)]">{l.title}</p>
              <p className="text-xs text-[var(--gray-500)]">{l.meta}</p>
            </div>
            <StatusBadge variant={l.status === "Ready" ? "success" : "warning"}>{l.status}</StatusBadge>
          </Link>
        ))}
      </div>
    </div>
  );
}

function UpcomingSessionsPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Upcoming Sessions</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Your scheduled classrooms.</p>
      <div className="mt-4 space-y-2">
        {upcomingSessions.map((s) => (
          <div
            key={s.title}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--gray-900)]">{s.title}</p>
              <p className="text-xs text-[var(--gray-500)]">
                {s.course} · {s.time}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={s.mode === "AI-Assisted" ? "default" : "success"}>{s.mode}</StatusBadge>
              <span className="text-xs text-[var(--gray-400)]">{s.students}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentAlertsPanel() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--gray-900)]">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        Student Alerts
      </h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Students who may need support.</p>
      <div className="mt-4 space-y-2">
        {studentAlerts.map((alert) => (
          <div
            key={alert}
            className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm font-semibold text-[var(--gray-700)]"
          >
            {alert}
          </div>
        ))}
      </div>
      <Link
        to="/teacher/analytics"
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 px-4 text-sm font-bold text-amber-700 transition-all hover:bg-amber-50"
      >
        <BarChart3 className="h-4 w-4" />
        View Details
      </Link>
    </div>
  );
}
