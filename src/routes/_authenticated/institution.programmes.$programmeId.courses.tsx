import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/programmes/$programmeId/courses")({
  component: () => (
    <RouteStubPage
      title="Programme Courses"
      description="Manage courses in this programme"
      role="Institution Admin"
      items={[]}
    />
  ),
});
