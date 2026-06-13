import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/settings")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: () => (
    <RouteStubPage
      role="Student"
      title="Settings"
      description="Profile, password, language, notifications, privacy, and institution memberships are organized here."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Profile", to: "/student/settings/profile" }}
      items={[
        {
          label: "Profile details",
          to: "/student/settings/profile",
          description: "Edit your name, avatar, and basic profile info.",
        },
        {
          label: "Privacy and notifications",
          to: "/student/settings",
          description: "Control how and when Klassruum can reach you.",
        },
        {
          label: "Institution memberships",
          to: "/student/settings",
          description: "Manage the schools or programs you belong to.",
        },
      ]}
    />
  ),
});
