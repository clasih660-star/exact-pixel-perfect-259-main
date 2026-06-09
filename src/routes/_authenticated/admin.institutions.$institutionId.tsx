import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/institutions/$institutionId")({
  component: () => (
    <RouteStubPage
      title="Institution Detail"
      description="View institution details"
      role="Platform Admin"
      items={[]}
    />
  ),
});
