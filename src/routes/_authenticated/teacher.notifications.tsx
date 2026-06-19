import { createFileRoute } from "@tanstack/react-router";
import { NotificationCenterPage } from "@/components/dashboard/shared/NotificationCenterPage";
import { requireTeacher } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/notifications")({
  beforeLoad: (ctx) => requireTeacher(ctx.context),
  component: NotificationCenterPage,
  head: () => ({
    meta: [
      { title: "Teacher Notifications - Klassruum" },
      { name: "description", content: "Teacher notifications and classroom updates" },
    ],
  }),
});
