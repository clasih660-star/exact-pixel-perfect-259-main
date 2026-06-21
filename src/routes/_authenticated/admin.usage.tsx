import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { getPlatformUsage } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/usage")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminUsagePage,
  head: () => ({
    meta: [
      { title: "Usage — Platform Admin" },
      { name: "description", content: "Platform-wide resource consumption" },
    ],
  }),
});

function AdminUsagePage() {
  const getUsage = useServerFn(getPlatformUsage);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-usage"],
    queryFn: () => getUsage(),
    staleTime: 30000,
  });

  const metrics = [
    { label: "Sessions", value: data?.sessions ?? 0 },
    { label: "Materials", value: data?.materials ?? 0 },
    { label: "Courses", value: data?.courses ?? 0 },
    { label: "Lessons", value: data?.lessons ?? 0 },
    { label: "Generation jobs", value: data?.jobs ?? 0 },
    { label: "AI tokens", value: data?.aiTokens ?? 0 },
  ];
  const byInstitution = data?.byInstitution ?? [];
  const maxSessions = byInstitution.length
    ? Math.max(...byInstitution.map((b) => b.sessions))
    : 1;

  return (
    <PlatformAdminSectionPage
      activePath="/admin/usage"
      title="Usage"
      label="Consumption"
      subtitle="Aggregate platform resource usage, plus top institutions by activity."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
              {m.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">
              {m.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--gray-700)]">
            Top institutions by session count
          </h2>
        </div>
        <div className="divide-y divide-[var(--gray-100)]">
          {byInstitution.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-[var(--gray-400)]">
              No session activity recorded yet.
            </p>
          )}
          {byInstitution.map((b) => (
            <div key={b.institutionId} className="px-4 py-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--gray-900)]">{b.name}</p>
                <p className="text-xs font-bold text-[var(--gray-500)]">{b.sessions}</p>
              </div>
              <div className="h-2 rounded-full bg-[var(--gray-100)]">
                <div
                  className="h-2 rounded-full bg-[var(--primary)]"
                  style={{ width: `${Math.max(4, (b.sessions / maxSessions) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PlatformAdminSectionPage>
  );
}