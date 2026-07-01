import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { listPlatformInstitutions } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/institutions")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminInstitutionsPage,
  head: () => ({
    meta: [
      { title: "Institutions — Platform Admin" },
      { name: "description", content: "Manage all institutions on the platform" },
    ],
  }),
});

function AdminInstitutionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const listInstitutions = useServerFn(listPlatformInstitutions);

  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-institutions", { search, status }],
    queryFn: () =>
      listInstitutions({ data: { search: search || undefined, status: status || undefined } }),
    staleTime: 15000,
  });

  const total = data?.total ?? 0;
  const rows = data?.rows ?? [];
  const totalMembers = rows.reduce((sum, r) => sum + (r.members ?? 0), 0);

  return (
    <PlatformAdminSectionPage
      activePath="/admin/institutions"
      title="Institutions"
      label="Organizations"
      subtitle="All institutions on the platform with member counts and subscription status."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No institutions found"
      emptyDescription="Institutions will appear here once they are created or imported."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Total institutions
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{total}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Linked members
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{totalMembers}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            With active subscription
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">
            {rows.filter((r) => r.subscription?.status === "active").length}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search institutions..."
            className="w-full rounded-xl border border-[var(--gray-200)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)] focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm text-[var(--gray-900)] focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="suspended">Suspended</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <tr>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {rows.map((inst) => (
                <tr key={inst.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[var(--gray-900)]">{inst.name}</p>
                    <p className="text-xs text-[var(--gray-500)]">{inst.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        inst.status === "active"
                          ? "success"
                          : inst.status === "suspended"
                            ? "error"
                            : "neutral"
                      }
                    >
                      {inst.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">
                    {inst.subscription?.plan_slug ?? inst.plan ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--gray-900)]">{inst.members}</td>
                  <td className="px-4 py-3 text-[var(--gray-600)]">{inst.country ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : "—"}
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