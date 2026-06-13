import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/students")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      role="Institution"
      title="Students"
      description="Prepare the student roster, enrollments, and progress review workflows for institutions."
      primary={{ label: "Institution dashboard", to: "/institution/dashboard" }}
      secondary={{ label: "Enrollments", to: "/institution/enrollments" }}
      items={[
        {
          label: "Invite student",
          to: "/institution/students",
          description: "Bring new learners into the institution.",
        },
        {
          label: "View progress",
          to: "/institution/analytics",
          description: "Review learner progress by course or cohort.",
        },
        {
          label: "Manage membership",
          to: "/institution/enrollments",
          description: "Add or remove students from courses.",
        },
      ]}
    />
  ),
});
