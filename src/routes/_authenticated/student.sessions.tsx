import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/sessions")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Sessions"
      description="Past and upcoming classroom sessions are organized here for quick review and re-entry."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open calendar", to: "/student/calendar" }}
      items={[
        {
          label: "Recent session summary",
          to: "/student/sessions/session-demo/summary",
          description: "Open the recap for a completed class.",
        },
        {
          label: "Live session",
          to: "/classroom/session/session-demo",
          description: "Continue the demo classroom while it is active.",
        },
        {
          label: "Scheduled session",
          to: "/student/calendar",
          description: "See what is coming next on your timetable.",
        },
      ]}
    />
  ),
});
