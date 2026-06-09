import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/sessions/new")({
  component: () => (
    <RouteStubPage
      title="Start Session"
      description="Start a new classroom session"
      role="Teacher"
      items={[]}
    />
  ),
});
