import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: () => (
    <RouteStubPage
      role="Platform Admin"
      title="Settings"
      description="Configure platform-wide settings, roles, integrations, and operational defaults."
      primary={{ label: "Platform dashboard", to: "/admin/platform" }}
      secondary={{ label: "Plans", to: "/admin/plans" }}
      items={[
        {
          label: "Roles & permissions",
          to: "/admin/users",
          description: "Manage what each role can access.",
        },
        {
          label: "Plans",
          to: "/admin/plans",
          description: "Subscription tiers and feature limits.",
        },
        {
          label: "System health",
          to: "/admin/health",
          description: "Operational status and alerts.",
        },
      ]}
    />
  ),
});
