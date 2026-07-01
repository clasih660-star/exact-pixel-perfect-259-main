import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/enrollments")({
  component: () => (
    <RouteStubPage
      title="Enrollments"
      description="Manage course enrollments"
      role="Institution Admin"
      items={[]}
    />
  ),
});
