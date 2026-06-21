import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Eye, FileText, Play, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { TeacherStartClassButton } from "@/components/classroom/TeacherStartClassButton";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { getTeacherCourseWorkspace } from "@/lib/teacher-course-workspace";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/lessons")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: TeacherCourseLessonsPage,
});

function TeacherCourseLessonsPage() {
  const { courseId } = Route.useParams();
  const course = getTeacherCourseWorkspace(courseId);

  return (
    <DashboardShell
      config={dashboardConfigs.teacher}
      activePath="/teacher/courses"
      title={course?.title ? `${course.title} Lessons` : "Course Lessons"}
    >
      <PageHeader
        label="Course lessons"
        title={course?.title ? `${course.title} lessons` : "Course not found"}
        subtitle="Choose a lesson, preview it, record a live class, or open the supporting course material and generation tools."
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
            <a
              href={`/teacher/courses/${course.id}/materials`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
            >
              <FileText className="h-4 w-4" />
              Materials
            </a>
            <a
              href={`/teacher/courses/${course.id}/generate-lessons`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
            >
              <Sparkles className="h-4 w-4" />
              Generate
            </a>
            <Link
              to="/teacher/lessons/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F7C80] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A5256]"
            >
              <BookOpen className="h-4 w-4" />
              New lesson
            </Link>
          </div>

          <div className="space-y-4">
            {course.lessons.map((lesson) => (
              <Card key={lesson.id} className="border-[#E2E8F0] bg-white">
                <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-[#0F172A]">{lesson.title}</h2>
                      <StatusBadge
                        variant={
                          lesson.status === "ready"
                            ? "success"
                            : lesson.status === "review"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {lesson.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[#64748B]">{lesson.objective}</p>
                    <p className="mt-2 text-xs font-semibold text-[#94A3B8]">
                      {lesson.duration} - {lesson.steps} steps
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/classroom/preview/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Link>
                    <Link
                      to="/teacher/lessons/$lessonId/edit"
                      params={{ lessonId: lesson.id }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                    >
                      <BookOpen className="h-4 w-4" />
                      Edit
                    </Link>
                    {lesson.status === "ready" ? (
                      <TeacherStartClassButton lessonId={lesson.id} label="Record live" compact />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#94A3B8]">
                        <Play className="h-4 w-4" />
                        Review first
                      </span>
                    )}
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
