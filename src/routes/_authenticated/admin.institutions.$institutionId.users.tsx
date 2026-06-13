import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/institutions/$institutionId/users")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: () => (
    <RouteStubPage
      title="Institution Users"
      description="Manage institution members"
      role="Platform Admin"
      items={[]}
    />
  ),
});
