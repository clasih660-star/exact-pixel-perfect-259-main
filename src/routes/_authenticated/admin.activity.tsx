import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { listPlatformActivity } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/activity")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminActivityPage,
  head: () => ({
    meta: [
      { title: "Activity — Platform Admin" },
      { name: "description", content: "Recent platform activity" },
    ],
  }),
});

function AdminActivityPage() {
  const getActivity = useServerFn(listPlatformActivity);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-activity"],
    queryFn: () => getActivity({ data: { limit: 50 } }),
    staleTime: 15000,
    refetchInterval: 30000,
  });

  const rows = data?.rows ?? [];

  return (
    <PlatformAdminSectionPage
      activePath="/admin/activity"
      title="Activity"
      label="Live feed"
      subtitle="A merged, time-ordered feed of recent events across the platform."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
      empty={!isLoading && rows.length === 0}
      emptyTitle="No activity yet"
      emptyDescription="Recent platform events will appear here once activity is recorded."
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="divide-y divide-[var(--gray-100)]">
          {rows.map((r) => (
            <div key={r.id} className="flex items-start gap-3 px-4 py-3">
              <div
                className={
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                  (r.type === "institution"
                    ? "bg-[#d1eceb] text-[#1F7C80]"
                    : r.type === "job"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600")
                }
              >
                {r.type === "institution" ? "I" : r.type === "job" ? "J" : "E"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--gray-900)]">{r.title}</p>
                {r.description && (
                  <p className="text-xs text-[var(--gray-500)]">{r.description}</p>
                )}
              </div>
              <p className="shrink-0 text-xs text-[var(--gray-400)]">
                {r.timestamp ? new Date(r.timestamp).toLocaleString() : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PlatformAdminSectionPage>
  );
}