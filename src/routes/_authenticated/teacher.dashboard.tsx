import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Teacher Dashboard"
      description="This route is prepared for assigned courses, lesson preparation, upcoming sessions, and student progress alerts."
      primary={{ label: "My courses", to: "/teacher/courses" }}
      secondary={{ label: "Analytics", to: "/teacher/analytics" }}
      items={[
        {
          label: "Assigned courses",
          to: "/teacher/courses",
          description: "See the classes you teach and manage.",
        },
        {
          label: "Lesson preparation",
          to: "/teacher/lessons",
          description: "Draft, edit, and preview classroom lessons.",
        },
        {
          label: "Upcoming sessions",
          to: "/teacher/sessions",
          description: "Review what starts next and when.",
        },
      ]}
    />
  ),
});
