import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/teachers")({
  component: () => (
    <RouteStubPage
      title="Course Teachers"
      description="Manage teachers assigned to this course"
      role="Institution Admin"
      items={[]}
    />
  ),
});
