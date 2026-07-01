import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/sessions/$sessionId")({
  component: () => (
    <RouteStubPage
      title="Session Detail"
      description="View session details"
      role="Teacher"
      items={[]}
    />
  ),
});
