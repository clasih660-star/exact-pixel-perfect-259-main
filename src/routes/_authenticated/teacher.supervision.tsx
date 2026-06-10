import { createFileRoute } from "@tanstack/react-router";
import TeacherSupervision from "@/components/dashboard/teacher/TeacherSupervision";

export const Route = createFileRoute("/_authenticated/teacher/supervision")({
  component: TeacherSupervision,
});
