import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/programmes/$programmeId")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      title="Programme"
      description="View programme details and courses"
      role="Institution Admin"
      items={[]}
    />
  ),
});
