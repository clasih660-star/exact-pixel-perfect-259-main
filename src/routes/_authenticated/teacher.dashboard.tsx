import { createFileRoute } from "@tanstack/react-router";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  component: TeacherDashboard,
});
