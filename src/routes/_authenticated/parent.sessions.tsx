import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireParent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/parent/sessions")({
  beforeLoad: (ctx) => requireParent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Parent"
      title="Sessions"
      description="See completed and upcoming classroom sessions for each of your learners."
      primary={{ label: "Parent dashboard", to: "/parent/dashboard" }}
      secondary={{ label: "Progress", to: "/parent/progress" }}
      items={[
        {
          label: "Upcoming sessions",
          to: "/parent/sessions",
          description: "Scheduled classes across your learners.",
        },
        {
          label: "Completed sessions",
          to: "/parent/sessions",
          description: "Lessons attended and their outcomes.",
        },
        {
          label: "Reports",
          to: "/parent/reports",
          description: "Session-based progress reports.",
        },
      ]}
    />
  ),
});
