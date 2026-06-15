/**
 * teaching-orchestrator.ts
 *
 * The classroom teaching engine for Klassruum.
 *
 * Real teachers don't just write formulas on a board. They:
 *   1. Explain the goal of the step
 *   2. Write the calculation on the whiteboard
 *   3. Read the written calculation exactly
 *   4. Explain what the calculation means
 *   5. Explain why that step is valid
 *   6. Warn about common mistakes
 *   7. Ask or check if the learner understands
 *   8. Move to the next step
 *
 * This orchestrator drives that flow for each MathTeachingItem.
 */

import type { MathTeachingItem } from "./lesson-models";

// ─────────────────────────────────────────────────────────────────────────────
// Teaching Phase — Where we are in the teaching cycle for one item
// ─────────────────────────────────────────────────────────────────────────────

export type TeachingPhase =
  | "idle"
  | "writing" // Teacher is writing on the board
  | "reading" // Teacher reads the board text exactly
  | "explaining" // Teacher explains what was written
  | "warning" // Teacher warns about common mistakes
  | "checking" // Teacher checks understanding
  | "pausing" // Pause before next item
  | "complete"; // This item is done, ready for next

// ─────────────────────────────────────────────────────────────────────────────
// Transcript Entry — What was said and when
// ─────────────────────────────────────────────────────────────────────────────

export type TeachingTranscriptEntry = {
  id: string;
  itemId: string;
  /** Which phase of teaching this entry records */
  phase: "reading" | "explaining" | "warning";
  /** The exact text spoken */
  spokenText: string;
  /** What appeared on the board at this point */
  boardText: string;
  timestamp: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Learner Note Entry — Preserved narrative for revision
// ─────────────────────────────────────────────────────────────────────────────

export type LearnerNoteEntry = {
  itemId: string;
  stepNumber: number;
  boardText: string;
  teacherExplanation: string;
  whyThisStepMatters: string;
  commonMistake?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Teaching State — Tracks where we are in the overall lesson
// ─────────────────────────────────────────────────────────────────────────────

export type TeachingState = {
  /** Current item being taught */
  currentItemIndex: number;
  /** Current phase within the current item */
  currentPhase: TeachingPhase;
  /** All items in the current teaching sequence */
  items: MathTeachingItem[];
  /** Accumulated board text (what the learner sees) */
  boardLines: string[];
  /** Full transcript of what was spoken */
  transcript: TeachingTranscriptEntry[];
  /** Accumulated learner notes */
  learnerNotes: LearnerNoteEntry[];
  /** Whether the overall teaching sequence is complete */
  isComplete: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions that the orchestrator can dispatch
// ─────────────────────────────────────────────────────────────────────────────

export type TeachingAction =
  | { type: "START_TEACHING"; items: MathTeachingItem[] }
  | { type: "BOARD_WRITTEN" } // Board animation finished
  | { type: "READING_DONE" } // Teacher finished reading exact text
  | { type: "EXPLANATION_DONE" } // Teacher finished explaining
  | { type: "WARNING_SHOWN" } // Common mistake warning shown
  | { type: "UNDERSTANDING_CHECKED" } // Learner confirmed understanding
  | { type: "PAUSE_DONE" } // Pause timer elapsed
  | { type: "NEXT_ITEM" } // Move to next teaching item
  | { type: "RESET" };

// ─────────────────────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────────────────────

export const initialTeachingState: TeachingState = {
  currentItemIndex: 0,
  currentPhase: "idle",
  items: [],
  boardLines: [],
  transcript: [],
  learnerNotes: [],
  isComplete: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Teaching Orchestrator Reducer
// ─────────────────────────────────────────────────────────────────────────────

export function teachingReducer(state: TeachingState, action: TeachingAction): TeachingState {
  switch (action.type) {
    // ── Start a new teaching sequence ────────────────────────────────────
    case "START_TEACHING": {
      if (action.items.length === 0) {
        return { ...state, isComplete: true };
      }
      const firstItem = action.items[0];
      return {
        ...state,
        items: action.items,
        currentItemIndex: 0,
        currentPhase: "writing",
        boardLines: [],
        transcript: [],
        learnerNotes: [],
        isComplete: false,
      };
    }

    // ── Board animation finished → start reading ─────────────────────────
    case "BOARD_WRITTEN": {
      const item = state.items[state.currentItemIndex];
      if (!item) return state;
      return {
        ...state,
        currentPhase: "reading",
        boardLines: [...state.boardLines, item.boardText],
      };
    }

    // ── Reading finished → start explaining ──────────────────────────────
    case "READING_DONE": {
      const item = state.items[state.currentItemIndex];
      if (!item) return state;
      return {
        ...state,
        currentPhase: "explaining",
        transcript: [
          ...state.transcript,
          {
            id: `transcript_${item.id}_read`,
            itemId: item.id,
            phase: "reading",
            spokenText: item.exactSpokenText,
            boardText: item.boardText,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    // ── Explanation finished → show warning or check understanding ───────
    case "EXPLANATION_DONE": {
      const item = state.items[state.currentItemIndex];
      if (!item) return state;

      const newTranscript = [
        ...state.transcript,
        {
          id: `transcript_${item.id}_explain`,
          itemId: item.id,
          phase: "explaining" as const,
          spokenText: item.teacherExplanation,
          boardText: item.boardText,
          timestamp: new Date().toISOString(),
        },
      ];

      const newNotes = [
        ...state.learnerNotes,
        {
          itemId: item.id,
          stepNumber: state.currentItemIndex + 1,
          boardText: item.boardText,
          teacherExplanation: item.teacherExplanation,
          whyThisStepMatters: item.whyThisStepMatters,
          commonMistake: item.commonMistake,
        },
      ];

      // If there's a common mistake, show warning next
      if (item.commonMistake) {
        return {
          ...state,
          currentPhase: "warning",
          transcript: newTranscript,
          learnerNotes: newNotes,
        };
      }

      // Otherwise, go to understanding check or pause
      const nextPhase = item.pauseAfter ? "pausing" : "checking";
      return {
        ...state,
        currentPhase: nextPhase,
        transcript: newTranscript,
        learnerNotes: newNotes,
      };
    }

    // ── Warning shown → check understanding or pause ─────────────────────
    case "WARNING_SHOWN": {
      const item = state.items[state.currentItemIndex];
      if (!item) return state;

      const newTranscript = [
        ...state.transcript,
        {
          id: `transcript_${item.id}_warn`,
          itemId: item.id,
          phase: "warning" as const,
          spokenText: item.commonMistake ?? "",
          boardText: item.boardText,
          timestamp: new Date().toISOString(),
        },
      ];

      const nextPhase = item.pauseAfter ? "pausing" : "checking";
      return {
        ...state,
        currentPhase: nextPhase,
        transcript: newTranscript,
      };
    }

    // ── Understanding checked → pause or move to next ────────────────────
    case "UNDERSTANDING_CHECKED": {
      const item = state.items[state.currentItemIndex];
      if (!item) return state;

      if (item.pauseAfter) {
        return { ...state, currentPhase: "pausing" };
      }
      return advanceToNextItem(state);
    }

    // ── Pause done → move to next item ───────────────────────────────────
    case "PAUSE_DONE": {
      return advanceToNextItem(state);
    }

    // ── Explicit next item ───────────────────────────────────────────────
    case "NEXT_ITEM": {
      return advanceToNextItem(state);
    }

    // ── Reset ────────────────────────────────────────────────────────────
    case "RESET": {
      return { ...initialTeachingState };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Advance to the next teaching item
// ─────────────────────────────────────────────────────────────────────────────

function advanceToNextItem(state: TeachingState): TeachingState {
  const nextIndex = state.currentItemIndex + 1;
  if (nextIndex >= state.items.length) {
    return { ...state, currentPhase: "complete", isComplete: true };
  }
  return {
    ...state,
    currentItemIndex: nextIndex,
    currentPhase: "writing",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export function selectCurrentItem(state: TeachingState): MathTeachingItem | null {
  return state.items[state.currentItemIndex] ?? null;
}

export function selectIsTeaching(state: TeachingState): boolean {
  return state.currentPhase !== "idle" && state.currentPhase !== "complete";
}

export function selectTeachingProgress(state: TeachingState): {
  currentItem: number;
  totalItems: number;
  percentage: number;
} {
  const total = state.items.length;
  const current = state.currentItemIndex + 1;
  return {
    currentItem: current,
    totalItems: total,
    percentage: total > 0 ? Math.round((current / total) * 100) : 0,
  };
}

/** Get the text the teacher should be speaking right now based on phase */
export function selectCurrentSpeech(state: TeachingState): string | null {
  const item = selectCurrentItem(state);
  if (!item) return null;

  switch (state.currentPhase) {
    case "reading":
      return item.exactSpokenText;
    case "explaining":
      return item.teacherExplanation;
    case "warning":
      return item.commonMistake ?? null;
    default:
      return null;
  }
}

/** Generate learner notes text from the accumulated notes */
export function generateLearnerNotesText(lessonTitle: string, notes: LearnerNoteEntry[]): string {
  const lines: string[] = [];
  lines.push(`Lesson: ${lessonTitle}`);
  lines.push("");

  for (const note of notes) {
    lines.push(`Step ${note.stepNumber}:`);
    lines.push(note.boardText);
    lines.push("");
    lines.push(note.teacherExplanation);
    lines.push("");
    lines.push(`Why this matters: ${note.whyThisStepMatters}`);
    if (note.commonMistake) {
      lines.push("");
      lines.push(`⚠ Common mistake: ${note.commonMistake}`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

/** Generate transcript text from accumulated transcript entries */
export function generateTranscriptText(transcript: TeachingTranscriptEntry[]): string {
  const lines: string[] = [];
  for (const entry of transcript) {
    const phaseLabel =
      entry.phase === "reading"
        ? "Teacher reads"
        : entry.phase === "explaining"
          ? "Teacher explains"
          : "Teacher warns";
    lines.push(`[${phaseLabel}]`);
    lines.push(entry.spokenText);
    lines.push("");
  }
  return lines.join("\n");
}
