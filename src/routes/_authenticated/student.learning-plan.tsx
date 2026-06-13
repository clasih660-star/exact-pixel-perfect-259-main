import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/learning-plan")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Student"
      title="Learning Plan"
      description="Customize your learning plan, pick priorities, and keep the next session focused on what matters most."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open access settings", to: "/student/access" }}
      items={[
        {
          label: "Prioritize weak topics",
          to: "/student/learning-plan",
          description: "Move factoring, review, or practice to the top of today's plan.",
        },
        {
          label: "Balance lesson and quiz time",
          to: "/student/learning-plan",
          description: "Tune how much of today is teaching, practice, and quick checks.",
        },
        {
          label: "Adjust your pace",
          to: "/student/access",
          description: "Set captions, speech rate, and focus mode before entering class.",
        },
      ]}
    />
  ),
});
