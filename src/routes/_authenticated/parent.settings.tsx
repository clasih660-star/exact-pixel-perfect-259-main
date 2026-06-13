import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireParent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/parent/settings")({
  beforeLoad: (ctx) => requireParent(ctx.context),
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
