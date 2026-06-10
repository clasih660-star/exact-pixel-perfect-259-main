import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

type Props = {
  title: string;
  institution?: string;
  course?: string;
  image?: string;
  badge?: ReactNode;
  progress?: number;
  stats?: Array<{ label: string; value: string }>;
  href: string;
  actions?: Array<{
    label: string;
    href: string;
    secondary?: boolean;
  }>;
};

export function CourseCard({
  title,
  institution,
  course,
  image,
  badge,
  progress,
  stats,
  href,
  actions,
}: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all hover:border-[#2563EB]/30 hover:shadow-md">
      {/* Image */}
      {image && (
        <div className="h-32 w-full bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center text-xs font-semibold text-[#2563EB]">
          {image}
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            {badge && <div className="mb-2">{badge}</div>}
            <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
            {course && (
              <p className="mt-0.5 text-xs text-[#64748B]">{course}</p>
            )}
            {institution && (
              <p className="text-xs text-[#64748B]">{institution}</p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        {stats && stats.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="rounded-lg bg-[#F8FAFC] p-2">
                <p className="text-[11px] font-semibold text-[#64748B]">
                  {stat.label}
                </p>
                <p className="text-sm font-bold text-[#0F172A]">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        {progress !== undefined && (
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-semibold text-[#64748B]">Progress</p>
              <p className="text-xs font-bold text-[#2563EB]">{progress}%</p>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E2E8F0]">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={href}
            className="flex-1 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-sm font-bold text-white transition-all hover:bg-[#1D4ED8]"
          >
            Enter
          </Link>
          {actions &&
            actions.map((action, idx) => (
              <Link
                key={idx}
                to={action.href}
                className={`
                  flex-1 inline-flex h-9 items-center justify-center gap-1 rounded-lg
                  text-sm font-bold transition-all
                  ${
                    action.secondary
                      ? "border border-[#E2E8F0] text-[#2563EB] hover:bg-[#EFF6FF]"
                      : "border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                  }
                `}
              >
                <span>{action.label}</span>
              </Link>
            ))}
        </div>
      </div>
    </article>
  );
}
