/**
 * classroom.reducer.ts
 *
 * A stateful reducer that controls all UI state for the live classroom.
 * Every user action dispatches through this reducer, which then:
 *   1. Updates local UI state immediately (optimistic)
 *   2. Calls the server function to persist the action
 *   3. Reconciles server state back into the reducer
 *
 * The classroom behaves like a mini operating system where every action
 * changes at least two visible things on screen.
 */

import type {
  LessonStepKey,
  TeacherState,
  ClassroomMode,
  LearnerAccessProfile,
  ChatMessage,
  BoardState,
  AudioState,
  LessonStep,
  StudentLevel,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

export type ClassroomState = {
  // Session identity
  sessionId: string | null;
  courseId: string | null;
  lessonId: string | null;
  institutionId: string | null;
  sessionStatus: "idle" | "loading" | "live" | "paused" | "ended";

  // Lesson content
  steps: LessonStep[];
  currentStepIndex: number;
  currentStepKey: LessonStepKey;

  // Progress tracking
  progressPercentage: number;
  confusionScore: number;
  studentLevel: StudentLevel;
  timeSpentMinutes: number;

  // Teacher
  teacherState: TeacherState;
  teacherMessage: string;

  // Board
  board: BoardState;

  // Chat
  messages: ChatMessage[];
  unreadMessageCount: number;

  // Audio
  audio: AudioState;

  // Notes
  notes: string[];
  notesTitle: string;

  // Quiz
  quizActive: boolean;
  quizQuestionIndex: number;
  quizAnswers: number[];
  quizScore: number | null;

  // Accessibility
  access: LearnerAccessProfile;
  focusMode: boolean;

  // UI
  classroomMode: ClassroomMode;
  captions: string[];
  recommendations: Array<{
    id: string;
    title: string;
    type: string;
    targetUrl: string | null;
  }>;

  // Loading flags
  isLoading: boolean;
  isEndingSession: boolean;
  error: string | null;
};

export const initialClassroomState: ClassroomState = {
  sessionId: null,
  courseId: null,
  lessonId: null,
  institutionId: null,
  sessionStatus: "idle",

  steps: [],
  currentStepIndex: 0,
  currentStepKey: "hook",

  progressPercentage: 0,
  confusionScore: 0,
  studentLevel: "intermediate",
  timeSpentMinutes: 0,

  teacherState: "idle",
  teacherMessage: "",

  board: {
    items: [],
    activeLineIndex: 0,
    description: "",
    mode: "lesson",
  },

  messages: [],
  unreadMessageCount: 0,

  audio: {
    enabled: true,
    playing: false,
    paused: false,
    muted: false,
    rate: 1,
    currentTranscript: "",
  },

  notes: [],
  notesTitle: "Session Notes",

  quizActive: false,
  quizQuestionIndex: 0,
  quizAnswers: [],
  quizScore: null,

  access: {
    captionsEnabled: true,
    transcriptEnabled: true,
    audioEnabled: true,
    boardDescriptionsEnabled: true,
    screenReaderOptimized: false,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    keyboardShortcutsEnabled: true,
    voiceInputEnabled: false,
    speechRate: 1,
    fontScale: 1,
    lessonPace: "normal",
    explanationStyle: "standard",
  },
  focusMode: false,

  classroomMode: "intro",
  captions: [],
  recommendations: [],

  isLoading: false,
  isEndingSession: false,
  error: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────

export type ClassroomAction =
  | { type: "ENTER_CLASSROOM"; payload: { sessionId: string; courseId: string; lessonId: string; institutionId: string } }
  | { type: "LOAD_CONTEXT"; payload: Partial<ClassroomState> }
  | { type: "LOAD_LESSON_STEPS"; payload: { steps: LessonStep[] } }
  | { type: "START_AUDIO" }
  | { type: "PAUSE_AUDIO" }
  | { type: "RESUME_AUDIO" }
  | { type: "AUDIO_ENDED" }
  | { type: "SET_TRANSCRIPT"; payload: { transcript: string } }
  | { type: "SEND_MESSAGE"; payload: { message: string } }
  | { type: "RECEIVE_TEACHER_MESSAGE"; payload: { message: string; speak?: string } }
  | { type: "QUICK_ACTION"; payload: { action: string; message: string } }
  | { type: "CHANGE_STEP"; payload: { targetStep: LessonStepKey; progressPercentage?: number; confusionScore?: number } }
  | { type: "START_QUIZ" }
  | { type: "ANSWER_QUIZ"; payload: { answerIndex: number } }
  | { type: "FINISH_QUIZ"; payload: { score: number } }
  | { type: "SAVE_NOTES"; payload: { notes: string[]; title?: string } }
  | { type: "UPDATE_ACCESS"; payload: Partial<LearnerAccessProfile> }
  | { type: "TOGGLE_FOCUS_MODE" }
  | { type: "SET_TEACHER_STATE"; payload: { state: TeacherState } }
  | { type: "UPDATE_BOARD"; payload: Partial<BoardState> }
  | { type: "ADD_CAPTION"; payload: { text: string } }
  | { type: "CLEAR_CAPTIONS" }
  | { type: "SET_LOADING"; payload: { isLoading: boolean } }
  | { type: "SET_ERROR"; payload: { error: string | null } }
  | { type: "END_SESSION"; payload: { finalProgressPercentage?: number; finalConfusionScore?: number } }
  | { type: "TICK_TIMER" }
  | { type: "SET_RECOMMENDATIONS"; payload: ClassroomState["recommendations"] };

// ─────────────────────────────────────────────────────────────────────────────
// Step ordering and helpers
// ─────────────────────────────────────────────────────────────────────────────

const STEP_ORDER: LessonStepKey[] = [
  "hook",
  "concept",
  "worked_example",
  "guided_practice",
  "independent_question",
  "correction",
  "quiz",
  "summary",
];

export function getStepIndex(stepKey: LessonStepKey): number {
  return STEP_ORDER.indexOf(stepKey);
}

export function getNextStep(current: LessonStepKey): LessonStepKey | null {
  const idx = STEP_ORDER.indexOf(current);
  if (idx < 0 || idx >= STEP_ORDER.length - 1) return null;
  return STEP_ORDER[idx + 1];
}

function stepToClassroomMode(step: LessonStepKey): ClassroomMode {
  switch (step) {
    case "hook":
      return "intro";
    case "concept":
    case "worked_example":
      return "teaching";
    case "guided_practice":
      return "practice";
    case "independent_question":
      return "answering";
    case "correction":
      return "board_writing";
    case "quiz":
      return "quiz";
    case "summary":
      return "summary";
    default:
      return "teaching";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────

export function classroomReducer(
  state: ClassroomState,
  action: ClassroomAction,
): ClassroomState {
  switch (action.type) {
    // ── Enter classroom ──────────────────────────────────────────────────
    case "ENTER_CLASSROOM": {
      return {
        ...state,
        ...action.payload,
        sessionStatus: "loading",
        isLoading: true,
        error: null,
      };
    }

    // ── Load context from server ─────────────────────────────────────────
    case "LOAD_CONTEXT": {
      return {
        ...state,
        ...action.payload,
        sessionStatus: action.payload.sessionStatus ?? "live",
        isLoading: false,
      };
    }

    // ── Load lesson steps ────────────────────────────────────────────────
    case "LOAD_LESSON_STEPS": {
      const steps = action.payload.steps;
      const currentIdx = Math.min(state.currentStepIndex, steps.length - 1);
      const step = steps[currentIdx];
      return {
        ...state,
        steps,
        currentStepIndex: currentIdx,
        currentStepKey: step?.key ?? state.currentStepKey,
        board: step
          ? {
              items: step.whiteboardContent,
              activeLineIndex: 0,
              description: step.whiteboardDescription,
              mode: "lesson",
            }
          : state.board,
        captions: step ? [step.captionText] : state.captions,
        classroomMode: stepToClassroomMode(step?.key ?? state.currentStepKey),
      };
    }

    // ── Start audio ──────────────────────────────────────────────────────
    case "START_AUDIO": {
      return {
        ...state,
        audio: { ...state.audio, playing: true, paused: false },
        teacherState: "speaking",
        classroomMode: state.quizActive ? "quiz" : stepToClassroomMode(state.currentStepKey),
      };
    }

    // ── Pause audio ──────────────────────────────────────────────────────
    case "PAUSE_AUDIO": {
      return {
        ...state,
        audio: { ...state.audio, paused: true },
        teacherState: "idle",
      };
    }

    // ── Resume audio ─────────────────────────────────────────────────────
    case "RESUME_AUDIO": {
      return {
        ...state,
        audio: { ...state.audio, paused: false },
        teacherState: "speaking",
      };
    }

    // ── Audio ended ──────────────────────────────────────────────────────
    case "AUDIO_ENDED": {
      return {
        ...state,
        audio: { ...state.audio, playing: false, paused: false },
        teacherState: "idle",
      };
    }

    // ── Set transcript ───────────────────────────────────────────────────
    case "SET_TRANSCRIPT": {
      return {
        ...state,
        audio: { ...state.audio, currentTranscript: action.payload.transcript },
      };
    }

    // ── Send message (student) ───────────────────────────────────────────
    case "SEND_MESSAGE": {
      const newMsg: ChatMessage = {
        id: `local_${Date.now()}`,
        sender: "student",
        message: action.payload.message,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        messages: [...state.messages, newMsg],
        teacherState: "listening",
        classroomMode: "listening",
      };
    }

    // ── Receive teacher message ──────────────────────────────────────────
    case "RECEIVE_TEACHER_MESSAGE": {
      const teacherMsg: ChatMessage = {
        id: `teacher_${Date.now()}`,
        sender: "ai_teacher",
        message: action.payload.message,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        messages: [...state.messages, teacherMsg],
        teacherState: "speaking",
        unreadMessageCount: state.focusMode ? state.unreadMessageCount + 1 : 0,
        // If there's a speak command, enable audio
        audio: action.payload.speak
          ? { ...state.audio, playing: true, currentTranscript: action.payload.speak }
          : state.audio,
      };
    }

    // ── Quick action ─────────────────────────────────────────────────────
    case "QUICK_ACTION": {
      const quickMsg: ChatMessage = {
        id: `qa_${Date.now()}`,
        sender: "student",
        message: action.payload.message,
        createdAt: new Date().toISOString(),
      };
      // Different quick actions have different effects on teacher state
      let newTeacherState: TeacherState = "thinking";
      let newConfusion = state.confusionScore;
      const actionName = action.payload.action.toLowerCase();

      if (actionName.includes("understand")) {
        newConfusion = Math.min(1, state.confusionScore + 0.15);
        newTeacherState = "explaining";
      } else if (actionName.includes("example")) {
        newTeacherState = "explaining";
      } else if (actionName.includes("slow")) {
        newTeacherState = "speaking";
      } else if (actionName.includes("next")) {
        newTeacherState = "preparing";
      } else if (actionName.includes("quiz")) {
        newTeacherState = "preparing";
      }

      return {
        ...state,
        messages: [...state.messages, quickMsg],
        teacherState: newTeacherState,
        confusionScore: newConfusion,
        classroomMode: "thinking",
      };
    }

    // ── Change step ──────────────────────────────────────────────────────
    case "CHANGE_STEP": {
      const { targetStep, progressPercentage, confusionScore } = action.payload;
      const stepIndex = getStepIndex(targetStep);
      const step = state.steps[stepIndex];
      const newProgress = progressPercentage ?? Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100);

      return {
        ...state,
        currentStepKey: targetStep,
        currentStepIndex: stepIndex,
        progressPercentage: newProgress,
        confusionScore: confusionScore ?? state.confusionScore,
        teacherState: "preparing",
        classroomMode: stepToClassroomMode(targetStep),
        board: step
          ? {
              items: step.whiteboardContent,
              activeLineIndex: 0,
              description: step.whiteboardDescription,
              mode: targetStep === "worked_example" ? "example" :
                    targetStep === "correction" ? "correction" :
                    targetStep === "quiz" ? "quiz" :
                    targetStep === "summary" ? "summary" : "lesson",
            }
          : state.board,
        captions: step ? [step.captionText] : state.captions,
        audio: { ...state.audio, playing: false },
        quizActive: targetStep === "quiz",
      };
    }

    // ── Start quiz ───────────────────────────────────────────────────────
    case "START_QUIZ": {
      return {
        ...state,
        quizActive: true,
        quizQuestionIndex: 0,
        quizAnswers: [],
        quizScore: null,
        classroomMode: "quiz",
        teacherState: "speaking",
      };
    }

    // ── Answer quiz ──────────────────────────────────────────────────────
    case "ANSWER_QUIZ": {
      const newAnswers = [...state.quizAnswers, action.payload.answerIndex];
      return {
        ...state,
        quizAnswers: newAnswers,
        quizQuestionIndex: state.quizQuestionIndex + 1,
        teacherState: "thinking",
      };
    }

    // ── Finish quiz ──────────────────────────────────────────────────────
    case "FINISH_QUIZ": {
      return {
        ...state,
        quizScore: action.payload.score,
        teacherState: action.payload.score >= 70 ? "encouraging" : "correcting",
        classroomMode: "summary",
      };
    }

    // ── Save notes ───────────────────────────────────────────────────────
    case "SAVE_NOTES": {
      return {
        ...state,
        notes: action.payload.notes,
        notesTitle: action.payload.title ?? state.notesTitle,
      };
    }

    // ── Update access profile ────────────────────────────────────────────
    case "UPDATE_ACCESS": {
      const newAccess = { ...state.access, ...action.payload };
      return {
        ...state,
        access: newAccess,
        audio: {
          ...state.audio,
          enabled: newAccess.audioEnabled,
          rate: newAccess.speechRate,
        },
        focusMode: newAccess.reducedMotion,
      };
    }

    // ── Toggle focus mode ────────────────────────────────────────────────
    case "TOGGLE_FOCUS_MODE": {
      const newFocus = !state.focusMode;
      return {
        ...state,
        focusMode: newFocus,
        access: { ...state.access, reducedMotion: newFocus },
        classroomMode: newFocus ? "focus" : stepToClassroomMode(state.currentStepKey),
        unreadMessageCount: newFocus ? 0 : state.unreadMessageCount,
      };
    }

    // ── Set teacher state ────────────────────────────────────────────────
    case "SET_TEACHER_STATE": {
      return {
        ...state,
        teacherState: action.payload.state,
      };
    }

    // ── Update board ─────────────────────────────────────────────────────
    case "UPDATE_BOARD": {
      return {
        ...state,
        board: { ...state.board, ...action.payload },
      };
    }

    // ── Add caption ──────────────────────────────────────────────────────
    case "ADD_CAPTION": {
      return {
        ...state,
        captions: [...state.captions, action.payload.text],
      };
    }

    // ── Clear captions ───────────────────────────────────────────────────
    case "CLEAR_CAPTIONS": {
      return {
        ...state,
        captions: [],
      };
    }

    // ── Set loading ──────────────────────────────────────────────────────
    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }

    // ── Set error ────────────────────────────────────────────────────────
    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
        teacherState: "idle",
      };
    }

    // ── End session ──────────────────────────────────────────────────────
    case "END_SESSION": {
      return {
        ...state,
        sessionStatus: "ended",
        isEndingSession: false,
        progressPercentage: action.payload.finalProgressPercentage ?? state.progressPercentage,
        confusionScore: action.payload.finalConfusionScore ?? state.confusionScore,
        audio: { ...state.audio, playing: false, paused: false },
        teacherState: "idle",
        classroomMode: "summary",
      };
    }

    // ── Tick timer (called every minute) ─────────────────────────────────
    case "TICK_TIMER": {
      return {
        ...state,
        timeSpentMinutes: state.timeSpentMinutes + 1,
      };
    }

    // ── Set recommendations ──────────────────────────────────────────────
    case "SET_RECOMMENDATIONS": {
      return {
        ...state,
        recommendations: action.payload,
      };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Selector helpers
// ─────────────────────────────────────────────────────────────────────────────

export function selectCurrentStep(state: ClassroomState): LessonStep | null {
  return state.steps[state.currentStepIndex] ?? null;
}

export function selectIsLastStep(state: ClassroomState): boolean {
  return state.currentStepIndex >= STEP_ORDER.length - 1;
}

export function selectProgressPercent(state: ClassroomState): number {
  return Math.round(((state.currentStepIndex + 1) / STEP_ORDER.length) * 100);
}

export function selectVisibleMessages(state: ClassroomState): ChatMessage[] {
  if (state.focusMode) {
    // In focus mode, only show teacher messages and the last student message
    let lastStudentIdx = -1;
    for (let i = state.messages.length - 1; i >= 0; i--) {
      if (state.messages[i].sender === "student") {
        lastStudentIdx = i;
        break;
      }
    }
    return state.messages.filter(
      (m, i) => m.sender === "ai_teacher" || m.sender === "system" || i === lastStudentIdx,
    );
  }
  return state.messages;
}
