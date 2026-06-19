import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute(
  "/_authenticated/institution/courses/$courseId/generation-jobs",
)({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      title="Generation Jobs"
      description="View lesson generation jobs for this course"
      role="Institution Admin"
      items={[]}
    />
  ),
});
