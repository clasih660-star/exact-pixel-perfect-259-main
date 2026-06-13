import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/lessons/$lessonId/preview")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: () => (
    <RouteStubPage
      title="Preview Lesson"
      description="Preview lesson as learners see it"
      role="Teacher"
      items={[]}
    />
  ),
});
