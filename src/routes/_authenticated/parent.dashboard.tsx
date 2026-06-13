import { createFileRoute } from "@tanstack/react-router";
import { ParentDashboard } from "@/components/dashboard/parent/ParentDashboard";
import { requireParent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/parent/dashboard")({
  beforeLoad: (ctx) => requireParent(ctx.context),
  component: ParentDashboard,
  head: () => ({
    meta: [
      { title: "Parent Dashboard — Klassruum" },
      { name: "description", content: "Parent portal for learner monitoring" },
    ],
  }),
});