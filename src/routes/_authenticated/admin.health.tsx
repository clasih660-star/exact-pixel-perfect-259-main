import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { getPlatformSystemHealth } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/health")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminSystemHealthPage,
  head: () => ({
    meta: [
      { title: "System Health — Platform Admin" },
      { name: "description", content: "Platform service status" },
    ],
  }),
});

function AdminSystemHealthPage() {
  const getHealth = useServerFn(getPlatformSystemHealth);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-health"],
    queryFn: () => getHealth(),
    staleTime: 15000,
    refetchInterval: 30000,
  });

  const status = data?.status ?? "operational";
  const services = data?.services ?? [];
  const metrics = data?.metrics ?? { institutions: 0, users: 0, sessions: 0, jobs: 0 };

  return (
    <PlatformAdminSectionPage
      activePath="/admin/health"
      title="System Health"
      label="Monitoring"
      subtitle="Live status of platform services and infrastructure."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
    >
      <div
        className={
          "mb-6 flex items-center gap-4 rounded-2xl border p-5 " +
          (status === "operational"
            ? "border-green-200 bg-green-50"
            : status === "degraded"
              ? "border-amber-200 bg-amber-50"
              : "border-red-200 bg-red-50")
        }
      >
        <div
          className={
            "flex h-12 w-12 items-center justify-center rounded-full " +
            (status === "operational"
              ? "bg-green-100"
              : status === "degraded"
                ? "bg-amber-100"
                : "bg-red-100")
          }
        >
          <Activity
            className={
              "h-6 w-6 " +
              (status === "operational"
                ? "text-green-600"
                : status === "degraded"
                  ? "text-amber-600"
                  : "text-red-600")
            }
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Overall status
          </p>
          <p className="text-2xl font-bold capitalize text-[var(--gray-900)]">{status}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Institutions
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{metrics.institutions}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Users
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{metrics.users}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Sessions
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{metrics.sessions}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Generation jobs
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{metrics.jobs}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--gray-700)]">
            Services
          </h2>
        </div>
        <div className="divide-y divide-[var(--gray-100)]">
          {services.map((s) => (
            <div key={s.name} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[var(--gray-900)]">{s.name}</p>
                <p className="text-xs text-[var(--gray-500)]">{s.detail}</p>
              </div>
              <StatusBadge
                variant={
                  s.status === "operational"
                    ? "success"
                    : s.status === "outage"
                      ? "error"
                      : s.status === "degraded"
                        ? "warning"
                        : "neutral"
                }
              >
                {s.status}
              </StatusBadge>
            </div>
          ))}
        </div>
      </div>
    </PlatformAdminSectionPage>
  );
}