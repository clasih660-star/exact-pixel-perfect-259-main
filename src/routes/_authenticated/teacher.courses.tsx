import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/courses")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="My Courses"
      description="Teacher-owned course management is ready for course details, lessons, and analytics."
      primary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      secondary={{ label: "Lessons", to: "/teacher/lessons" }}
      items={[
        {
          label: "Course detail",
          to: "/teacher/courses/course-demo",
          description: "Open an individual course overview.",
        },
        {
          label: "Course analytics",
          to: "/teacher/courses/course-demo/analytics",
          description: "Inspect student performance in the course.",
        },
        {
          label: "Preview classroom",
          to: "/classroom/preview/lesson-demo",
          description: "See the classroom flow before teaching.",
        },
      ]}
    />
  ),
});
