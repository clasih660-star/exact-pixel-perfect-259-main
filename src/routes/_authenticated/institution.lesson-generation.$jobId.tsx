import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/lesson-generation/$jobId")({
  component: () => (
    <RouteStubPage
      title="Generation Job"
      description="View and review generated lessons"
      role="Institution Admin"
      items={[]}
    />
  ),
});
