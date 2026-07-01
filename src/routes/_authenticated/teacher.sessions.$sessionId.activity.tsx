import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/sessions/$sessionId/activity")({
  component: () => (
    <RouteStubPage
      title="Session Activity"
      description="View session activity log"
      role="Teacher"
      items={[]}
    />
  ),
});
