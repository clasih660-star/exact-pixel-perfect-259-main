import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/plans")({
  component: () => (
    <RouteStubPage
      role="Platform Admin"
      title="Plans"
      description="Configure subscription tiers, pricing, and feature limits for institutions."
      primary={{ label: "Platform dashboard", to: "/admin/platform" }}
      secondary={{ label: "Usage", to: "/admin/usage" }}
      items={[
        {
          label: "Subscription tiers",
          to: "/admin/plans",
          description: "Define plan levels and their feature limits.",
        },
        {
          label: "Institutions by plan",
          to: "/admin/institutions",
          description: "See which institutions are on each plan.",
        },
        {
          label: "Revenue overview",
          to: "/admin/platform",
          description: "Track subscription income across the platform.",
        },
      ]}
    />
  ),
});
