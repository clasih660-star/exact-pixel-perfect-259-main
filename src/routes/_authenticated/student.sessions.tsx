import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StudentShell } from "@/components/student/StudentShell";
import {
  Video,
  Clock,
  BookOpen,
  BarChart2,
  CheckCircle2,
  Calendar,
  Search,
  ChevronRight,
  PlayCircle,
  Sparkles,
  FileText,
} from "lucide-react";
import { requireStudent } from "@/lib/route-guards";
import { getStudentSessions } from "@/lib/student.functions";

export const Route = createFileRoute("/_authenticated/student/sessions")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentSessions,
});

type Filter = "all" | "completed" | "in-progress" | "upcoming";

const STATUS_META = {
  completed: {
    label: "Completed",
    color: "#15803D",
    bg: "#DCFCE7",
    border: "#BBF7D0",
    iconBg: "linear-gradient(135deg, #bbf7d0, #dcfce7)",
    iconColor: "#15803D",
  },
  "in-progress": {
    label: "In Progress",
    color: "#1A5256",
    bg: "#e8f5f5",
    border: "#a3d9d8",
    iconBg: "linear-gradient(135deg, #a3d9d8, #e8f5f5)",
    iconColor: "#1F7C80",
  },
  upcoming: {
    label: "Upcoming",
    color: "#475569",
    bg: "#F1F5F9",
    border: "#E2E8F0",
    iconBg: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
    iconColor: "#64748B",
  },
} as const;

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diffDays <= 0) return `Today at ${time}`;
  if (diffDays === 1) return `Yesterday at ${time}`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function toUiStatus(db: "live" | "completed" | "scheduled"): keyof typeof STATUS_META {
  if (db === "live") return "in-progress";
  if (db === "completed") return "completed";
  return "upcoming";
}

function StudentSessions() {
  const fn = useServerFn(getStudentSessions);
  const q = useQuery({ queryKey: ["student-sessions"], queryFn: () => fn() });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const sessions = q.data?.sessions ?? [];

  const mapped = useMemo(
    () =>
      sessions.map((s: any) => ({
        id: s.id as string,
        title: s.lessonTitle as string,
        course: s.courseTitle as string,
        date: formatWhen(s.startedAt),
        duration: s.durationMinutes ? `${s.durationMinutes} min` : "—",
        notesCount: s.notesCount as number,
        status: toUiStatus(s.status),
      })),
    [sessions],
  );

  const filtered = mapped.filter((s) => {
    const qq = query.toLowerCase();
    const matchQ = s.title.toLowerCase().includes(qq) || s.course.toLowerCase().includes(qq);
    const matchF = filter === "all" || s.status === filter;
    return matchQ && matchF;
  });

  const completedCount = mapped.filter((s) => s.status === "completed").length;
  const notesTotal = mapped.reduce((a, s) => a + s.notesCount, 0);

  return (
    <StudentShell title="Sessions">
      <div className="kr-stat-strip kr-stat-strip--3 mb-6">
        <div className="kr-stat-card-item kr-stat-card-item--success">
          <div className="mb-2 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <p className="kr-stat-value text-green-700">{completedCount}</p>
          <p className="kr-stat-label">Completed</p>
        </div>
        <div className="kr-stat-card-item kr-stat-card-item--brand">
          <div className="mb-2 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[#1F7C80]" />
          </div>
          <p className="kr-stat-value text-[#1F7C80]">{mapped.length}</p>
          <p className="kr-stat-label">Total Sessions</p>
        </div>
        <div className="kr-stat-card-item">
          <div className="mb-2 flex items-center justify-center">
            <FileText className="h-4 w-4 text-[#64748B]" />
          </div>
          <p className="kr-stat-value text-[#0F172A]">{notesTotal}</p>
          <p className="kr-stat-label">Notes Created</p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions…"
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1F7C80] focus:outline-none focus:ring-2 focus:ring-[#1F7C80]/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "completed", "in-progress", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-[#1F7C80] text-white shadow-sm"
                  : "border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#1F7C80]/40 hover:text-[#1F7C80]"
              }`}
            >
              {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {q.isLoading ? (
          <p className="text-sm text-[#64748B]">Loading sessions…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white">
            <div className="kr-empty-state">
              <div className="kr-empty-state-icon">
                <Video className="h-6 w-6 text-[#1F7C80]" />
              </div>
              <h3>No sessions found</h3>
              <p>
                {query
                  ? `No sessions match "${query}". Try a different search term.`
                  : "You haven't started any sessions yet. Enter a classroom to begin."}
              </p>
              {!query && (
                <Link
                  to="/student/courses"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#1F7C80] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1A5256]"
                >
                  <PlayCircle className="h-4 w-4" /> Browse Courses
                </Link>
              )}
            </div>
          </div>
        ) : (
          filtered.map((session) => {
            const sm = STATUS_META[session.status];
            return (
              <div
                key={session.id}
                className="group flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 transition-all hover:border-[#1F7C80]/30 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm"
                  style={{ background: sm.iconBg }}
                >
                  <Video className="h-5 w-5" style={{ color: sm.iconColor }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[#0F172A]">{session.title}</h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}
                    >
                      {sm.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-[#64748B]">{session.course}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {session.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {session.notesCount} notes
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
                  {session.status === "completed" ? (
                    <Link
                      to="/student/sessions/$sessionId/summary"
                      params={{ sessionId: session.id }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:border-[#1F7C80]/30"
                    >
                      <BarChart2 className="h-3.5 w-3.5" /> Summary
                    </Link>
                  ) : session.status === "in-progress" ? (
                    <Link
                      to="/student/classrooms"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F7C80] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1A5256]"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex cursor-default items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#475569]">
                      <Calendar className="h-3.5 w-3.5" /> Scheduled
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </StudentShell>
  );
}
