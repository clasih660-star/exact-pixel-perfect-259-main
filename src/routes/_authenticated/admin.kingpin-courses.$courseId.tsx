import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Layers, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { getKingpinCourseById } from "@/lib/kingpin-catalog";
import { KingpinCertificatePreview } from "@/components/kingpin/KingpinCertificatePreview";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/$courseId")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: KingpinCourseDetailPage,
});

function KingpinCourseDetailPage() {
  const { courseId } = Route.useParams();
  const course = getKingpinCourseById(courseId);

  return (
    <DashboardShell config={dashboardConfigs.platform_admin} title="KingPin Course">
      <PageHeader
        label="Course overview"
        title={course?.title ?? "KingPin course"}
        subtitle={course?.heroDescription ?? "Course not found."}
        action={
          <a href="/admin/kingpin-courses" className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#0F172A]">
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </a>
        }
      />

      {!course ? (
        <Card className="border-[#DDE7F0] bg-white/90"><CardContent className="p-6 text-sm text-[#475569]">Course not found.</CardContent></Card>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge>{course.owner}</Badge>
            <Badge variant="outline">{course.pricingLabel}</Badge>
            <Badge variant="outline">{course.toolUniverse.length} tools</Badge>
            <Badge variant="outline">{course.modules.length} modules</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard label="Modules" value={course.modules.length} icon={<Layers className="h-5 w-5" />} />
            <SummaryCard label="Lessons" value={course.modules.reduce((sum, module) => sum + module.lessons.length, 0)} icon={<BookOpen className="h-5 w-5" />} />
            <SummaryCard label="AI tools covered" value={course.toolUniverse.length} icon={<Sparkles className="h-5 w-5" />} />
          </div>

          <Card className="mt-6 border-[#DDE7F0] bg-white/90">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-[#0F172A]">Course outcomes</h2>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-[#334155]">
                {course.outcomes.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-4">
            {course.modules.map((module) => (
              <Card key={module.id} className="border-[#DDE7F0] bg-white/90">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">{module.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#475569]">{module.overview}</p>
                    </div>
                    <Badge variant="outline">{module.lessons.length} lessons</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.tools.map((tool) => <Badge key={tool} variant="outline">{tool}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-[#0F172A]">Premium certificate preview</h2>
            <KingpinCertificatePreview course={course} learnerName="KingPin Graduate" certificateNumber="KP-2026-AI-2048" issueDate="15 June 2026" />
          </div>
        </>
      )}
    </DashboardShell>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <Card className="border-[#DDE7F0] bg-white/90">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#0F172A]">{value}</p>
        </div>
        <div className="rounded-2xl bg-[#E6F6F3] p-3 text-[#1F7C80]">{icon}</div>
      </CardContent>
    </Card>
  );
}
