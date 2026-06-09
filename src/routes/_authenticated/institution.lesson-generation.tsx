import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/lesson-generation")({
  component: () => (
    <RouteStubPage
      title="Lesson Generation"
      description="View all lesson generation jobs"
      role="Institution Admin"
      items={[]}
    />
  ),
});
