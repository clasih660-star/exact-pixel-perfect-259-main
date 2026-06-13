import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/courses/$courseId/progress")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: () => (
    <RouteStubPage
      title="Course Progress"
      description="Track your progress in this course"
      role="Learner"
      items={[]}
    />
  ),
});
