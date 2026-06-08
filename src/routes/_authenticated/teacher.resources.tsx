import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/resources")({
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Resources"
      description="Teacher resources and teaching materials are ready to organize and reuse."
      primary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      secondary={{ label: "Courses", to: "/teacher/courses" }}
      items={[
        {
          label: "Resource library",
          to: "/teacher/resources",
          description: "Manage PDFs, slides, and lesson aids.",
        },
        {
          label: "Attach to lesson",
          to: "/teacher/lessons",
          description: "Link materials directly to a lesson.",
        },
        {
          label: "Preview classroom",
          to: "/classroom/preview/lesson-demo",
          description: "See how resources appear to learners.",
        },
      ]}
    />
  ),
});
