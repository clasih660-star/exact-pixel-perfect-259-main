import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/lesson-generation")({
  component: () => (
    <RouteStubPage
      title="Lesson Generation Jobs"
      description="Monitor all AI lesson generation jobs"
      role="Platform Admin"
      items={[]}
    />
  ),
});
