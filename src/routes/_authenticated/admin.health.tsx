import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/health")({
  component: () => (
    <RouteStubPage
      role="Platform Admin"
      title="System Health"
      description="Monitor uptime, service status, and platform performance metrics in real time."
      primary={{ label: "Platform dashboard", to: "/admin/platform" }}
      secondary={{ label: "Usage", to: "/admin/usage" }}
      items={[
        {
          label: "Service status",
          to: "/admin/health",
          description: "API, database, video, and storage health.",
        },
        {
          label: "Incidents",
          to: "/admin/support",
          description: "Active and recent platform incidents.",
        },
        {
          label: "Usage load",
          to: "/admin/usage",
          description: "Resource consumption driving system load.",
        },
      ]}
    />
  ),
});
