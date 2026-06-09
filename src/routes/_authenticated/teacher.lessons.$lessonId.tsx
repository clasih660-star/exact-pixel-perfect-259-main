import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/teacher/lessons/$lessonId")({
  component: () => (
    <RouteStubPage
      title="Lesson Detail"
      description="View lesson details"
      role="Teacher"
      items={[]}
    />
  ),
});
