import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { getKingpinCourseById } from "@/lib/kingpin-catalog";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute(
  "/_authenticated/admin/kingpin-courses/$courseId/generate-lessons",
)({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: KingpinGenerateLessonsPage,
});

function KingpinGenerateLessonsPage() {
  const { courseId } = Route.useParams();
  const course = getKingpinCourseById(courseId);

  return (
    <DashboardShell config={dashboardConfigs.platform_admin} title="Generate Lessons">
      <PageHeader
        label="Generation strategy"
        title={course ? `${course.title} lesson generation` : "Lesson generation"}
        subtitle="For KingPin flagship courses, AI generation should support expansion and refinement — not replace the curriculum structure, lesson intent, or quality-control design."
        action={
          <a href={course ? `/admin/kingpin-courses/${course.id}/lessons` : "/admin/kingpin-courses"} className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#0F172A]">
            <ArrowLeft className="h-4 w-4" />
            Back to lessons
          </a>
        }
      />

      <div className="grid gap-4">
        {[
          ["Author-first model", "Modules and lessons are curriculum-authored first so each lesson has a stable objective, department context, tool focus, and practice intent."],
          ["AI-assisted enrichment", "Generation can expand examples, create alternative scenarios, produce role-specific variations, and draft practice prompts without changing the learning architecture."],
          ["Review checkpoints", "Every generated addition should be reviewed for factual quality, workflow realism, bias, weak assumptions, and commercial/course-brand consistency."],
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
