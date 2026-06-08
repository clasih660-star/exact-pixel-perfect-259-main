import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/lessons/$lessonId/edit")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Edit Lesson"
      description="A dedicated edit route for lesson content, pacing, and classroom preview."
      primary={{ label: "Back to lessons", to: "/teacher/lessons" }}
      secondary={{ label: "Preview classroom", to: "/classroom/preview/lesson-demo" }}
      items={[
        {
          label: "Lesson content",
          to: "/teacher/lessons",
          description: "Update steps, notes, and examples.",
        },
        {
          label: "Classroom preview",
          to: "/classroom/preview/lesson-demo",
          description: "Preview the lesson before publishing it.",
        },
        {
          label: "Student progress links",
          to: "/teacher/students",
          description: "See how learners are doing in this lesson.",
        },
      ]}
    />
  ),
});
