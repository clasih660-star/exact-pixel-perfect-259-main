import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/sessions")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Sessions"
      description="Scheduled, live, and completed teaching sessions are prepared here."
      primary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      secondary={{ label: "Courses", to: "/teacher/courses" }}
      items={[
        {
          label: "Start class",
          to: "/classroom/session/session-demo",
          description: "Enter the live classroom for a session.",
        },
        {
          label: "Manage session",
          to: "/teacher/sessions",
          description: "Review the list of active or upcoming sessions.",
        },
        {
          label: "Completion review",
          to: "/teacher/analytics",
          description: "See how the last sessions performed.",
        },
      ]}
    />
  ),
});
