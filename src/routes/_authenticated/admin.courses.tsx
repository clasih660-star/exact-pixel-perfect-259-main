import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/courses")({
  component: () => (
    <RouteStubPage
      title="All Courses"
      description="View all courses across the platform"
      role="Platform Admin"
      items={[]}
    />
  ),
});
