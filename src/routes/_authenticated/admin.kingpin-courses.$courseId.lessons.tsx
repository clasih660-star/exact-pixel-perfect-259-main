import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/$courseId/lessons")({
  component: () => (
    <RouteStubPage
      title="Course Lessons"
      description="View KingPin course lessons"
      role="Platform Admin"
      items={[]}
    />
  ),
});
