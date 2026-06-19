import { createFileRoute } from "@tanstack/react-router";
import { NotificationCenterPage } from "@/components/dashboard/shared/NotificationCenterPage";
import { requireInstitutionAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/notifications")({
  beforeLoad: (ctx) => requireInstitutionAdmin(ctx.context),
  component: NotificationCenterPage,
  head: () => ({
    meta: [
      { title: "Institution Notifications - Klassruum" },
      { name: "description", content: "Institution notifications and operational updates" },
    ],
  }),
});
