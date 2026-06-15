import { createFileRoute } from "@tanstack/react-router";
import { Layers, BookOpen, DollarSign, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { getKingpinCourseCatalog } from "@/lib/kingpin-catalog";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: KingpinCoursesPage,
});

function KingpinCoursesPage() {
  const courses = getKingpinCourseCatalog();

  return (
    <DashboardShell config={dashboardConfigs.platform_admin} title="KingPin Courses">
      <PageHeader
        label="Platform curriculum"
        title="KingPin AI course catalog"
        subtitle="Platform-owned curriculum products designed for direct public sale, licensing, and structured AI classroom delivery."
        action={
          <a
            href="/admin/kingpin-courses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F7C80] px-4 py-2 text-sm font-semibold text-white"
          >
            View creation blueprint
            <ArrowRight className="h-4 w-4" />
          </a>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Catalog courses" value={courses.length} icon={<Layers className="h-5 w-5" />} />
        <StatCard
          label="Curriculum modules"
          value={courses.reduce((sum, course) => sum + course.modules.length, 0)}
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          label="Detailed lessons"
          value={courses.reduce(
            (sum, course) => sum + course.modules.reduce((inner, module) => inner + module.lessons.length, 0),
            0,
          )}
          icon={<BookOpen className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-5">
        {courses.map((course) => {
          const lessonCount = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
          return (
            <Card key={course.id} className="border-[#DDE7F0] bg-white/90">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{course.owner}</Badge>
                      <Badge variant="outline">{course.pricingLabel}</Badge>
                      <Badge variant="outline">{course.visibility}</Badge>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#0F172A]">{course.title}</h2>
                      <p className="mt-1 text-sm text-[#475569]">{course.subtitle}</p>
                    </div>
                    <p className="max-w-4xl text-sm leading-7 text-[#334155]">{course.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-[#475569]">
                      <span className="inline-flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#1F7C80]" />
                        ${course.priceUsd} one-time
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#1F7C80]" />
                        {course.modules.length} modules
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#1F7C80]" />
                        {lessonCount} lessons
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-[220px]">
                    <a href={`/admin/kingpin-courses/${course.id}`} className="rounded-xl bg-[#1F7C80] px-4 py-2 text-center text-sm font-semibold text-white">
                      Open course overview
                    </a>
                    <a href={`/admin/kingpin-courses/${course.id}/lessons`} className="rounded-xl border border-[#CBD5E1] px-4 py-2 text-center text-sm font-semibold text-[#0F172A]">
                      View lessons
                    </a>
                    <a href={`/admin/kingpin-courses/${course.id}/materials`} className="rounded-xl border border-[#CBD5E1] px-4 py-2 text-center text-sm font-semibold text-[#0F172A]">
                      Materials guidance
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
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
