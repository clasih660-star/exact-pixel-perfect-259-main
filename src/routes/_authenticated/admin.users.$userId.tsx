import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/users/$userId")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: () => (
    <RouteStubPage
      title="User Detail"
      description="View and manage user details"
      role="Platform Admin"
      items={[]}
    />
  ),
});
