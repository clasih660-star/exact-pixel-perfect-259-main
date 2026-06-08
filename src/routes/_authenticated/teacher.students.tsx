import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/students")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Students"
      description="Learner lists, progress alerts, and follow-up views are prepared for teachers."
      primary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      secondary={{ label: "Analytics", to: "/teacher/analytics" }}
      items={[
        {
          label: "Struggling students",
          to: "/teacher/analytics",
          description: "Identify learners who need intervention.",
        },
        {
          label: "Quiz scores",
          to: "/teacher/analytics",
          description: "Review low scores and improvement trends.",
        },
        {
          label: "Incomplete lessons",
          to: "/teacher/analytics",
          description: "See who has not finished the current lesson.",
        },
      ]}
    />
  ),
});
