import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/users/$userId")({
  component: () => (
    <RouteStubPage
      title="User Detail"
      description="View and manage user details"
      role="Platform Admin"
      items={[]}
    />
  ),
});
