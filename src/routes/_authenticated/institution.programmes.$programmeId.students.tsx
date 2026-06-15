import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute(
  "/_authenticated/institution/programmes/$programmeId/students",
)({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      title="Programme Students"
      description="View students enrolled in this programme"
      role="Institution Admin"
      items={[]}
    />
  ),
});
