import { type ReactNode } from "react";

export type UserRole = "platform_admin" | "institution_admin" | "teacher" | "student";

export type TeacherState =
  | "idle"
  | "preparing"
  | "listening"
  | "thinking"
  | "speaking"
  | "explaining"
  | "correcting"
  | "encouraging";

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
