import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/sessions/new")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      role="Institution Admin"
      title="Start Classroom"
      description="A route prepared for scheduling or launching a new classroom session for a course."
      primary={{ label: "Sessions", to: "/institution/sessions" }}
      secondary={{ label: "Courses", to: "/institution/courses" }}
      items={[
        {
          label: "Active sessions",
          to: "/institution/sessions",
          description: "Live and scheduled classrooms.",
        },
        {
          label: "Courses",
          to: "/institution/courses",
          description: "Choose a course to start a session for.",
        },
        {
          label: "Resources",
          to: "/institution/resources",
          description: "Attach materials to the new session.",
        },
      ]}
    />
  ),
});
