/**
 * Lesson Structure Types for Klassruum
 * Supports real classroom teaching with:
 * - Learning objectives
 * - Prerequisite checks
 * - Board sequences
 * - Teacher notes
 * - Learner notes
 * - Question checkpoints
 * - Misconception handling
 * - Exit tickets
 * - Homework
 */

import type { BoardWriteItem } from "./types";

export type LessonCheckpointTrigger = "timer" | "manual" | "automatic";

export type LessonObjective = {
  id: string;
  title: string;
  description: string;
  successCriteria: string[];
};

export type PrerequisiteCheck = {
  id: string;
  question: string;
  guidance?: string;
  reviewMaterial?: string;
};

export type LessonStep = {
  id: string;
  order: number;
  title: string;
  estimatedMinutes: number;
  boardItems: BoardWriteItem[];
  teacherNotes?: string;
  learnerNotes: {
    summary: string;
    keyPoints: string[];
    examples: string[];
    commonMistakes: string[];
    formulasOrRules?: string[];
  };
  accessibility: {
    boardDescription: string;
    screenReaderText: string;
    simplifiedExplanation?: string;
  };
};

export type GuidedPractice = {
  id: string;
  problem: string;
  solution: string;
  explanation: string;
  workingSteps: string[];
};

export type IndependentPractice = {
  id: string;
  problem: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit?: number; // seconds
};

export type Misconception = {
  id: string;
  commonError: string;
  correction: string;
  boardItems: BoardWriteItem[];
  explanation: string;
};

export type QuestionCheckpoint = {
  id: string;
  triggerMinute: number;
  promptText: string;
  promptAudio: string;
  required: boolean;
  inputModes: Array<"text" | "voice" | "quick_action">;
  expectedAnswerPattern?: RegExp;
};

export type RequiredLessonQuestion = {
  id: string;
  triggerPercentage: number; // 0-100
  questionText: string;
  correctAnswers: string[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
  boardCorrection?: BoardWriteItem[];
  hints?: string[];
};

export type ExitTicket = {
  id: string;
  question: string;
  expectedAnswer?: string;
  acceptableAnswers?: string[];
  difficulty: "easy" | "medium" | "hard";
};

export type Homework = {
  id: string;
  title: string;
  problems: {
    id: string;
    problem: string;
    difficulty: "easy" | "medium" | "hard";
  }[];
  estimatedMinutes: number;
  reviewMaterial?: string;
};

export type LessonNotes = {
  learnerNotes: {
    summary: string;
    sections: {
      title: string;
      content: string;
      keyPoints: string[];
    }[];
    formulasAndRules: {
      formula: string;
      when: string;
      example: string;
    }[];
    commonMistakes: {
      mistake: string;
      correction: string;
    }[];
  };
  teacherGuide: {
    keyMessages: string[];
    commonStudentConfusions: string[];
    timingNotes: string;
    adaptations: {
      forSlowLearners: string;
      forFastLearners: string;
    };
  };
};

export type Lesson = {
  id: string;
  institutionId: string;
  courseId: string;
  title: string;
  subject: string;
  description: string;
  minimumDurationMinutes: number; // minimum 25
  estimatedDurationMinutes: number;
  createdAt: string;
  updatedAt: string;

  // Learning Design
  objective: LessonObjective;
  prerequisiteCheck?: PrerequisiteCheck;

  // Teaching Content
  steps: LessonStep[];
  notes: LessonNotes;
  misconceptions?: Misconception[];

  // Student Engagement
  guidedPractice?: GuidedPractice;
  independentPractice?: IndependentPractice;
  questionCheckpoints: QuestionCheckpoint[];
  requiredMidLessonQuestion: RequiredLessonQuestion;
  exitTicket: ExitTicket;

  // Homework
  homework?: Homework;

  // Metadata
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  attachedResources?: {
    title: string;
    type: "pdf" | "video" | "link";
    url: string;
  }[];
};

export type LessonProgress = {
  lessonId: string;
  studentId: string;
  startedAt: string;
  currentStepIndex: number;
  completedSteps: string[];
  askedQuestions: {
    checkpointId: string;
    question: string;
    answer: string;
    timestamp: string;
  }[];
  midLessonQuestionAnswered: boolean;
  midLessonQuestionCorrect?: boolean;
  practiceAnswers: {
    type: "guided" | "independent";
    answer: string;
    correct: boolean;
    timestamp: string;
  }[];
  exitTicketAnswered: boolean;
  exitTicketScore?: number;
  misconceptionsDetected: string[];
  totalTimeMinutes: number;
  completedAt?: string;
  notesCollected: string[];
};

export type LessonCompletion = {
  lessonId: string;
  studentId: string;
  completedAt: string;
  timeSpentMinutes: number;
  performanceScore: number; // 0-100
  understanding: {
    concept1: number;
    concept2: number;
  };
  nextRecommendation?: {
    type: "review" | "practice" | "nextLesson";
    lessonId?: string;
    reason: string;
  };
};
