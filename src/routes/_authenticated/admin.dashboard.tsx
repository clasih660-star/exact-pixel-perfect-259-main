import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: () => (
    <RouteStubPage
      title="Platform Dashboard"
      description="Overview of the Klassruum platform"
      role="Platform Admin"
      items={[]}
    />
  ),
});
