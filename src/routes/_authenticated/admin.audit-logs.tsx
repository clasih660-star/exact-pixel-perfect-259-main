import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { listPlatformAuditLogs } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/audit-logs")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminAuditLogsPage,
  head: () => ({
    meta: [
      { title: "Audit Logs — Platform Admin" },
      { name: "description", content: "Platform audit trail" },
    ],
  }),
});

function AdminAuditLogsPage() {
  const getLogs = useServerFn(listPlatformAuditLogs);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-audit-logs"],
    queryFn: () => getLogs({ data: { limit: 100 } }),
    staleTime: 30000,
  });

  const rows = data?.rows ?? [];

  return (
    <PlatformAdminSectionPage
      activePath="/admin/audit-logs"
      title="Audit Logs"
      label="Security"
      subtitle="Immutable record of administrative and system actions across the platform."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No audit entries"
      emptyDescription="Administrative actions will be logged here once recorded."
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {rows.map((l) => (
                <tr key={l.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-[var(--gray-100)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--gray-700)]">
                      {l.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">{l.resourceType}</td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">{l.summary}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-[var(--gray-500)]">
                      {l.actorUserId ?? "system"}
                    </p>
                    {l.actorRole && (
                      <p className="text-xs text-[var(--gray-400)]">{l.actorRole}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {l.createdAt ? new Date(l.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PlatformAdminSectionPage>
  );
}