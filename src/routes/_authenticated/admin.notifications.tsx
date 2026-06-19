import { createFileRoute } from "@tanstack/react-router";
import { NotificationCenterPage } from "@/components/dashboard/shared/NotificationCenterPage";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/notifications")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: NotificationCenterPage,
  head: () => ({
    meta: [
      { title: "Admin Notifications - Klassruum" },
      { name: "description", content: "Platform notifications and system updates" },
    ],
  }),
});
