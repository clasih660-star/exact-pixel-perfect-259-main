import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AIVideoClassroom } from "@/components/classroom/AIVideoClassroom";
import { loadClassroomLesson } from "@/lib/classroom-lesson.functions";
import { buildDemoLessonContent } from "@/lib/classroom-content.demo";
import { startLearnerSession, endSession } from "@/lib/live-sessions.functions";
import type { ClassroomLessonContent } from "@/lib/classroom-content";

export const Route = createFileRoute("/classroom/$lessonId")({
  head: () => ({
    meta: [
      { title: "Classroom — Klassruum" },
      { name: "description", content: "Live AI teacher classroom." },
    ],
  }),
  component: Classroom,
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The live AI classroom. For a real (UUID) lesson id it loads the published
 * lesson — sections, teaching items, and the course's own material text for
 * grounded question answering — and teaches it in the teacher-first classroom.
 * Any non-UUID id (e.g. the marketing demo links) falls back to the built-in
 * quadratic-equations demo, so existing entry points keep working.
 */
function Classroom() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState<ClassroomLessonContent | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  /** Real DB session backing this classroom (only for real, UUID lessons). */
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    if (!UUID_RE.test(lessonId)) {
      // Demo / non-database lesson id → built-in demo content (no DB session).
      setContent(buildDemoLessonContent());
      setStatus("ready");
      return;
    }

    setStatus("loading");
    loadClassroomLesson({ data: { lesson_id: lessonId } })
      .then((res) => {
        if (cancelled) return;
        if (res.content) {
          setContent(res.content);
          setStatus("ready");
          // Start a real session so progress, events, and results persist.
          startLearnerSession({ data: { lesson_id: lessonId } })
            .then((s) => {
              if (!cancelled) setSessionId(s.sessionId);
            })
            .catch(() => {
              /* non-fatal: the lesson still plays without a session */
            });
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  function leaveClassroom() {
    if (sessionId) {
      endSession({ data: { session_id: sessionId } }).catch(() => {
        /* best-effort */
      });
    }
    navigate({ to: "/student/dashboard" });
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
          <p className="text-sm text-slate-400">Preparing your classroom…</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-200">
        <div>
          <h1 className="text-2xl font-semibold">Lesson not available</h1>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            This lesson has no published teaching content yet, or you don't have access to it.
            Ask your teacher to publish it, then try again.
          </p>
          <button
            onClick={() => navigate({ to: "/student/dashboard" })}
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <AIVideoClassroom
      content={content}
      sessionId={sessionId}
      onExit={leaveClassroom}
    />
  );
}
