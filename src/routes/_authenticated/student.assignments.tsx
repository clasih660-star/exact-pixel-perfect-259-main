import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/assignments")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Assignments"
      description="Track homework and post-lesson tasks. This page is prepared for submission and due-date workflows."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open courses", to: "/student/courses" }}
      items={[
        {
          label: "Pending assignments",
          to: "/student/assignments",
          description: "Work that still needs to be completed.",
        },
        {
          label: "Submitted work",
          to: "/student/assignments",
          description: "Review what has already been turned in.",
        },
        {
          label: "Grading status",
          to: "/student/assignments",
          description: "See what is pending review or feedback.",
        },
      ]}
    />
  ),
});
