/**
 * engines.ts
 *
 * Barrel export for all backend engine modules.
 * Import from here for clean dependency paths.
 */

// Classroom engine - all server functions
export {
  getStudentDashboard,
  startOrResumeClassroomV2,
  getClassroomContextV2,
  postChatMessageV2,
  postQuickActionV2,
  changeClassroomStepV2,
  saveBoardNotesV2,
  updateAccessProfileV2,
  submitQuizResultV2,
  endSessionV2,
  getSessionSummary,
  getSessionReplay,
  listRecommendations,
  saveSessionEvent,
  saveNotes,
} from "./classroom.engine";

// Classroom reducer - state machine
export {
  classroomReducer,
  initialClassroomState,
  getStepIndex,
  getNextStep,
  selectCurrentStep,
  selectIsLastStep,
  selectProgressPercent,
  selectVisibleMessages,
} from "./classroom.reducer";

export type {
  ClassroomState,
  ClassroomAction,
} from "./classroom.reducer";

// Recommendations engine
export {
  generateRecommendations,
  generateSessionSummary,
  generateAndStoreRecommendations,
} from "./recommendations.engine";

export type {
  GeneratedRecommendation,
  GeneratedSummary,
} from "./recommendations.engine";

// Analytics engine
export {
  getStudentAnalytics,
  generateNotifications,
  getNotifications,
  markNotificationRead,
} from "./analytics.engine";

export type {
  StudentAnalytics,
  NotificationRule,
} from "./analytics.engine";

// Payload types
export type {
  DashboardResponse,
  StartClassroomRequest,
  StartClassroomResponse,
  ClassroomContextResponse,
  ChatMessageRequest,
  ChatMessageResponse,
  QuickActionRequest,
  QuickActionResponse,
  StepChangeRequest,
  StepChangeResponse,
  SaveBoardNotesRequest,
  SaveBoardNotesResponse,
  AccessProfileUpdateRequest,
  AccessProfileUpdateResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
  EndSessionRequest,
  EndSessionResponse,
  SessionSummaryResponse,
  SessionReplayResponse,
  ReplayTimelineItem,
  SaveNotesRequest,
  SaveNotesResponse,
  SaveEventRequest,
  SaveEventResponse,
} from "./classroom.payloads";