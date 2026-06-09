import { createFileRoute } from "@tanstack/react-router";
import { ParentDashboard } from "@/components/dashboard/parent/ParentDashboard";

export const Route = createFileRoute("/_authenticated/parent/dashboard")({
  component: ParentDashboard,
  head: () => ({
    meta: [
      { title: "Parent Dashboard — Klassruum" },
      { name: "description", content: "Parent portal for learner monitoring" },
    ],
  }),
});