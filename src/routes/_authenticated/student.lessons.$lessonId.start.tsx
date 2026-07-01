import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/lessons/$lessonId/start")({
  component: () => (
    <RouteStubPage
      title="Start Lesson"
      description="Begin a lesson"
      role="Learner"
      items={[]}
    />
  ),
});
