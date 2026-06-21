import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { getPlatformRealtime } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/realtime")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminRealtimePage,
  head: () => ({
    meta: [
      { title: "Realtime — Platform Admin" },
      { name: "description", content: "Live realtime presence and active sessions" },
    ],
  }),
});

function AdminRealtimePage() {
  const getRealtime = useServerFn(getPlatformRealtime);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-realtime"],
    queryFn: () => getRealtime(),
    staleTime: 5000,
    refetchInterval: 10000,
  });

  const onlineUsers = data?.onlineUsers ?? 0;
  const onlineInstitutions = data?.onlineInstitutions ?? 0;
  const liveSessions = data?.liveSessions ?? [];

  return (
    <PlatformAdminSectionPage
      activePath="/admin/realtime"
      title="Realtime"
      label="Live presence"
      subtitle="Currently online users, active institutions, and live classroom sessions."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && liveSessions.length === 0 && onlineUsers === 0}
      emptyTitle="No live activity right now"
      emptyDescription="Online users and live sessions will appear here as they happen."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
            Online users
          </p>
          <p className="mt-2 text-3xl font-bold text-green-700">{onlineUsers}</p>
          <p className="mt-1 text-xs text-green-600">Active in the last 15 minutes</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Institutions live
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--gray-900)]">{onlineInstitutions}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Live sessions
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--gray-900)]">{liveSessions.length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--gray-700)]">
            Live classroom sessions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <tr>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {liveSessions.map((s) => (
                <tr key={s.id} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3 font-semibold text-[var(--gray-900)]">{s.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant="success">{s.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--gray-500)]">
                    {s.institutionId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--gray-500)]">
                    {s.startedAt ? new Date(s.startedAt).toLocaleTimeString() : "—"}
                  </td>
                </tr>
              ))}
              {liveSessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--gray-400)]">
                    No live sessions right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PlatformAdminSectionPage>
  );
}