import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Monitor,
  BookOpen,
  Clock,
  Star,
  Zap,
  Award,
  MessageSquare,
  Calendar,
  FileText,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";
import { DashboardEmptyState } from "@/components/dashboard/shared/DashboardEmptyState";
import { FeaturedActionCard } from "@/components/dashboard/shared/FeaturedActionCard";
import { CourseCard } from "@/components/dashboard/shared/CourseCard";
import { SessionCard } from "@/components/dashboard/shared/SessionCard";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { ActivityFeed } from "@/components/dashboard/shared/ActivityFeed";
import { RealtimeMetricCard } from "@/components/dashboard/shared/RealtimeMetricCard";
import { OnlineStatusDot } from "@/components/dashboard/shared/OnlineStatusDot";

const config = dashboardConfigs.learner;

const mockContinueLearning = {
  course: "Mathematics Form 2",
  institution: "Klassruum Demo Academy",
  lesson: "Introduction to Quadratic Equations",
  step: "Worked Example",
  progress: 42,
  estimatedTimeLeft: "18 min",
  mode: "AI Teacher",
  lessonId: "session_demo_math",
};

const mockClassrooms = [
  {
    title: "Mathematics Form 2",
    institution: "Klassruum Demo Academy",
    course: "Quadratic Equations",
    progress: 42,
    stats: [
      { label: "Lessons", value: "12/28" },
      { label: "Completed", value: "8" },
    ],
    href: "/classroom/lesson_math",
  },
  {
    title: "KCSE Chemistry Revision",
    institution: "Klassruum Demo Academy",
    course: "Chemical Reactions",
    progress: 28,
    stats: [
      { label: "Lessons", value: "8/24" },
      { label: "Completed", value: "6" },
    ],
    href: "/classroom/lesson_chem",
  },
  {
    title: "English Speaking Practice",
    institution: "Klassruum Demo Academy",
    course: "Daily Conversation",
    progress: 65,
    stats: [
      { label: "Lessons", value: "13/20" },
      { label: "Completed", value: "12" },
    ],
    href: "/classroom/lesson_english",
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

const mockActivity = [
  {
    id: "1",
    action: "Completed lesson",
    description: 'Finished "Quadratic Equations" lesson',
    timestamp: "Today at 2:45 PM",
    variant: "success" as const,
  },
  {
    id: "2",
    action: "Quiz answered",
    description: "Scored 92% on Quadratic Equations quiz",
    timestamp: "Today at 2:42 PM",
    variant: "success" as const,
  },
  {
    id: "3",
    action: "Joined classroom",
    description: 'Started "Introduction to Quadratic Equations"',
    timestamp: "Today at 2:30 PM",
    variant: "default" as const,
  },
  {
    id: "4",
    action: "Notes saved",
    description: "5 pages of study notes created",
    timestamp: "Today at 2:28 PM",
    variant: "default" as const,
  },
  {
    id: "5",
    action: "Completed assignment",
    description: "Submitted homework for Chemical Reactions",
    timestamp: "Yesterday at 4:15 PM",
    variant: "success" as const,
  },
];

export function StudentDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
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
      <PageHeader
        label="Welcome back"
        title="Continue your learning journey"
        subtitle="Pick up from where you left off and keep your progress moving forward."
      />

      {/* Featured Continue Learning Card */}
      <FeaturedActionCard
        title={mockContinueLearning.lesson}
        description={`${mockContinueLearning.course} · ${mockContinueLearning.institution}`}
        badge={<StatusBadge variant="success">AI Teacher Ready</StatusBadge>}
        content={
          <div className="space-y-5">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Current Step</p>
                <p className="mt-1 text-base font-bold text-[#0F172A]">
                  Step 3 of 8 · {mockContinueLearning.step}
                </p>
              </div>
              <div className="h-12 w-px bg-[#E2E8F0]" />
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Progress</p>
                <p className="mt-1 text-3xl font-bold text-[#2563EB]">
                  {mockContinueLearning.progress}%
                </p>
              </div>
              <div className="h-12 w-px bg-[#E2E8F0]" />
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Est. Time Left</p>
                <p className="mt-1 text-base font-bold text-[#0F172A]">
                  {mockContinueLearning.estimatedTimeLeft}
                </p>
              </div>
            </div>
            <div className="h-3 w-full rounded-full bg-[#E2E8F0]">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all"
                style={{ width: `${mockContinueLearning.progress}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#0F172A] backdrop-blur">
                <Monitor className="h-3 w-3" />
                {mockContinueLearning.mode}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#0F172A] backdrop-blur">
                <Eye className="h-3 w-3" />
                Captions On
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#0F172A] backdrop-blur">
                <Zap className="h-3 w-3" />
                Voice On
              </span>
            </div>
          </div>
        }
        actions={[
          {
            label: "Enter Classroom",
            href: `/classroom/${mockContinueLearning.lessonId}`,
            variant: "primary",
          },
          {
            label: "Review Notes",
            href: "/student/notes",
            variant: "secondary",
          },
          {
            label: "View Transcript",
            href: "/student/transcripts",
            variant: "tertiary",
          },
        ]}
      />

      {/* KPI Cards */}
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          title="My Classrooms"
          value="3"
          subtitle="Active courses"
          href="/student/classrooms"
          icon={Monitor}
        />
        <KpiCard
          title="Completed"
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

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Classrooms and Sessions */}
        <div className="space-y-8 lg:col-span-2">
          {/* My Classrooms */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">My Classrooms</h2>
                <p className="mt-0.5 text-sm text-[#64748B]">Continue your active learning spaces</p>
              </div>
              <Link
                to="/student/classrooms"
                className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {mockClassrooms.map((classroom) => (
                <CourseCard
                  key={classroom.title}
                  title={classroom.title}
                  course={classroom.course}
                  institution={classroom.institution}
                  progress={classroom.progress}
                  stats={classroom.stats}
                  href={classroom.href}
                />
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Recent Sessions</h2>
                <p className="mt-0.5 text-sm text-[#64748B]">Your recent learning activity</p>
              </div>
              <Link
                to="/student/sessions"
                className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {mockRecentSessions.map((session) => (
                <SessionCard
                  key={session.title}
                  title={session.title}
                  course={session.course}
                  time={session.time}
                  duration={session.duration}
                  status={session.status}
                  href={session.href}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Info and Activity */}
        <div className="space-y-6 lg:col-span-1">
          {/* Today's Plan */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-[#0F172A]">Today's Plan</h3>
              <Calendar className="h-4 w-4 text-[#94A3B8]" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-[#EFF6FF] p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] flex-shrink-0 text-xs font-bold text-white">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0F172A]">Complete lesson</p>
                  <p className="text-xs text-[#64748B]">Quadratic Equations</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-[#F8FAFC] p-3 opacity-60">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E2E8F0] flex-shrink-0 text-xs font-bold text-[#64748B]">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0F172A]">Take quiz</p>
                  <p className="text-xs text-[#64748B]">Check your understanding</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-[#F8FAFC] p-3 opacity-60">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E2E8F0] flex-shrink-0 text-xs font-bold text-[#64748B]">
                  3
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0F172A]">Review notes</p>
                  <p className="text-xs text-[#64748B]">Study your highlights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Access */}
          <Link
            to="/student/access"
            className="block rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-[#EFF6FF] to-white p-6 transition-all hover:border-[#2563EB] hover:shadow-md"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-[#0F172A]">Learning Access</h3>
            </div>
            <p className="text-xs text-[#64748B]">Customize captions, focus mode, and accessibility settings</p>
          </Link>

          {/* Activity Feed */}
          <ActivityFeed title="Recent Activity" items={mockActivity} maxItems={5} />
        </div>
      </section>
    </DashboardShell>
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
