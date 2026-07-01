import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/generate-lessons")({
  component: () => (
    <RouteStubPage
      title="Generate Lessons"
      description="AI lesson generation settings"
      role="Institution Admin"
      items={[]}
    />
  ),
});
