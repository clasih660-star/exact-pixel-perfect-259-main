import { createFileRoute } from "@tanstack/react-router";
import { requireInstitutionAdmin } from "@/lib/route-guards";
import { InstitutionBillingPage } from "@/components/billing/InstitutionBillingPage";

export const Route = createFileRoute("/_authenticated/institution/billing")({
  beforeLoad: async (ctx) => {
    await requireInstitutionAdmin(ctx.context);
    return {};
  },
  component: BillingRoute,
});

function BillingRoute() {
  const context = Route.useRouteContext() as Record<string, unknown>;
  const institutionId = (context.institutionId as string) ?? "demo-institution";
  return <InstitutionBillingPage institutionId={institutionId} />;
}
