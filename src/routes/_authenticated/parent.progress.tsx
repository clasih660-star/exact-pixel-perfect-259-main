import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/parent/progress")({
  component: () => (
    <RouteStubPage
      role="Parent"
      title="Progress"
      description="Track each learner's course progress, quiz scores, and study time over time."
      primary={{ label: "Parent dashboard", to: "/parent/dashboard" }}
      secondary={{ label: "Reports", to: "/parent/reports" }}
      items={[
        {
          label: "Learners",
          to: "/parent/learners",
          description: "Switch between the children on your account.",
        },
        {
          label: "Sessions",
          to: "/parent/sessions",
          description: "Attendance and completed lessons.",
        },
        {
          label: "Reports",
          to: "/parent/reports",
          description: "Detailed performance reports.",
        },
      ]}
    />
  ),
});
