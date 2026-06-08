import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/courses/$courseId/lessons")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Course Lessons"
      description="Browse lessons in this course, review what is available next, and jump back into the active classroom."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open course", to: "/student/courses" }}
      items={[
        {
          label: "Lesson overview",
          to: "/student/courses/$courseId/lessons",
          description: "See the full lesson list and identify your next step.",
        },
        {
          label: "Open a lesson",
          to: "/student/lessons",
          description: "Choose a lesson to start or resume in the classroom.",
        },
        {
          label: "Track completion",
          to: "/student/progress",
          description: "Check which lessons are done, in progress, or ready to review.",
        },
      ]}
    />
  ),
});
