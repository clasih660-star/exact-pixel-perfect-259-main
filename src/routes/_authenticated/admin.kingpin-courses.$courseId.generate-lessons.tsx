import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/$courseId/generate-lessons")({
  component: () => (
    <RouteStubPage
      title="Generate Lessons"
      description="AI lesson generation for KingPin course"
      role="Platform Admin"
      items={[]}
    />
  ),
});
