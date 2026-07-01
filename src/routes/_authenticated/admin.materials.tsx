import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/materials")({
  component: () => (
    <RouteStubPage
      title="All Materials"
      description="View all course materials"
      role="Platform Admin"
      items={[]}
    />
  ),
});
