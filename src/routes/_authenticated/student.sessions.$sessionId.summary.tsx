import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/sessions/$sessionId/summary")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Student"
      title="Session Summary"
      description="A session recap route for lessons, key points, questions, and follow-up work."
      primary={{ label: "Back to sessions", to: "/student/sessions" }}
      secondary={{ label: "Open dashboard", to: "/student/dashboard" }}
      items={[
        {
          label: "Lesson recap",
          to: "/student/sessions",
          description: "Review the topic, highlights, and outcome.",
        },
        {
          label: "Mistakes and feedback",
          to: "/student/progress",
          description: "Track common errors and where to improve.",
        },
        {
          label: "Continue learning",
          to: "/classroom/session/session-demo",
          description: "Return to a live classroom flow if needed.",
        },
      ]}
    />
  ),
});
