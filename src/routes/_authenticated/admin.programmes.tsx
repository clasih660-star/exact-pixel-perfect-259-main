import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/programmes")({
  component: () => (
    <RouteStubPage
      title="All Programmes"
      description="View all programmes across institutions"
      role="Platform Admin"
      items={[]}
    />
  ),
});
