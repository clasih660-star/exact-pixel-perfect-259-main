import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: () => (
    <RouteStubPage
      role="Platform Admin"
      title="Users"
      description="Search and manage all platform users across every role and institution."
      primary={{ label: "Platform dashboard", to: "/admin/platform" }}
      secondary={{ label: "Institutions", to: "/admin/institutions" }}
      items={[
        {
          label: "All users",
          to: "/admin/platform",
          description: "Learners, teachers, and admins across the platform.",
        },
        {
          label: "Roles & permissions",
          to: "/admin/settings",
          description: "Review and adjust role assignments.",
        },
        {
          label: "Support requests",
          to: "/admin/support",
          description: "User-reported issues awaiting action.",
        },
      ]}
    />
  ),
});
