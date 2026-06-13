import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/support")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: () => (
    <RouteStubPage
      role="Platform Admin"
      title="Support"
      description="Triage and resolve support tickets raised by institutions and users."
      primary={{ label: "Platform dashboard", to: "/admin/platform" }}
      secondary={{ label: "System Health", to: "/admin/health" }}
      items={[
        {
          label: "Open tickets",
          to: "/admin/support",
          description: "Unresolved support requests by priority.",
        },
        {
          label: "System alerts",
          to: "/admin/health",
          description: "Platform incidents that may generate tickets.",
        },
        {
          label: "Institutions",
          to: "/admin/institutions",
          description: "Jump to the institution behind a ticket.",
        },
      ]}
    />
  ),
});
