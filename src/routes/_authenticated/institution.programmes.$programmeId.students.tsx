import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/programmes/$programmeId/students")({
  component: () => (
    <RouteStubPage
      title="Programme Students"
      description="View students enrolled in this programme"
      role="Institution Admin"
      items={[]}
    />
  ),
});
