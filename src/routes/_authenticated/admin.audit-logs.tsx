import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/admin/audit-logs")({
  component: () => (
    <RouteStubPage
      title="Audit Logs"
      description="Platform audit trail"
      role="Platform Admin"
      items={[]}
    />
  ),
});
