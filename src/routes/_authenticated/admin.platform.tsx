import { createFileRoute } from "@tanstack/react-router";
import { PlatformAdminDashboard } from "@/components/dashboard/platform/PlatformAdminDashboard";

export const Route = createFileRoute("/_authenticated/admin/platform")({
  component: PlatformAdminDashboard,
  head: () => ({
    meta: [
      { title: "Platform Admin — Klassruum" },
      { name: "description", content: "Platform administration dashboard" },
    ],
  }),
});