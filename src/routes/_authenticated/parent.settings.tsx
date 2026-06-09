import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/parent/settings")({
  component: () => (
    <RouteStubPage
      role="Parent"
      title="Settings"
      description="Manage your account, linked learners, notifications, and communication preferences."
      primary={{ label: "Parent dashboard", to: "/parent/dashboard" }}
      secondary={{ label: "Learners", to: "/parent/learners" }}
      items={[
        {
          label: "Linked learners",
          to: "/parent/learners",
          description: "Add or manage the children on your account.",
        },
        {
          label: "Notifications",
          to: "/parent/settings",
          description: "Choose what updates you receive.",
        },
        {
          label: "Messages",
          to: "/parent/messages",
          description: "Communication preferences with teachers.",
        },
      ]}
    />
  ),
});
