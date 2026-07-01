import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { getPlatformSettings } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminSettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — Platform Admin" },
      { name: "description", content: "Platform configuration" },
    ],
  }),
});

function AdminSettingsPage() {
  const getSettings = useServerFn(getPlatformSettings);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: () => getSettings(),
    staleTime: 60000,
  });

  const settings = [
    { label: "Environment", value: data?.environment ?? "—" },
    {
      label: "Supabase",
      value: data?.supabaseConfigured ? "Configured" : "Not configured",
      ok: data?.supabaseConfigured,
    },
    {
      label: "Billing (Paystack)",
      value: data?.billing?.paystackConfigured ? "Configured" : "Not configured",
      ok: data?.billing?.paystackConfigured,
    },
    { label: "App URL", value: data?.appUrl ?? "—", mono: true },
    { label: "Region", value: data?.region ?? "—" },
    { label: "Currency", value: data?.billing?.currency ?? "—" },
  ];

  return (
    <PlatformAdminSectionPage
      activePath="/admin/settings"
      title="Settings"
      label="Configuration"
      subtitle="Runtime configuration and integration status for the platform."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
    >
      {(data?.maintenanceMode || data?.allowDemoMode) && (
        <div className="mb-6 flex flex-wrap gap-3">
          {data?.maintenanceMode && <StatusBadge variant="error">Maintenance mode ON</StatusBadge>}
          {data?.allowDemoMode && <StatusBadge variant="info">Demo mode allowed</StatusBadge>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {settings.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--gray-200)] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
              {s.label}
            </p>
            <p
              className={
                "mt-2 text-lg font-semibold " +
                (s.ok === undefined
                  ? "text-[var(--gray-900)]"
                  : s.ok
                    ? "text-green-600"
                    : "text-amber-600") +
                (s.mono ? " font-mono text-sm" : "")
              }
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-[var(--gray-400)]">
        Platform settings are managed via server environment variables. Update your deployment
        configuration to change these values.
      </p>
    </PlatformAdminSectionPage>
  );
}