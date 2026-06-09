import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BookOpen, Building2, FileText, GraduationCap, Monitor, Plus, Upload, UserPlus, Users, Video } from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";

const config = dashboardConfigs.institution;

const courses = [
  { title: "Mathematics Form 2", subject: "Algebra", students: 42, lessons: 8, status: "Published" as const, progress: 72 },
  { title: "KCSE Chemistry Revision", subject: "Chemistry", students: 56, lessons: 14, status: "Published" as const, progress: 45 },
  { title: "Computer Studies Basics", subject: "ICT", students: 28, lessons: 6, status: "Draft" as const, progress: 30 },
];

const activeSessions = [
  { title: "Quadratic Equations", teacher: "AI Teacher", mode: "Live" as const, joined: 18 },
  { title: "Chemical Reactions", teacher: "Mr. Kamau", mode: "Scheduled" as const, time: "2:00 PM" },
  { title: "English Practice", teacher: "Ms. Wanjiku", mode: "Scheduled" as const, time: "Tomorrow" },
];

const recentResources = [
  { title: "Quadratics Notes.pdf", subject: "Mathematics", status: "Ready" as const },
  { title: "KCSE Past Paper Link", subject: "Chemistry", status: "Ready" as const },
  { title: "HTML Worksheet", subject: "Computer Studies", status: "Ready" as const },
];

const recentActivity = [
  { title: "New student enrolled", meta: "Mathematics Form 2 · 10 min ago", href: "/institution/enrollments" },
  { title: "Teacher published lesson", meta: "Chemical Reactions · 1 hour ago", href: "/institution/courses" },
  { title: "Quiz completed", meta: "24 submissions · Today", href: "/institution/analytics" },
];

export default function InstitutionDashboard() {
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
      <DashboardShell config={config} activePath="/institution/dashboard">
        <DashboardLoadingState type="skeleton" />
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell config={config} activePath="/institution/dashboard">
        <DashboardLoadingState type="error" message={error} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell config={config} activePath="/institution/dashboard">
      <InstitutionHeader />
      <KpiSection />
      <MainContentGrid />
    </DashboardShell>
  );
}

function InstitutionHeader() {
  return (
    <section className="mb-8 rounded-3xl border border-[var(--gray-200)] bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-blue-400 text-2xl font-bold text-white shadow-lg">
            K
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Institution dashboard
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--gray-900)] lg:text-3xl">
              Klassruum Demo Academy
            </h1>
            <p className="mt-0.5 text-sm text-[var(--gray-500)]">
              <StatusBadge variant="success">Active</StatusBadge>
              <span className="ml-2">School · Nairobi</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/institution/courses/new"
            className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl bg-[var(--primary)] px-5 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition-all hover:bg-[var(--primary-dark)]"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
          <Link
            to="/institution/resources/upload"
            className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 px-5 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
          >
            <Upload className="h-4 w-4" />
            Upload Resource
          </Link>
          <Link
            to="/institution/students/invite"
            className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 px-5 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
          >
            <UserPlus className="h-4 w-4" />
            Invite Student
          </Link>
          <Link
            to="/institution/teachers/invite"
            className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 px-5 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
          >
            <GraduationCap className="h-4 w-4" />
            Invite Teacher
          </Link>
        </div>
      </div>
    </section>
  );
}

function KpiSection() {
  return (
    <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <KpiCard title="Total Courses" value="12" subtitle="4 published" href="/institution/courses" icon={BookOpen} />
      <KpiCard title="Students" value="428" subtitle="Active learners" href="/institution/students" icon={Users} />
      <KpiCard title="Teachers" value="24" subtitle="Assigned" href="/institution/teachers" icon={GraduationCap} />
      <KpiCard title="Active Sessions" value="6" subtitle="Live or scheduled" href="/institution/sessions" icon={Video} />
      <KpiCard title="Resources" value="96" subtitle="Uploaded files" href="/institution/resources" icon={FileText} />
      <KpiCard title="Avg Progress" value="64%" subtitle="Across courses" href="/institution/analytics" icon={Building2} />
    </section>
  );
}

function MainContentGrid() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.85fr]">
      <div className="space-y-6 lg:row-span-2">
        <CoursesOverviewPanel />
      </div>
      <ActiveSessionsPanel />
      <ResourceLibraryPanel />
      <RecentActivityPanel />
    </section>
  );
}

function CoursesOverviewPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--gray-900)]">Courses Overview</h2>
          <p className="mt-0.5 text-sm text-[var(--gray-500)]">Manage your institution's learning programs.</p>
        </div>
        <Link to="/institution/courses" className="text-sm font-bold text-[var(--primary)] hover:underline">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {courses.map((c) => (
          <article
            key={c.title}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--gray-200)] bg-white p-4 transition-all hover:border-[var(--primary)]/20 hover:shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-400 text-sm font-bold text-white">
              {c.title.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[var(--gray-900)]">{c.title}</h3>
              <p className="text-xs text-[var(--gray-500)]">
                {c.subject} · {c.students} students · {c.lessons} lessons
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
              <StatusBadge variant={c.status === "Published" ? "success" : "warning"}>{c.status}</StatusBadge>
              <Link
                to={`/institution/courses/course_${c.title.toLowerCase().replace(/\s+/g, "_")}`}
                className="inline-flex h-9 items-center rounded-xl border border-[var(--primary)]/20 px-4 text-xs font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
              >
                Open
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ActiveSessionsPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Active Sessions</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Live and upcoming classrooms.</p>
      <div className="mt-4 space-y-2">
        {activeSessions.map((s) => (
          <Link
            key={s.title}
            to="/classroom/session_demo_math"
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3 transition-all hover:bg-[var(--gray-50)]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--gray-900)]">{s.title}</p>
              <p className="text-xs text-[var(--gray-500)]">
                {s.teacher} · {"time" in s ? s.time : `${s.joined} joined`}
              </p>
            </div>
            <StatusBadge variant={s.mode === "Live" ? "success" : "warning"}>{s.mode}</StatusBadge>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ResourceLibraryPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Resource Library</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Recently uploaded resources.</p>
      <div className="mt-4 space-y-2">
        {recentResources.map((r) => (
          <div
            key={r.title}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--gray-900)]">{r.title}</p>
              <p className="text-xs text-[var(--gray-500)]">{r.subject}</p>
            </div>
            <StatusBadge variant={r.status === "Ready" ? "success" : "warning"}>{r.status}</StatusBadge>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to="/institution/resources/upload"
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 text-sm font-bold text-white transition-all hover:bg-[var(--primary-dark)]"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Link>
        <Link
          to="/institution/resources"
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--primary)]/20 px-4 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
        >
          <FileText className="h-4 w-4" />
          View Library
        </Link>
      </div>
    </div>
  );
}

function RecentActivityPanel() {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Recent Activity</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Latest actions across your institution.</p>
      <div className="mt-4 space-y-2">
        {recentActivity.map((a) => (
          <Link
            key={a.title}
            to={a.href}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3 transition-all hover:bg-[var(--gray-50)]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--gray-900)]">{a.title}</p>
              <p className="text-xs text-[var(--gray-500)]">{a.meta}</p>
            </div>
            <Monitor className="h-4 w-4 flex-shrink-0 text-[var(--gray-400)]" />
          </Link>
        ))}
      </div>
      <Link
        to="/institution/activity"
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-2xl border border-[var(--primary)]/20 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
      >
        View All Activity
      </Link>
    </div>
  );
}
