import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/teachers/invite")({
  component: () => (
    <RouteStubPage
      role="Institution Admin"
      title="Invite Teachers"
      description="A route prepared for inviting teachers and assigning them to courses in your institution."
      primary={{ label: "Teachers", to: "/institution/teachers" }}
      secondary={{ label: "Courses", to: "/institution/courses" }}
      items={[
        {
          label: "All teachers",
          to: "/institution/teachers",
          description: "Browse teachers already in your institution.",
        },
        {
          label: "Courses",
          to: "/institution/courses",
          description: "Assign invited teachers to courses.",
        },
        {
          label: "Settings",
          to: "/institution/settings",
          description: "Manage roles and permissions.",
        },
      ]}
    />
  ),
});
