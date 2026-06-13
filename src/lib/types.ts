import { type ReactNode } from "react";

export type UserRole = "platform_admin" | "institution_admin" | "owner" | "teacher" | "student" | "parent";

export type TeacherState =
  | "idle"
  | "preparing"
  | "listening"
  | "thinking"
  | "speaking"
  | "explaining"
  | "correcting"
  | "encouraging"
  | "writing"
  | "reading"
  | "warning"
  | "checking"
  | "paused";

export type ClassroomMode =
  | "intro"
  | "teaching"
  | "listening"
  | "thinking"
  | "answering"
  | "board_writing"
  | "practice"
  | "quiz"
  | "summary"
  | "focus";

export type AudioState = {
  enabled: boolean;
  playing: boolean;
  paused: boolean;
  muted: boolean;
  rate: number;
  currentTranscript: string;
};

export type BoardState = {
  items: string[];
  activeLineIndex: number;
  description: string;
  mode: "lesson" | "example" | "correction" | "quiz" | "summary";
};

export type SessionEventKind =
  | "session_started"
  | "audio_started"
  | "audio_ended"
  | "student_message"
  | "teacher_message"
  | "quick_action"
  | "step_changed"
  | "quiz_started"
  | "quiz_answered"
  | "note_saved"
  | "board_saved"
  | "access_updated"
  | "focus_mode_enabled"
  | "focus_mode_disabled"
  | "session_ended";

export type SessionEvent = {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  sessionId: string;
  studentId?: string | null;
  actorUserId?: string | null;
  actorRole: "student" | "teacher" | "ai_teacher" | "system";
  eventType: SessionEventKind;
  eventSource?: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type BoardSnapshot = {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  sessionId: string;
  sourceEventId?: string | null;
  stepKey?: LessonStepKey | null;
  mode: BoardState["mode"];
  title: string;
  lines: string[];
  description?: string | null;
  activeLineIndex: number;
  highlight?: string | null;
  createdAt: string;
};

export type SessionNote = {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  sessionId?: string | null;
  studentId: string;
  title: string;
  body: string;
  notes: string[];
  sourceType: "manual" | "board" | "teacher" | "quiz" | "summary";
  isBoardExport: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Recommendation = {
  id: string;
  institutionId: string;
  studentId: string;
  courseId?: string | null;
  lessonId?: string | null;
  sessionId?: string | null;
  recommendationType:
    | "next_lesson"
    | "review_topic"
    | "quiz_retry"
    | "accessibility_tip"
    | "focus_mode"
    | "study_plan";
  title: string;
  description?: string | null;
  reason: Record<string, unknown>;
  targetUrl?: string | null;
  priority: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationItem = {
  id: string;
  institutionId?: string | null;
  userId: string;
  notificationType:
    | "reminder"
    | "nudge"
    | "summary_ready"
    | "quiz_ready"
    | "session_update"
    | "system";
  title: string;
  body: string;
  targetUrl?: string | null;
  payload: Record<string, unknown>;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LessonStepKey =
  | "hook"
  | "concept"
  | "worked_example"
  | "guided_practice"
  | "independent_question"
  | "correction"
  | "quiz"
  | "summary";

export type LessonStep = {
  key: LessonStepKey;
  title: string;
  spokenScript: string;
  captionText: string;
  whiteboardContent: string[];
  whiteboardDescription: string;
  simpleExplanation: string;
  focusGoal: string;
};

export type Institution = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

export type Course = {
  id: string;
  institutionId: string;
  title: string;
  subject: string;
  level: string;
  progressPercentage: number;
  description?: string;
  totalLessons?: number;
  completedLessons?: number;
  thumbnail?: string;
  color?: string;
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  difficulty: string;
  durationMinutes: number;
  steps: LessonStep[];
  description?: string;
  subject?: string;
};

export type ClassroomSession = {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  mode: "ai_teacher" | "human_teacher" | "hybrid";
  status: "scheduled" | "live" | "completed" | "cancelled";
  startTime?: string;
  endTime?: string;
};

export type LessonProgress = {
  currentStep: LessonStepKey;
  progressPercentage: number;
  confusionScore: number;
  studentLevel: "beginner" | "intermediate" | "advanced";
  teacherState: TeacherState;
  timeSpentMinutes: number;
};

export type ChatMessage = {
  id: string;
  sender: "student" | "ai_teacher" | "system";
  message: string;
  createdAt: string;
};

export type LearnerAccessProfile = {
  captionsEnabled: boolean;
  transcriptEnabled: boolean;
  audioEnabled: boolean;
  boardDescriptionsEnabled: boolean;
  screenReaderOptimized: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardShortcutsEnabled: boolean;
  voiceInputEnabled: boolean;
  speechRate: number;
  fontScale: number;
  lessonPace: "slow" | "normal" | "fast";
  explanationStyle: "simple" | "standard" | "detailed";
};

export type ClassroomContext = {
  institution: Institution;
  course: Course;
  lesson: Lesson;
  session: ClassroomSession;
  progress: LessonProgress;
  learnerAccessProfile: LearnerAccessProfile;
  messages: ChatMessage[];
};

export type DashboardData = {
  studentName: string;
  studentEmail?: string;
  studentAvatar?: string;
  stats: {
    classrooms: number;
    completedLessons: number;
    studyTime: string;
    quizAverage: number;
    streak: number;
  };
  courses: Course[];
  recentSessions: Array<{
    id: string;
    title: string;
    courseTitle: string;
    status: string;
    duration: string;
    timestamp?: string;
  }>;
  upcomingSessions?: Array<{
    id: string;
    title: string;
    courseTitle: string;
    time: string;
    date: string;
  }>;
};

export type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: number;
};

export type StatCardData = {
  title: string;
  value: string | number;
  subtitle: string;
  link?: string;
  linkText?: string;
  color: "blue" | "green" | "orange" | "purple" | "red" | "cyan";
  icon: ReactNode;
};

export type CourseCardData = {
  id: string;
  title: string;
  institution: string;
  subject: string;
  level: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  color: string;
  thumbnail?: string;
  description?: string;
};

export type SessionCardData = {
  id: string;
  title: string;
  courseTitle: string;
  status: "completed" | "in_progress" | "scheduled";
  duration: string;
  timestamp: string;
  thumbnail?: string;
  subject?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type TeacherResponse = {
  speak: string;
  board: {
    title: string;
    lines: string[];
    highlight?: string;
  };
  nextStep: LessonStepKey;
  confusionDelta: number;
  evaluation?: "correct" | "incorrect" | "partial";
  quiz?: QuizQuestion;
  done?: boolean;
  simpleExplanation?: string;
  encouragementLevel?: "low" | "medium" | "high";
};

export type StudentLevel = "beginner" | "intermediate" | "advanced";

export type LessonState = {
  step: LessonStepKey;
  studentLevel: StudentLevel;
  confusionScore: number;
  correct: number;
  mistakes: number;
  notes: string[];
  teacherState: TeacherState;
  timeSpentMinutes: number;
};

export type QuickAction = {
  label: string;
  message: string;
  icon: ReactNode;
  category?: "understanding" | "pace" | "practice" | "testing";
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  earned: boolean;
  earnedDate?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
};

export type CalendarEvent = {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  type: "lesson" | "quiz" | "review" | "other";
  completed?: boolean;
};

export type ProgressChartData = {
  subject: string;
  percentage: number;
  color: string;
  icon?: ReactNode;
};

export type LearningGoal = {
  id: string;
  title: string;
  target: string;
  current: number;
  deadline: string;
  completed: boolean;
};

/* ─── Klassruum Video Classroom Types ───────────────────────────── */

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

/**
 * Academic level — drives the teaching style the AI teacher adopts (vocabulary,
 * pacing, depth, amount of encouragement). Set per-learner or per-course.
 */
export type AcademicLevel =
  | "elementary"
  | "secondary"
  | "college"
  | "tertiary"
  | "adult";

/**
 * Structured response from the AI teacher when a learner asks a question.
 *
 * A real tutor does not blindly answer an unclear question — they ask one
 * clarifying question first. When the question is clear, they answer in
 * 74–150 words and decide whether to also show it on the board and whether the
 * answer is worth saving to the learner's notes.
 */
export type TeacherAnswer = {
  /** Whether the learner's question was clear enough to answer directly. */
  clarity: "clear" | "unclear" | "off_topic";
  /** When unclear: a single clarifying question to ask the learner. */
  clarificationQuestion?: string;
  /** When unclear: quick-pick options that resolve the ambiguity. */
  clarificationOptions?: string[];
  /** When clear: the spoken answer (74–150 words), read aloud + captioned. */
  answer?: string;
  /** Whether the teacher should also write supporting items on the board. */
  shouldShowOnBoard: boolean;
  /** Optional board items to render when shouldShowOnBoard is true. */
  boardItems?: Array<{ type: string; text: string }>;
  /** Whether this answer is worth persisting into the learner's notes. */
  saveToNotes: boolean;
  /** A short suggested next step the teacher offers ("see an example?"). */
  suggestedFollowUp: string;
  /** Where the answer came from. */
  source: "ai" | "fallback";
};

export type TeacherVideoState =
  | "preparing"
  | "speaking"
  | "writing"
  | "reading"
  | "explaining"
  | "asking_question"
  | "listening"
  | "thinking"
  | "answering"
  | "clarifying"
  | "encouraging"
  | "paused"
  | "warning"
  | "correcting";

export type WritingSpeed = "slow" | "normal" | "fast";

export type BoardWriteItem = {
  id: string;
  type: "heading" | "bullet" | "equation" | "calculation" | "question" | "answer" | "diagram_label" | "step_number";
  text: string;
  readExactly: boolean;
  explanation?: string;
  accessibleDescription: string;
  writingSpeed?: WritingSpeed;
};

export type BlindQuestionState =
  | "teacher_asking"
  | "mic_listening"
  | "transcribing"
  | "answering"
  | "continuing";

export type QuestionPrompt = {
  id: string;
  promptText: string;
  promptAudio: string;
  allowedInputModes: Array<"text" | "voice" | "quick_action">;
  timeoutSeconds?: number;
  defaultAction: "continue" | "wait";
};

export type VideoClassroomState = {
  sessionId: string;
  learningMode: LearningMode;
  teacherState: TeacherVideoState;
  teacherMode: "ai_teacher" | "human_teacher" | "hybrid";
  boardState: {
    items: BoardWriteItem[];
    currentItemIndex: number;
    writtenItems: BoardWriteItem[];
    isWriting: boolean;
    autoScroll: boolean;
    currentWrittenText: string;
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
    transcript: string;
    blindState?: BlindQuestionState;
  };
  replayState: {
    isReplayMode: boolean;
    replayFromIndex?: number;
  };
  captions: {
    enabled: boolean;
    currentText: string;
  };
  transcript: TranscriptEntry[];
  progress: {
    stepIndex: number;
    totalSteps: number;
    percentage: number;
  };
};

export type TranscriptEntry = {
  id: string;
  role: "student" | "teacher" | "board" | "system";
  text: string;
  timestamp: string;
  boardItemId?: string;
};

/* ─── Video Provider Types (Phase 1–3) ───────────────────────── */

export type VideoProvider = "livekit" | "daily" | "agora";

export type VideoConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "failed";

export type VideoRoom = {
  provider: VideoProvider;
  roomId: string;
  joinUrl?: string;
  token?: string;
};

export type VideoParticipantRole = "teacher" | "student" | "observer";

export type VideoParticipantState = {
  userId: string;
  displayName: string;
  role: VideoParticipantRole;
  cameraEnabled: boolean;
  micEnabled: boolean;
  isSpeaking: boolean;
  connectionStatus: VideoConnectionStatus;
  joinedAt?: string;
};

export type VideoSessionState = {
  sessionId: string;
  videoSessionId?: string;
  provider?: VideoProvider;
  roomStatus: "inactive" | "creating" | "active" | "ending" | "ended";
  connectionStatus: VideoConnectionStatus;
  localParticipant: {
    cameraEnabled: boolean;
    micEnabled: boolean;
    isSpeaking: boolean;
  };
  remoteParticipants: VideoParticipantState[];
  participantsVisible: boolean;
  recordingEnabled: boolean;
  recordingActive: boolean;
};

/* ─── Video Service Interface ────────────────────────────────── */

export interface VideoService {
  createRoom(sessionId: string): Promise<VideoRoom>;
  createToken(params: {
    roomId: string;
    userId: string;
    role: VideoParticipantRole;
  }): Promise<string>;
  endRoom(roomId: string): Promise<void>;
}

/* ─── Video Session DB Types ─────────────────────────────────── */

export type VideoSession = {
  id: string;
  classroomSessionId: string;
  provider: VideoProvider;
  providerRoomId: string;
  status: "creating" | "active" | "ended" | "failed";
  startedAt?: string;
  endedAt?: string;
  recordingUrl?: string;
  createdAt: string;
};

export type VideoParticipant = {
  id: string;
  videoSessionId: string;
  userId: string;
  role: VideoParticipantRole;
  cameraEnabled: boolean;
  micEnabled: boolean;
  joinedAt?: string;
  leftAt?: string;
};

export type SessionRecording = {
  id: string;
  classroomSessionId: string;
  videoUrl?: string;
  audioUrl?: string;
  transcriptUrl?: string;
  durationSeconds: number;
  status: "recording" | "processing" | "ready" | "failed";
  createdAt: string;
};

/* ─── Camera / Mic Permission State ──────────────────────────── */

export type PermissionState = "unknown" | "granted" | "denied" | "prompt";

export type MediaPermissionState = {
  camera: PermissionState;
  microphone: PermissionState;
};

/* ─── Klassruum Business Hierarchy Types ─────────────────────── */

/** Programme: groups courses under an institution (e.g., "Form 2 Mathematics") */
export type Programme = {
  id: string;
  institutionId: string;
  title: string;
  description?: string;
  level?: string;
  subjectArea?: string;
  targetLearners?: string;
  learningOutcomes: string[];
  startDate?: string;
  endDate?: string;
  timelineWeeks?: number;
  status: "draft" | "active" | "archived";
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

/** Course material: uploaded content tied to a course for lesson generation */
export type CourseMaterial = {
  id: string;
  institutionId: string;
  courseId: string;
  uploadedBy?: string;
  title: string;
  type: "pdf" | "document" | "slide" | "image" | "text" | "link" | "worksheet" | "syllabus";
  fileUrl?: string;
  linkUrl?: string;
  extractedText?: string;
  syllabusReference?: string;
  processingStatus: "pending" | "processing" | "ready" | "failed";
  processingError?: string;
  createdAt: string;
  updatedAt: string;
};

/** Material image: extracted from course materials */
export type MaterialImage = {
  id: string;
  institutionId: string;
  courseId: string;
  courseMaterialId: string;
  imageUrl: string;
  caption?: string;
  extractedContext?: string;
  suggestedLessonId?: string;
  createdAt: string;
};

/** Lesson generation job: tracks AI lesson generation from materials */
export type LessonGenerationJob = {
  id: string;
  institutionId: string;
  courseId: string;
  programmeId?: string;
  triggeredBy: string;
  sourceMaterialIds: string[];
  status: "queued" | "processing" | "completed" | "failed" | "cancelled";
  totalLessonsRequested?: number;
  totalLessonsGenerated?: number;
  generationSettings: LessonGenerationSettings;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

/** Settings for lesson generation */
export type LessonGenerationSettings = {
  mode: "auto" | "manual" | "mixed";
  targetLessonCount?: number;
  minimumDurationMinutes: number;
  maximumDurationMinutes: number;
  defaultDurationMinutes: number;
  teachingDepth: "basic" | "standard" | "detailed" | "intensive";
  includeImages: boolean;
  includeGuidedPractice: boolean;
  includeIndependentPractice: boolean;
  includeNotes: boolean;
  includeTranscriptStructure: boolean;
};

/** Lesson section: structured teaching unit within a lesson */
export type LessonSection = {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  title: string;
  type:
    | "welcome"
    | "objective"
    | "why_it_matters"
    | "prerequisite_check"
    | "concept"
    | "worked_example"
    | "question_checkpoint"
    | "required_middle_question"
    | "guided_practice"
    | "independent_practice"
    | "correction"
    | "summary"
    | "exit_reflection"
    | "homework";
  orderIndex: number;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
};

/** Teaching item: individual board item within a section */
export type TeachingItem = {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  sectionId: string;
  orderIndex: number;
  type:
    | "heading"
    | "bullet"
    | "equation"
    | "calculation"
    | "image"
    | "diagram"
    | "question"
    | "answer"
    | "correction"
    | "instruction"
    | "concept";
  boardText?: string;
  imageUrl?: string;
  imageAlt?: string;
  exactSpokenText: string;
  teacherExplanation: string;
  learnerNotes: string;
  accessibleDescription: string;
  whyThisMatters?: string;
  commonMistake?: string;
  writingSpeed: "slow" | "normal" | "fast";
  estimatedSeconds: number;
  sourceMaterialId?: string;
  createdAt: string;
  updatedAt: string;
};

/** Learner question: asked in class, answered from context */
export type LearnerQuestion = {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  sessionId?: string;
  studentId: string;
  sectionType?: string;
  boardItemRef?: string;
  questionText: string;
  answerText?: string;
  answerWordCount?: number;
  contextJson: Record<string, unknown>;
  answerSource: "ai" | "teacher" | "fallback";
  learningMode?: string;
  createdAt: string;
};

/** Learning result: per-session activity & evidence */
export type LearningResult = {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  sessionId?: string;
  studentId: string;
  status: "not_started" | "in_progress" | "paused" | "needs_review" | "completed" | "replayed";
  progressPercentage: number;
  timeSpentSeconds: number;
  currentSection?: string;
  resumePointJson: Record<string, unknown>;
  questionsAsked: number;
  raisedHands: number;
  practiceAttempts: number;
  practiceCorrect: number;
  hintsUsed: number;
  middleQuestionCorrect?: boolean;
  confidenceChecks: unknown[];
  misconceptionsDetected: number;
  weakAreas: unknown[];
  notesSaved: boolean;
  transcriptSaved: boolean;
  eventsJson: unknown[];
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
};

/** User presence: realtime online tracking */
export type UserPresence = {
  id: string;
  userId: string;
  institutionId?: string;
  status: "online" | "away" | "offline";
  lastHeartbeat: string;
  currentSessionId?: string;
  currentLessonId?: string;
};

/** KingPin course source type */
export type CourseSourceType = "institution" | "kingpin";
