import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { listPlatformSupportTickets } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/support")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminSupportPage,
  head: () => ({
    meta: [
      { title: "Support — Platform Admin" },
      { name: "description", content: "Platform support tickets" },
    ],
  }),
});

function AdminSupportPage() {
  const listTickets = useServerFn(listPlatformSupportTickets);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-support"],
    queryFn: () => listTickets(),
    staleTime: 30000,
  });

  const total = data?.total ?? 0;
  const rows = data?.rows ?? [];

  return (
    <PlatformAdminSectionPage
      activePath="/admin/support"
      title="Support"
      label="Tickets"
      subtitle="User-reported support requests and issues across the platform."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No support tickets"
      emptyDescription="Support tickets submitted by users will appear here."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Total tickets
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{total}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Open
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {rows.filter((r) => r.status === "Open").length}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Resolved
          </p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {rows.filter((r) => r.status === "Resolved" || r.status === "Closed").length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {rows.map((t) => (
                <tr key={t.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3 font-semibold text-[var(--gray-900)]">{t.subject}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        t.status === "Resolved" || t.status === "Closed"
                          ? "success"
                          : t.status === "Open"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {t.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        t.priority === "High" || t.priority === "Critical"
                          ? "error"
                          : t.priority === "Medium"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {t.priority}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
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