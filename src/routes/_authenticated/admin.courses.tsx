import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Search } from "lucide-react";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { listPlatformCourses } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/courses")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminCoursesPage,
  head: () => ({
    meta: [
      { title: "Courses — Platform Admin" },
      { name: "description", content: "Browse every course across institutions" },
    ],
  }),
});

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const listCourses = useServerFn(listPlatformCourses);

  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-courses", { search, status }],
    queryFn: () => listCourses({ data: { search: search || undefined, status: status || undefined } }),
    staleTime: 15000,
  });

  const total = data?.total ?? 0;
  const rows = data?.rows ?? [];
  const institutions = new Set(rows.map((c) => c.institutionId).filter(Boolean)).size;
  const subjects = new Set(rows.map((c) => c.subject).filter(Boolean)).size;

  return (
    <PlatformAdminSectionPage
      activePath="/admin/courses"
      title="Courses"
      label="Platform catalog"
      subtitle="Browse every course created across all institutions and programmes."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No courses found"
      emptyDescription="Adjust your search or filters, or check that courses exist in the database."
      actions={[
        { label: "KingPin catalog", to: "/admin/kingpin-courses", variant: "outline" },
      ]}
    >
      {/* KPI summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <SummaryTile label="Total courses" value={total} />
        <SummaryTile label="Institutions" value={institutions} />
        <SummaryTile label="Subjects" value={subjects} />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course title..."
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
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {rows.map((c) => (
                <tr key={c.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[var(--gray-400)]" />
                      <div>
                        <p className="font-semibold text-[var(--gray-900)]">{c.title}</p>
                        {c.level && (
                          <p className="text-xs text-[var(--gray-500)]">{c.level}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">
                    {c.institutionName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">{c.subject ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        c.status === "Published" ? "success" : c.status === "Archived" ? "neutral" : "default"
                      }
                    >
                      {c.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--gray-500)]">
        Looking for KingPin-owned content?{" "}
        <Link
          to="/admin/kingpin-courses"
          className="font-semibold text-[var(--primary)] hover:underline"
        >
          Open the KingPin catalog →
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