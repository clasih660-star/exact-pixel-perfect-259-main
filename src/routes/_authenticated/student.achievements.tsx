import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/achievements")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Student"
      title="Achievements"
      description="Motivation badges and learning milestones are ready here without crowding the learning flow."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open progress", to: "/student/progress" }}
      items={[
        {
          label: "Consistent Learner",
          to: "/student/progress",
          description: "Celebrate streaks and regular practice.",
        },
        {
          label: "Quick Learner",
          to: "/student/progress",
          description: "Recognize fast and accurate progress.",
        },
        {
          label: "Quiz Master",
          to: "/student/quizzes",
          description: "Track strong quiz performance over time.",
        },
      ]}
    />
  ),
});
