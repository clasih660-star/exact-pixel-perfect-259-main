import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/students")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Course Students"
      description="A route prepared for the roster of students enrolled in this course, with progress and alerts."
      primary={{ label: "Back to course", to: "/teacher/courses/course-demo" }}
      secondary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      items={[
        {
          label: "Enrolled students",
          to: "/teacher/students",
          description: "The full roster for this course.",
        },
        {
          label: "Progress alerts",
          to: "/teacher/analytics",
          description: "Students who may need support.",
        },
        {
          label: "Course analytics",
          to: "/teacher/courses/course-demo/analytics",
          description: "Performance trends for this course.",
        },
      ]}
    />
  ),
});
