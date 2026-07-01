import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/lessons")({
  component: () => (
    <RouteStubPage
      title="Course Lessons"
      description="View and manage lessons"
      role="Teacher"
      items={[]}
    />
  ),
});
