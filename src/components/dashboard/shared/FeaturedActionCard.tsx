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

export function FeaturedActionCard({ icon, badge, title, description, content, actions }: Props) {
  return (
    <section className="dashboard-card relative overflow-hidden p-5 sm:p-6">
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div className="flex-1">
            {badge && <div className="mb-3">{badge}</div>}
            <h2 className="text-xl font-bold leading-tight tracking-tight text-heading lg:text-2xl">
              {title}
            </h2>
            {description && (
              <p className="mt-1 max-w-2xl text-sm leading-6 text-body">{description}</p>
            )}
          </div>
          {icon && <div className="ml-4 flex-shrink-0 text-academic-blue">{icon}</div>}
        </div>

        {/* Content */}
        <div className="mb-5">{content}</div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            {actions.map((action, idx) => (
              <Link
                key={action.href}
                to={action.href}
                className={`
                  inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap 
                  rounded-lg px-5 text-sm font-bold transition-all
                  ${
                    action.variant === "primary"
                      ? "bg-academic-blue text-white shadow-lg shadow-academic-blue/25 hover:bg-navy-light"
                      : action.variant === "tertiary"
                        ? "text-academic-blue hover:text-navy-light flex items-center gap-1"
                        : "border border-border bg-white text-heading hover:bg-page-background-alt"
                  }
                `}
              >
                <span>{action.label}</span>
                {action.variant === "tertiary" && <ChevronRight className="h-4 w-4" />}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
