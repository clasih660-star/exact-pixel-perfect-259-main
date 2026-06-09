import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/institutions/$institutionId/activity")({
  component: () => (
    <RouteStubPage
      title="Institution Activity"
      description="View institution activity log"
      role="Platform Admin"
      items={[]}
    />
  ),
});
