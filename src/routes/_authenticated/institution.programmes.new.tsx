import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/programmes/new")({
  component: () => (
    <RouteStubPage
      title="Create Programme"
      description="Create a new academic programme"
      role="Institution Admin"
      items={[]}
    />
  ),
});
