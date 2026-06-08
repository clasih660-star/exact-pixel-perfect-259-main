/**
 * useClassroomEngine.ts
 *
 * React hook that wires the classroom reducer to server functions.
 * Every user action:
 *   1. Dispatches to the reducer for immediate UI update (optimistic)
 *   2. Calls the server function to persist
 *   3. Reconciles any server response back
 */

import { useReducer, useCallback, useEffect, useRef } from "react";
import {
  classroomReducer,
  initialClassroomState,
  selectCurrentStep,
  getNextStep,
  selectIsLastStep,
  type ClassroomState,
  type ClassroomAction,
} from "@/lib/classroom.reducer";
import type { LessonStepKey, LearnerAccessProfile } from "@/lib/types";
import {
  getClassroomContextV2,
  postChatMessageV2,
  postQuickActionV2,
  changeClassroomStepV2,
  saveBoardNotesV2,
  updateAccessProfileV2,
  submitQuizResultV2,
  endSessionV2,
  saveSessionEvent,
  saveNotes,
  startOrResumeClassroomV2,
} from "@/lib/classroom.engine";

export type ClassroomEngine = {
  state: ClassroomState;
  // Lifecycle
  enterClassroom: (sessionId: string) => Promise<void>;
  startOrResume: (courseId: string, lessonId: string) => Promise<void>;
  endClassroom: () => Promise<void>;
  // Audio
  startAudio: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  // Chat
  sendMessage: (message: string) => Promise<void>;
  // Quick actions
  triggerQuickAction: (action: string, message: string) => Promise<void>;
  // Navigation
  goToStep: (step: LessonStepKey) => Promise<void>;
  nextStep: () => Promise<void>;
  // Quiz
  startQuiz: () => void;
  answerQuiz: (answerIndex: number) => Promise<void>;
  finishQuiz: (score: number, answers: number[], quizId: string) => Promise<void>;
  // Notes
  saveCurrentNotes: (notes: string[], title?: string) => Promise<void>;
  saveBoardNotes: (lines: string[], description: string, title?: string) => Promise<void>;
  // Access
  updateAccess: (changes: Partial<LearnerAccessProfile>) => Promise<void>;
  toggleFocusMode: () => void;
  // Captions
  addCaption: (text: string) => void;
  clearCaptions: () => void;
};

export function useClassroomEngine(): ClassroomEngine {
  const [state, dispatch] = useReducer(classroomReducer, initialClassroomState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // ── Timer: tick every 60s while session is live ────────────────────────
  useEffect(() => {
    if (state.sessionStatus === "live" && !timerRef.current) {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 60000);
    }
    if (state.sessionStatus !== "live" && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.sessionStatus]);

  // Keep ref in sync
  useEffect(() => {
    sessionIdRef.current = state.sessionId;
  }, [state.sessionId]);

  // ── Enter existing classroom ───────────────────────────────────────────
  const enterClassroom = useCallback(async (sessionId: string) => {
    dispatch({ type: "ENTER_CLASSROOM", payload: { sessionId, courseId: "", lessonId: "", institutionId: "" } });

    try {
      const ctx = await getClassroomContextV2({ data: { session_id: sessionId } });

      dispatch({
        type: "LOAD_CONTEXT",
        payload: {
          sessionId: ctx.session.id,
          courseId: ctx.session.courseId,
          lessonId: ctx.session.lessonId,
          institutionId: ctx.session.institutionId,
          progressPercentage: ctx.progress?.progressPercentage ?? 0,
          confusionScore: ctx.progress?.confusionScore ?? 0,
          studentLevel: ctx.progress?.studentLevel ?? "intermediate",
          currentStepKey: ctx.progress?.currentStep ?? "hook",
          messages: ctx.messages ?? [],
          access: ctx.learnerAccessProfile ?? undefined,
          sessionStatus: "live",
        } as Partial<ClassroomState>,
      });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: { error: err.message ?? "Failed to load classroom" } });
    }
  }, []);

  // ── Start or resume ────────────────────────────────────────────────────
  const startOrResume = useCallback(async (courseId: string, lessonId: string) => {
    dispatch({ type: "SET_LOADING", payload: { isLoading: true } });

    try {
      const result = await startOrResumeClassroomV2({ data: { courseId, lessonId } });
      if (result?.sessionId) {
        await enterClassroom(result.sessionId);
      }
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: { error: err.message ?? "Failed to start classroom" } });
    }
  }, [enterClassroom]);

  // ── End classroom ──────────────────────────────────────────────────────
  const endClassroom = useCallback(async () => {
    if (!state.sessionId) return;
    dispatch({ type: "SET_LOADING", payload: { isLoading: true } });

    try {
      await endSessionV2({
        data: {
          session_id: state.sessionId,
          final_progress_percentage: state.progressPercentage,
          final_confusion_score: state.confusionScore,
          final_step: state.currentStepKey,
        },
      });
      dispatch({
        type: "END_SESSION",
        payload: {
          finalProgressPercentage: state.progressPercentage,
          finalConfusionScore: state.confusionScore,
        },
      });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: { error: err.message ?? "Failed to end session" } });
    }
  }, [state.sessionId, state.progressPercentage, state.confusionScore, state.currentStepKey]);

  // ── Audio controls ─────────────────────────────────────────────────────
  const startAudio = useCallback(() => {
    dispatch({ type: "START_AUDIO" });
    if (state.sessionId) {
      saveSessionEvent({
        data: {
          session_id: state.sessionId,
          event_type: "audio_started",
          actor_role: "student",
          event_source: "audio",
          payload: { step: state.currentStepKey },
          request_key: `audio_start_${state.sessionId}_${state.currentStepKey}_${Date.now()}`,
        },
      }).catch(() => {});
    }
  }, [state.sessionId, state.currentStepKey]);

  const pauseAudio = useCallback(() => {
    dispatch({ type: "PAUSE_AUDIO" });
  }, []);

  const resumeAudio = useCallback(() => {
    dispatch({ type: "RESUME_AUDIO" });
  }, []);

  // ── Send message ───────────────────────────────────────────────────────
  const sendMessage = useCallback(async (message: string) => {
    if (!state.sessionId) return;
    dispatch({ type: "SEND_MESSAGE", payload: { message } });

    try {
      await postChatMessageV2({
        data: {
          session_id: state.sessionId,
          message,
          sender: "student",
          request_key: `msg_${Date.now()}`,
        },
      });
    } catch {
      // Optimistic already applied; log silently
    }
  }, [state.sessionId]);

  // ── Quick action ───────────────────────────────────────────────────────
  const triggerQuickAction = useCallback(async (action: string, message: string) => {
    if (!state.sessionId) return;
    dispatch({ type: "QUICK_ACTION", payload: { action, message } });

    try {
      await postQuickActionV2({
        data: {
          session_id: state.sessionId,
          action,
          message,
          request_key: `qa_${state.sessionId}_${action}_${Date.now()}`,
        },
      });
    } catch {
      // Optimistic already applied
    }
  }, [state.sessionId]);

  // ── Step navigation ────────────────────────────────────────────────────
  const goToStep = useCallback(async (step: LessonStepKey) => {
    if (!state.sessionId) return;
    dispatch({ type: "CHANGE_STEP", payload: { targetStep: step } });

    try {
      await changeClassroomStepV2({
        data: {
          session_id: state.sessionId,
          targetStep: step,
        },
      });
    } catch {
      // Optimistic already applied
    }
  }, [state.sessionId]);

  const nextStep = useCallback(async () => {
    const next = getNextStep(state.currentStepKey);
    if (next) await goToStep(next);
  }, [state.currentStepKey, goToStep]);

  // ── Quiz ───────────────────────────────────────────────────────────────
  const startQuiz = useCallback(() => {
    dispatch({ type: "START_QUIZ" });
    if (state.sessionId) {
      saveSessionEvent({
        data: {
          session_id: state.sessionId,
          event_type: "quiz_started",
          actor_role: "student",
          event_source: "quiz",
          payload: { step: state.currentStepKey },
        },
      }).catch(() => {});
    }
  }, [state.sessionId, state.currentStepKey]);

  const answerQuiz = useCallback(async (answerIndex: number) => {
    dispatch({ type: "ANSWER_QUIZ", payload: { answerIndex } });
  }, []);

  const finishQuiz = useCallback(async (score: number, answers: number[], quizId: string) => {
    dispatch({ type: "FINISH_QUIZ", payload: { score } });

    if (state.sessionId) {
      try {
        await submitQuizResultV2({
          data: {
            session_id: state.sessionId,
            quiz_id: quizId,
            lesson_id: state.lessonId ?? "",
            score,
            percentage: score,
            answers_json: answers,
            request_key: `quiz_${state.sessionId}_${quizId}`,
          },
        });
      } catch {
        // Optimistic already applied
      }
    }
  }, [state.sessionId, state.lessonId]);

  // ── Notes ──────────────────────────────────────────────────────────────
  const saveCurrentNotes = useCallback(async (notes: string[], title?: string) => {
    dispatch({ type: "SAVE_NOTES", payload: { notes, title } });

    if (state.sessionId && state.lessonId) {
      try {
        await saveNotes({
          data: {
            session_id: state.sessionId,
            lesson_id: state.lessonId,
            title: title ?? "Session Notes",
            body: notes.join("\n"),
            notes_json: notes,
            source_type: "manual",
          },
        });
      } catch {
        // Optimistic already applied
      }
    }
  }, [state.sessionId, state.lessonId]);

  const saveBoardNotes = useCallback(async (lines: string[], description: string, title?: string) => {
    if (!state.sessionId) return;
    dispatch({ type: "UPDATE_BOARD", payload: { items: lines, description } });

    try {
      await saveBoardNotesV2({
        data: {
          session_id: state.sessionId,
          whiteboardContent: lines,
          description,
          title: title ?? "Board Notes",
        },
      });
    } catch {
      // Optimistic already applied
    }
  }, [state.sessionId]);

  // ── Access ─────────────────────────────────────────────────────────────
  const updateAccess = useCallback(async (changes: Partial<LearnerAccessProfile>) => {
    dispatch({ type: "UPDATE_ACCESS", payload: changes });

    try {
      await updateAccessProfileV2({
        data: {
          session_id: state.sessionId ?? undefined,
          ...changes,
        },
      });
    } catch {
      // Optimistic already applied
    }
  }, [state.sessionId]);

  const toggleFocusMode = useCallback(() => {
    dispatch({ type: "TOGGLE_FOCUS_MODE" });
  }, []);

  // ── Captions ───────────────────────────────────────────────────────────
  const addCaption = useCallback((text: string) => {
    dispatch({ type: "ADD_CAPTION", payload: { text } });
  }, []);

  const clearCaptions = useCallback(() => {
    dispatch({ type: "CLEAR_CAPTIONS" });
  }, []);

  return {
    state,
    enterClassroom,
    startOrResume,
    endClassroom,
    startAudio,
    pauseAudio,
    resumeAudio,
    sendMessage,
    triggerQuickAction,
    goToStep,
    nextStep,
    startQuiz,
    answerQuiz,
    finishQuiz,
    saveCurrentNotes,
    saveBoardNotes,
    updateAccess,
    toggleFocusMode,
    addCaption,
    clearCaptions,
  };
}