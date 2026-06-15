import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Accessibility,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Monitor,
  Star,
  Zap,
} from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";

const config = dashboardConfigs.learner;

const mockContinueLearning = {
  course: "Mathematics Form 2",
  institution: "Klassruum Demo Academy",
  lesson: "Solving Quadratic Equations by Factoring",
  step: "Worked Example",
  progress: 42,
  estimatedTimeLeft: "18 min",
  mode: "AI Teacher",
  lessonId: "demo",
};

const mockClassrooms = [
  {
    title: "Mathematics Form 2",
    institution: "Klassruum Demo Academy",
    course: "Quadratic Equations",
    progress: 42,
    href: "/classroom/demo",
    badge: "AI Teacher",
  },
  {
    title: "Science Form 3",
    institution: "Klassruum Demo Academy",
    course: "Chemical Bonding",
    progress: 28,
    href: "/classroom/demo_chemistry",
    badge: "AI Teacher",
  },
  {
    title: "English Form 2",
    institution: "Klassruum Demo Academy",
    course: "Parts of Speech",
    progress: 65,
    href: "/classroom/demo_english",
    badge: "AI Teacher",
  },
];

const mockRecentSessions = [
  {
    title: "Quadratic Equations",
    course: "Mathematics Form 2",
    time: "Today at 2:30 PM",
    duration: "45 min",
    status: "completed" as const,
    href: "/student/sessions/sess_1",
  },
  {
    title: "Chemical Reactions",
    course: "KCSE Chemistry Revision",
    time: "Yesterday at 4:00 PM",
    duration: "38 min",
    status: "completed" as const,
    href: "/student/sessions/sess_2",
  },
  {
    title: "HTML Introduction",
    course: "Computer Studies Basics",
    time: "3 days ago at 9:30 AM",
    duration: "41 min",
    status: "completed" as const,
    href: "/student/sessions/sess_3",
  },
];

export function StudentDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch {
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
    <DashboardShell config={config} activePath="/student/dashboard" title="Learner Dashboard">
      <section className="mb-5 grid gap-5 xl:grid-cols-[1fr_1.22fr]">
        <div className="relative overflow-hidden rounded-[22px] border border-[#DCE8F7] bg-gradient-to-br from-white via-[#F6FAFF] to-[#EAF3FF] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="relative z-10 max-w-[58%]">
            <p className="text-sm font-bold text-[#1F7C80]">Welcome back</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Continue your learning journey
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#334155]">
              Your next classroom is ready. Continue from where you left off and keep building your
              skills.
            </p>
            <Link
              to={`/classroom/${mockContinueLearning.lessonId}` as any}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F7C80] px-6 text-sm font-bold text-white shadow-lg shadow-[#1F7C80]/25 transition-all hover:bg-[#1A5256]"
            >
              Enter Classroom
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="absolute bottom-5 right-8 grid h-44 w-52 place-items-center">
            <div className="absolute h-36 w-48 rounded-[44px] bg-[#d1eceb]" />
            <div className="relative grid h-28 w-36 place-items-center rounded-3xl bg-white shadow-xl shadow-[#1F7C80]/10">
              <BookOpen className="h-16 w-16 text-[#1A5256]" />
              <Award className="absolute -right-4 -top-4 h-11 w-11 rounded-2xl bg-[#e8f5f5] p-2 text-[#1F7C80] shadow-md" />
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#DCE8F7] bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1F7C80] text-2xl font-black text-white shadow-lg shadow-[#1F7C80]/25">
              x²
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-extrabold tracking-tight text-[#0F172A]">
                {mockContinueLearning.lesson}
              </h2>
              <p className="mt-1 text-sm text-[#475569]">
                {mockContinueLearning.course} · {mockContinueLearning.institution}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge variant="success">AI Teacher Ready</StatusBadge>
                <span className="inline-flex items-center gap-1 rounded-lg border border-[#BFDBFE] bg-[#e8f5f5] px-3 py-1 text-xs font-bold text-[#1A5256]">
                  <Eye className="h-3.5 w-3.5" />
                  Captions On
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1 text-xs font-bold text-[#15803D]">
                  <Zap className="h-3.5 w-3.5" />
                  Voice On
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm text-[#334155]">
                <span className="font-bold">Current Step:</span> Step 3 of 8 ·{" "}
                {mockContinueLearning.step}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#d1eceb]">
                <div
                  className="h-full rounded-full bg-[#1F7C80]"
                  style={{ width: `${mockContinueLearning.progress}%` }}
                />
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl font-extrabold text-[#1A5256]">
                {mockContinueLearning.progress}%
              </p>
              <p className="mt-1 text-sm text-[#475569]">
                {mockContinueLearning.estimatedTimeLeft} left
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link
              to={`/classroom/${mockContinueLearning.lessonId}` as any}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F7C80] px-4 text-sm font-bold text-white transition-all hover:bg-[#1A5256]"
            >
              Enter Classroom
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/student/notes"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#a3d9d8] bg-white px-4 text-sm font-bold text-[#1A5256] transition-all hover:bg-[#e8f5f5]"
            >
              Review Notes
            </Link>
            <Link
              to="/student/quizzes"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#a3d9d8] bg-white px-4 text-sm font-bold text-[#1A5256] transition-all hover:bg-[#e8f5f5]"
            >
              Quick Quiz
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          title="My Classrooms"
          value="4"
          subtitle="Active classrooms"
          href="/student/classrooms"
          icon={Monitor}
        />
        <KpiCard
          title="Completed Lessons"
          value="18"
          subtitle="This month"
          href="/student/progress"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Study Time"
          value="12h 45m"
          subtitle="This week"
          href="/student/progress"
          icon={Clock}
        />
        <KpiCard
          title="Quiz Average"
          value="86%"
          subtitle="This month"
          href="/student/quizzes"
          icon={Star}
          trend="+4%"
        />
        <KpiCard
          title="Current Streak"
          value="7"
          subtitle="Days in a row"
          href="/student/progress"
          icon={Zap}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.22fr_.75fr_.95fr]">
        <div className="rounded-[18px] border border-[#DCE8F7] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">My Classrooms</h2>
              <p className="mt-0.5 text-sm text-[#64748B]">Continue your active learning spaces</p>
            </div>
            <Link
              to="/student/classrooms"
              className="text-sm font-bold text-[#1F7C80] hover:text-[#1A5256]"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mockClassrooms.map((classroom) => (
              <Link
                key={classroom.title}
                to={classroom.href}
                className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 transition-all hover:border-[#BFDBFE] hover:bg-[#F8FBFF]"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#1F7C80] text-sm font-black text-white">
                  {classroom.title.includes("Mathematics")
                    ? "x²"
                    : classroom.title.includes("Chemistry")
                      ? "Chem"
                      : "Eng"}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold text-[#0F172A]">
                    {classroom.title}
                  </h3>
                  <p className="truncate text-xs text-[#64748B]">
                    {classroom.institution} · {classroom.course}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-[#d1eceb]">
                      <div
                        className="h-full rounded-full bg-[#1F7C80]"
                        style={{ width: `${classroom.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#1A5256]">{classroom.progress}%</span>
                  </div>
                </div>
                <span className="inline-flex h-9 items-center rounded-lg border border-[#BFDBFE] px-3 text-xs font-bold text-[#1A5256]">
                  Enter
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-[#DCE8F7] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[#0F172A]">Today's Plan</h3>
            <Calendar className="h-4 w-4 text-[#94A3B8]" />
          </div>
          <div className="space-y-3">
            {[
              ["Continue Quadratic Equations lesson", "Active"],
              ["Complete the quick quiz", "5 min"],
              ["Review weak topic: Factoring", "Later"],
            ].map(([title, meta], index) => (
              <div
                key={title}
                className={`flex items-start gap-3 rounded-xl p-3 ${index === 0 ? "bg-[#e8f5f5]" : "bg-[#F8FAFC]"}`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? "bg-[#1F7C80] text-white" : "bg-[#d1eceb] text-[#1F7C80]"}`}
                >
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
                  <p className="text-xs text-[#64748B]">{meta}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              to="/classroom/$lessonId"
              params={{ lessonId: mockContinueLearning.lessonId }}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1F7C80] text-sm font-bold text-white"
            >
              Start Plan
            </Link>
            <Link
              to="/student/learning-plan"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#a3d9d8] text-sm font-bold text-[#1A5256]"
            >
              Customize
            </Link>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#DCE8F7] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Recent Sessions</h2>
              <p className="mt-0.5 text-sm text-[#64748B]">Your recent learning activity</p>
            </div>
            <Link
              to="/student/sessions"
              className="text-sm font-bold text-[#1F7C80] hover:text-[#1A5256]"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mockRecentSessions.map((session) => (
              <Link
                key={session.title}
                to={session.href}
                className="grid grid-cols-[46px_1fr_auto] items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 transition-all hover:border-[#BFDBFE] hover:bg-[#F8FBFF]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#1F7C80] text-xs font-black text-white">
                  {session.title.includes("Quadratic")
                    ? "x²"
                    : session.title.includes("Chemical")
                      ? "Lab"
                      : "HTML"}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold text-[#0F172A]">
                    {session.title}
                  </h3>
                  <p className="truncate text-xs text-[#64748B]">
                    {session.course} · {session.duration}
                  </p>
                </div>
                <span className="rounded-lg bg-[#DCFCE7] px-2.5 py-1 text-xs font-bold text-[#15803D]">
                  Completed
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[18px] border border-[#DCE8F7] bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr_auto_auto] lg:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f5f5] text-[#1F7C80]">
              <Accessibility className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#0F172A]">Learning Access</h2>
              <p className="text-sm text-[#475569]">Standard profile</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["Teacher voice", "On"],
              ["Captions", "On"],
              ["Keyboard shortcuts", "On"],
              ["Focus mode", "Off"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
              >
                <p className="text-xs font-bold text-[#334155]">{label}</p>
                <p
                  className={`mt-1 text-sm font-extrabold ${value === "On" ? "text-[#16A34A]" : "text-[#64748B]"}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/student/access"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1F7C80] px-5 text-sm font-bold text-white"
          >
            Adjust Access
          </Link>
          <button className="inline-flex h-11 items-center justify-center rounded-xl border border-[#a3d9d8] px-5 text-sm font-bold text-[#1A5256]">
            Focus Mode
          </button>
        </div>
      </section>
    </DashboardShell>
  );
}

export default StudentDashboardPage;
