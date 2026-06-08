import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/messages")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Messages"
      description="Teacher messages, institution updates, and AI conversation history are prepared here."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Notifications", to: "/student/notifications" }}
      items={[
        {
          label: "Teacher messages",
          to: "/student/messages",
          description: "Read messages from your teachers.",
        },
        {
          label: "Institution announcements",
          to: "/student/messages",
          description: "See updates from your institution.",
        },
        {
          label: "AI session history",
          to: "/student/messages",
          description: "Review past conversations and prompts.",
        },
      ]}
    />
  ),
});
