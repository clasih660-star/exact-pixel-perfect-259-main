import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/lesson-generation/$jobId")({
  component: () => (
    <RouteStubPage
      title="Generation Job"
      description="View generation job details"
      role="Platform Admin"
      items={[]}
    />
  ),
});
