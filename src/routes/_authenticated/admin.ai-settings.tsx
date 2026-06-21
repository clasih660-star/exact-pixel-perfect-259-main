import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlatformAdminSectionPage } from "@/components/dashboard/platform/PlatformAdminSectionPage";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { getPlatformAiSettings } from "@/lib/admin.functions";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/ai-settings")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: AdminAiSettingsPage,
  head: () => ({
    meta: [
      { title: "AI Settings — Platform Admin" },
      { name: "description", content: "AI provider configuration" },
    ],
  }),
});

function AdminAiSettingsPage() {
  const getSettings = useServerFn(getPlatformAiSettings);
  const { data, isLoading, error } = useQuery({
    queryKey: ["platform-ai-settings"],
    queryFn: () => getSettings(),
    staleTime: 60000,
  });

  const providers = data?.providers ?? [];
  const teacherVoice = data?.teacherVoice;

  return (
    <PlatformAdminSectionPage
      activePath="/admin/ai-settings"
      title="AI Settings"
      label="Providers"
      subtitle="Runtime view of configured AI providers and voice settings."
      loading={isLoading}
      error={(error as Error | null)?.message ?? null}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Default provider
          </p>
          <p className="mt-2 text-2xl font-bold capitalize text-[var(--gray-900)]">
            {data?.defaultProvider ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Max tokens
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">{data?.maxTokens ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
            Teacher voice
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--gray-900)]">
            {teacherVoice?.enabled ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--gray-700)]">
            Configured providers
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <tr>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Base URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {providers.map((p) => (
                <tr key={p.name} className="transition hover:bg-[var(--gray-50)]">
                  <td className="px-4 py-3 font-semibold text-[var(--gray-900)]">{p.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={p.configured ? "success" : "neutral"}>
                      {p.configured ? "Configured" : "Not configured"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--gray-500)]">{p.model}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--gray-500)]">{p.baseUrl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {teacherVoice && (
        <div className="mt-6 rounded-2xl border border-[var(--gray-200)] bg-white p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--gray-700)]">
            Teacher voice
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[var(--gray-500)]">Enabled</p>
              <p className="font-semibold text-[var(--gray-900)]">
                {teacherVoice.enabled ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--gray-500)]">Provider</p>
              <p className="font-semibold capitalize text-[var(--gray-900)]">
                {teacherVoice.provider}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--gray-500)]">Voice</p>
              <p className="font-semibold text-[var(--gray-900)]">{teacherVoice.voice}</p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-[var(--gray-400)]">
        AI provider keys and models are configured via environment variables on the server. Update
        them in your deployment settings to change what appears here.
      </p>
    </PlatformAdminSectionPage>
  );
}