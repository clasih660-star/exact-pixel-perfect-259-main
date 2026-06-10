import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import {
  Play,
  Clock,
  Users,
  Video,
  CheckCircle2,
  Calendar,
  BarChart2,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/teacher/sessions")({
  component: TeacherSessions,
});

type SessionStatus = "live" | "upcoming" | "completed" | "cancelled";

type Session = {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  students: number;
  status: SessionStatus;
  mode: "AI-Assisted" | "Live Teaching" | "Self-paced";
  avgScore?: number;
  completionRate?: number;
};

const SESSIONS: Session[] = [
  {
    id: "sess_live_1",
    title: "Quadratic Equations",
    course: "Mathematics Form 2",
    date: "Today",
    time: "10:30 AM",
    duration: "45 min",
    students: 32,
    status: "live",
    mode: "AI-Assisted",
  },
  {
    id: "sess_up_2",
    title: "Chemical Reactions",
    course: "KCSE Chemistry Revision",
    date: "Today",
    time: "2:00 PM",
    duration: "40 min",
    students: 45,
    status: "upcoming",
    mode: "AI-Assisted",
  },
  {
    id: "sess_up_3",
    title: "HTML Basics",
    course: "Computer Studies Basics",
    date: "Tomorrow",
    time: "9:00 AM",
    duration: "35 min",
    students: 28,
    status: "upcoming",
    mode: "AI-Assisted",
  },
  {
    id: "sess_c_4",
    title: "Algebraic Expressions",
    course: "Mathematics Form 2",
    date: "Jun 9, 2026",
    time: "10:30 AM",
    duration: "42 min",
    students: 30,
    status: "completed",
    mode: "AI-Assisted",
    avgScore: 84,
    completionRate: 94,
  },
  {
    id: "sess_c_5",
    title: "Atomic Structure",
    course: "KCSE Chemistry Revision",
    date: "Jun 6, 2026",
    time: "2:00 PM",
    duration: "38 min",
    students: 42,
    status: "completed",
    mode: "AI-Assisted",
    avgScore: 78,
    completionRate: 88,
  },
  {
    id: "sess_c_6",
    title: "Python Introduction",
    course: "Computer Studies Basics",
    date: "Jun 5, 2026",
    time: "9:00 AM",
    duration: "41 min",
    students: 27,
    status: "completed",
    mode: "AI-Assisted",
    avgScore: 91,
    completionRate: 100,
  },
];

const STATUS_CONFIG: Record<SessionStatus, { label: string; variant: "success" | "warning" | "info" | "neutral" | "error"; dotColor: string }> = {
  live: { label: "Live Now", variant: "info", dotColor: "#2563EB" },
  upcoming: { label: "Upcoming", variant: "neutral", dotColor: "#94A3B8" },
  completed: { label: "Completed", variant: "success", dotColor: "#22C55E" },
  cancelled: { label: "Cancelled", variant: "error", dotColor: "#EF4444" },
};

const config = dashboardConfigs.teacher;

function TeacherSessions() {
  const liveSessions = SESSIONS.filter((s) => s.status === "live");
  const upcomingSessions = SESSIONS.filter((s) => s.status === "upcoming");
  const completedSessions = SESSIONS.filter((s) => s.status === "completed");

  return (
    <DashboardShell config={config} activePath="/teacher/sessions">
      <PageHeader
        label="Classroom management"
        title="Teaching Sessions"
        subtitle="Monitor live sessions, prepare upcoming classes, and review completed lesson data."
      />

      {/* Live Now banner */}
      {liveSessions.length > 0 && (
        <div className="mb-6 rounded-2xl border-2 border-[#2563EB] bg-gradient-to-r from-[#EFF6FF] to-white p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2563EB] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#2563EB]" />
            </span>
            <h2 className="text-base font-bold text-[#0F172A]">Live Right Now</h2>
          </div>
          <div className="space-y-3">
            {liveSessions.map((s) => (
              <SessionRow key={s.id} session={s} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#0F172A]">Upcoming Sessions</h2>
          </div>
          <span className="text-sm text-[#64748B]">{upcomingSessions.length} scheduled</span>
        </div>
        <div className="space-y-3">
          {upcomingSessions.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
        </div>
      </section>

      {/* Completed */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-bold text-[#0F172A]">Completed Sessions</h2>
          </div>
          <span className="text-sm text-[#64748B]">{completedSessions.length} sessions</span>
        </div>
        <div className="space-y-3">
          {completedSessions.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

function SessionRow({ session }: { session: Session }) {
  const sc = STATUS_CONFIG[session.status];
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 transition-all hover:border-[#2563EB]/30 hover:shadow-sm sm:flex-row sm:items-center">
      {/* Video icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF]">
        <Video className="h-5 w-5 text-[#2563EB]" />
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-[#0F172A]">{session.title}</h3>
          <StatusBadge variant={sc.variant}>{sc.label}</StatusBadge>
        </div>
        <p className="text-sm text-[#64748B]">{session.course}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {session.date} · {session.time}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {session.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {session.students} students
          </span>
          {session.avgScore !== undefined && (
            <span className="font-semibold text-green-600">
              Avg score: {session.avgScore}%
            </span>
          )}
          {session.completionRate !== undefined && (
            <span className="font-semibold text-[#2563EB]">
              {session.completionRate}% completed
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {session.status === "live" || session.status === "upcoming" ? (
          <Link
            to="/classroom/session_demo_math"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
          >
            <Play className="h-4 w-4" />
            {session.status === "live" ? "Join" : "Start"}
          </Link>
        ) : (
          <>
            <Link
              to="/teacher/analytics"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
            >
              <BarChart2 className="h-4 w-4" />
              Results
            </Link>
            <Link
              to="/demo/ai-video"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
            >
              <Eye className="h-4 w-4" />
              Replay
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
