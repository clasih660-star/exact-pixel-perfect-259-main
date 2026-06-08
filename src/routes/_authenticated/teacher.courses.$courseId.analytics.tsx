import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/analytics")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Course Analytics"
      description="A route prepared for course-specific performance, weak topics, and student progress alerts."
      primary={{ label: "Back to course", to: "/teacher/courses/course-demo" }}
      secondary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      items={[
        {
          label: "Weak topics",
          to: "/teacher/analytics",
          description: "See where students need support.",
        },
        {
          label: "Low quiz scores",
          to: "/teacher/analytics",
          description: "Review performance by topic and attempt.",
        },
        {
          label: "Incomplete lessons",
          to: "/teacher/analytics",
          description: "Identify students who need follow-up.",
        },
      ]}
    />
  ),
});
