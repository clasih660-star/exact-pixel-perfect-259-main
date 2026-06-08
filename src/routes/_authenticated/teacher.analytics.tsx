import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/analytics")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Analytics"
      description="Teacher analytics are prepared for student performance, common mistakes, and lesson completion."
      primary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      secondary={{ label: "Courses", to: "/teacher/courses" }}
      items={[
        {
          label: "Performance overview",
          to: "/teacher/analytics",
          description: "See class-wide trends.",
        },
        {
          label: "Common mistakes",
          to: "/teacher/analytics",
          description: "Track recurring misunderstandings.",
        },
        {
          label: "Progress alerts",
          to: "/teacher/students",
          description: "Follow up with learners who need support.",
        },
      ]}
    />
  ),
});
