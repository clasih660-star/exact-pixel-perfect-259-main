import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FileText, Plus, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { getTeacherCourseWorkspace } from "@/lib/teacher-course-workspace";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/materials")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: TeacherCourseMaterialsPage,
});

const MATERIALS = [
  {
    title: "Syllabus and lesson scope",
    type: "Syllabus",
    status: "Ready",
    note: "Course objectives, topic order, and assessment expectations.",
  },
  {
    title: "Practice worksheet pack",
    type: "Worksheet",
    status: "Ready",
    note: "Exercises teachers can use for guided and independent practice.",
  },
  {
    title: "Classroom examples",
    type: "Text",
    status: "Review",
    note: "Example prompts, worked answers, and board notes for live teaching.",
  },
];

function TeacherCourseMaterialsPage() {
  const { courseId } = Route.useParams();
  const course = getTeacherCourseWorkspace(courseId);

  return (
    <DashboardShell
      config={dashboardConfigs.teacher}
      activePath="/teacher/courses"
      title={course?.title ? `${course.title} Materials` : "Course Materials"}
    >
      <PageHeader
        label="Course materials"
        title={course?.title ? `${course.title} materials` : "Course not found"}
        subtitle="Review the source materials used for lesson planning and generation."
        action={
          <Link
            to="/teacher/courses/$courseId"
            params={{ courseId }}
            className="inline-flex items-center rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
          >
            Course overview
          </Link>
        }
      />

      {!course ? (
        <Card className="border-[#E2E8F0] bg-white">
          <CardContent className="p-6 text-sm text-[#64748B]">Course not found.</CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap justify-end gap-2">
            <Link
              to="/teacher/courses/$courseId/materials/upload"
              params={{ courseId }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F7C80] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A5256]"
            >
              <Plus className="h-4 w-4" />
              Upload material
            </Link>
            <Link
              to="/teacher/courses/$courseId/lessons"
              params={{ courseId }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
            >
              <BookOpen className="h-4 w-4" />
              Lessons
            </Link>
            <Link
              to="/teacher/courses/$courseId/generate-lessons"
              params={{ courseId }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
            >
              <Sparkles className="h-4 w-4" />
              Generate
            </Link>
          </div>

          <div className="space-y-3">
            {MATERIALS.map((material) => (
              <Card key={material.title} className="border-[#E2E8F0] bg-white">
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <div className="rounded-xl bg-[#E6F6F3] p-3 text-[#1F7C80]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#0F172A]">{material.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[#64748B]">{material.note}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Badge variant="outline">{material.type}</Badge>
                    <Badge>{material.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
