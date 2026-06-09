/**
 * lesson-teaching-moments.ts
 *
 * The "teaching moments" content that turns the classroom page into a teacher:
 * lesson goal, why-it-matters, prerequisite check, per-section goals, recaps,
 * thinking pauses, confidence checks, the required middle question, and the
 * end-of-lesson reflection.
 *
 * These are content-only constants. The orchestration (when each moment fires)
 * lives in AIVideoClassroom.tsx. Keeping the content here keeps the lesson easy
 * to author and swap per syllabus topic.
 */

// ── A. Lesson goal + B. Why this matters ─────────────────────────────────────

export const LESSON_GOAL =
  "Solve a simple quadratic equation by rewriting it into two brackets (factoring).";

export const LESSON_WHY_IT_MATTERS =
  "Quadratic equations help us model curves, areas, motion, and many real-world problems. Today we start with the simplest solving method: factoring.";

// ── C. Prerequisite check ────────────────────────────────────────────────────

export interface PrerequisiteOption {
  label: string;
  value: "yes" | "unsure" | "no" | "explain";
  needsReview: boolean;
}

export const PREREQUISITE_CHECK: {
  question: string;
  options: PrerequisiteOption[];
  review: string;
} = {
  question:
    "Before we factor quadratics, do you remember how to multiply two brackets like (x + 2)(x + 3)?",
  options: [
    { label: "Yes, I remember", value: "yes", needsReview: false },
    { label: "Not sure", value: "unsure", needsReview: true },
    { label: "No", value: "no", needsReview: true },
    { label: "Explain first", value: "explain", needsReview: true },
  ],
  review:
    "Quick review: to multiply (x + 2)(x + 3), multiply each term in the first bracket by each term in the second — x·x + x·3 + 2·x + 2·3 = x² + 5x + 6. Factoring is simply doing this in reverse.",
};

// ── D. Per-section "current goal" banner text ────────────────────────────────

export const SECTION_GOALS: Record<string, string> = {
  welcome: "Understand what today's lesson will achieve.",
  concept: "Learn the two conditions the factor numbers must satisfy.",
  worked_example: "Follow each step of solving x² + 5x + 6 = 0 by factoring.",
  guided_practice: "Solve a problem together with the teacher.",
  independent_practice: "Solve a problem on your own.",
  summary: "Review the full method from start to finish.",
  exit_ticket: "Show what you learned with one final check.",
  complete: "Lesson complete — review your notes and progress.",
};

// ── K. Section recaps ────────────────────────────────────────────────────────

export interface SectionRecap {
  title: string;
  points: string[];
}

export const SECTION_RECAPS: Record<string, SectionRecap> = {
  concept: {
    title: "Concept recap",
    points: [
      "We need two numbers.",
      "They must multiply to the constant term (6).",
      "They must add to the middle coefficient (5).",
    ],
  },
  worked_example: {
    title: "Worked example recap",
    points: [
      "The numbers 2 and 3 satisfy both conditions.",
      "We rewrote the equation as (x + 2)(x + 3) = 0.",
      "Setting each bracket to zero gives x = -2 or x = -3.",
    ],
  },
};

// ── E. Thinking pauses (keyed by the board index they appear BEFORE) ─────────

export const THINKING_PAUSES: Record<number, string> = {
  4: "Take a moment. We need two numbers that multiply to 6 and add to 5. Notice that 2 and 3 satisfy both conditions before we confirm it on the board.",
};

// ── F. Confidence check ──────────────────────────────────────────────────────

export interface ConfidenceOption {
  label: string;
  value: "understand" | "almost" | "not_yet" | "explain_again";
  emoji: string;
}

export const CONFIDENCE_OPTIONS: ConfidenceOption[] = [
  { label: "I understand", value: "understand", emoji: "😀" },
  { label: "Almost", value: "almost", emoji: "🙂" },
  { label: "Not yet", value: "not_yet", emoji: "😐" },
  { label: "Explain again", value: "explain_again", emoji: "🔁" },
];

// ── Required middle question (~50% checkpoint) ───────────────────────────────

export const MIDDLE_QUESTION = {
  question:
    "Quick check before we continue: which two numbers multiply to 6 and add to 5?",
  options: ["1 and 6", "2 and 3", "3 and 3", "2 and 4"],
  correct: "2 and 3",
  feedbackCorrect:
    "Correct! 2 × 3 = 6 and 2 + 3 = 5. Those are exactly the numbers we need.",
  feedbackIncorrect:
    "Let's check it together: 2 × 3 = 6 and 2 + 3 = 5, so the answer is 2 and 3.",
  /** Misconception watch: a plausible-but-wrong choice and the gentle correction. */
  misconception: {
    answer: "1 and 6",
    note: "Good attempt — 1 and 6 multiply to 6, but they add to 7, not 5. Both conditions must be true.",
  },
};

// ── L. End-of-lesson reflection ──────────────────────────────────────────────

export const EXIT_REFLECTION = {
  question: "Before we finish — what part should we review again next time?",
  options: [
    "Finding the factor numbers",
    "Setting brackets to zero",
    "Sign changes (why the answers are negative)",
    "I understood everything",
  ],
};
