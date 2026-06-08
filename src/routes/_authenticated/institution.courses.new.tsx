import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/courses/new")({
  component: () => (
    <RouteStubPage
      role="Institution"
      title="Create Course"
      description="Course creation is ready for the next step in the institution workflow."
      primary={{ label: "Institution dashboard", to: "/institution/dashboard" }}
      secondary={{ label: "Courses", to: "/institution/courses" }}
      items={[
        {
          label: "Course details",
          to: "/institution/courses",
          description: "Set title, subject, level, and ownership.",
        },
        {
          label: "Add lessons",
          to: "/institution/courses",
          description: "Prepare the lesson structure for delivery.",
        },
        {
          label: "Attach resources",
          to: "/institution/resources",
          description: "Link learning materials to the course.",
        },
      ]}
    />
  ),
});
