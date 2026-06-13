import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireTeacher } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/settings")({
  beforeLoad: (ctx) => requireTeacher(ctx.context),
  component: () => (
    <RouteStubPage
      role="Teacher"
      title="Settings"
      description="Teacher account settings, preferences, and workflow controls are prepared here."
      primary={{ label: "Teacher dashboard", to: "/teacher/dashboard" }}
      secondary={{ label: "Courses", to: "/teacher/courses" }}
      items={[
        {
          label: "Profile",
          to: "/teacher/settings",
          description: "Edit your account and identity details.",
        },
        {
          label: "Notifications",
          to: "/teacher/settings",
          description: "Choose what alerts you want to receive.",
        },
        {
          label: "Accessibility",
          to: "/teacher/settings",
          description: "Tune the teaching experience to your preference.",
        },
      ]}
    />
  ),
});
