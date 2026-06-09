import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/settings")({
  component: () => (
    <RouteStubPage
      title="Course Settings"
      description="Course configuration and settings"
      role="Institution Admin"
      items={[]}
    />
  ),
});
