import { z } from "zod";

export const ClassroomStartInputSchema = z.object({
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
  sessionId: z.string().optional(),
  resumeStep: z.string().optional(),
  preferredAccessProfile: z.record(z.unknown()).optional(),
});

export const ClassroomContextInputSchema = z.object({
  session_id: z.string().uuid(),
});

export const ChatMessageInputSchema = z.object({
  session_id: z.string().uuid(),
  message: z.string().trim().min(1).max(5000),
  sender: z.enum(["student", "teacher", "ai_teacher", "system"]).default("student"),
  message_type: z.string().max(40).default("text"),
  request_key: z.string().max(120).optional(),
});

export const QuickActionInputSchema = z.object({
  session_id: z.string().uuid(),
  action: z.string().trim().min(1).max(80),
  request_key: z.string().max(120).optional(),
});

export const ChangeStepInputSchema = z.object({
  session_id: z.string().uuid(),
  targetStep: z.string().trim().min(1),
  request_key: z.string().max(120).optional(),
});

export const SaveBoardNotesInputSchema = z.object({
  session_id: z.string().uuid(),
  whiteboardContent: z.array(z.string()),
  description: z.string().trim().min(1),
  title: z.string().trim().min(1).optional(),
  request_key: z.string().max(120).optional(),
});

export const AccessProfileInputSchema = z.object({
  session_id: z.string().uuid().optional(),
  captionsEnabled: z.boolean().optional(),
  audioEnabled: z.boolean().optional(),
  keyboardShortcutsEnabled: z.boolean().optional(),
  focusModeEnabled: z.boolean().optional(),
  speechRate: z.number().min(0.5).max(2).optional(),
  currentMode: z.string().optional(),
});

export const QuizResultInputSchema = z.object({
  session_id: z.string().uuid().optional(),
  quiz_id: z.string().uuid(),
  lesson_id: z.string().uuid(),
  score: z.number(),
  percentage: z.number(),
  answers_json: z.any(),
  feedback_json: z.any().optional(),
  request_key: z.string().max(120).optional(),
});

export const SessionEventInputSchema = z.object({
  session_id: z.string().uuid(),
  event_type: z.string().trim().min(1).max(80),
  actor_role: z.enum(["student", "teacher", "ai_teacher", "system"]),
  event_source: z.string().max(80).optional(),
  student_id: z.string().uuid().optional(),
  request_key: z.string().max(120).optional(),
  payload_json: z.record(z.unknown()).default({}),
});

export const SessionLookupInputSchema = z.object({
  session_id: z.string().uuid(),
});

export type ClassroomStartInput = z.infer<typeof ClassroomStartInputSchema>;
export type ClassroomContextInput = z.infer<typeof ClassroomContextInputSchema>;
export type ChatMessageInput = z.infer<typeof ChatMessageInputSchema>;
export type QuickActionInput = z.infer<typeof QuickActionInputSchema>;
export type ChangeStepInput = z.infer<typeof ChangeStepInputSchema>;
export type SaveBoardNotesInput = z.infer<typeof SaveBoardNotesInputSchema>;
export type AccessProfileInput = z.infer<typeof AccessProfileInputSchema>;
export type QuizResultInput = z.infer<typeof QuizResultInputSchema>;
export type SessionEventInput = z.infer<typeof SessionEventInputSchema>;
export type SessionLookupInput = z.infer<typeof SessionLookupInputSchema>;
