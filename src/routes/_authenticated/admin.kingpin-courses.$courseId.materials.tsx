import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/$courseId/materials")({
  component: () => (
    <RouteStubPage
      title="Course Materials"
      description="Manage KingPin course materials"
      role="Platform Admin"
      items={[]}
    />
  ),
});
