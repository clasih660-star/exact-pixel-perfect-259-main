import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { getKingpinCourseById } from "@/lib/kingpin-catalog";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/$courseId/materials")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: KingpinCourseMaterialsPage,
});

function KingpinCourseMaterialsPage() {
  const { courseId } = Route.useParams();
  const course = getKingpinCourseById(courseId);

  return (
    <DashboardShell config={dashboardConfigs.platform_admin} title="Course Materials">
      <PageHeader
        label="Materials strategy"
        title={course ? `${course.title} materials` : "Course materials"}
        subtitle="This flagship course is curriculum-authored first, then supported by reusable source packs, prompt libraries, guided examples, workflow templates, and role-based case studies."
        action={
          <a href={course ? `/admin/kingpin-courses/${course.id}` : "/admin/kingpin-courses"} className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#0F172A]">
            <ArrowLeft className="h-4 w-4" />
            Back to overview
          </a>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Core source pack", "Tool comparison notes, workflow frameworks, responsible-use guidelines, and quality-control checklists."],
          ["Department case bank", "Examples for education, HR, finance, operations, research, marketing, and administration."],
          ["Role application pack", "Student, teacher, researcher, analyst, founder, manager, and marketer-specific practice cases."],
          ["Prompt and workflow library", "Reusable prompts, exercise templates, and tool-routing logic that support consistent delivery."],
        ].map(([title, body]) => (
          <Card key={title} className="border-[#DDE7F0] bg-white/90">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#475569]">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
