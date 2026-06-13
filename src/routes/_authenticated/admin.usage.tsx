import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/usage")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: () => (
    <RouteStubPage
      role="Platform Admin"
      title="Usage"
      description="Monitor platform resource consumption — AI, storage, video sessions, and API calls."
      primary={{ label: "Platform dashboard", to: "/admin/platform" }}
      secondary={{ label: "System Health", to: "/admin/health" }}
      items={[
        {
          label: "AI usage",
          to: "/admin/usage",
          description: "Token and request consumption across institutions.",
        },
        {
          label: "Storage usage",
          to: "/admin/usage",
          description: "Resource and media storage consumption.",
        },
        {
          label: "Session usage",
          to: "/admin/usage",
          description: "Live and recorded classroom session minutes.",
        },
      ]}
    />
  ),
});
