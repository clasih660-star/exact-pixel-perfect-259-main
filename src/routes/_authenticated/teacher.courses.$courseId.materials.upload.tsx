import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Upload } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { getTeacherCourseWorkspace } from "@/lib/teacher-course-workspace";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/courses/$courseId/materials/upload")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: TeacherUploadMaterialPage,
});

function TeacherUploadMaterialPage() {
  const { courseId } = Route.useParams();
  const course = getTeacherCourseWorkspace(courseId);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <DashboardShell
      config={dashboardConfigs.teacher}
      activePath="/teacher/courses"
      title={course?.title ? `Upload material for ${course.title}` : "Upload Material"}
    >
      <PageHeader
        label="Course material"
        title={course?.title ? `Upload material for ${course.title}` : "Course not found"}
        subtitle="Attach teacher notes, worksheets, source text, or file references for lesson planning."
        action={
          <Link
            to="/teacher/courses/$courseId/materials"
            params={{ courseId }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
          >
            <ArrowLeft className="h-4 w-4" />
            Materials
          </Link>
        }
      />

      {!course ? (
        <Card className="border-[#E2E8F0] bg-white">
          <CardContent className="p-6 text-sm text-[#64748B]">Course not found.</CardContent>
        </Card>
      ) : (
        <Card className="border-[#E2E8F0] bg-white">
          <CardContent className="space-y-4 p-6">
            <div>
              <Label>Material title</Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Chapter worksheet or source notes"
              />
            </div>
            <div>
              <Label>Notes or source text</Label>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="min-h-40"
                placeholder="Paste notes, learning objectives, links, or a short material summary."
              />
            </div>
            <div className="rounded-xl border border-dashed border-[#CBD5E1] p-5 text-center">
              <Upload className="mx-auto h-8 w-8 text-[#94A3B8]" />
              <p className="mt-2 text-sm text-[#64748B]">
                File attachment UI is ready for this route. Production uploads should use the
                institution course UUID material pipeline.
              </p>
            </div>
            <Button
              className="bg-[#1F7C80] hover:bg-[#1A5256]"
              disabled={!title.trim()}
              onClick={() => {
                setSaved(true);
                toast.success("Material saved in this teacher workspace");
              }}
            >
              <Check className="h-4 w-4" />
              Save material
            </Button>
            {saved && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                Material saved for this teacher workspace. Real course UUIDs continue to use the
                institution material upload pipeline.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}
