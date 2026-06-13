import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requirePlatformAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/$courseId/generate-lessons")({
  beforeLoad: (ctx) => requirePlatformAdmin(ctx.context),
  component: () => (
    <RouteStubPage
      title="Generate Lessons"
      description="AI lesson generation for KingPin course"
      role="Platform Admin"
      items={[]}
    />
  ),
});
