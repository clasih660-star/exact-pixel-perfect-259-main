import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardPage } from "@/components/student/StudentDashboardPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/dashboard")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentDashboardPage,
  head: () => ({
    meta: [
      { title: "Learner Dashboard — Klassruum" },
      { name: "description", content: "Continue learning, enter classrooms, and track your progress." },
    ],
  }),
});
