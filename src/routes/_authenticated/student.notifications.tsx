import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/notifications")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Student"
      title="Notifications"
      description="Lesson alerts, quiz results, session reminders, messages, and system notices can surface here."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open messages", to: "/student/messages" }}
      items={[
        {
          label: "Quiz result ready",
          to: "/student/quizzes",
          description: "Jump directly to the latest result when grading is done.",
        },
        {
          label: "Upcoming session reminder",
          to: "/student/calendar",
          description: "Remember what starts next and when to join.",
        },
        {
          label: "Teacher message",
          to: "/student/messages",
          description: "Open a reply or continue the conversation.",
        },
      ]}
    />
  ),
});
