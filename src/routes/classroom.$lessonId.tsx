import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AIVideoClassroom } from "@/components/classroom/AIVideoClassroom";
import { loadClassroomLesson } from "@/lib/classroom-lesson.functions";
import { getDemoLessonContent } from "@/lib/demo-lessons/demo-lesson-registry";
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
 * lesson from the database. Any non-UUID id is looked up from the demo lesson
 * registry (supports multiple demo subjects: math, chemistry, english, etc.).
 */
function Classroom() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState<ClassroomLessonContent | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    // ── Demo lesson (non-UUID ID) ─────────────────────────────────────
    if (!UUID_RE.test(lessonId)) {
      const demoContent = getDemoLessonContent(lessonId);
      if (demoContent) {
        setContent(demoContent);
        setStatus("ready");
      } else {
        // Unknown demo ID — fall back to the default math demo
        const fallback = getDemoLessonContent("demo");
        if (fallback) {
          setContent(fallback);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      }
      return;
    }

    // ── Real database lesson (UUID) ───────────────────────────────────
    setStatus("loading");
    loadClassroomLesson({ data: { lesson_id: lessonId } })
      .then((res) => {
        if (cancelled) return;
        if (res.content) {
          setContent(res.content);
          setStatus("ready");
          startLearnerSession({ data: { lesson_id: lessonId } })
            .then((s) => {
              if (!cancelled) setSessionId(s.sessionId);
            })
            .catch(() => {
              /* non-fatal */
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
      endSession({ data: { session_id: sessionId } }).catch(() => {});
    }
    navigate({ to: "/student/dashboard" });
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-[#0F172A]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#1F7C80]" />
          <p className="text-sm text-[#64748B]">Preparing your classroom…</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 text-center text-[#0F172A]">
        <div>
          <h1 className="text-2xl font-semibold">Lesson not available</h1>
          <p className="mt-2 max-w-md text-sm text-[#64748B]">
            This lesson has no published teaching content yet, or you don't have access to it.
          </p>
          <button
            onClick={() => navigate({ to: "/student/dashboard" })}
            className="mt-6 inline-block rounded-lg bg-[#1F7C80] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1A5256]"
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
      autoPlay={true}
    />
  );
}
