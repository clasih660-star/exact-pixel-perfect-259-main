import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/edit")({
  component: () => (
    <RouteStubPage
      title="Edit Course"
      description="Edit course details and settings"
      role="Institution Admin"
      items={[]}
    />
  ),
});
