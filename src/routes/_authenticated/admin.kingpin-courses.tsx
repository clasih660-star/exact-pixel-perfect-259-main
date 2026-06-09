import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses")({
  component: () => (
    <RouteStubPage
      title="KingPin Courses"
      description="Platform-owned courses for licensing"
      role="Platform Admin"
      items={[]}
    />
  ),
});
