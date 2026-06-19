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
  PlayCircle,
  Sparkles,
  FileText,
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

const STATUS_META: Record<
  SessionStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
  }
> = {
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

  const completedSessions = SESSIONS.filter((s) => s.status === "completed");
  const avgScore = completedSessions.filter((s) => s.quizScore !== undefined).length
    ? Math.round(
        completedSessions
          .filter((s) => s.quizScore !== undefined)
          .reduce((a, s) => a + (s.quizScore ?? 0), 0) /
          completedSessions.filter((s) => s.quizScore !== undefined).length,
      )
    : 0;

  return (
    <StudentShell title="Sessions">
      {/* Premium Stats Strip */}
      <div className="kr-stat-strip kr-stat-strip--3 mb-6">
        {/* Completed */}
        <div className="kr-stat-card-item kr-stat-card-item--success">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <p className="kr-stat-value text-green-700">
            {SESSIONS.filter((s) => s.status === "completed").length}
          </p>
          <p className="kr-stat-label">Completed</p>
        </div>

        {/* Avg Quiz Score */}
        <div className="kr-stat-card-item kr-stat-card-item--brand">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="h-4 w-4 text-[#1F7C80]" />
          </div>
          <p className="kr-stat-value text-[#1F7C80]">{avgScore}%</p>
          <p className="kr-stat-label">Avg Quiz Score</p>
        </div>

        {/* Notes */}
        <div className="kr-stat-card-item">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <FileText className="h-4 w-4 text-[#64748B]" />
          </div>
          <p className="kr-stat-value text-[#0F172A]">
            {SESSIONS.reduce((a, s) => a + s.notesCount, 0)}
          </p>
          <p className="kr-stat-label">Notes Created</p>
        </div>
      </div>

      {/* Filters */}
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
                  : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#1F7C80]/40 hover:text-[#1F7C80]"
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
          /* Premium empty state */
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white">
            <div className="kr-empty-state">
              <div className="kr-empty-state-icon">
                <Video className="h-6 w-6 text-[#1F7C80]" />
              </div>
              <h3>No sessions found</h3>
              <p>
                {query
                  ? `No sessions match "${query}". Try a different search term.`
                  : "No sessions in this category yet. Book your first AI-powered session to get started."}
              </p>
              {!query && (
                <Link
                  to="/student/courses"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#1F7C80] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A5256] transition-colors"
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
                {/* Status-aware icon */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm"
                  style={{ background: sm.iconBg }}
                >
                  <Video className="h-5 w-5" style={{ color: sm.iconColor }} />
                </div>

                {/* Main content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[#0F172A]">{session.title}</h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        background: sm.bg,
                        color: sm.color,
                        border: `1px solid ${sm.border}`,
                      }}
                    >
                      {sm.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-[#64748B]">{session.course}</p>

                  {/* Meta row */}
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
                    {session.quizScore !== undefined && (
                      <span
                        className={`font-semibold ${session.quizScore >= 80 ? "text-green-600" : "text-amber-600"}`}
                      >
                        Quiz: {session.quizScore}%
                      </span>
                    )}
                  </div>

                  {/* In-progress progress bar */}
                  {session.status === "in-progress" && (
                    <div className="mt-2.5">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1F7C80]">
                          {session.progress}% complete
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#1F7C80] to-[#3fa8ab] transition-all"
                          style={{ width: `${session.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
                  {session.status === "completed" ? (
                    <>
                      <Link
                        to="/student/sessions/$sessionId/summary"
                        params={{ sessionId: session.id }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#1F7C80]/30 transition-all"
                      >
                        <BarChart2 className="h-3.5 w-3.5" /> Summary
                      </Link>
                      <Link
                        to="/demo/ai-video"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#1F7C80]/30 transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" /> Replay
                      </Link>
                    </>
                  ) : session.status === "in-progress" ? (
                    <Link
                      to="/student/classrooms"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F7C80] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A5256] transition-colors shadow-sm"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button className="inline-flex cursor-default items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#475569]">
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
