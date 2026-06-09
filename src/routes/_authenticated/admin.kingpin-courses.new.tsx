import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/new")({
  component: () => (
    <RouteStubPage
      title="New KingPin Course"
      description="Create a platform-owned course"
      role="Platform Admin"
      items={[]}
    />
  ),
});
