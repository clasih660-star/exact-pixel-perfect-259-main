import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/settings/profile")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Profile"
      description="This route is ready for profile editing, avatar updates, and account identity details."
      primary={{ label: "Back to settings", to: "/student/settings" }}
      secondary={{ label: "Open dashboard", to: "/student/dashboard" }}
      items={[
        {
          label: "Name and avatar",
          to: "/student/settings/profile",
          description: "Update the identity shown across the platform.",
        },
        {
          label: "Email and contact",
          to: "/student/settings/profile",
          description: "Keep your contact details current.",
        },
        {
          label: "Security basics",
          to: "/student/settings/profile",
          description: "Change password and account recovery options.",
        },
      ]}
    />
  ),
});
