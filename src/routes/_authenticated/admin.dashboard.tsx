import { createFileRoute } from "@tanstack/react-router";
import { PlatformAdminDashboard } from "@/components/dashboard/platform/PlatformAdminDashboard";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: PlatformAdminDashboard,
  head: () => ({
    meta: [
      { title: "Platform Dashboard — Klassruum" },
      { name: "description", content: "Platform administration and monitoring" },
    ],
  }),
});
