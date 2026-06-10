/**
 * classroom-content.ts
 *
 * The single, data-driven content contract the AI video classroom teaches from.
 *
 * Historically `AIVideoClassroom.tsx` was hardwired to the quadratic-equations
 * demo: it imported a dozen scattered constants (teaching sequence, lesson goal,
 * recaps, thinking pauses, the middle question, practice problems, the exit
 * ticket, learner notes, the teacher persona…). That made it impossible to run a
 * real, institution-generated lesson in the same polished classroom.
 *
 * `ClassroomLessonContent` collapses all of that into ONE object. The classroom
 * renders whatever content it is handed:
 *   - the demo bundle (built by `buildDemoLessonContent`) — unchanged behaviour, or
 *   - a real lesson loaded from the database (built by the loader in
 *     `classroom-lesson.functions.ts`, which also attaches `materialContext` so
 *     the AI teacher's answers stay grounded in the institution's own materials).
 *
 * This is the seam that turns the classroom from a demo into a product.
 */

import type { MathTeachingItem } from "./lesson-models";
import type { AcademicLevel } from "./types";

/** A single practice problem the learner attempts (guided or independent). */
export interface ClassroomPracticeProblem {
  /** The equation / prompt shown large on the practice card. */
  equation: string;
  /** The question asked about it. */
  question: string;
  /** Canonical correct answer (normalised before comparison). */
  correctAnswer: string;
  /** A single quick hint (legacy; `hints` is preferred). */
  hint: string;
  /** Progressive hints revealed one level at a time. */
  hints: string[];
  /** A common wrong answer + the targeted correction (misconception watch). */
  misconception: { answer: string; note: string };
}

/** A multiple-choice checkpoint asked mid-lesson (~50%) and at the exit. */
export interface ClassroomChoiceQuestion {
  question: string;
  options: string[];
  /** The option text that is correct. */
  correct: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  /** Optional misconception watch for a plausible-but-wrong option. */
  misconception?: { answer: string; note: string };
}

/** Confidence-check option (emoji scale — learning data, never a grade). */
export interface ClassroomConfidenceOption {
  label: string;
  value: string;
  emoji: string;
}

/** A short recap shown at a section boundary. */
export interface ClassroomSectionRecap {
  title: string;
  points: string[];
}

/** The teacher persona that fronts the classroom. */
export interface ClassroomTeacherPersona {
  name: string;
  /** Public image path; falls back to initials if it fails to load. */
  image: string;
  /** Drives the speech-synthesis voice. */
  voice: "female" | "male";
}

/**
 * Everything the AI video classroom needs to teach one lesson, end to end.
 * Built either from the demo or from a real DB lesson.
 */
export interface ClassroomLessonContent {
  /** Stable id (the DB lesson id, or "demo"). */
  lessonId: string;
  title: string;
  /** Short topic equation/identifier shown in the top bar (optional). */
  equation?: string;
  subject: string;
  course: string;
  institution: string;
  /** Drives the AI teacher's vocabulary, depth, pacing, encouragement. */
  academicLevel: AcademicLevel;
  teacher: ClassroomTeacherPersona;

  /** Opening narrative spoken before any board writing. */
  openingNarrative: string;
  /** What success looks like for the learner. */
  lessonGoal: string;
  /** Why the lesson matters (motivation). */
  whyItMatters: string;
  /** Optional spoken prerequisite reminder before teaching starts. */
  prerequisiteReview?: string;

  /** The ordered teaching items the teacher writes → reads → explains. */
  sequence: MathTeachingItem[];

  /** Per-section "current goal" banner text, keyed by section key. */
  sectionGoals: Record<string, string>;
  /**
   * Ordered "section stops" mapping regions of the teaching `sequence` to
   * lesson-plan section keys. Each entry says "from this board index onward, we
   * are in this section". Used for the current-goal banner and lesson-plan
   * jump navigation. Must be sorted by `startIndex` ascending.
   */
  sectionStops: Array<{ key: string; startIndex: number }>;
  /** Section recaps, keyed by section key. */
  sectionRecaps: Record<string, ClassroomSectionRecap>;
  /** Thinking pauses, keyed by the board index they appear BEFORE. */
  thinkingPauses: Record<number, string>;

  /**
   * The required mid-lesson checkpoint (~50%). Optional: omitted for lessons that
   * don't carry an authored multiple-choice check (the classroom simply skips the
   * interjection rather than inventing — and possibly mis-grading — a question).
   */
  middleQuestion?: ClassroomChoiceQuestion;
  /** Confidence-check options. */
  confidenceOptions: ClassroomConfidenceOption[];
  /** Guided + independent practice problems. May be empty (practice skipped). */
  practiceProblems: ClassroomPracticeProblem[];
  /** The final exit-ticket check. Optional (skipped when absent). */
  exitTicket?: ClassroomChoiceQuestion;
  /** End-of-lesson reflection prompt + options. */
  exitReflection: { question: string; options: string[] };

  /** Pre-built, revision-ready learner notes for the notes drawer. */
  learnerNotes: string;

  /**
   * Grounding text for the AI teacher's question answering (RAG). When present,
   * answers are constrained to the institution's own course materials instead of
   * the model's general knowledge. Empty for the demo.
   */
  materialContext?: string;
}
