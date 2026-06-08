import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardPage } from "@/components/student/StudentDashboardPage";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: StudentDashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — Klassruum" },
      { name: "description", content: "Your learning dashboard at Klassruum" },
    ],
  }),
});
