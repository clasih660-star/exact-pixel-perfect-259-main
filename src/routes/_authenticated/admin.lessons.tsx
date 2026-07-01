import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/lessons")({
  component: () => (
    <RouteStubPage
      title="All Lessons"
      description="View all lessons across the platform"
      role="Platform Admin"
      items={[]}
    />
  ),
});
