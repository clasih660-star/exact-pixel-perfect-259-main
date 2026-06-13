import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/institutions")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: () => (
    <RouteStubPage
      role="Platform Admin"
      title="Institutions"
      description="Manage every institution on the platform — review status, suspend accounts, and inspect usage."
      primary={{ label: "Platform dashboard", to: "/admin/platform" }}
      secondary={{ label: "Usage", to: "/admin/usage" }}
      items={[
        {
          label: "Active institutions",
          to: "/admin/platform",
          description: "Browse organizations currently using Klassruum.",
        },
        {
          label: "Plans & billing",
          to: "/admin/plans",
          description: "See which plan each institution is subscribed to.",
        },
        {
          label: "Platform usage",
          to: "/admin/usage",
          description: "AI, storage, and session usage per institution.",
        },
      ]}
    />
  ),
});
