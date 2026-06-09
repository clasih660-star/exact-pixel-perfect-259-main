import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/programmes/$programmeId/analytics")({
  component: () => (
    <RouteStubPage
      title="Programme Analytics"
      description="Programme performance analytics"
      role="Institution Admin"
      items={[]}
    />
  ),
});
