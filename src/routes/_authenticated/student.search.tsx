import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/search")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Search"
      description="Search results are prepared for lessons, notes, resources, quizzes, summaries, and sessions."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open resources", to: "/student/resources" }}
      items={[
        {
          label: "Lessons",
          to: "/student/lessons",
          description: "Find a lesson by topic or title.",
        },
        {
          label: "Notes",
          to: "/student/notes",
          description: "Locate saved summaries and whiteboard notes.",
        },
        {
          label: "Resources",
          to: "/student/resources",
          description: "Jump to PDFs, worksheets, and helpful links.",
        },
      ]}
    />
  ),
});
