import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { listPlatformPlans } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/plans")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminPlansPage,
  head: () => ({
    meta: [
      { title: "Plans — Platform Admin" },
      { name: "description", content: "Subscription plans and billing" },
    ],
  }),
});

function AdminPlansPage() {
  const getPlans = useServerFn(listPlatformPlans);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-plans"],
    queryFn: () => getPlans(),
    staleTime: 60000,
  });

  const rows = data?.rows ?? [];
  const subscriptions = data?.subscriptions ?? 0;

  return (
    <PlatformAdminSectionPage
      activePath="/admin/plans"
      title="Plans"
      label="Billing"
      subtitle="Subscription tiers available to institutions and their uptake."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No plans configured"
      emptyDescription="Subscription plans will appear here once defined in the database."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Total plans
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Active subscriptions
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{subscriptions}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((p) => {
          const price = (p.amountMinor / 100).toFixed(2);
          return (
            <div
              key={p.id}
              className={
                "rounded-2xl border bg-white p-5 " +
                (p.highlight ? "border-[var(--primary)] shadow-sm" : "border-[var(--gray-200)]")
              }
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)]">{p.name}</h3>
                  <p className="font-mono text-xs text-[var(--gray-500)]">{p.slug}</p>
                </div>
                {p.highlight && <StatusBadge variant="info">Highlighted</StatusBadge>}
              </div>

              <p className="mt-3 text-3xl font-bold text-[var(--gray-900)]">
                {p.currency} {price}
                <span className="text-sm font-normal text-[var(--gray-500)]">/{p.interval}</span>
              </p>

              {p.description && (
                <p className="mt-2 text-sm text-[var(--gray-500)]">{p.description}</p>
              )}

              {p.features.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--gray-600)]">
                      <span className="mt-1 text-[var(--primary)]">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </PlatformAdminSectionPage>
  );
}