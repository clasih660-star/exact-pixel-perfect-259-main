import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Layers, BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { KINGPIN_AI_MASTERCLASS } from "@/lib/kingpin-catalog";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/new")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: KingpinCourseBlueprintPage,
});

function KingpinCourseBlueprintPage() {
  return (
    <DashboardShell config={dashboardConfigs.platform_admin} title="New KingPin Course">
      <PageHeader
        label="Course blueprint"
        title="KingPin flagship AI curriculum model"
        subtitle="This page documents the course design standard used for direct-to-learner KingPin AI courses: premium, structured, role-aware, and department-aware."
        action={
          <a href="/admin/kingpin-courses" className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#0F172A]">
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </a>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <BlueprintCard title="Commercial model" text={`${KINGPIN_AI_MASTERCLASS.pricingLabel} direct sale, platform-owned, reusable for licensing and public catalog distribution.`} icon={<Sparkles className="h-5 w-5" />} />
        <BlueprintCard title="Curriculum structure" text={`${KINGPIN_AI_MASTERCLASS.modules.length} modules with 2 classroom-ready lessons per module for structured 10–15 minute delivery.`} icon={<Layers className="h-5 w-5" />} />
        <BlueprintCard title="Learning depth" text="Each lesson includes context, workflow logic, role application, guided practice, and quality control reflection." icon={<BookOpen className="h-5 w-5" />} />
      </div>

      <Card className="mt-6 border-[#DDE7F0] bg-white/90">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-[#0F172A]">Creation standard</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#334155]">
            <li>• The course must feel like a real curriculum product, not a tool directory.</li>
            <li>• Every lesson should sustain approximately 10–15 minutes of AI classroom delivery.</li>
            <li>• Lessons must include multiple sections: context, tool logic, role/department use, guided practice, and reflection.</li>
            <li>• Modules must connect tools to real departments such as education, operations, finance, research, HR, marketing, and administration.</li>
            <li>• The same course should remain reusable for public sales, platform licensing, and internal demonstrations.</li>
          </ul>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

function BlueprintCard({ title, text, icon }: { title: string; text: string; icon: ReactNode }) {
  return (
    <Card className="border-[#DDE7F0] bg-white/90">
      <CardContent className="p-5">
        <div className="mb-3 inline-flex rounded-2xl bg-[#E6F6F3] p-3 text-[#1F7C80]">{icon}</div>
        <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-[#475569]">{text}</p>
      </CardContent>
    </Card>
  );
}
