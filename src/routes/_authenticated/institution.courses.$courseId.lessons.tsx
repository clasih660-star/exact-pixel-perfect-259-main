import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/lessons")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      title="Course Lessons"
      description="View and manage lessons for this course"
      role="Institution Admin"
      items={[]}
    />
  ),
});
