import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/generate-lessons")({
  component: () => (
    <RouteStubPage
      title="Generate Lessons"
      description="AI lesson generation for this course"
      role="Teacher"
      items={[]}
    />
  ),
});
