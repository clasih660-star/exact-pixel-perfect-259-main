import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/lesson-generation/$jobId")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      title="Generation Job"
      description="View and review generated lessons"
      role="Institution Admin"
      items={[]}
    />
  ),
});
