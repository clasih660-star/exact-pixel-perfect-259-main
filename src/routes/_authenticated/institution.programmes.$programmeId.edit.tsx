import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/programmes/$programmeId/edit")({
  component: () => (
    <RouteStubPage
      title="Edit Programme"
      description="Edit programme details"
      role="Institution Admin"
      items={[]}
    />
  ),
});
