import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { InteractiveClassroomPage } from "@/components/classroom/InteractiveClassroomPage";
import { LearnerLiveClassroomPage } from "@/components/classroom/LearnerLiveClassroomPage";
import { TeacherLiveClassroomPage } from "@/components/classroom/TeacherLiveClassroomPage";
import { getClassroomContext, endSession } from "@/lib/sessions.functions";
import { leaveSession, endSession as endLiveSession } from "@/lib/live-sessions.functions";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postChatMessage } from "@/lib/sessions.functions";

export const Route = createFileRoute("/classroom/session/$sessionId")({
  component: ClassroomSessionRoute,
});

function LoadingSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-[var(--gray-50)]">
      <div className="flex h-14 items-center border-b border-[var(--gray-200)] bg-white px-4">
        <div className="h-4 w-20 animate-pulse rounded bg-[var(--gray-200)]" />
        <div className="ml-4 h-4 w-48 animate-pulse rounded bg-[var(--gray-200)]" />
        <div className="ml-auto flex items-center gap-4">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--gray-200)]" />
          <div className="h-4 w-20 animate-pulse rounded bg-[var(--gray-200)]" />
        </div>
      </div>
      <div className="flex flex-1">
        <aside className="w-[23%] min-w-[220px] border-r border-[var(--gray-200)] bg-white p-4">
          <div className="mx-auto mb-4 h-[120px] w-[120px] animate-pulse rounded-full bg-[var(--gray-200)]" />
          <div className="mx-auto mb-3 h-4 w-24 animate-pulse rounded bg-[var(--gray-200)]" />
          <div className="mx-auto mb-6 h-3 w-32 animate-pulse rounded bg-[var(--gray-200)]" />
          <div className="space-y-3">
            <div className="h-3 w-full animate-pulse rounded bg-[var(--gray-200)]" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--gray-200)]" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--gray-200)]" />
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="mb-6 h-6 w-64 animate-pulse rounded bg-[var(--gray-200)]" />
          <div className="mb-6 h-20 w-full animate-pulse rounded-lg bg-[var(--gray-200)]" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i: any) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-[var(--gray-200)]" />
            ))}
          </div>
        </main>
        <aside className="w-[25%] min-w-[240px] border-l border-[var(--gray-200)] bg-white p-4">
          <div className="mb-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((i: any) => (
              <div key={i} className="h-8 flex-1 animate-pulse rounded bg-[var(--gray-200)]" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i: any) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-[var(--gray-200)]" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ClassroomSessionRoute() {
  const { sessionId } = Route.useParams();
  const router = useRouter();
  const classroomFn = useServerFn(getClassroomContext);
  const endFn = useServerFn(endSession);
  const leaveFn = useServerFn(leaveSession);
  const postFn = useServerFn(postChatMessage);
  const endLiveFn = useServerFn(endLiveSession);

  const query = useQuery({
    queryKey: ["classroom-context", sessionId],
    queryFn: () => classroomFn({ data: { session_id: sessionId } }),
  });
  const shouldUseTeacherRoute = Boolean(query.data?.viewer?.isInstitutionStaff);

  useEffect(() => {
    if (!shouldUseTeacherRoute) return;
    void router.navigate({
      to: "/teacher/sessions/$sessionId",
      params: { sessionId },
    });
  }, [router, sessionId, shouldUseTeacherRoute]);

  if (query.isLoading) {
    return <LoadingSkeleton />;
  }

  if (query.isError || !query.data?.session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--gray-50)] px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Loader2 className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-[var(--gray-900)]">Session not available</h2>
          <p className="mb-6 text-sm leading-relaxed text-[var(--gray-500)]">
            This classroom session could not be found or may have ended. Return to your dashboard to
            continue learning.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link to="/student/classrooms">Return to classrooms</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (shouldUseTeacherRoute) {
    return <LoadingSkeleton />;
  }

  const isTeacherHost = Boolean(query.data.viewer?.isInstitutionStaff);

  if (
    isTeacherHost &&
    (query.data.session?.mode === "human_teacher" || query.data.session?.mode === "hybrid")
  ) {
    return (
      <TeacherLiveClassroomPage
        classroomContext={query.data}
        sessionId={sessionId}
        onEndSession={async () => {
          await endLiveFn({ data: { session_id: sessionId } });
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
    );
  }

  if (query.data.session?.mode === "human_teacher" || query.data.session?.mode === "hybrid") {
    return (
      <LearnerLiveClassroomPage
        classroomContext={query.data}
        sessionId={sessionId}
        onLeaveSession={async () => {
          if (query.data.session?.status === "completed") {
            await router.navigate({ to: "/student/classrooms" });
            return;
          }
          await leaveFn({ data: { session_id: sessionId } });
          await router.navigate({ to: "/student/classrooms" });
        }}
        onAskQuestion={async (message) => {
          await postFn({
            data: {
              session_id: sessionId,
              message,
              sender: "student",
              message_type: "question",
            },
          });
          await query.refetch();
        }}
      />
    );
  }

  return (
    <InteractiveClassroomPage
      classroomContext={query.data as any}
      sessionId={sessionId}
      onEndLesson={async () => {
        if (query.data.session?.mode === "human_teacher" || query.data.session?.mode === "hybrid") {
          await endLiveFn({ data: { session_id: sessionId } });
        } else {
          await endFn({ data: { session_id: sessionId } });
        }
        await router.navigate({ to: "/student/dashboard" });
      }}
    />
  );
}
