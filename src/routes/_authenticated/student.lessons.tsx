import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/lessons")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Student"
      title="Lessons"
      description="Browse all lessons in your enrolled courses, then start, continue, or review them."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open courses", to: "/student/courses" }}
      items={[
        {
          label: "Current lesson",
          to: "/student/lessons/lesson-demo",
          description: "Open the lesson you are working through now.",
        },
        {
          label: "Review summary",
          to: "/student/notes",
          description: "Return to the notes and key points for a lesson.",
        },
        {
          label: "Take a quiz",
          to: "/student/quizzes",
          description: "Move into an assessment after finishing the lesson.",
        },
      ]}
    />
  ),
});
