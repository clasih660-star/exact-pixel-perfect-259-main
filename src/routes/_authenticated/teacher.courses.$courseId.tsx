import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Course Detail"
      description="A per-course teacher route for rosters, lessons, session planning, and open classroom links."
      primary={{ label: "Back to courses", to: "/teacher/courses" }}
      secondary={{ label: "Analytics", to: "/teacher/courses/course-demo/analytics" }}
      items={[
        {
          label: "Course lessons",
          to: "/teacher/lessons",
          description: "Review the lesson list for this course.",
        },
        {
          label: "Course sessions",
          to: "/teacher/sessions",
          description: "Check what is scheduled next.",
        },
        {
          label: "Student progress",
          to: "/teacher/students",
          description: "Inspect learner progress within the course.",
        },
      ]}
    />
  ),
});
