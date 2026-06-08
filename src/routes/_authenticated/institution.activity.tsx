import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/activity")({
  component: () => (
    <RouteStubPage
      role="Institution"
      title="Recent Activity"
      description="Student enrollments, lesson creation, resource uploads, and session completions can surface here."
      primary={{ label: "Institution dashboard", to: "/institution/dashboard" }}
      secondary={{ label: "Analytics", to: "/institution/analytics" }}
      items={[
        {
          label: "Student enrolled",
          to: "/institution/students",
          description: "See who joined and when.",
        },
        {
          label: "Lesson created",
          to: "/institution/courses",
          description: "Track new lesson preparation.",
        },
        {
          label: "Session completed",
          to: "/institution/sessions",
          description: "Review completed learning moments.",
        },
      ]}
    />
  ),
});
