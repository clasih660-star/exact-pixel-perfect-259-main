import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { getKingpinCourseById } from "@/lib/kingpin-catalog";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/$courseId/lessons")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: KingpinCourseLessonsPage,
});

function KingpinCourseLessonsPage() {
  const { courseId } = Route.useParams();
  const course = getKingpinCourseById(courseId);
  const lessons = course ? course.modules.flatMap((module) => module.lessons.map((lesson) => ({ module, lesson }))) : [];

  return (
    <DashboardShell config={dashboardConfigs.platform_admin} title="Course Lessons">
      <PageHeader
        label="Detailed lessons"
        title={course ? `${course.title} lessons` : "Course lessons"}
        subtitle="Every lesson is built for structured AI classroom delivery with context, tool logic, role-based application, guided practice, and reflection."
        action={
          <a href={course ? `/admin/kingpin-courses/${course.id}` : "/admin/kingpin-courses"} className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#0F172A]">
            <ArrowLeft className="h-4 w-4" />
            Back to overview
          </a>
        }
      />

      <div className="grid gap-4">
        {lessons.map(({ module, lesson }) => (
          <Card key={lesson.id} className="border-[#DDE7F0] bg-white/90">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                <Badge>{module.title}</Badge>
                <Badge variant="outline">{lesson.durationMinutes} min</Badge>
              </div>
              <h2 className="mt-3 text-xl font-bold text-[#0F172A]">{lesson.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#334155]">{lesson.objective}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {lesson.tools.map((tool) => <Badge key={tool} variant="outline">{tool}</Badge>)}
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {lesson.sections.map((section) => (
                  <div key={section.title} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <h3 className="text-sm font-bold text-[#0F172A]">{section.title}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#64748B]">{section.purpose}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-[#475569]">
                      {section.content.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
