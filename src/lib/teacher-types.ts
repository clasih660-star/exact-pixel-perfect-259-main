export const LESSON_STEPS = [
  "hook",
  "concept",
  "example",
  "practice",
  "independent",
  "correction",
  "quiz",
  "summary",
] as const;

export type LessonStep = (typeof LESSON_STEPS)[number];

export const STEP_LABELS: Record<LessonStep, string> = {
  hook: "Hook",
  concept: "Concept Teaching",
  example: "Worked Example",
  practice: "Guided Practice",
  independent: "Independent Question",
  correction: "Correction Loop",
  quiz: "Quiz",
  summary: "Summary",
};

export type TeacherState =
  | "idle"
  | "preparing"
  | "listening"
  | "thinking"
  | "speaking"
  | "explaining"
  | "correcting"
  | "encouraging";

export type LessonState = {
  step: LessonStep;
  studentLevel: "beginner" | "intermediate" | "advanced";
  confusionScore: number; // 0..1
  correct: number;
  mistakes: number;
  notes: string[];
  teacherState: TeacherState;
};

export const initialLessonState: LessonState = {
  step: "hook",
  studentLevel: "intermediate",
  confusionScore: 0,
  correct: 0,
  mistakes: 0,
  notes: [],
  teacherState: "listening",
};

export type ChatTurn = { role: "teacher" | "student"; text: string };

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

// What the AI returns on each turn
export type TeacherResponse = {
  speak: string; // what the teacher says (also for TTS)
  board: {
    title: string;
    lines: string[]; // each line shown on the whiteboard
    highlight?: string; // a line/expression to emphasize
  };
  nextStep: LessonStep;
  confusionDelta: number; // -1..1
  evaluation?: "correct" | "incorrect" | "partial";
  quiz?: QuizQuestion; // present only when stepping into quiz
  done?: boolean;
};
