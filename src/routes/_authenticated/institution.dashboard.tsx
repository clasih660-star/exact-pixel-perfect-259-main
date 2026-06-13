import { createFileRoute } from "@tanstack/react-router";
import { requireInstitutionAdmin } from "@/lib/route-guards";
import InstitutionDashboard from "@/components/dashboard/institution/InstitutionDashboard";

export const Route = createFileRoute("/_authenticated/institution/dashboard")({
  beforeLoad: (ctx) => requireInstitutionAdmin(ctx.context),
  component: InstitutionDashboard,
  head: () => ({
    meta: [
      { title: "Institution Dashboard — Klassruum" },
      { name: "description", content: "Manage programmes, courses, teachers, students, and learning materials." },
    ],
  }),
});
