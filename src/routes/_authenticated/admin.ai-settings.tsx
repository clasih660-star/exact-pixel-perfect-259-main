import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/ai-settings")({
  component: () => (
    <RouteStubPage
      title="AI Settings"
      description="Configure AI providers and generation defaults"
      role="Platform Admin"
      items={[]}
    />
  ),
});
