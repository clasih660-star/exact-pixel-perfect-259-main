import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type Props = {
  icon?: ReactNode;
  badge?: ReactNode;
  title: string;
  description?: string;
  content: ReactNode;
  actions: Array<{
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "tertiary";
  }>;
};

export function FeaturedActionCard({
  icon,
  badge,
  title,
  description,
  content,
  actions,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-gradient-to-br from-white via-[#EFF6FF] to-white p-8 shadow-sm">
      {/* Gradient background accent */}
      <div className="absolute right-0 top-0 h-80 w-80 translate-x-24 -translate-y-24 rounded-full bg-[#2563EB]/5 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            {badge && <div className="mb-3">{badge}</div>}
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] lg:text-3xl">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-[#475569]">{description}</p>
            )}
          </div>
          {icon && (
            <div className="ml-4 flex-shrink-0 text-[#2563EB]">{icon}</div>
          )}
        </div>

        {/* Content */}
        <div className="mb-6">{content}</div>

        {/* Actions */}
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex flex-col gap-2 lg:flex-row">
            {actions.map((action, idx) => (
              <Link
                key={action.href}
                to={action.href}
                className={`
                  inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap 
                  rounded-xl px-5 text-sm font-bold transition-all
                  ${
                    action.variant === "primary"
                      ? "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 hover:bg-[#1D4ED8]"
                      : action.variant === "tertiary"
                        ? "text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
                        : "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]"
                  }
                `}
              >
                <span>{action.label}</span>
                {action.variant === "tertiary" && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
