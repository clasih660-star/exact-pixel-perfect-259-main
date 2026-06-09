import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/institutions/$institutionId/users")({
  component: () => (
    <RouteStubPage
      title="Institution Users"
      description="Manage institution members"
      role="Platform Admin"
      items={[]}
    />
  ),
});
