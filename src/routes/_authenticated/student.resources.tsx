import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/resources")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Resources"
      description="Open PDFs, notes, worksheets, links, images, and past papers attached to your enrolled courses."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open notes", to: "/student/notes" }}
      items={[
        {
          label: "PDF lesson notes",
          to: "/student/resources",
          description: "Download or read course handouts and summaries.",
        },
        {
          label: "Worksheets",
          to: "/student/resources",
          description: "Practice materials and guided exercises.",
        },
        {
          label: "Past papers",
          to: "/student/resources",
          description: "Review previous exam-style questions.",
        },
      ]}
    />
  ),
});
