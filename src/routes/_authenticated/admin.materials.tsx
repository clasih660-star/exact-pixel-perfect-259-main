import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { listPlatformMaterials } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/materials")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminMaterialsPage,
  head: () => ({
    meta: [
      { title: "Materials — Platform Admin" },
      { name: "description", content: "All learning materials across the platform" },
    ],
  }),
});

function AdminMaterialsPage() {
  const [status, setStatus] = useState("");
  const listMaterials = useServerFn(listPlatformMaterials);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-materials", status],
    queryFn: () => listMaterials({ data: { status: status || undefined } }),
    staleTime: 15000,
  });

  const total = data?.total ?? 0;
  const rows = data?.rows ?? [];

  return (
    <PlatformAdminSectionPage
      activePath="/admin/materials"
      title="Materials"
      label="Content library"
      subtitle="All uploaded learning materials and their processing status."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No materials found"
      emptyDescription="Materials uploaded by institutions will appear here."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
              Total materials
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{total}</p>
          </div>
          <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
              Ready
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">
              {rows.filter((r) => r.processingStatus === "Ready").length}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
              Processing / failed
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">
              {rows.filter((r) => r.processingStatus !== "Ready").length}
            </p>
          </div>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm text-[var(--gray-900)] focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="ready">Ready</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <tr>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {rows.map((m) => (
                <tr key={m.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3 font-semibold text-[var(--gray-900)]">{m.title}</td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">{m.type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        m.processingStatus === "Ready"
                          ? "success"
                          : m.processingStatus === "Failed"
                            ? "error"
                            : "warning"
                      }
                    >
                      {m.processingStatus}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--gray-500)]">
                    {m.courseId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—"}
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