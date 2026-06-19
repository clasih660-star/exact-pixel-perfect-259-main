/**
 * useTeachingEngine.ts
 *
 * React hook that drives the real-teacher classroom flow:
 *   explain → write → read → explain written → warn → check → next
 *
 * This hook manages:
 *   - The teaching orchestrator state machine
 *   - Speech synthesis (TTS) for reading and explaining
 *   - Automatic phase transitions based on speech events
 *   - Transcript and learner notes accumulation
 *   - Pause timers between items
 */

import { useReducer, useCallback, useEffect, useRef } from "react";
import {
  teachingReducer,
  initialTeachingState,
  selectCurrentItem,
  selectCurrentSpeech,
  selectTeachingProgress,
  selectIsTeaching,
  generateLearnerNotesText,
  generateTranscriptText,
  type TeachingState,
  type TeachingPhase,
} from "@/lib/teaching-orchestrator";
import type { MathTeachingItem } from "@/lib/lesson-models";
import { speak, stopSpeech } from "@/lib/speech";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TeachingEngine = {
  /** Current teaching state */
  teachingState: TeachingState;
  /** Current item being taught */
  currentItem: MathTeachingItem | null;
  /** Current phase (writing, reading, explaining, warning, checking, etc.) */
  currentPhase: TeachingPhase;
  /** What the teacher should be speaking right now */
  currentSpeech: string | null;
  /** Progress through the teaching sequence */
  progress: { currentItem: number; totalItems: number; percentage: number };
  /** Whether teaching is active */
  isTeaching: boolean;
  /** Board lines accumulated so far */
  boardLines: string[];
  /** Whether the common mistake warning is currently visible */
  isWarningVisible: boolean;

  // ── Actions ──
  /** Start teaching a sequence of items */
  startTeaching: (items: MathTeachingItem[]) => void;
  /** Signal that the board animation has finished writing */
  onBoardWritten: () => void;
  /** Signal that the teacher finished reading the exact text */
  onReadingDone: () => void;
  /** Signal that the teacher finished explaining */
  onExplanationDone: () => void;
  /** Signal that the common mistake warning was shown */
  onWarningShown: () => void;
  /** Signal that the learner confirmed understanding */
  onUnderstandingChecked: () => void;
  /** Skip to the next item */
  skipToNext: () => void;
  /** Pause the teaching flow */
  pauseTeaching: () => void;
  /** Reset the teaching state completely */
  resetTeaching: () => void;
  /** Get the full learner notes text */
  getLearnerNotesText: (lessonTitle: string) => string;
  /** Get the full transcript text */
  getTranscriptText: () => string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useTeachingEngine(): TeachingEngine {
  const [teachingState, dispatch] = useReducer(teachingReducer, initialTeachingState);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechRateRef = useRef(1);

  // ── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopSpeech();
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // ── Auto-handle pause phase ────────────────────────────────────────────
  useEffect(() => {
    if (teachingState.currentPhase === "pausing") {
      const item = selectCurrentItem(teachingState);
      const pauseMs = item?.pauseAfter ?? 1000;

      pauseTimerRef.current = setTimeout(() => {
        dispatch({ type: "PAUSE_DONE" });
      }, pauseMs);

      return () => {
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      };
    }
  }, [teachingState.currentPhase]);

  // ── Derived values ─────────────────────────────────────────────────────
  const currentItem = selectCurrentItem(teachingState);
  const currentSpeech = selectCurrentSpeech(teachingState);
  const progress = selectTeachingProgress(teachingState);
  const isTeaching = selectIsTeaching(teachingState);
  const isWarningVisible = teachingState.currentPhase === "warning";

  // ── Actions ────────────────────────────────────────────────────────────

  const startTeaching = useCallback((items: MathTeachingItem[]) => {
    dispatch({ type: "START_TEACHING", items });
  }, []);

  const onBoardWritten = useCallback(() => {
    dispatch({ type: "BOARD_WRITTEN" });

    // After board writes, speak the exact text
    const state_after = teachingReducer(teachingState, { type: "BOARD_WRITTEN" });
    const item = selectCurrentItem(state_after);
    if (item) {
      speak(item.exactSpokenText, () => {
        dispatch({ type: "READING_DONE" });
        // After reading, speak the explanation
        const state_after_read = teachingReducer(state_after, { type: "READING_DONE" });
        const currentItemAfterRead = selectCurrentItem(state_after_read);
        if (currentItemAfterRead) {
          speak(currentItemAfterRead.teacherExplanation, () => {
            dispatch({ type: "EXPLANATION_DONE" });
          });
        }
      });
    }
  }, [teachingState]);

  const onReadingDone = useCallback(() => {
    // This is handled by the speech onEnd callback in onBoardWritten
    // But expose it for manual control if needed
  }, []);

  const onExplanationDone = useCallback(() => {
    // This is handled by the speech onEnd callback in onBoardWritten
    // But expose it for manual control if needed
  }, []);

  const onWarningShown = useCallback(() => {
    const item = selectCurrentItem(teachingState);
    if (item?.commonMistake) {
      speak(`Watch out! ${item.commonMistake}`, () => {
        dispatch({ type: "WARNING_SHOWN" });
      });
    } else {
      dispatch({ type: "WARNING_SHOWN" });
    }
  }, [teachingState]);

  const onUnderstandingChecked = useCallback(() => {
    dispatch({ type: "UNDERSTANDING_CHECKED" });
  }, []);

  const skipToNext = useCallback(() => {
    stopSpeech();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    dispatch({ type: "NEXT_ITEM" });
  }, []);

  const pauseTeaching = useCallback(() => {
    stopSpeech();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  }, []);

  const resetTeaching = useCallback(() => {
    stopSpeech();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    dispatch({ type: "RESET" });
  }, []);

  const getLearnerNotesText = useCallback(
    (lessonTitle: string) => {
      return generateLearnerNotesText(lessonTitle, teachingState.learnerNotes);
    },
    [teachingState.learnerNotes],
  );

  const getTranscriptText = useCallback(() => {
    return generateTranscriptText(teachingState.transcript);
  }, [teachingState.transcript]);

  return {
    teachingState,
    currentItem,
    currentPhase: teachingState.currentPhase,
    currentSpeech,
    progress,
    isTeaching,
    boardLines: teachingState.boardLines,
    isWarningVisible,

    startTeaching,
    onBoardWritten,
    onReadingDone,
    onExplanationDone,
    onWarningShown,
    onUnderstandingChecked,
    skipToNext,
    pauseTeaching,
    resetTeaching,
    getLearnerNotesText,
    getTranscriptText,
  };
}
