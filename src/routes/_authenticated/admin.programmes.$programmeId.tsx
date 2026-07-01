import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/programmes/$programmeId")({
  component: () => (
    <RouteStubPage
      title="Programme Detail"
      description="View programme details"
      role="Platform Admin"
      items={[]}
    />
  ),
});
