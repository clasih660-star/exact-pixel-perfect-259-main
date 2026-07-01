import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/institutions/$institutionId/courses")({
  component: () => (
    <RouteStubPage
      title="Institution Courses"
      description="View institution courses"
      role="Platform Admin"
      items={[]}
    />
  ),
});
