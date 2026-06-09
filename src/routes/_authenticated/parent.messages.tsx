import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/parent/messages")({
  component: () => (
    <RouteStubPage
      role="Parent"
      title="Messages"
      description="Stay in touch with your learners' teachers and read feedback on their progress."
      primary={{ label: "Parent dashboard", to: "/parent/dashboard" }}
      secondary={{ label: "Reports", to: "/parent/reports" }}
      items={[
        {
          label: "Teacher messages",
          to: "/parent/messages",
          description: "Conversations with each learner's teachers.",
        },
        {
          label: "Learners",
          to: "/parent/learners",
          description: "Pick a child to message about.",
        },
        {
          label: "Reports",
          to: "/parent/reports",
          description: "Feedback attached to progress reports.",
        },
      ]}
    />
  ),
});
