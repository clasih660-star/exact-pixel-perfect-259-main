import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { listPlatformLessonGenerationJobs } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/lesson-generation")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminLessonGenerationPage,
  head: () => ({
    meta: [
      { title: "Lesson Generation — Platform Admin" },
      { name: "description", content: "AI lesson generation jobs across the platform" },
    ],
  }),
});

function AdminLessonGenerationPage() {
  const [status, setStatus] = useState("");
  const listJobs = useServerFn(listPlatformLessonGenerationJobs);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-lesson-generation", status],
    queryFn: () => listJobs({ data: { status: status || undefined } }),
    staleTime: 10000,
    refetchInterval: 15000,
  });

  const total = data?.total ?? 0;
  const rows = data?.rows ?? [];
  const completed = rows.filter((r) => r.rawStatus === "completed" || r.rawStatus === "succeeded").length;
  const failed = rows.filter((r) => r.rawStatus === "failed" || r.rawStatus === "error").length;

  return (
    <PlatformAdminSectionPage
      activePath="/admin/lesson-generation"
      title="Lesson Generation"
      label="AI jobs"
      subtitle="Every AI lesson generation job running across institutions, with live status."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No generation jobs yet"
      emptyDescription="AI lesson generation jobs will appear here once courses start generating."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Total jobs
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{total}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Completed
          </p>
          <p className="mt-2 text-2xl font-bold text-green-600">{completed}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Failed
          </p>
          <p className="mt-2 text-2xl font-bold text-red-600">{failed}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            In progress
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {rows.filter((r) => r.rawStatus === "running" || r.rawStatus === "pending" || r.rawStatus === "queued").length}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm text-[var(--gray-900)] focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <tr>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {rows.map((j) => (
                <tr key={j.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--gray-500)]">{j.id}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        j.rawStatus === "completed" || j.rawStatus === "succeeded"
                          ? "success"
                          : j.rawStatus === "failed" || j.rawStatus === "error"
                            ? "error"
                            : "warning"
                      }
                    >
                      {j.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">
                    {j.generated}/{j.requested}
                    {j.error && (
                      <p className="mt-1 line-clamp-1 text-xs text-red-500">{j.error}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--gray-500)]">
                    {j.courseId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {j.createdAt ? new Date(j.createdAt).toLocaleString() : "—"}
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