import { Link } from "@tanstack/react-router";
import { Clock, Users, Play, Eye, UserCheck } from "lucide-react";

interface TeachingTodayHeroProps {
  courseName: string;
  lessonTitle: string;
  scheduledTime: string;
  mode: string;
  expectedStudents: number;
  sessionId: string;
  lessonId: string;
  courseId: string;
  accessibilityStatus: string;
}

export function TeachingTodayHero({
  courseName,
  lessonTitle,
  scheduledTime,
  mode,
  expectedStudents,
  sessionId,
  lessonId,
  courseId,
  accessibilityStatus,
}: TeachingTodayHeroProps) {
  return (
    <section className="dashboard-card overflow-hidden bg-gradient-to-br from-green-50 to-white border-green-200">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side: Session info */}
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="status-pill bg-green-100 text-green-700 flex items-center gap-1">
              <Play className="h-3 w-3" />
              Next Session
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-[var(--gray-900)] lg:text-3xl">
            {lessonTitle}
          </h2>
          
          <p className="text-sm text-[var(--gray-500)] lg:text-base">
            {courseName} · {scheduledTime}
          </p>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--gray-700)] border border-[var(--gray-200)]">
              <Play className="h-3 w-3" />
              Mode: {mode}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--gray-700)] border border-[var(--gray-200)]">
              <Users className="h-3 w-3" />
              Expected: {expectedStudents} students
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--gray-700)] border border-[var(--gray-200)]">
              <Eye className="h-3 w-3" />
              Accessibility: {accessibilityStatus}
            </span>
          </div>

          {/* Time info */}
          <div className="mt-4 flex items-center gap-2 text-sm text-[var(--gray-500)]">
            <Clock className="h-4 w-4" />
            <span>{scheduledTime}</span>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex flex-col gap-3 lg:min-w-[200px]">
          <Link
            to={`/classroom/${sessionId}`}
            className="btn-primary flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
          >
            <Play className="h-4 w-4" />
            Start Class
          </Link>
          <Link
            to={`/teacher/lessons/${lessonId}/edit`}
            className="btn-secondary flex items-center justify-center gap-2 rounded-xl border border-[var(--gray-200)] bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--primary)] hover:bg-[var(--gray-50)]"
          >
            <Eye className="h-4 w-4" />
            Preview Lesson
          </Link>
          <Link
            to={`/teacher/courses/${courseId}/students`}
            className="btn-secondary flex items-center justify-center gap-2 rounded-xl border border-[var(--gray-200)] bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--primary)] hover:bg-[var(--gray-50)]"
          >
            <UserCheck className="h-4 w-4" />
            View Students
          </Link>
        </div>
      </div>
    </section>
  );
}