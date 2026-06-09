import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/programmes")({
  component: () => (
    <RouteStubPage
      title="Programmes"
      description="Manage your institution programmes"
      role="Institution Admin"
      items={[]}
    />
  ),
});
