import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Building2, FileText, GraduationCap, Monitor, Plus, Upload, UserPlus, Users, Video } from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";
import { getInstitutionDashboard } from "@/lib/reporting.functions";

const config = dashboardConfigs.institution;

type DashboardData = Awaited<ReturnType<typeof getInstitutionDashboard>>;

/** Human-readable label for a recorded session event_type. */
function eventLabel(type: string): string {
  const map: Record<string, string> = {
    session_started: "Session started",
    session_resumed: "Session resumed",
    session_completed: "Session completed",
    section_started: "Section started",
    board_written: "Board written",
    teacher_explained: "Teacher explained",
    question_asked: "Question asked",
    question_answered: "Question answered",
    checkpoint_triggered: "Checkpoint reached",
    practice_attempted: "Practice attempted",
    practice_correct: "Practice solved",
    hand_raised: "Hand raised",
    notes_saved: "Notes saved",
    misconception_detected: "Misconception detected",
  };
  return map[type] ?? type.replace(/_/g, " ");
}

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}

export default function InstitutionDashboard() {
  const fn = useServerFn(getInstitutionDashboard);
  const { data, isLoading, error } = useQuery({
    queryKey: ["institution-dashboard"],
    queryFn: () => fn(),
  });

  if (isLoading) {
    return (
      <DashboardShell config={config} activePath="/institution/dashboard">
        <DashboardLoadingState type="skeleton" />
      </DashboardShell>
    );
  }

  if (error || !data) {
    return (
      <DashboardShell config={config} activePath="/institution/dashboard">
        <DashboardLoadingState type="error" message={(error as Error)?.message || "Failed to load dashboard data"} />
      </DashboardShell>
    );
  }

  if (!data.institution) {
    return (
      <DashboardShell config={config} activePath="/institution/dashboard">
        <div className="rounded-3xl border border-[var(--gray-200)] bg-white p-10 text-center">
          <h1 className="text-xl font-bold text-[var(--gray-900)]">No institution found</h1>
          <p className="mt-2 text-sm text-[var(--gray-500)]">
            You are not a member of any institution yet. Register one to get started.
          </p>
          <Link
            to="/institutions/register"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl bg-[var(--primary)] px-5 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> Register Institution
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell config={config} activePath="/institution/dashboard">
      <InstitutionHeader name={data.institution.name} />
      <KpiSection stats={data.stats!} />
      <MainContentGrid data={data} />
    </DashboardShell>
  );
}

function InstitutionHeader({ name }: { name: string }) {
  return (
    <section className="mb-8 rounded-3xl border border-[var(--gray-200)] bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-blue-400 text-2xl font-bold text-white shadow-lg">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Institution dashboard</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--gray-900)] lg:text-3xl">{name}</h1>
            <p className="mt-0.5 text-sm text-[var(--gray-500)]">
              <StatusBadge variant="success">Active</StatusBadge>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/institution/courses/new" className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl bg-[var(--primary)] px-5 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition-all hover:bg-[var(--primary-dark)]">
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
          <Link to="/institution/resources/upload" className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 px-5 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
            <Upload className="h-4 w-4" />
            Upload Resource
          </Link>
          <Link to="/institution/students/invite" className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 px-5 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
            <UserPlus className="h-4 w-4" />
            Invite Student
          </Link>
          <Link to="/institution/teachers/invite" className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 px-5 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
            <GraduationCap className="h-4 w-4" />
            Invite Teacher
          </Link>
        </div>
      </div>
    </section>
  );
}

function KpiSection({ stats }: { stats: NonNullable<DashboardData["stats"]> }) {
  return (
    <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <KpiCard title="Total Courses" value={stats.courses} subtitle={`${stats.publishedCourses} published`} href="/institution/courses" icon={BookOpen} />
      <KpiCard title="Students" value={stats.students} subtitle="Active learners" href="/institution/students" icon={Users} />
      <KpiCard title="Teachers" value={stats.teachers} subtitle="Assigned" href="/institution/teachers" icon={GraduationCap} />
      <KpiCard title="Live Sessions" value={stats.liveSessions} subtitle="Happening now" href="/institution/sessions" icon={Video} />
      <KpiCard title="Materials" value={stats.materials} subtitle="Uploaded files" href="/institution/resources" icon={FileText} />
      <KpiCard title="Avg Progress" value={`${stats.avgProgress}%`} subtitle="Across learners" href="/institution/analytics" icon={Building2} />
    </section>
  );
}

function MainContentGrid({ data }: { data: DashboardData }) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.85fr]">
      <div className="space-y-6 lg:row-span-2">
        <CoursesOverviewPanel courses={data.courses} />
      </div>
      <ActiveSessionsPanel sessions={data.activeSessions} />
      <ResourceLibraryPanel materials={data.recentMaterials} />
      <RecentActivityPanel activity={data.activity} />
    </section>
  );
}

function CoursesOverviewPanel({ courses }: { courses: DashboardData["courses"] }) {
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
      {courses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--gray-200)] p-6 text-center text-sm text-[var(--gray-500)]">
          No courses yet. Create your first course to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <article key={c.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--gray-200)] bg-white p-4 transition-all hover:border-[var(--primary)]/20 hover:shadow-sm sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-400 text-sm font-bold text-white">
                {c.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-[var(--gray-900)]">{c.title}</h3>
                <p className="text-xs text-[var(--gray-500)]">
                  {c.subject ? `${c.subject} · ` : ""}{c.students} students · {c.lessons} lessons
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={c.status === "published" ? "success" : "warning"}>
                  {c.status === "published" ? "Published" : "Draft"}
                </StatusBadge>
                <Link
                  to="/institution/courses/$courseId"
                  params={{ courseId: c.id }}
                  className="inline-flex h-9 items-center rounded-xl border border-[var(--primary)]/20 px-4 text-xs font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
                >
                  Open
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ActiveSessionsPanel({ sessions }: { sessions: DashboardData["activeSessions"] }) {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Active Sessions</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Live and upcoming classrooms.</p>
      <div className="mt-4 space-y-2">
        {sessions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--gray-200)] p-4 text-center text-xs text-[var(--gray-500)]">No live sessions right now.</p>
        ) : (
          sessions.map((s) => (
            <Link
              key={s.id}
              to="/classroom/session/$sessionId"
              params={{ sessionId: s.id }}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3 transition-all hover:bg-[var(--gray-50)]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--gray-900)]">{s.title}</p>
                <p className="text-xs text-[var(--gray-500)]">{s.mode} · {timeAgo(s.startedAt)}</p>
              </div>
              <StatusBadge variant={s.status === "live" ? "success" : "warning"}>{s.status === "live" ? "Live" : "Scheduled"}</StatusBadge>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function ResourceLibraryPanel({ materials }: { materials: DashboardData["recentMaterials"] }) {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Resource Library</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Recently uploaded materials.</p>
      <div className="mt-4 space-y-2">
        {materials.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--gray-200)] p-4 text-center text-xs text-[var(--gray-500)]">No materials uploaded yet.</p>
        ) : (
          materials.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--gray-900)]">{r.title}</p>
                <p className="text-xs text-[var(--gray-500)] capitalize">{r.type}</p>
              </div>
              <StatusBadge variant={r.processing_status === "ready" ? "success" : "warning"}>
                {r.processing_status === "ready" ? "Ready" : r.processing_status}
              </StatusBadge>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/institution/resources/upload" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 text-sm font-bold text-white transition-all hover:bg-[var(--primary-dark)]">
          <Upload className="h-4 w-4" />
          Upload
        </Link>
        <Link to="/institution/resources" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--primary)]/20 px-4 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
          <FileText className="h-4 w-4" />
          View Library
        </Link>
      </div>
    </div>
  );
}

function RecentActivityPanel({ activity }: { activity: DashboardData["activity"] }) {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[var(--gray-900)]">Recent Activity</h2>
      <p className="mt-0.5 text-sm text-[var(--gray-500)]">Latest actions across your institution.</p>
      <div className="mt-4 space-y-2">
        {activity.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--gray-200)] p-4 text-center text-xs text-[var(--gray-500)]">No recorded activity yet.</p>
        ) : (
          activity.map((a: any) => (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--gray-900)]">{eventLabel(a.event_type)}</p>
                <p className="text-xs text-[var(--gray-500)] capitalize">{a.actor_role.replace(/_/g, " ")} · {timeAgo(a.created_at)}</p>
              </div>
              <Monitor className="h-4 w-4 flex-shrink-0 text-[var(--gray-400)]" />
            </div>
          ))
        )}
      </div>
      <Link to="/institution/activity" className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-2xl border border-[var(--primary)]/20 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
        View All Activity
      </Link>
    </div>
  );
}
