import { createFileRoute } from "@tanstack/react-router";
import { StudentClassroomsPage } from "@/components/student/StudentClassroomsPage";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/classrooms")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentClassroomsPage,
  head: () => ({
    meta: [
      { title: "My Classrooms — Klassruum" },
      {
        name: "description",
        content: "Resume active classrooms, review progress, and enter the right lesson faster from one organized learner hub.",
      },
    ],
  }),
});
