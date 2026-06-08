import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/teachers")({
  component: () => (
    <RouteStubPage
      role="Institution"
      title="Teachers"
      description="Prepare teacher invitations, course assignment, and staff management."
      primary={{ label: "Institution dashboard", to: "/institution/dashboard" }}
      secondary={{ label: "Courses", to: "/institution/courses" }}
      items={[
        {
          label: "Invite teacher",
          to: "/institution/teachers",
          description: "Add a teacher to the institution.",
        },
        {
          label: "Assign courses",
          to: "/institution/courses",
          description: "Map teachers to the classes they manage.",
        },
        {
          label: "View staff activity",
          to: "/institution/activity",
          description: "Keep track of teacher contributions.",
        },
      ]}
    />
  ),
});
