import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { TeacherLiveClassroomPage } from "@/components/classroom/TeacherLiveClassroomPage";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { requireInstitutionStaff } from "@/lib/route-guards";
import { getClassroomContext, postChatMessage } from "@/lib/sessions.functions";
import { endSession as endLiveSession } from "@/lib/live-sessions.functions";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/teacher/sessions/$sessionId")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: TeacherSessionDetailRoute,
});

function TeacherSessionDetailRoute() {
  const { sessionId } = Route.useParams();
  const router = useRouter();
  const classroomFn = useServerFn(getClassroomContext);
  const postFn = useServerFn(postChatMessage);
  const endFn = useServerFn(endLiveSession);

  const query = useQuery({
    queryKey: ["teacher-live-session", sessionId],
    queryFn: () => classroomFn({ data: { session_id: sessionId } }),
  });

  if (query.isLoading) {
    return (
      <DashboardShell config={dashboardConfigs.teacher} activePath="/teacher/sessions" title="Live Classroom">
        <div className="rounded-3xl border border-[#D9E7EE] bg-white p-10 text-center shadow-sm">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#1F7C80]" />
          <p className="mt-4 text-sm text-[#61758A]">Loading teacher live classroom…</p>
        </div>
      </DashboardShell>
    );
  }

  if (query.isError || !query.data?.session) {
    return (
      <DashboardShell config={dashboardConfigs.teacher} activePath="/teacher/sessions" title="Live Classroom">
        <div className="rounded-3xl border border-[#D9E7EE] bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-[#132033]">Session not available</p>
          <p className="mt-2 text-sm text-[#61758A]">
            This session could not be loaded right now. Return to the sessions list and try again.
          </p>
          <Button className="mt-5 bg-[#1F7C80] hover:bg-[#1A5256]" onClick={() => void router.navigate({ to: "/teacher/sessions" })}>
            Back to sessions
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      config={dashboardConfigs.teacher}
      activePath="/teacher/sessions"
      title="Teacher Live Classroom"
      subtitle="Run the lesson in real time, monitor learners, and manage live class interactions."
    >
      <TeacherLiveClassroomPage
        sessionId={sessionId}
        classroomContext={query.data}
        onEndSession={async () => {
          await endFn({ data: { session_id: sessionId } });
          await router.navigate({ to: "/teacher/sessions" });
        }}
        onBroadcast={async (message) => {
          await postFn({
            data: {
              session_id: sessionId,
              message,
              sender: "teacher",
              message_type: "announcement",
            },
          });
          await query.refetch();
        }}
      />
    </DashboardShell>
  );
}
