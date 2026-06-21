import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { listPlatformUsers } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminUsersPage,
  head: () => ({
    meta: [
      { title: "Users — Platform Admin" },
      { name: "description", content: "Manage all platform users" },
    ],
  }),
});

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "platform_admin", label: "Platform Admin" },
  { value: "institution_admin", label: "Institution Admin" },
  { value: "owner", label: "Owner" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
];

function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const listUsers = useServerFn(listPlatformUsers);

  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-users", { search, role }],
    queryFn: () => listUsers({ data: { search: search || undefined, role: role || undefined } }),
    staleTime: 15000,
  });

  const total = data?.total ?? 0;
  const breakdown = data?.roleBreakdown ?? {};
  const rows = data?.rows ?? [];

  const breakdownSummary = useMemo(
    () =>
      Object.entries(breakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6),
    [breakdown],
  );

  return (
    <PlatformAdminSectionPage
      activePath="/admin/users"
      title="Users"
      label="Platform directory"
      subtitle="Search and manage every user across roles and institutions."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No users found"
      emptyDescription="Adjust your search or filters, or check that users exist in the database."
    >
      {/* KPI summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Total users
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{total}</p>
        </div>
        {breakdownSummary.map(([key, count]) => (
          <div
            key={key}
            className="rounded-2xl border border-[var(--gray-200)] bg-white p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
              {key.replace(/_/g, " ")}
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-[var(--gray-200)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)] focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm text-[var(--gray-900)] focus:border-[var(--primary)] focus:outline-none"
        >
          {ROLE_OPTIONS.map((opt) => (
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
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {rows.map((u) => (
                <tr key={u.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[var(--gray-900)]">{u.fullName}</p>
                    <p className="text-xs text-[var(--gray-500)]">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        u.role === "platform_admin"
                          ? "info"
                          : u.role === "owner" || u.role === "institution_admin"
                            ? "success"
                            : u.role === "teacher"
                              ? "default"
                              : "neutral"
                      }
                    >
                      {u.role.replace(/_/g, " ")}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">
                    {u.teacherType ?? u.learnerType ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
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