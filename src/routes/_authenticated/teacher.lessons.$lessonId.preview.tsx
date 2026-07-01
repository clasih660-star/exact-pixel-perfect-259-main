import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/lessons/$lessonId/preview")({
  component: () => (
    <RouteStubPage
      title="Preview Lesson"
      description="Preview lesson as learners see it"
      role="Teacher"
      items={[]}
    />
  ),
});
