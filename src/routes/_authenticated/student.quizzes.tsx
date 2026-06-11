import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/quizzes")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Quizzes"
      description="Review quiz attempts, scores, retakes, and answer breakdowns."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "View progress", to: "/student/progress" }}
      items={[
        {
          label: "Current quiz results",
          to: "/student/quizzes",
          description: "See the latest scores from completed lessons.",
        },
        {
          label: "Retake eligible quizzes",
          to: "/student/quizzes",
          description: "Retry quizzes when the lesson allows it.",
        },
        {
          label: "Review answers",
          to: "/student/quizzes",
          description: "Check which questions were missed and why.",
        },
      ]}
    />
  ),
});
