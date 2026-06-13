import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/ai-lesson/new")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Student"
      title="Start a New AI Lesson"
      description="This route is ready for the topic prompt modal that launches a fresh AI-driven classroom session."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open classrooms", to: "/student/classrooms" }}
      items={[
        {
          label: "Choose a topic",
          to: "/student/ai-lesson/new",
          description: "Type what you want to learn next.",
        },
        {
          label: "Launch session",
          to: "/classroom/session/session-demo",
          description: "Enter a classroom flow once the lesson starts.",
        },
        {
          label: "Use focus tools",
          to: "/student/access",
          description: "Keep captions, focus mode, and pace settings visible.",
        },
      ]}
    />
  ),
});
