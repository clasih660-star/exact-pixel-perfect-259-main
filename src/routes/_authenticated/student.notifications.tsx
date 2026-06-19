import { createFileRoute } from "@tanstack/react-router";
import { NotificationCenterPage } from "@/components/dashboard/shared/NotificationCenterPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/notifications")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: NotificationCenterPage,
  head: () => ({
    meta: [
      { title: "Notifications - Klassruum" },
      { name: "description", content: "Student notifications and learning updates" },
    ],
  }),
});
