/**
 * classroom.payloads.ts
 *
 * Clean request/response contracts for all classroom API functions.
 * These types define the standardized payloads used by both
 * server functions and client hooks.
 */

import type { LessonStepKey, TeacherState, StudentLevel } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export type DashboardResponse = {
  continueLearning: {
    courseId: string;
    lessonId: string;
    currentStep: string;
    progressPercentage: number;
    courseTitle: string;
    lessonTitle: string;
  } | null;
  stats: {
    activeCourses: number;
    completedLessons: number;
    totalTimeMinutes: number;
    avgQuizScore: number;
    recentSessionsCount: number;
  };
  courses: Array<{
    id: string | null;
    title: string | null;
    subject: string | null;
    level: string | null;
    institutionName?: string | null;
    progressPercentage: number;
    description?: string | null;
    coverImageUrl?: string | null;
  }>;
  recentSessions: Array<{
    id: string;
    lessonTitle: string;
    courseTitle: string;
    status: string;
    startedAt: string | null;
    endedAt: string | null;
    durationMinutes: number | null;
  }>;
  accessProfile: {
    captionsEnabled: boolean;
    audioEnabled: boolean;
    keyboardShortcutsEnabled: boolean;
    focusModeEnabled: boolean;
    speechRate: number;
    currentMode: string;
  };
  recommendations: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    type: string;
    targetUrl: string | null;
  }>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Classroom Start
// ─────────────────────────────────────────────────────────────────────────────

export type StartClassroomRequest = {
  courseId: string;
  lessonId: string;
  sessionId?: string;
  resumeStep?: string;
  preferredAccessProfile?: Record<string, unknown>;
};

export type StartClassroomResponse = {
  sessionId: string;
  redirectUrl: string;
  resumed: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Classroom Context
// ─────────────────────────────────────────────────────────────────────────────

export type ClassroomContextResponse = {
  session: {
    id: string;
    institutionId: string;
    courseId: string;
    lessonId: string;
    mode: string;
    status: string;
    startTime: string | null;
    endTime: string | null;
  };
  institution: Record<string, unknown> | null;
  course: Record<string, unknown> | null;
  lesson: Record<string, unknown> | null;
  progress: {
    currentStep: LessonStepKey;
    progressPercentage: number;
    confusionScore: number;
    studentLevel: StudentLevel;
    teacherState: TeacherState;
    timeSpentMinutes: number;
  };
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    createdAt: string;
  }>;
  learnerAccessProfile: Record<string, unknown> | null;
  lastEvent: Record<string, unknown> | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Chat
// ─────────────────────────────────────────────────────────────────────────────

export type ChatMessageRequest = {
  session_id: string;
  message: string;
  sender?: "student" | "teacher" | "ai_teacher" | "system";
  message_type?: string;
  request_key?: string;
};

export type ChatMessageResponse = {
  ok: boolean;
  messageId: string;
  createdAt: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Quick Action
// ─────────────────────────────────────────────────────────────────────────────

export type QuickActionRequest = {
  session_id: string;
  action: string;
  message?: string;
  request_key?: string;
};

export type QuickActionResponse = {
  ok: boolean;
  eventId: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Step Change
// ─────────────────────────────────────────────────────────────────────────────

export type StepChangeRequest = {
  session_id: string;
  targetStep: string;
  progress_percentage?: number;
  confusion_score?: number;
  request_key?: string;
};

export type StepChangeResponse = {
  ok: boolean;
  eventId: string | null;
  currentStep: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Board Notes Save
// ─────────────────────────────────────────────────────────────────────────────

export type SaveBoardNotesRequest = {
  session_id: string;
  whiteboardContent: string[];
  description: string;
  title?: string;
  mode?: "lesson" | "example" | "correction" | "quiz" | "summary";
  activeLineIndex?: number;
  highlight?: string;
  stepKey?: string;
  request_key?: string;
};

export type SaveBoardNotesResponse = {
  ok: boolean;
  snapshotId: string;
  eventId: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Access Profile Update
// ─────────────────────────────────────────────────────────────────────────────

export type AccessProfileUpdateRequest = {
  session_id?: string;
  captionsEnabled?: boolean;
  transcriptEnabled?: boolean;
  audioEnabled?: boolean;
  boardDescriptionsEnabled?: boolean;
  screenReaderOptimized?: boolean;
  highContrast?: boolean;
  largeText?: boolean;
  reducedMotion?: boolean;
  keyboardShortcutsEnabled?: boolean;
  voiceInputEnabled?: boolean;
  speechRate?: number;
  fontScale?: number;
  lessonPace?: "slow" | "normal" | "fast";
  explanationStyle?: "simple" | "standard" | "detailed";
  request_key?: string;
};

export type AccessProfileUpdateResponse = {
  ok: boolean;
  profile: Record<string, unknown>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Quiz Submit
// ─────────────────────────────────────────────────────────────────────────────

export type QuizSubmitRequest = {
  session_id?: string;
  quiz_id: string;
  lesson_id: string;
  score: number;
  percentage: number;
  answers_json?: unknown;
  feedback_json?: unknown;
  weak_topics?: string[];
  request_key?: string;
};

export type QuizSubmitResponse = {
  ok: boolean;
  id: string;
  duplicate: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Session End
// ─────────────────────────────────────────────────────────────────────────────

export type EndSessionRequest = {
  session_id: string;
  final_progress_percentage?: number;
  final_confusion_score?: number;
  final_step?: string;
};

export type EndSessionResponse = {
  ok: boolean;
  alreadyEnded?: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Session Summary
// ─────────────────────────────────────────────────────────────────────────────

export type SessionSummaryResponse = {
  session: {
    id: string;
    status: string;
    startedAt: string | null;
    endedAt: string | null;
    durationMinutes: number;
  };
  lesson: { id: string; title: string; description: string } | null;
  course: { id: string; title: string; subject: string } | null;
  stepsCompleted: number;
  totalSteps: number;
  progress: Record<string, unknown> | null;
  quizResults: Array<Record<string, unknown>>;
  notes: Array<Record<string, unknown>>;
  eventCount: number;
  confusionTrend: Array<{ step: string; score: number; timestamp: string }>;
  weakTopics: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Session Replay
// ─────────────────────────────────────────────────────────────────────────────

export type ReplayTimelineItem =
  | {
      type: "event";
      id: string;
      eventType: string;
      actorRole: string;
      payload: Record<string, unknown>;
      timestamp: string;
    }
  | {
      type: "message";
      id: string;
      sender: string;
      message: string;
      messageType: string;
      timestamp: string;
    }
  | {
      type: "board_snapshot";
      id: string;
      title: string;
      lines: string[];
      mode: string;
      stepKey: string | null;
      timestamp: string;
    };

export type SessionReplayResponse = {
  sessionId: string;
  timeline: ReplayTimelineItem[];
  eventCount: number;
  messageCount: number;
  boardSnapshotCount: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Notes Save
// ─────────────────────────────────────────────────────────────────────────────

export type SaveNotesRequest = {
  session_id?: string;
  lesson_id: string;
  title: string;
  body: string;
  notes_json?: string[];
  source_type?: "manual" | "board" | "teacher" | "quiz" | "summary";
  request_key?: string;
};

export type SaveNotesResponse = {
  ok: boolean;
  noteId: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Generic Event Save
// ─────────────────────────────────────────────────────────────────────────────

export type SaveEventRequest = {
  session_id: string;
  event_type: string;
  actor_role: "student" | "teacher" | "ai_teacher" | "system";
  event_source?: string;
  payload?: Record<string, unknown>;
  request_key?: string;
};

export type SaveEventResponse = {
  ok: boolean;
  eventId: string | null;
};