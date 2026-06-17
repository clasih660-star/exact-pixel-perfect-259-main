import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, HelpCircle, Radio, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";
import { getTeacherSupervision } from "@/lib/reporting.functions";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";

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

export default function TeacherSupervision() {
  const config = useDashboardConfig();
  const fn = useServerFn(getTeacherSupervision);
  const { data, isLoading, error } = useQuery({
    queryKey: ["teacher-supervision"],
    queryFn: () => fn(),
    refetchInterval: 30000, // live monitor — refresh every 30s
  });

  if (isLoading) {
    return (
      <DashboardShell config={config} activePath="/teacher/supervision">
        <DashboardLoadingState type="skeleton" />
      </DashboardShell>
    );
  }

  if (error || !data || !data.institution) {
    return (
      <DashboardShell config={config} activePath="/teacher/supervision">
        <DashboardLoadingState
          type="error"
          message={(error as Error)?.message || "No supervision data available."}
        />
      </DashboardShell>
    );
  }

  const stats = data.stats!;

  return (
    <DashboardShell config={config} activePath="/teacher/supervision">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
          Supervision
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--gray-900)]">
          Live Class Monitor
        </h1>
        <p className="mt-0.5 text-sm text-[var(--gray-500)]">
          Watch live AI-led classes, review learner questions, and track progress across your
          courses.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          title="My Courses"
          value={stats.courses}
          subtitle="Assigned"
          href="/teacher/courses"
          icon={BookOpen}
        />
        <KpiCard
          title="Live Now"
          value={stats.liveSessions}
          subtitle="Active classes"
          href="/teacher/supervision"
          icon={Radio}
        />
        <KpiCard
          title="Active Learners"
          value={stats.activeLearners}
          subtitle="Have started"
          href="/teacher/students"
          icon={Users}
        />
        <KpiCard
          title="Questions"
          value={stats.questionsToReview}
          subtitle="To review"
          href="/teacher/supervision"
          icon={HelpCircle}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Live sessions */}
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <h2 className="text-lg font-bold text-[var(--gray-900)]">Live Classrooms</h2>
          </div>
          <p className="mt-0.5 text-sm text-[var(--gray-500)]">Sessions happening right now.</p>
          <div className="mt-4 space-y-2">
            {data.liveSessions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--gray-200)] p-6 text-center text-sm text-[var(--gray-500)]">
                No live classrooms at the moment.
              </p>
            ) : (
              data.liveSessions.map(
                (s: {
                  id: string;
                  lessonId: string;
                  courseId: string;
                  title: string;
                  startedAt: string | null;
                }) => (
                  <Link
                    key={s.id}
                    to="/classroom/session/$sessionId"
                    params={{ sessionId: s.id }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] p-3 transition-all hover:bg-[var(--gray-50)]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[var(--gray-900)]">{s.title}</p>
                      <p className="text-xs text-[var(--gray-500)]">
                        Started {timeAgo(s.startedAt)}
                      </p>
                    </div>
                    <StatusBadge variant="success">Watch</StatusBadge>
                  </Link>
                ),
              )
            )}
          </div>
        </div>

        {/* Recent questions */}
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--gray-900)]">Questions to Review</h2>
          <p className="mt-0.5 text-sm text-[var(--gray-500)]">
            What learners are asking the AI teacher.
          </p>
          <div className="mt-4 space-y-2">
            {data.recentQuestions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--gray-200)] p-6 text-center text-sm text-[var(--gray-500)]">
                No questions recorded yet.
              </p>
            ) : (
              data.recentQuestions.map((q: any) => (
                <div key={q.id} className="rounded-xl border border-[var(--gray-200)] p-3">
                  <p className="text-sm font-semibold text-[var(--gray-900)]">{q.question_text}</p>
                  {q.answer_text && (
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--gray-500)]">
                      {q.answer_text}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge
                      variant={
                        q.answer_source === "ai"
                          ? "success"
                          : q.answer_source === "teacher"
                            ? "default"
                            : "warning"
                      }
                    >
                      {q.answer_source}
                    </StatusBadge>
                    <span className="text-xs text-[var(--gray-400)]">{timeAgo(q.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Courses overview */}
      <section className="mt-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--gray-900)]">My Courses</h2>
        <p className="mt-0.5 text-sm text-[var(--gray-500)]">
          Open a course to view detailed learner progress.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.courses.length === 0 ? (
            <p className="text-sm text-[var(--gray-500)]">No courses assigned.</p>
          ) : (
            data.courses.map((c: any) => (
              <Link
                key={c.id}
                to="/teacher/courses/$courseId"
                params={{ courseId: c.id }}
                className="rounded-xl border border-[var(--gray-200)] p-4 transition-all hover:border-[var(--primary)]/20 hover:shadow-sm"
              >
                <h3 className="font-bold text-[var(--gray-900)]">{c.title}</h3>
                <p className="text-xs text-[var(--gray-500)]">{c.subject ?? "—"}</p>
                <div className="mt-2">
                  <StatusBadge variant={c.status === "published" ? "success" : "warning"}>
                    {c.status === "published" ? "Published" : "Draft"}
                  </StatusBadge>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
