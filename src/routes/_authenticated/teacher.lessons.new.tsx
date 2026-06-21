import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Plus } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { TEACHER_COURSE_WORKSPACES } from "@/lib/teacher-course-workspace";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/lessons/new")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: NewTeacherLessonPage,
});

function NewTeacherLessonPage() {
  return (
    <DashboardShell
      config={dashboardConfigs.teacher}
      activePath="/teacher/lessons"
      title="Create Lesson"
    >
      <PageHeader
        label="Lesson creation"
        title="Create Lesson"
        subtitle="Choose the course first, then add a manual lesson or generate drafts from course materials."
        action={
          <Link
            to="/teacher/lessons"
            className="inline-flex items-center rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
          >
            Lesson library
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TEACHER_COURSE_WORKSPACES.map((course) => (
          <Card key={course.id} className="border-[#E2E8F0] bg-white">
            <CardContent className="space-y-4 p-5">
              <div className="inline-flex rounded-2xl bg-[#E6F6F3] p-3 text-[#1F7C80]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-[#0F172A]">{course.title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">{course.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/teacher/courses/$courseId/lessons"
                  params={{ courseId: course.id }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F7C80] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A5256]"
                >
                  <Plus className="h-4 w-4" />
                  Lesson workspace
                </Link>
                <Link
                  to="/teacher/courses/$courseId/generate-lessons"
                  params={{ courseId: course.id }}
                  className="inline-flex items-center rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Generate
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
