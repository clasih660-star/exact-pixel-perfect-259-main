import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/analytics")({
  component: () => (
    <RouteStubPage
      role="Institution"
      title="Analytics"
      description="Course performance, student progress, quiz averages, and completion rates are prepared here."
      primary={{ label: "Institution dashboard", to: "/institution/dashboard" }}
      secondary={{ label: "Courses", to: "/institution/courses" }}
      items={[
        {
          label: "Course performance",
          to: "/institution/analytics",
          description: "Compare course outcomes and engagement.",
        },
        {
          label: "Student progress",
          to: "/institution/analytics",
          description: "Monitor completion and mastery trends.",
        },
        {
          label: "Quiz averages",
          to: "/institution/analytics",
          description: "Review score distributions and outcomes.",
        },
      ]}
    />
  ),
});
