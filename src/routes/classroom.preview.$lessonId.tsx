import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/classroom/preview/$lessonId")({
  component: () => (
    <RouteStubPage
      role="Classroom"
      title="Lesson Preview"
      description="This preview route is prepared for teacher lesson testing before a real classroom session starts."
      primary={{ label: "Teacher lessons", to: "/teacher/lessons" }}
      secondary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      items={[
        {
          label: "Preview lesson flow",
          to: "/teacher/lessons",
          description: "Check the teaching flow before publishing.",
        },
        {
          label: "Open resources",
          to: "/teacher/resources",
          description: "Validate the attachments that will appear.",
        },
        {
          label: "Start live session",
          to: "/classroom/session/session-demo",
          description: "Move from preview into the classroom.",
        },
      ]}
    />
  ),
});
