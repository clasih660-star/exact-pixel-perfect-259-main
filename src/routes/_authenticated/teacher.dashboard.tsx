import { createFileRoute } from "@tanstack/react-router";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";
import { requireTeacher } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  beforeLoad: (ctx) => requireTeacher(ctx.context),
  component: TeacherDashboard,
  head: () => ({
    meta: [
      { title: "Teacher Dashboard — Klassruum" },
      { name: "description", content: "Prepare lessons, start classes, and support learners." },
    ],
  }),
});
