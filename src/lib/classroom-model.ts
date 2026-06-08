import type {
  ClassroomMode,
  TeacherState,
  AudioState,
  BoardState,
  LearnerAccessProfile,
  LessonProgress,
  SessionEvent,
} from "@/lib/types";

export const CANONICAL_USER_JOURNEYS = [
  "Student dashboard",
  "Start or resume classroom",
  "Live lesson interaction",
  "Quiz inside classroom",
  "Session summary",
  "Session replay",
  "Notes hub",
  "Access settings",
  "Course detail",
  "Lesson detail",
] as const;

export const CANONICAL_CLASSROOM_STATE = {
  classroomModes: [
    "intro",
    "teaching",
    "listening",
    "thinking",
    "answering",
    "board_writing",
    "practice",
    "quiz",
    "summary",
    "focus",
  ] as const satisfies readonly ClassroomMode[],
  teacherStates: [
    "idle",
    "preparing",
    "speaking",
    "listening",
    "thinking",
    "correcting",
    "encouraging",
  ] as const satisfies readonly TeacherState[],
  ownership: {
    classroom_sessions: "Authoritative room lifecycle and session metadata.",
    session_events: "Authoritative event log for every meaningful classroom interaction.",
    chat_messages: "Authoritative transcript for student and teacher dialogue.",
    board_snapshots: "Authoritative whiteboard history for replay and summary.",
    quiz_results: "Authoritative quiz scoring, feedback, and weak-topic data.",
    session_notes: "Authoritative lesson notes and saved board content.",
    learner_access_profiles: "Authoritative learner preference store for accessibility and pace.",
    recommendations: "Authoritative next-step suggestions for dashboard and classroom.",
    notifications: "Authoritative reminders and nudges surfaced to the learner.",
    lessons: "Authoritative lesson content via lesson_data_json.",
  } as const,
} as const;

export type CanonicalJourneys = (typeof CANONICAL_USER_JOURNEYS)[number];

export type CanonicalTableOwnership = keyof typeof CANONICAL_CLASSROOM_STATE.ownership;

export type CanonicalClassroomState = {
  mode: ClassroomMode;
  teacherState: TeacherState;
  audio: AudioState;
  board: BoardState;
  accessProfile: LearnerAccessProfile;
  progress: LessonProgress;
  lastEvent?: SessionEvent | null;
};

export const CANONICAL_PRODUCT_DATA_MODEL = {
  institutions: "School or organization root records.",
  courses: "Course shell, curriculum, and high-level progress.",
  lessons: "Lesson metadata and lesson_data_json content payload.",
  lesson_data_json: "Canonical lesson content structure for steps and board data.",
  course_enrollments: "Student-to-course membership and lifecycle state.",
  classroom_sessions: "Session lifecycle, mode, and timestamps.",
  session_participants: "Membership records for live or historical room participation.",
  chat_messages: "Conversation transcript.",
  lesson_progress: "Per-lesson progress and mastery state.",
  quiz_results: "Assessment results and weak-topic signals.",
  session_notes: "Student and teacher notes extracted from the lesson.",
  board_snapshots: "Whiteboard state captured over time.",
  learner_access_profiles: "Accessibility, pace, and input preferences.",
  session_events: "Event log for every classroom action.",
  recommendations: "Next-step suggestions derived from lesson signals.",
  notifications: "Learner-facing reminders and nudges.",
} as const;
