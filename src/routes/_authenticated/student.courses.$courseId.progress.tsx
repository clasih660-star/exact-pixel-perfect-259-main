import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/courses/$courseId/progress")({
  component: () => (
    <RouteStubPage
      title="Course Progress"
      description="Track your progress in this course"
      role="Learner"
      items={[]}
    />
  ),
});
