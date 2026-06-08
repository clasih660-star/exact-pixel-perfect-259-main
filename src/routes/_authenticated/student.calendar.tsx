import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/calendar")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Calendar"
      description="Keep track of upcoming sessions, reminders, quizzes, and assignments from one place."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "View sessions", to: "/student/sessions" }}
      items={[
        {
          label: "Upcoming lessons",
          to: "/student/sessions",
          description: "View what is scheduled next and when it starts.",
        },
        {
          label: "Quiz reminders",
          to: "/student/quizzes",
          description: "See any quizzes that need attention this week.",
        },
        {
          label: "Assignment due dates",
          to: "/student/assignments",
          description: "Track work that still needs to be submitted.",
        },
      ]}
    />
  ),
});
