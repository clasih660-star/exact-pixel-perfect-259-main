/**
 * classroom-confusion-tracker.ts
 *
 * A lightweight, client-side confusion accumulator that does NOT require AI.
 * It tracks learner behaviour signals during a lesson and computes a rolling
 * confusion score. When the score crosses a threshold, the classroom can
 * trigger adaptive interjections (recaps, encouragement, simpler explanations).
 *
 * Design goals:
 * - Zero latency (all computation is synchronous)
 * - No network calls in the hot teaching path
 * - Graceful: even if the tracker is wrong, a false-positive interjection is
 *   just an extra recap — never harmful
 * - Capped at 20 recent signals so memory/computation stays tiny
 */

import type { MathTeachingItem } from "./lesson-models";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ConfusionSignalType =
  | "quick_action_confused"
  | "repeated_question"
  | "long_idle"
  | "multiple_hints"
  | "practice_wrong"
  | "raise_hand"
  | "sentiment_frustrated";

export type ConfusionSignal = {
  type: ConfusionSignalType;
  timestamp: number;
  /** How strong the signal is (0–1). Higher = more confused. */
  weight: number;
  /** Board index where the signal occurred. */
  boardIndex: number;
  /** Which lesson section the signal occurred in. */
  section: string;
};

export type ConfusionState = {
  /** Rolling confusion score 0–1, weighted toward recent signals. */
  confusionScore: number;
  /** Sections with the most accumulated confusion. */
  confusedSections: string[];
  /** Whether the threshold for an intervention has been crossed. */
  shouldIntervene: boolean;
  /** What kind of intervention is recommended. */
  interventionType: "recap" | "thinking_pause" | "encouragement" | "none";
  /** The dominant signal type driving the confusion. */
  dominantSignal: ConfusionSignalType | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum number of signals kept (oldest are pruned). */
const MAX_SIGNALS = 20;

/** Half-life in ms for signal decay (~90 seconds). Recent signals matter more. */
const DECAY_HALF_LIFE_MS = 90_000;

/** Confusion score threshold above which an intervention is recommended. */
const INTERVENTION_THRESHOLD = 0.6;

// ─────────────────────────────────────────────────────────────────────────────
// Tracker
// ─────────────────────────────────────────────────────────────────────────────

export function createConfusionTracker() {
  const signals: ConfusionSignal[] = [];

  function recordSignal(signal: Omit<ConfusionSignal, "timestamp">) {
    signals.push({ ...signal, timestamp: Date.now() });
    // Prune oldest if over cap
    if (signals.length > MAX_SIGNALS) {
      signals.splice(0, signals.length - MAX_SIGNALS);
    }
  }

  function getState(): ConfusionState {
    const now = Date.now();

    // Compute weighted, decayed score
    let totalScore = 0;
    const sectionScores = new Map<string, number>();
    const typeScores = new Map<ConfusionSignalType, number>();

    for (const signal of signals) {
      const age = now - signal.timestamp;
      const decay = Math.pow(0.5, age / DECAY_HALF_LIFE_MS);
      const contribution = signal.weight * decay;
      totalScore += contribution;

      // Accumulate per-section
      const prev = sectionScores.get(signal.section) ?? 0;
      sectionScores.set(signal.section, prev + contribution);

      // Accumulate per-type
      const prevType = typeScores.get(signal.type) ?? 0;
      typeScores.set(signal.type, prevType + contribution);
    }

    // Normalise to 0–1 (cap at 1.0)
    const confusionScore = Math.min(1, totalScore);

    // Find confused sections (above 30% of total)
    const confusedSections = Array.from(sectionScores.entries())
      .filter(([, score]) => score > totalScore * 0.3 && score > 0.1)
      .map(([section]) => section);

    // Find dominant signal type
    let dominantSignal: ConfusionSignalType | null = null;
    let maxTypeScore = 0;
    for (const [type, score] of typeScores) {
      if (score > maxTypeScore) {
        maxTypeScore = score;
        dominantSignal = type;
      }
    }

    // Decide intervention type based on dominant signal
    const shouldIntervene = confusionScore >= INTERVENTION_THRESHOLD;
    let interventionType: ConfusionState["interventionType"] = "none";

    if (shouldIntervene && dominantSignal) {
      switch (dominantSignal) {
        case "practice_wrong":
        case "repeated_question":
          interventionType = "recap";
          break;
        case "long_idle":
        case "quick_action_confused":
          interventionType = "thinking_pause";
          break;
        case "sentiment_frustrated":
          interventionType = "encouragement";
          break;
        case "multiple_hints":
        case "raise_hand":
          interventionType = "encouragement";
          break;
        default:
          interventionType = "recap";
      }
    }

    return {
      confusionScore,
      confusedSections,
      shouldIntervene,
      interventionType,
      dominantSignal,
    };
  }

  function reset() {
    signals.length = 0;
  }

  return { recordSignal, getState, reset };
}

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic intervention text generator (no AI needed in the hot path)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Produce a spoken intervention text from templates. This is synchronous and
 * always available — no AI round-trip needed. The AI-powered version
 * (classroom-adaptive-interjection.ts) can be called async for richer text
 * but is never on the critical teaching path.
 */
export function deriveAdaptiveIntervention(
  state: ConfusionState,
  currentSection: string,
  currentItem: MathTeachingItem | undefined,
): string {
  const sectionLabel = currentSection.replace(/_/g, " ");

  switch (state.interventionType) {
    case "recap":
      return (
        `Let me quickly recap what we just covered in ${sectionLabel}, ` +
        `because I want to make sure we're building on a solid foundation. ` +
        (currentItem?.teacherExplanation
          ? `Remember: ${currentItem.teacherExplanation.split(".")[0]}. `
          : "") +
        `Take a breath — this is normal when learning something new.`
      );

    case "thinking_pause":
      return (
        `Let's pause for a moment. I can see this part needs a bit more time to sink in, ` +
        `and that's completely fine. Look at what's on the board right now and see if you ` +
        `can connect it to the previous step. When you're ready, we'll continue together.`
      );

    case "encouragement":
      return (
        `You're doing well by sticking with this — asking for help and working through ` +
        `tricky parts is exactly how learning happens. Let me go over this once more in a ` +
        `simpler way so it clicks. You've got this.`
      );

    case "none":
    default:
      return "";
  }
}
