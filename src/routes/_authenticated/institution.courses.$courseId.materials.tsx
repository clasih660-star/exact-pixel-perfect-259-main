import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/materials")({
  component: () => (
    <RouteStubPage
      title="Course Materials"
      description="Manage materials for this course"
      role="Institution Admin"
      items={[]}
    />
  ),
});
