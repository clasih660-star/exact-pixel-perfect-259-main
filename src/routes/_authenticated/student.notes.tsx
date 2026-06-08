import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/notes")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Notes"
      description="Saved lesson summaries, key points, and whiteboard notes live here."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open progress", to: "/student/progress" }}
      items={[
        {
          label: "Recent note",
          to: "/student/notes/note-demo",
          description: "Open a lesson summary and key formulas.",
        },
        {
          label: "Whiteboard notes",
          to: "/student/notes/note-demo",
          description: "Revisit the board from a live lesson.",
        },
        {
          label: "Homework reminders",
          to: "/student/notes/note-demo",
          description: "Keep important follow-ups in one place.",
        },
      ]}
    />
  ),
});
