import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Clock, FileText, Search } from "lucide-react";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { listPlatformLessons } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/lessons")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminLessonsPage,
  head: () => ({
    meta: [
      { title: "Lessons — Platform Admin" },
      { name: "description", content: "Browse every lesson across courses" },
    ],
  }),
});

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

function AdminLessonsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const listLessons = useServerFn(listPlatformLessons);

  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-lessons", { search, status }],
    queryFn: () => listLessons({ data: { search: search || undefined, status: status || undefined } }),
    staleTime: 15000,
  });

  const total = data?.total ?? 0;
  const rows = data?.rows ?? [];
  const courses = new Set(rows.map((l) => l.courseId).filter(Boolean)).size;
  const durations = rows.map((l) => l.durationMinutes ?? 0).filter((d) => d > 0);
  const avgDuration =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

  return (
    <PlatformAdminSectionPage
      activePath="/admin/lessons"
      title="Lessons"
      label="Platform content"
      subtitle="Browse every lesson across all courses and institutions."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No lessons found"
      emptyDescription="Adjust your search or filters, or check that lessons exist in the database."
    >
      {/* KPI summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <SummaryTile label="Total lessons" value={total} />
        <SummaryTile label="Courses" value={courses} />
        <SummaryTile
          label="Avg duration"
          value={avgDuration > 0 ? `${avgDuration} min` : "—"}
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lesson title..."
            className="w-full rounded-xl border border-[var(--gray-200)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)] focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm text-[var(--gray-900)] focus:border-[var(--primary)] focus:outline-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <tr>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {rows.map((l) => (
                <tr key={l.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--gray-400)]" />
                      <div>
                        <p className="font-semibold text-[var(--gray-900)]">{l.title}</p>
                        {l.objective && (
                          <p className="max-w-md truncate text-xs text-[var(--gray-500)]">
                            {l.objective}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">
                    {l.courseTitle ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">
                    {l.institutionName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">
                    {l.durationMinutes ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[var(--gray-400)]" />
                        {l.durationMinutes} min
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        l.status === "Published" ? "success" : l.status === "Archived" ? "neutral" : "default"
                      }
                    >
                      {l.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--gray-500)]">
        Need the course list?{" "}
        <Link to="/admin/courses" className="font-semibold text-[var(--primary)] hover:underline">
          Browse all courses →
        </Link>
      </p>
    </PlatformAdminSectionPage>
  );
}

function SummaryTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{value}</p>
    </div>
  );
}