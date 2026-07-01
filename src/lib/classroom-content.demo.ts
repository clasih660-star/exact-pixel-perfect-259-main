/**
 * classroom-content.demo.ts
 *
 * Builds the demo `ClassroomLessonContent` from the existing quadratic-equations
 * teaching material. This is the DEFAULT content the classroom uses when no real
 * lesson is supplied, so the demo and marketing flows behave exactly as before —
 * but now they flow through the same data-driven path as a real lesson.
 */

import {
  LESSON_TITLE,
  LESSON_EQUATION,
  LESSON_OPENING_NARRATIVE,
  FULL_LEARNER_NOTES,
  quadraticTeachingSequence,
} from "./demo-lesson-real-teacher";
import {
  LESSON_GOAL,
  LESSON_WHY_IT_MATTERS,
  PREREQUISITE_CHECK,
  SECTION_GOALS,
  SECTION_RECAPS,
  THINKING_PAUSES,
  CONFIDENCE_OPTIONS,
  MIDDLE_QUESTION,
  EXIT_REFLECTION,
} from "./lesson-teaching-moments";
import type { ClassroomLessonContent } from "./classroom-content";

const DEMO_PRACTICE_PROBLEMS: ClassroomLessonContent["practiceProblems"] = [
  {
    equation: "x² + 7x + 10 = 0",
    question: "What two numbers multiply to 10 and add to 7?",
    correctAnswer: "2,5",
    hint: "Think: what pairs multiply to 10? (1,10), (2,5). Which pair adds to 7?",
    hints: [
      "Look at the constant term: 10. We need two numbers that multiply to it.",
      "Factor pairs of 10 are (1, 10) and (2, 5).",
      "Which pair adds to 7? Check: 2 + 5 = 7.",
    ],
    misconception: {
      answer: "1,10",
      note: "Good attempt — 1 and 10 multiply to 10, but they add to 11, not 7. We need both conditions to be true.",
    },
  },
  {
    equation: "x² + 6x + 8 = 0",
    question: "What two numbers multiply to 8 and add to 6?",
    correctAnswer: "2,4",
    hint: "Think: what pairs multiply to 8? (1,8), (2,4). Which pair adds to 6?",
    hints: [
      "Look at the constant term: 8. We need two numbers that multiply to it.",
      "Factor pairs of 8 are (1, 8) and (2, 4).",
      "Which pair adds to 6? Check: 2 + 4 = 6.",
    ],
    misconception: {
      answer: "1,8",
      note: "Good attempt — 1 and 8 multiply to 8, but they add to 9, not 6. We need both conditions to be true.",
    },
  },
];

/** Build the demo lesson content bundle (quadratic equations). */
export function buildDemoLessonContent(): ClassroomLessonContent {
  return {
    lessonId: "demo",
    title: LESSON_TITLE,
    equation: LESSON_EQUATION,
    subject: "Quadratic Equations",
    course: "Mathematics Form 2",
    courseLevel: "Form 2",
    institution: "Demo Academy",
    academicLevel: "secondary",
    teacher: {
      name: "Mr. Klass",
      image: "/images/teachers/man.png",
      voice: "male",
    },
    openingNarrative: LESSON_OPENING_NARRATIVE,
    lessonGoal: LESSON_GOAL,
    whyItMatters: LESSON_WHY_IT_MATTERS,
    prerequisiteReview: PREREQUISITE_CHECK.review,
    sequence: quadraticTeachingSequence,
    sectionGoals: SECTION_GOALS,
    // Board-index → section mapping (matches the original hardwired ranges).
    sectionStops: [
      { key: "welcome", startIndex: 0 },
      { key: "concept", startIndex: 1 },
      { key: "worked_example", startIndex: 3 },
      { key: "summary", startIndex: 7 },
    ],
    sectionRecaps: SECTION_RECAPS,
    thinkingPauses: THINKING_PAUSES,
    middleQuestion: {
      question: MIDDLE_QUESTION.question,
      options: MIDDLE_QUESTION.options,
      correct: MIDDLE_QUESTION.correct,
      feedbackCorrect: MIDDLE_QUESTION.feedbackCorrect,
      feedbackIncorrect: MIDDLE_QUESTION.feedbackIncorrect,
      misconception: MIDDLE_QUESTION.misconception,
    },
    confidenceOptions: CONFIDENCE_OPTIONS,
    practiceProblems: DEMO_PRACTICE_PROBLEMS,
    exitTicket: {
      question: "Which two numbers multiply to 6 and add to 5?",
      options: ["1, 6", "2, 3", "3, 3", "2, 4"],
      correct: "2, 3",
      feedbackCorrect: "Correct! Two and three multiply to six and add to five. ✅",
      feedbackIncorrect: "Good effort! The correct answer is 2 and 3: 2 × 3 = 6 and 2 + 3 = 5.",
    },
    exitReflection: EXIT_REFLECTION,
    visualPlan: [
      {
        id: "math_quadratic_formula",
        anchorId: "step_1",
        kind: "formula",
        source: "fallback",
        title: "Quadratic standard form",
        description: "The general form of a quadratic equation is ax² + bx + c = 0, where a ≠ 0.",
        alt: "ax² + bx + c = 0",
        teacherCue: "Identify that a = 1, b = 5, and c = 6 in our equation.",
        labels: ["Quadratic", "Standard Form", "a = 1", "b = 5", "c = 6"]
      },
      {
        id: "math_factor_table",
        anchorId: "step_2",
        kind: "table",
        source: "fallback",
        title: "Factors of 6 matching sum 5",
        description: "Finding pairs of integers that multiply to 6 and add to 5.",
        alt: "Factors comparison",
        teacherCue: "Look at the table: the pair (2, 3) satisfies both product = 6 and sum = 5.",
        labels: ["Pair: 1, 6 (Sum: 7)", "Pair: 2, 3 (Sum: 5)", "Product = 6", "Sum = 5"]
      },
      {
        id: "math_factored_equality",
        anchorId: "step_6",
        kind: "formula",
        source: "fallback",
        title: "Factored decomposition",
        description: "Rewriting quadratic expression x² + 5x + 6 into two linear factors (x + 2)(x + 3).",
        alt: "x² + 5x + 6 = (x + 2)(x + 3)",
        teacherCue: "Compare both sides. Expanding the right side gives x² + 3x + 2x + 6 = x² + 5x + 6.",
        labels: ["Factored Form", "Linear Factors", "Zero Product Rule"]
      }
    ],
    learnerNotes: FULL_LEARNER_NOTES,
    materialContext: undefined,
  };
}
