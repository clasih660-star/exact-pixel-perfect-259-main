import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/activity")({
  component: () => (
    <RouteStubPage
      title="Platform Activity"
      description="Recent platform-wide activity"
      role="Platform Admin"
      items={[]}
    />
  ),
});
