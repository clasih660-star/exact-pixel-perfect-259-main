import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/materials")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      title="Course Materials"
      description="Manage materials for assigned course"
      role="Teacher"
      items={[]}
    />
  ),
});
