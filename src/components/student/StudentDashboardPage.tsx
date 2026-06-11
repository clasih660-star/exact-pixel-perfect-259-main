import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Activity, BookOpen, Flame, Monitor, Star, TrendingUp } from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";
import { DashboardEmptyState } from "@/components/dashboard/shared/DashboardEmptyState";

const config = dashboardConfigs.learner;
const classrooms = [
  { course: "Mathematics Form 2", institution: "Klassruum Demo Academy", lesson: "Quadratic Equations", step: "Worked Example", progress: 42, mode: "AI Teacher" },
  { course: "KCSE Chemistry Revision", institution: "Klassruum Demo Academy", lesson: "Chemical Reactions", step: "Guided Practice", progress: 28, mode: "Hybrid" },
  { course: "English Speaking Practice", institution: "Klassruum Demo Academy", lesson: "Daily Conversation", step: "Independent Work", progress: 65, mode: "Human Teacher" },
];

const recentSessions = [
  { title: "Quadratic Equations", course: "Mathematics Form 2", duration: "45 min", status: "Completed" as const },
  { title: "Chemical Reactions", course: "KCSE Chemistry Revision", duration: "38 min", status: "Completed" as const },
  { title: "HTML Introduction", course: "Computer Studies Basics", duration: "41 min", status: "Completed" as const },
];

export function StudentDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data loading
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
      <DashboardShell config={config} activePath="/student/dashboard">
        <DashboardLoadingState type="skeleton" />
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell config={config} activePath="/student/dashboard">
        <DashboardLoadingState type="error" message={error} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell config={config} activePath="/student/dashboard">
      <Header />
      <ContinueLearningHero />
      <KpiSection />
      <MainContentGrid />
    </DashboardShell>
  );
}

function Header() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Welcome back</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--gray-900)] lg:text-4xl">
          Continue your learning journey
        </h1>
        <p className="mt-1 text-sm text-[var(--gray-500)]">
          Your next classroom is ready. Pick up from your last lesson and keep your progress moving.
        </p>
      </div>
      <Link
        to="/classroom/$lessonId"
        params={{ lessonId: "session_demo_math" }}
        className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition-all hover:bg-[var(--primary-dark)]"
      >
        <Monitor className="h-4 w-4" />
        Enter Classroom
      </Link>
    </div>
  );
}

function ContinueLearningHero() {
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-white via-[var(--primary-light)] to-white p-7 shadow-lg">
      <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-[var(--primary)]/5 blur-3xl" />
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <StatusBadge variant="success">AI Teacher Ready</StatusBadge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--gray-900)] lg:text-3xl">
            Introduction to Quadratic Equations
          </h2>
          <p className="mt-1 text-sm text-[var(--gray-500)]">
            Mathematics Form 2 · Klassruum Demo Academy
          </p>
          <div className="mt-5 flex items-center gap-6">
            <div>
              <p className="text-xs text-[var(--gray-400)]">Current Step</p>
              <p className="font-bold text-[var(--gray-900)]">Step 3 of 8 · Worked Example</p>
            </div>
            <div className="h-8 w-px bg-[var(--gray-200)]" />
            <div>
              <p className="text-xs text-[var(--gray-400)]">Progress</p>
              <p className="text-2xl font-extrabold text-[var(--primary)]">42%</p>
            </div>
            <div className="h-8 w-px bg-[var(--gray-200)]" />
            <div>
              <p className="text-xs text-[var(--gray-400)]">Est. Time Left</p>
              <p className="font-bold text-[var(--gray-900)]">18 min</p>
            </div>
          </div>
          <div className="mt-4 h-2.5 w-full max-w-md rounded-full bg-[var(--primary)]/10">
            <div className="h-full w-[42%] rounded-full bg-[var(--primary)] transition-all" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--gray-600)] shadow-sm">AI Teacher</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--gray-600)] shadow-sm">Captions On</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--gray-600)] shadow-sm">Voice On</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:items-end">
          <Link
            to="/classroom/$lessonId"
        params={{ lessonId: "session_demo_math" }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition-all hover:bg-[var(--primary-dark)] lg:w-auto"
          >
            <Monitor className="h-4 w-4" />
            Enter Classroom
          </Link>
          <Link
            to="/student/sessions/$sessionId/summary"
        params={{ sessionId: "session_demo_math" }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 bg-white px-6 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)] lg:w-auto"
          >
            Review Summary
          </Link>
          <Link
            to="/student/quizzes/$quizId"
        params={{ quizId: "quiz_quadratic_001" }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 bg-white px-6 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)] lg:w-auto"
          >
            Take Quick Quiz
          </Link>
        </div>
      </div>
    </section>
  );
}

function KpiSection() {
  return (
    <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <KpiCard title="My Classrooms" value="4" subtitle="Active classrooms" href="/student/classrooms" icon={Monitor} />
      <KpiCard title="Completed Lessons" value="18" subtitle="This month" href="/student/progress" icon={BookOpen} />
      <KpiCard title="Study Time" value="12h 45m" subtitle="This week" href="/student/progress" icon={Activity} />
      <KpiCard title="Quiz Average" value="86%" subtitle="This month" href="/student/quizzes" icon={Star} trend="+4%" />
      <KpiCard title="Current Streak" value="7" subtitle="Days in a row" href="/student/progress" icon={Flame} />
    </section>
  );
}

function MainContentGrid() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.85fr]">
      <div className="space-y-6 lg:row-span-2">
        <MyClassroomsPanel />
      </div>
      <LearningPlanCard />
      <RecentSessionsPanel />
      <LearningAccessWidget />
    </section>
  );
}

function MyClassroomsPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--gray-900)]">My Classrooms</h2>
          <p className="mt-0.5 text-sm text-[var(--gray-500)]">Enter your active learning spaces.</p>
        </div>
        <Link to="/student/classrooms" className="text-sm font-bold text-[var(--primary)] hover:underline">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {classrooms.map((c) => (
          <article
            key={c.course}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--gray-200)] bg-white p-4 transition-all hover:border-[var(--primary)]/20 hover:shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-400 text-sm font-bold text-white">
              {c.course.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[var(--gray-900)]">{c.course}</h3>
              <p className="text-xs text-[var(--gray-500)]">
                {c.institution} · {c.lesson}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-[var(--gray-100)]">
                  <div
                    className="h-full rounded-full bg-[var(--primary)]"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[var(--gray-500)]">{c.progress}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge>{c.mode}</StatusBadge>
              <Link
                to="/classroom/$lessonId"
        params={{ lessonId: "session_demo_math" }}
                className="inline-flex h-9 items-center rounded-xl border border-[var(--primary)]/20 px-4 text-xs font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
              >
                Enter
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function LearningPlanCard() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Today's Learning Plan</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Recommended for you.</p>
      <ol className="mt-5 space-y-3">
        {[
          "Continue Quadratic Equations lesson",
          "Complete the quick quiz (5 min)",
          "Review weak topic: Factoring",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5 text-sm font-semibold text-[var(--gray-700)]">{item}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex gap-2">
        <Link
          to="/classroom/$lessonId"
        params={{ lessonId: "session_demo_math" }}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-bold text-white transition-all hover:bg-[var(--primary-dark)]"
        >
          Start Plan
        </Link>
        <Link
          to="/student/learning-plan"
          className="inline-flex h-10 flex-1 items-center justify-center rounded-2xl border border-[var(--primary)]/20 px-4 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
        >
          Customize
        </Link>
      </div>
    </div>
  );
}

function RecentSessionsPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Recent Sessions</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Review what you learned.</p>
      <div className="mt-4 space-y-2">
        {recentSessions.map((s) => (
          <Link
            key={s.title}
            to="/student/sessions/$sessionId/summary"
        params={{ sessionId: "session_demo_math" }}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3 transition-all hover:bg-[var(--gray-50)]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--gray-900)]">{s.title}</p>
              <p className="text-xs text-[var(--gray-500)]">
                {s.course} · {s.duration}
              </p>
            </div>
            <StatusBadge variant="neutral">{s.status}</StatusBadge>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LearningAccessWidget() {
  return (
    <div className="rounded-2xl border border-[var(--primary)]/20 bg-gradient-to-br from-white to-[var(--primary-light)] p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Learning Access</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Standard profile</p>
      <div className="mt-4 space-y-2">
        {[
          { label: "Teacher voice", value: "On" },
          { label: "Captions", value: "On" },
          { label: "Keyboard shortcuts", value: "On" },
          { label: "Focus mode", value: "Off" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5"
          >
            <span className="text-sm font-semibold text-[var(--gray-700)]">{item.label}</span>
            <span
              className={`text-xs font-bold ${
                item.value === "On" ? "text-green-600" : "text-[var(--gray-400)]"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <Link
          to="/student/access"
          className="inline-flex h-10 flex-1 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-bold text-white transition-all hover:bg-[var(--primary-dark)]"
        >
          Adjust Access
        </Link>
        <button className="inline-flex h-10 flex-1 items-center justify-center rounded-2xl border border-[var(--primary)]/20 px-4 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
          <TrendingUp className="mr-1.5 h-4 w-4" />
          Focus Mode
        </button>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
