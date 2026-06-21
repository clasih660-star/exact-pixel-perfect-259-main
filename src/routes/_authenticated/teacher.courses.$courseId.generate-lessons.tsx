import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { getTeacherCourseWorkspace } from "@/lib/teacher-course-workspace";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/generate-lessons")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: TeacherGenerateLessonsPage,
});

function TeacherGenerateLessonsPage() {
  const { courseId } = Route.useParams();
  const course = getTeacherCourseWorkspace(courseId);
  const [count, setCount] = useState(3);
  const [generated, setGenerated] = useState(false);

  return (
    <DashboardShell
      config={dashboardConfigs.teacher}
      activePath="/teacher/courses"
      title={course?.title ? `Generate lessons for ${course.title}` : "Generate Lessons"}
    >
      <PageHeader
        label="AI lesson generation"
        title={course?.title ? `Generate lessons for ${course.title}` : "Course not found"}
        subtitle="Create draft lessons from course materials, then review them before using them in class."
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
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-[#E2E8F0] bg-white">
            <CardContent className="space-y-5 p-6">
              <div className="inline-flex rounded-2xl bg-[#E6F6F3] p-3 text-[#1F7C80]">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">Generate lesson drafts</h2>
                <p className="mt-2 text-sm leading-7 text-[#64748B]">
                  Select how many drafts you want, then review the lesson queue before teaching or
                  recording. Institution courses with UUIDs can connect this flow to the Supabase AI
                  generation pipeline.
                </p>
              </div>
              <div className="max-w-xs">
                <Label>Draft lesson count</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={count}
                  onChange={(event) => setCount(Number(event.target.value))}
                />
              </div>
              <Button
                className="bg-[#1F7C80] hover:bg-[#1A5256]"
                onClick={() => {
                  setGenerated(true);
                  toast.success(`Prepared ${count} lesson drafts`);
                }}
              >
                <Sparkles className="h-4 w-4" />
                Generate drafts
              </Button>
              {generated && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <p>
                      {count} draft lesson slots prepared. Open lessons to review and decide which
                      ones are ready for class.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Link to="/teacher/courses/$courseId/materials" params={{ courseId }}>
              <Card className="transition hover:border-[#1F7C80]/40">
                <CardContent className="flex items-start gap-3 p-4">
                  <FileText className="mt-1 h-5 w-5 text-[#1F7C80]" />
                  <div>
                    <h3 className="font-semibold">Materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Check the source content before generating lessons.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/teacher/courses/$courseId/lessons" params={{ courseId }}>
              <Card className="transition hover:border-[#1F7C80]/40">
                <CardContent className="flex items-start gap-3 p-4">
                  <BookOpen className="mt-1 h-5 w-5 text-[#1F7C80]" />
                  <div>
                    <h3 className="font-semibold">Lessons</h3>
                    <p className="text-sm text-muted-foreground">
                      Review, preview, and record lessons for this course.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
