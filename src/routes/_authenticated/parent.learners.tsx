import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/parent/learners")({
  component: () => (
    <RouteStubPage
      role="Parent"
      title="Learners"
      description="View the children linked to your account and jump into each learner's progress."
      primary={{ label: "Parent dashboard", to: "/parent/dashboard" }}
      secondary={{ label: "Progress", to: "/parent/progress" }}
      items={[
        {
          label: "Progress",
          to: "/parent/progress",
          description: "Course progress and quiz performance per child.",
        },
        {
          label: "Sessions",
          to: "/parent/sessions",
          description: "Completed and upcoming classroom sessions.",
        },
        {
          label: "Reports",
          to: "/parent/reports",
          description: "Generated progress and performance reports.",
        },
      ]}
    />
  ),
});
