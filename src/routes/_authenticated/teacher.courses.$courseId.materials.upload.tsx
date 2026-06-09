import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/materials/upload")({
  component: () => (
    <RouteStubPage
      title="Upload Material"
      description="Upload new course material"
      role="Teacher"
      items={[]}
    />
  ),
});
