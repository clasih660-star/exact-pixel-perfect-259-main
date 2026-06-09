import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { StudentShell } from "@/components/student/StudentShell";
import { CheckCircle2, PlayCircle, Lock, RotateCcw, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/student/courses/$courseId/lessons")({
  component: CourseLessons,
});

type LessonStatus = "completed" | "current" | "upcoming" | "locked" | "review";
type LessonRow = {
  index: number;
  title: string;
  minutes: number;
  status: LessonStatus;
};

// Demo lesson plan for the course. Procedural: you cannot jump to an "upcoming"
// lesson before finishing the current one, but completed lessons stay open
// (via their notes / replay).
const COURSE_TITLE = "Mathematics Form 2 · Algebra Foundations";
const LESSONS: LessonRow[] = [
  { index: 1, title: "Meaning of Algebraic Expressions", minutes: 30, status: "completed" },
  { index: 2, title: "Simplifying Expressions", minutes: 35, status: "completed" },
  { index: 3, title: "Solving Quadratics by Factoring", minutes: 45, status: "current" },
  { index: 4, title: "Common Sign Mistakes", minutes: 30, status: "locked" },
  { index: 5, title: "Word Problems with Quadratics", minutes: 40, status: "locked" },
  { index: 6, title: "Review and Practice", minutes: 35, status: "locked" },
];

const STATUS: Record<LessonStatus, { label: string; color: string; bg: string }> = {
  completed: { label: "Completed", color: "#15803d", bg: "#dcfce7" },
  current: { label: "In progress", color: "#1d4ed8", bg: "#dbeafe" },
  upcoming: { label: "Upcoming", color: "#475569", bg: "#f1f5f9" },
  locked: { label: "Locked", color: "#94a3b8", bg: "#f1f5f9" },
  review: { label: "Needs review", color: "#b45309", bg: "#fffbeb" },
};

function CourseLessons() {
  const { courseId } = useParams({ from: "/_authenticated/student/courses/$courseId/lessons" });
  const done = LESSONS.filter((l) => l.status === "completed").length;
  const pct = Math.round((done / LESSONS.length) * 100);

  return (
    <StudentShell title="Course Lessons">
      <div className="kr-pcard mb-6 p-6">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--primary)]">Course</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--gray-900)]">{COURSE_TITLE}</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--gray-100)]">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-bold text-[var(--gray-700)]">{done}/{LESSONS.length} lessons · {pct}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {LESSONS.map((l) => {
          const meta = STATUS[l.status];
          const isLocked = l.status === "locked" || l.status === "upcoming";
          const Icon = l.status === "completed" ? CheckCircle2 : l.status === "current" ? PlayCircle : Lock;
          return (
            <div
              key={l.index}
              className={`kr-pcard flex items-center gap-4 p-4 ${isLocked ? "opacity-75" : ""}`}
            >
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: meta.bg, color: meta.color }}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--gray-400)]">Lesson {l.index}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: meta.bg, color: meta.color }}>
                    {meta.label}
                  </span>
                </div>
                <h3 className="truncate font-semibold text-[var(--gray-900)]">{l.title}</h3>
                <p className="flex items-center gap-1 text-xs text-[var(--gray-500)]">
                  <Clock className="h-3 w-3" /> {l.minutes} min
                </p>
              </div>

              <div className="flex-shrink-0">
                {l.status === "current" && (
                  <Link to="/demo/ai-video" className="kr-btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white">
                    <PlayCircle className="h-4 w-4" /> Continue
                  </Link>
                )}
                {l.status === "completed" && (
                  <div className="flex gap-2">
                    <Link to="/demo/ai-video" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--gray-200)] px-3 py-2 text-xs font-semibold text-[var(--gray-700)] hover:bg-[var(--gray-50)]">
                      <RotateCcw className="h-3.5 w-3.5" /> Replay
                    </Link>
                    <Link to="/student/notes" className="inline-flex items-center rounded-lg border border-[var(--gray-200)] px-3 py-2 text-xs font-semibold text-[var(--gray-700)] hover:bg-[var(--gray-50)]">
                      Notes
                    </Link>
                  </div>
                )}
                {isLocked && (
                  <span className="text-xs font-medium text-[var(--gray-400)]" title="Complete the current lesson first">
                    Complete Lesson {LESSONS.find((x) => x.status === "current")?.index} first
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Link to="/student/courses" className="text-sm font-semibold text-[var(--primary)] hover:underline">
          ← Back to my courses
        </Link>
        <span className="ml-2 text-xs text-[var(--gray-400)]">({courseId})</span>
      </div>
    </StudentShell>
  );
}
