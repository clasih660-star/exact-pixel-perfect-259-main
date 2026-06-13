import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StudentShell } from "@/components/student/StudentShell";
import {
  Video,
  Clock,
  BookOpen,
  Eye,
  BarChart2,
  CheckCircle2,
  Calendar,
  Search,
  ChevronRight,
} from "lucide-react";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/sessions")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentSessions,
});

type SessionStatus = "completed" | "in-progress" | "upcoming";

type Session = {
  id: string;
  title: string;
  course: string;
  date: string;
  duration: string;
  progress: number;
  status: SessionStatus;
  quizScore?: number;
  notesCount: number;
};

const SESSIONS: Session[] = [
  {
    id: "session_demo_math",
    title: "Introduction to Quadratic Equations",
    course: "Mathematics Form 2",
    date: "Today at 2:30 PM",
    duration: "45 min",
    progress: 100,
    status: "completed",
    quizScore: 92,
    notesCount: 5,
  },
  {
    id: "sess_chem_1",
    title: "Chemical Reactions",
    course: "KCSE Chemistry Revision",
    date: "Yesterday at 4:00 PM",
    duration: "38 min",
    progress: 100,
    status: "completed",
    quizScore: 76,
    notesCount: 3,
  },
  {
    id: "sess_cs_1",
    title: "HTML Introduction",
    course: "Computer Studies Basics",
    date: "3 days ago at 9:30 AM",
    duration: "41 min",
    progress: 100,
    status: "completed",
    quizScore: 88,
    notesCount: 4,
  },
  {
    id: "sess_math_2",
    title: "Algebraic Expressions",
    course: "Mathematics Form 2",
    date: "Jun 4, 2026",
    duration: "32 min",
    progress: 100,
    status: "completed",
    quizScore: 80,
    notesCount: 2,
  },
  {
    id: "sess_chem_2",
    title: "Atomic Structure",
    course: "KCSE Chemistry Revision",
    date: "Jun 2, 2026",
    duration: "36 min",
    progress: 65,
    status: "in-progress",
    notesCount: 1,
  },
  {
    id: "sess_eng_1",
    title: "Daily Conversation Practice",
    course: "English Speaking Practice",
    date: "Jun 12, 2026 at 4:00 PM",
    duration: "30 min",
    progress: 0,
    status: "upcoming",
    notesCount: 0,
  },
];

const STATUS_META: Record<SessionStatus, { label: string; color: string; bg: string; border: string }> = {
  completed: { label: "Completed", color: "#15803D", bg: "#DCFCE7", border: "#BBF7D0" },
  "in-progress": { label: "In Progress", color: "#1A5256", bg: "#DBEAFE", border: "#BFDBFE" },
  upcoming: { label: "Upcoming", color: "#475569", bg: "#F1F5F9", border: "#E2E8F0" },
};

function StudentSessions() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SessionStatus | "all">("all");

  const filtered = SESSIONS.filter((s) => {
    const q = query.toLowerCase();
    const matchQ = s.title.toLowerCase().includes(q) || s.course.toLowerCase().includes(q);
    const matchF = filter === "all" || s.status === filter;
    return matchQ && matchF;
  });

  const avgScore = Math.round(
    SESSIONS.filter((s) => s.quizScore !== undefined).reduce((a, s) => a + (s.quizScore ?? 0), 0) /
      SESSIONS.filter((s) => s.quizScore !== undefined).length,
  );

  return (
    <StudentShell title="Sessions">
      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-[var(--gray-900)]">
            {SESSIONS.filter((s) => s.status === "completed").length}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[var(--gray-500)]">Completed</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-[var(--primary)]">{avgScore}%</p>
          <p className="mt-0.5 text-xs font-semibold text-[var(--gray-500)]">Avg Quiz Score</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-[var(--gray-900)]">
            {SESSIONS.reduce((a, s) => a + s.notesCount, 0)}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[var(--gray-500)]">Notes Created</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions…"
            className="w-full rounded-xl border border-[var(--gray-200)] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "completed", "in-progress", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white border border-[var(--gray-200)] text-[var(--gray-500)] hover:border-[var(--primary)]/40"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Session list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--gray-200)] p-12 text-center">
            <Video className="mx-auto h-10 w-10 text-[var(--gray-300)]" />
            <p className="mt-3 font-semibold text-[var(--gray-500)]">No sessions found</p>
          </div>
        ) : (
          filtered.map((session) => {
            const sm = STATUS_META[session.status];
            return (
              <div
                key={session.id}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--gray-200)] bg-white p-4 transition-all hover:border-[var(--primary)]/30 hover:shadow-sm sm:flex-row sm:items-center"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)]">
                  <Video className="h-5 w-5 text-[var(--primary)]" />
                </div>

                {/* Main */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--gray-900)]">{session.title}</h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}
                    >
                      {sm.label}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--gray-500)]">{session.course}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--gray-400)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {session.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {session.notesCount} notes
                    </span>
                    {session.quizScore !== undefined && (
                      <span className={`font-semibold ${session.quizScore >= 80 ? "text-green-600" : "text-amber-600"}`}>
                        Quiz: {session.quizScore}%
                      </span>
                    )}
                    {session.status === "in-progress" && (
                      <span className="font-semibold text-[var(--primary)]">{session.progress}% complete</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {session.status === "completed" ? (
                    <>
                      <Link
                        to="/student/sessions/$sessionId/summary"
                        params={{ sessionId: session.id }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--gray-200)] px-3 py-2 text-xs font-semibold text-[var(--gray-600)] hover:bg-[var(--gray-50)]"
                      >
                        <BarChart2 className="h-3.5 w-3.5" /> Summary
                      </Link>
                      <Link
                        to="/demo/ai-video"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--gray-200)] px-3 py-2 text-xs font-semibold text-[var(--gray-600)] hover:bg-[var(--gray-50)]"
                      >
                        <Eye className="h-3.5 w-3.5" /> Replay
                      </Link>
                    </>
                  ) : session.status === "in-progress" ? (
                    <Link
                      to="/classroom/$lessonId"
                      params={{ lessonId: session.id }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--gray-200)] px-3 py-2 text-xs font-semibold text-[var(--gray-600)]">
                      <Calendar className="h-3.5 w-3.5" /> Scheduled
                    </button>
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
