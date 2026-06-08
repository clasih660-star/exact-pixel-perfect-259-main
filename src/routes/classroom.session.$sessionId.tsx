import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { InteractiveClassroomPage } from "@/components/classroom/InteractiveClassroomPage";
import { getClassroomContext, endSession } from "@/lib/sessions.functions";

export const Route = createFileRoute("/classroom/session/$sessionId")({
  component: ClassroomSessionRoute,
});

function ClassroomSessionRoute() {
  const { sessionId } = Route.useParams();
  const router = useRouter();
  const classroomFn = useServerFn(getClassroomContext);
  const endFn = useServerFn(endSession);

  const query = useQuery({
    queryKey: ["classroom-context", sessionId],
    queryFn: () => classroomFn({ data: { session_id: sessionId } }),
  });

  if (query.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--gray-50)] text-[var(--gray-600)]">
        Loading classroom...
      </div>
    );
  }

  if (query.isError || !query.data?.session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--gray-50)] text-[var(--gray-600)]">
        Classroom session not found.
      </div>
    );
  }

  return (
    <InteractiveClassroomPage
      classroomContext={query.data}
      sessionId={sessionId}
      onEndLesson={async () => {
        await endFn({ data: { session_id: sessionId } });
        await router.navigate({ to: "/student/dashboard" });
      }}
    />
  );
}
