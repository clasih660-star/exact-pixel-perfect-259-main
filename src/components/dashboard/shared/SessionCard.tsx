import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Clock, Users, MessageCircle } from "lucide-react";

type Props = {
  title: string;
  course?: string;
  time?: string;
  duration?: string;
  participantCount?: number;
  status?: "live" | "completed" | "scheduled" | "ongoing";
  badge?: ReactNode;
  href: string;
  mode?: string;
};

export function SessionCard({
  title,
  course,
  time,
  duration,
  participantCount,
  status = "completed",
  badge,
  href,
  mode,
}: Props) {
  const statusConfig = {
    live: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    completed: {
      bg: "bg-[#F8FAFC]",
      border: "border-[#E2E8F0]",
      text: "text-[#0F172A]",
      dot: "bg-[#64748B]",
    },
    scheduled: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    ongoing: {
      bg: "bg-[#e8f5f5]",
      border: "border-[#a3d9d8]",
      text: "text-[#1A5256]",
      dot: "bg-[#e8f5f5]0",
    },
  };

  const config = statusConfig[status];

  return (
    <Link
      to={href}
      className={`
        block overflow-hidden rounded-2xl border transition-all
        hover:shadow-md hover:border-[#1F7C80]/30
        ${config.bg} ${config.border}
      `}
    >
      <div className="p-5">
        {/* Status indicator and badge */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
            <span className={`text-xs font-bold uppercase tracking-wide ${config.text}`}>
              {status}
            </span>
          </div>
          {badge && <div className="text-xs">{badge}</div>}
        </div>

        {/* Title */}
        <h3 className="mb-1 text-base font-bold text-[#0F172A]">{title}</h3>

        {/* Course */}
        {course && <p className="mb-3 text-xs text-[#64748B]">{course}</p>}

        {/* Mode if present */}
        {mode && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2.5 py-1 text-xs font-semibold text-[#0F172A]">
              {mode}
            </span>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          {time && (
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Clock className="h-3.5 w-3.5" />
              <span>{time}</span>
              {duration && <span className="text-[#94A3B8]">· {duration}</span>}
            </div>
          )}
          {participantCount !== undefined && (
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Users className="h-3.5 w-3.5" />
              <span>{participantCount} participants</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
