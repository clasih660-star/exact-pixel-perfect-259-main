import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardPage } from "@/components/student/StudentDashboardPage";

export const Route = createFileRoute("/_authenticated/student/dashboard")({
  component: StudentDashboardPage,
});
