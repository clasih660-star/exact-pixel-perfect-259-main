import { createFileRoute } from "@tanstack/react-router";
import { NotificationCenterPage } from "@/components/dashboard/shared/NotificationCenterPage";
import { requireParent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/parent/notifications")({
  beforeLoad: (ctx) => requireParent(ctx.context),
  component: NotificationCenterPage,
  head: () => ({
    meta: [
      { title: "Parent Notifications - Klassruum" },
      { name: "description", content: "Parent notifications and learner updates" },
    ],
  }),
});
