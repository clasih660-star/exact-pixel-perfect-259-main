// ─── Core Klassruum Classroom Types ───────────────────────────────────────

export type LearningMode =
  | "standard"
  | "deaf"
  | "blind"
  | "low_vision"
  | "deaf_blind"
  | "dyslexia"
  | "adhd_focus"
  | "motor_support"
  | "speech_difficulty"
  | "extra_support"
  | "challenge";

export type TeacherVideoState =
  | "preparing"
  | "speaking"
  | "writing"
  | "explaining"
  | "asking_question"
  | "listening"
  | "thinking"
  | "answering"
  | "encouraging"
  | "paused";

export type WritingSpeed = "slow" | "normal" | "fast";

export type BoardWriteItemType =
  | "heading"
  | "bullet"
  | "equation"
  | "calculation"
  | "question"
  | "answer";

export type BoardWriteItem = {
  id: string;
  type: BoardWriteItemType;
  text: string;
  readExactly: boolean;
  explanation?: string;
  accessibleDescription: string;
  writingSpeed?: WritingSpeed;
};

export type QuestionPrompt = {
  id: string;
  promptText: string;
  promptAudio: string;
  allowedInputModes: Array<"text" | "voice" | "quick_action">;
  timeoutSeconds?: number;
  defaultAction: "continue" | "wait";
};

export type BlindQuestionState =
  | "teacher_asking"
  | "mic_listening"
  | "transcribing"
  | "answering"
  | "continuing";

export type ClassroomState = {
  sessionId: string;
  mode: LearningMode;
  teacherState: TeacherVideoState;
  boardState: {
    items: BoardWriteItem[];
    currentItemIndex: number;
    writtenItems: BoardWriteItem[];
    isWriting: boolean;
    autoScroll: boolean;
  };
  audioState: {
    enabled: boolean;
    playing: boolean;
    rate: number;
    lockedOnForBlindMode: boolean;
  };
  questionState: {
    isPromptOpen: boolean;
    inputMode: "text" | "voice" | "quick_action";
    isListening: boolean;
    transcript?: string;
  };
  replayState: {
    isReplayMode: boolean;
    replayFromIndex?: number;
  };
};

export const MODE_LABELS: Record<LearningMode, string> = {
  standard: "Standard",
  deaf: "Deaf / Hard of Hearing",
  blind: "Blind",
  low_vision: "Low Vision",
  deaf_blind: "Deaf-Blind",
  dyslexia: "Dyslexia-Friendly",
  adhd_focus: "ADHD / Focus",
  motor_support: "Motor Support",
  speech_difficulty: "Speech Difficulty",
  extra_support: "Extra Support",
  challenge: "Challenge Mode",
};

export const MODE_DEFAULTS: Record<
  LearningMode,
  {
    teacherVideo: boolean;
    audio: boolean;
    captions: boolean;
    boardWriting: boolean;
    textInput: boolean;
    voiceInput: boolean;
    transcript: boolean;
    boardDescriptions: boolean;
    screenReaderOptimized: boolean;
    keyboardNav: boolean;
    visualAlerts: boolean;
    largeButtons: boolean;
    reducedMotion: boolean;
    hideChat: boolean;
    writingSpeed: WritingSpeed;
  }
> = {
  standard: {
    teacherVideo: true,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: true,
    transcript: true,
    boardDescriptions: false,
    screenReaderOptimized: false,
    keyboardNav: false,
    visualAlerts: false,
    largeButtons: false,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "normal",
  },
  deaf: {
    teacherVideo: true,
    audio: false,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: false,
    transcript: true,
    boardDescriptions: false,
    screenReaderOptimized: false,
    keyboardNav: false,
    visualAlerts: true,
    largeButtons: false,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "normal",
  },
  blind: {
    teacherVideo: false,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: false,
    voiceInput: true,
    transcript: true,
    boardDescriptions: true,
    screenReaderOptimized: true,
    keyboardNav: true,
    visualAlerts: false,
    largeButtons: false,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "slow",
  },
  low_vision: {
    teacherVideo: true,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: true,
    transcript: true,
    boardDescriptions: true,
    screenReaderOptimized: true,
    keyboardNav: true,
    visualAlerts: true,
    largeButtons: true,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "normal",
  },
  deaf_blind: {
    teacherVideo: false,
    audio: false,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: false,
    transcript: true,
    boardDescriptions: true,
    screenReaderOptimized: true,
    keyboardNav: true,
    visualAlerts: false,
    largeButtons: true,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "normal",
  },
  dyslexia: {
    teacherVideo: true,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: true,
    transcript: true,
    boardDescriptions: false,
    screenReaderOptimized: false,
    keyboardNav: false,
    visualAlerts: false,
    largeButtons: false,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "normal",
  },
  adhd_focus: {
    teacherVideo: true,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: true,
    transcript: true,
    boardDescriptions: false,
    screenReaderOptimized: false,
    keyboardNav: false,
    visualAlerts: false,
    largeButtons: false,
    reducedMotion: true,
    hideChat: true,
    writingSpeed: "slow",
  },
  motor_support: {
    teacherVideo: true,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: false,
    transcript: true,
    boardDescriptions: false,
    screenReaderOptimized: false,
    keyboardNav: true,
    visualAlerts: false,
    largeButtons: true,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "normal",
  },
  speech_difficulty: {
    teacherVideo: true,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: false,
    transcript: true,
    boardDescriptions: false,
    screenReaderOptimized: false,
    keyboardNav: false,
    visualAlerts: false,
    largeButtons: false,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "normal",
  },
  extra_support: {
    teacherVideo: true,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: true,
    transcript: true,
    boardDescriptions: true,
    screenReaderOptimized: false,
    keyboardNav: false,
    visualAlerts: true,
    largeButtons: true,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "slow",
  },
  challenge: {
    teacherVideo: true,
    audio: true,
    captions: true,
    boardWriting: true,
    textInput: true,
    voiceInput: true,
    transcript: true,
    boardDescriptions: false,
    screenReaderOptimized: false,
    keyboardNav: false,
    visualAlerts: false,
    largeButtons: false,
    reducedMotion: false,
    hideChat: false,
    writingSpeed: "fast",
  },
};

export const TEACHER_STATE_LABELS: Record<TeacherVideoState, string> = {
  preparing: "Preparing lesson…",
  speaking: "Speaking…",
  writing: "Writing on board…",
  explaining: "Explaining…",
  asking_question: "Asking a question…",
  listening: "Listening…",
  thinking: "Thinking…",
  answering: "Answering…",
  encouraging: "Great work!",
  paused: "Paused",
};

export const TEACHER_STATE_ACTIVITIES: Record<TeacherVideoState, string> = {
  preparing: "Preparing",
  speaking: "Speaking",
  writing: "Writing on board",
  explaining: "Explaining",
  asking_question: "Asking Question",
  listening: "Listening",
  thinking: "Thinking",
  answering: "Answering",
  encouraging: "Encouraging",
  paused: "Paused",
};

export const WRITING_SPEED_MS: Record<WritingSpeed, number> = {
  slow: 55,
  normal: 28,
  fast: 12,
};

export const SAMPLE_BOARD_SEQUENCE: BoardWriteItem[] = [
  {
    id: "b1",
    type: "heading",
    text: "Solving Quadratic Equations",
    readExactly: true,
    accessibleDescription: "The board title is Solving Quadratic Equations.",
  },
  {
    id: "b2",
    type: "equation",
    text: "x² + 5x + 6 = 0",
    readExactly: true,
    accessibleDescription: "The board shows x squared plus five x plus six equals zero.",
  },
  {
    id: "b3",
    type: "bullet",
    text: "Find two numbers that multiply to 6.",
    readExactly: true,
    explanation: "We are looking for a factor pair of six.",
    accessibleDescription: "The instruction is to find two numbers that multiply to six.",
  },
  {
    id: "b4",
    type: "bullet",
    text: "The same numbers must add to 5.",
    readExactly: true,
    explanation: "This is because the middle term is five x.",
    accessibleDescription: "The same two numbers must also add to five.",
  },
  {
    id: "b5",
    type: "calculation",
    text: "2 × 3 = 6 and 2 + 3 = 5",
    readExactly: true,
    accessibleDescription: "Two times three equals six, and two plus three equals five.",
  },
  {
    id: "b6",
    type: "answer",
    text: "x = -2 or x = -3",
    readExactly: true,
    accessibleDescription: "The answers are x equals negative two or x equals negative three.",
  },
];
