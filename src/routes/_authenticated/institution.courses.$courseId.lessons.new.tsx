import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/lessons/new")({
  component: () => (
    <RouteStubPage
      title="Create Lesson"
      description="Create a new lesson manually"
      role="Institution Admin"
      items={[]}
    />
  ),
});
