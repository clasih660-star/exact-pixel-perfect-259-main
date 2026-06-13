import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireParent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/parent/reports")({
  beforeLoad: (ctx) => requireParent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Parent"
      title="Reports"
      description="Download and review progress, attendance, and performance reports for your learners."
      primary={{ label: "Parent dashboard", to: "/parent/dashboard" }}
      secondary={{ label: "Progress", to: "/parent/progress" }}
      items={[
        {
          label: "Progress reports",
          to: "/parent/progress",
          description: "Weekly and monthly progress summaries.",
        },
        {
          label: "Quiz performance",
          to: "/parent/progress",
          description: "Score breakdowns per subject.",
        },
        {
          label: "Teacher feedback",
          to: "/parent/messages",
          description: "Notes and feedback shared by teachers.",
        },
      ]}
    />
  ),
});
