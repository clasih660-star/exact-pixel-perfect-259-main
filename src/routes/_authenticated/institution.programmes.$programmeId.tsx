import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/programmes/$programmeId")({
  component: () => (
    <RouteStubPage
      title="Programme"
      description="View programme details and courses"
      role="Institution Admin"
      items={[]}
    />
  ),
});
