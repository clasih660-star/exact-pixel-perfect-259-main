import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { dashboardConfigs, type DashboardConfig } from "@/lib/dashboard-config";

type RouteItem = {
  label: string;
  /** Either `href` (new) or `to` (legacy) is accepted. */
  href?: string;
  to?: string;
  description?: string;
};

type RouteStubPageProps = {
  title: string;
  description: string;
  role: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  items?: RouteItem[];
};

// Map the human-readable role label to a dashboard config so the stub page
// renders inside the same persistent sidebar + topbar as the rest of that
// role's app (the chrome stays visible — pages open *within*).
function configForRole(role: string): DashboardConfig | null {
  const r = role.toLowerCase();
  if (r.includes("teacher-enrolled learner")) return dashboardConfigs.teacher_enrolled_learner;
  if (r.includes("institution learner")) return dashboardConfigs.institution_learner;
  if (r.includes("private learner")) return dashboardConfigs.private_learner;
  if (r.includes("private teacher")) return dashboardConfigs.private_teacher;
  if (r.includes("institution teacher")) return dashboardConfigs.institution_teacher;
  if (r.includes("kingpin teacher")) return dashboardConfigs.kingpin_teacher;
  if (r.includes("student") || r.includes("learner")) return dashboardConfigs.institution_learner;
  if (r.includes("teacher")) return dashboardConfigs.institution_teacher;
  if (r.includes("institution")) return dashboardConfigs.institution;
  if (r.includes("platform") || r.includes("admin")) return dashboardConfigs.platform_admin;
  if (r.includes("parent")) return dashboardConfigs.parent;
  return null;
}

function StubBody({
  title,
  description,
  role,
  primary,
  secondary,
  items = [],
}: RouteStubPageProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gray-900)]">{title}</h1>
        <span className="bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Stub</span>
      </div>
      <p className="text-lg text-[var(--gray-600)]">{description}</p>

      {(primary || secondary) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {primary && (
            <Link
              to={primary.to}
              className="inline-flex items-center gap-1.5 bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
            >
              {primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {secondary && (
            <Link
              to={secondary.to}
              className="inline-flex items-center border border-[var(--gray-200)] bg-white px-4 py-2 text-sm font-bold text-[var(--gray-700)] transition hover:bg-[var(--gray-50)]"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      )}

      <div className="mt-8 border border-dashed border-[var(--gray-300)] bg-white p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gray-100)]">
            <svg
              className="h-6 w-6 text-[var(--gray-400)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-[var(--gray-700)]">
            This page is architecturally defined
          </h3>
          <p className="mt-1 text-sm text-[var(--gray-500)]">
            The route exists and is properly connected. Full implementation coming soon.
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--gray-700)]">Related Pages</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const target = item.href ?? item.to ?? "#";
              return (
                <Link
                  key={target + item.label}
                  to={target}
                  className="group block border border-[var(--gray-200)] bg-white p-4 transition hover:border-[var(--primary)]/40 hover:shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                    {role}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold text-[var(--gray-900)]">
                    {item.label}
                  </h3>
                  {item.description && (
                    <p className="mt-1.5 text-sm leading-6 text-[var(--gray-600)]">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                    Open
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Placeholder page for routes that are architecturally defined but not yet
 * fully implemented. Renders inside the role's persistent shell so the top bar
 * and left menu stay visible (pages open within).
 */
export function RouteStubPage(props: RouteStubPageProps) {
  const config = configForRole(props.role);
  const location = useLocation();

  if (config) {
    return (
      <DashboardShell config={config} activePath={location.pathname} title={props.title}>
        <StubBody {...props} />
      </DashboardShell>
    );
  }

  // Outside a known role (e.g. a public preview) → standalone with a Back link.
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <header className="border-b border-[var(--gray-200)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            to="."
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--gray-600)] hover:text-[var(--gray-900)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="bg-[var(--gray-100)] px-3 py-1 text-xs font-medium text-[var(--gray-600)]">
            {props.role}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <StubBody {...props} />
      </main>
    </div>
  );
}
