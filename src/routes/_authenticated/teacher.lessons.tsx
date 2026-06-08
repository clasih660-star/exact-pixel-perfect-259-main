import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/lessons")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Lessons"
      description="Prepare lessons, preview classroom delivery, and manage lesson drafts."
      primary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      secondary={{ label: "Courses", to: "/teacher/courses" }}
      items={[
        {
          label: "Lesson draft",
          to: "/teacher/lessons/lesson-demo/edit",
          description: "Edit the lesson content and flow.",
        },
        {
          label: "Preview classroom",
          to: "/classroom/preview/lesson-demo",
          description: "Check how the lesson will feel live.",
        },
        {
          label: "Linked course",
          to: "/teacher/courses/course-demo",
          description: "Jump back to the course it belongs to.",
        },
      ]}
    />
  ),
});
