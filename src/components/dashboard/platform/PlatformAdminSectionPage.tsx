/**
 * PlatformAdminSectionPage
 *
 * A reusable layout wrapper for Platform Admin dashboard sections.
 * Provides a consistent shell, header, loading/error/empty states, and a
 * content area so each admin route only has to supply its data + table/cards.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";
import { DashboardEmptyState } from "@/components/dashboard/shared/DashboardEmptyState";
import { dashboardConfigs } from "@/lib/dashboard-config";

type ActionLink = {
  label: string;
  to: string;
  variant?: "primary" | "outline";
};

type Props = {
  /** Active sidebar path (defaults to current location). */
  activePath?: string;
  title: string;
  subtitle?: string;
  label?: string;
  /** Optional header action(s). */
  actions?: ActionLink[];
  /** Loading state. */
  loading?: boolean;
  /** Error message (renders error state instead of children). */
  error?: string | null;
  /** Render empty state when true (children ignored). */
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children: ReactNode;
};

export function PlatformAdminSectionPage({
  activePath,
  title,
  subtitle,
  label,
  actions = [],
  loading,
  error,
  empty,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Data will appear here once available.",
  children,
}: Props) {
  return (
    <DashboardShell
      config={dashboardConfigs.platform_admin}
      activePath={activePath}
      title={title}
      subtitle={subtitle}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {label && (
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              {label}
            </span>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--gray-900)] lg:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-sm text-[var(--gray-500)]">{subtitle}</p>}
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Link
                key={action.to + action.label}
                to={action.to}
                className={
                  action.variant === "outline"
                    ? "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--gray-200)] bg-white px-4 text-sm font-bold text-[var(--gray-700)] transition hover:bg-[var(--gray-50)]"
                    : "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
                }
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <DashboardLoadingState type="skeleton" />
      ) : error ? (
        <DashboardLoadingState type="error" message={error} />
      ) : empty ? (
        <DashboardEmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        children
      )}
    </DashboardShell>
  );
}

/**
 * A compact back-link used on detail sub-pages
 * (e.g. /admin/users/$userId → back to /admin/users).
 */
export function BackToSectionLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--gray-500)] transition hover:text-[var(--gray-900)]"
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Link>
  );
}