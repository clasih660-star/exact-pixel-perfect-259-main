/**
 * classroom-teacher-brain.ts
 *
 * The teacher brain decides WHEN and WHAT the teacher says as an aside
 * between scripted lesson steps. It uses deterministic templates (no AI
 * in the hot path) to pick natural, warm teacher phrases based on:
 *
 * - Current phase (writing, reading, explaining, practice)
 * - Student confusion level (from confusion tracker)
 * - Student sentiment (from sentiment analysis)
 * - Progress (how far through the lesson)
 * - Time since last interaction
 * - Section boundaries
 *
 * Falls back gracefully: when no aside is appropriate, returns null
 * and the classroom continues with the scripted flow.
 */

import type { TeacherSpeechType } from "./voice/types";
import {
  TRANSITION_ASIDES,
  ENCOURAGEMENT_ASIDES,
  CHECKIN_ASIDES,
  REACTION_CONFUSED_ASIDES,
  REACTION_FRUSTRATED_ASIDES,
  PERSONALITY_ASIDES,
  BRIDGE_ASIDES,
} from "./classroom-teacher-brain-content";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TeacherAsideType =
  | "transition"
  | "encouragement"
  | "check_in"
  | "reaction_confused"
  | "reaction_frustrated"
  | "personality"
  | "bridge";

export type TeacherAside = {
  type: TeacherAsideType;
  text: string;
  speechType: TeacherSpeechType;
};

export type TeacherBrainContext = {
  /** Current teaching phase. */
  phase: string;
  /** Index of the board item that just completed. */
  currentIndex: number;
  /** Total number of board items in the sequence. */
  totalItems: number;
  /** Current lesson section key (e.g. "concept", "worked_example"). */
  sectionKey: string;
  /** Rolling confusion score from the confusion tracker (0–1). */
  confusionScore: number;
  /** Last detected student sentiment tone. */
  lastSentiment: string | null;
  /** Number of consecutive correct practice answers. */
  consecutiveCorrect: number;
  /** Milliseconds since the student last interacted. */
  timeSinceLastInteraction: number;
  /** The lesson subject/course type for personality aside selection. */
  courseType: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Don't give an aside for the first 2 board items (let the lesson establish). */
const MIN_ITEMS_BEFORE_ASIDE = 2;

/** Minimum gap between asides (ms) to avoid overwhelming the student. */
const MIN_ASIDE_GAP_MS = 12_000;

/** After how many items without interaction should we check in? */
const CHECKIN_AFTER_ITEMS = 4;

/** After how many ms idle should we check in? */
const CHECKIN_IDLE_MS = 90_000;

// ─────────────────────────────────────────────────────────────────────────────
// Seeded random (deterministic per lesson + index — no Math.random)
// ─────────────────────────────────────────────────────────────────────────────

function seededPick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// Main decision function
// ─────────────────────────────────────────────────────────────────────────────

let lastAsideTime = 0;

/**
 * Decide whether the teacher should give an aside, and if so, what kind.
 *
 * Called from `advanceToNext` after each board item completes. Returns null
 * when no aside is appropriate (the classroom continues with scripted flow).
 *
 * This function is SYNCHRONOUS and deterministic — zero latency, no AI call.
 */
export function decideAside(ctx: TeacherBrainContext): TeacherAside | null {
  const now = Date.now();

  // ── Gate: too early in the lesson ──
  if (ctx.currentIndex < MIN_ITEMS_BEFORE_ASIDE) return null;

  // ── Gate: too soon since the last aside ──
  if (now - lastAsideTime < MIN_ASIDE_GAP_MS) return null;

  const seed = ctx.currentIndex * 31 + ctx.totalItems;

  // ── Priority 1: Reaction to confusion/frustration ──
  if (ctx.confusionScore > 0.5) {
    lastAsideTime = now;
    if (ctx.lastSentiment === "frustrated" || ctx.confusionScore > 0.7) {
      return {
        type: "reaction_frustrated",
        text: seededPick(REACTION_FRUSTRATED_ASIDES, seed),
        speechType: "encouragement",
      };
    }
    return {
      type: "reaction_confused",
      text: seededPick(REACTION_CONFUSED_ASIDES, seed),
      speechType: "encouragement",
    };
  }

  // ── Priority 2: Check-in after long idle ──
  if (ctx.timeSinceLastInteraction > CHECKIN_IDLE_MS) {
    lastAsideTime = now;
    return {
      type: "check_in",
      text: seededPick(CHECKIN_ASIDES, seed),
      speechType: "question",
    };
  }

  // ── Priority 3: Encouragement after consecutive correct answers ──
  if (ctx.consecutiveCorrect >= 3) {
    lastAsideTime = now;
    return {
      type: "encouragement",
      text: seededPick(ENCOURAGEMENT_ASIDES, seed),
      speechType: "encouragement",
    };
  }

  // ── Priority 4: Section bridge (at section boundaries) ──
  // Detect section boundary: index matches a common boundary point
  const isSectionBoundary =
    ctx.currentIndex > 0 && ctx.currentIndex % Math.max(3, Math.floor(ctx.totalItems / 4)) === 0;

  if (isSectionBoundary) {
    const bridges = BRIDGE_ASIDES[ctx.sectionKey];
    if (bridges && bridges.length > 0) {
      lastAsideTime = now;
      return {
        type: "bridge",
        text: seededPick(bridges, seed),
        speechType: "explanation",
      };
    }
  }

  // ── Priority 5: Periodic check-in ──
  if (ctx.currentIndex > 0 && ctx.currentIndex % CHECKIN_AFTER_ITEMS === 0) {
    lastAsideTime = now;
    return {
      type: "check_in",
      text: seededPick(CHECKIN_ASIDES, seed),
      speechType: "question",
    };
  }

  // ── Priority 6: Personality aside (occasional, every ~8 items) ──
  if (ctx.currentIndex > 0 && ctx.currentIndex % 8 === 0) {
    const personalities = PERSONALITY_ASIDES[ctx.courseType] ?? PERSONALITY_ASIDES["mathematics"];
    if (personalities && personalities.length > 0) {
      lastAsideTime = now;
      return {
        type: "personality",
        text: seededPick(personalities, seed),
        speechType: "explanation",
      };
    }
  }

  // ── Priority 7: Transition aside (every ~5 items, if no other aside fired) ──
  if (ctx.currentIndex > 0 && ctx.currentIndex % 5 === 0) {
    lastAsideTime = now;
    return {
      type: "transition",
      text: seededPick(TRANSITION_ASIDES, seed),
      speechType: "explanation",
    };
  }

  // ── No aside this time ──
  return null;
}

/**
 * Reset the aside timer (call when lesson starts or replays).
 */
export function resetTeacherBrain() {
  lastAsideTime = 0;
}
