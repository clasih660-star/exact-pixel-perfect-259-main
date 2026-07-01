import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/transcripts")({
  component: () => (
    <RouteStubPage
      title="Transcripts"
      description="View your classroom transcripts"
      role="Learner"
      items={[]}
    />
  ),
});
