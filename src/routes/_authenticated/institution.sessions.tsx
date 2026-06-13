import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/sessions")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      role="Institution"
      title="Sessions"
      description="Scheduled, live, and completed classroom sessions are prepared here."
      primary={{ label: "Institution dashboard", to: "/institution/dashboard" }}
      secondary={{ label: "Courses", to: "/institution/courses" }}
      items={[
        {
          label: "Live sessions",
          to: "/institution/sessions",
          description: "Join or supervise active classrooms.",
        },
        {
          label: "Scheduled sessions",
          to: "/institution/sessions",
          description: "Review what is coming next.",
        },
        {
          label: "Completed sessions",
          to: "/institution/sessions",
          description: "Audit what happened and when.",
        },
      ]}
    />
  ),
});
