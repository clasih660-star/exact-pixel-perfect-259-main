import { createFileRoute } from "@tanstack/react-router";
import TeacherSupervision from "@/components/dashboard/teacher/TeacherSupervision";
import { requireTeacher } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/supervision")({
  beforeLoad: (ctx) => requireTeacher(ctx.context),
  component: TeacherSupervision,
});
