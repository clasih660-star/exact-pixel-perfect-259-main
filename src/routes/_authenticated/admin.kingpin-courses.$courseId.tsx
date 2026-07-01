import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/kingpin-courses/$courseId")({
  component: () => (
    <RouteStubPage
      title="KingPin Course"
      description="Manage KingPin course"
      role="Platform Admin"
      items={[]}
    />
  ),
});
