/**
 * error-handler.ts
 *
 * Centralized error handling for the classroom application.
 * Handles AI gateway failures, Supabase errors, missing data,
 * duplicate operations, and degraded mode gracefully.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Error Types
// ─────────────────────────────────────────────────────────────────────────────

export type AppError =
  | { type: "ai_unavailable"; message: string; fallback: string }
  | { type: "supabase_error"; message: string; code: string }
  | { type: "missing_lesson"; message: string; lessonId: string }
  | { type: "missing_session"; message: string; sessionId: string }
  | { type: "duplicate_action"; message: string; action: string }
  | { type: "stale_data"; message: string }
  | { type: "auth_error"; message: string }
  | { type: "unknown"; message: string };

// ─────────────────────────────────────────────────────────────────────────────
// Error Classifier
// ─────────────────────────────────────────────────────────────────────────────

export function classifyError(error: unknown): AppError {
  if (!error) return { type: "unknown", message: "An unknown error occurred" };

  const message = error instanceof Error ? error.message : String(error);

  // Supabase errors
  if (message.includes("JWT") || message.includes("token") || message.includes("auth")) {
    return { type: "auth_error", message: "Your session has expired. Please log in again." };
  }

  if (message.includes("row-level security") || message.includes("RLS")) {
    return { type: "auth_error", message: "You don't have permission for this action." };
  }

  if (message.includes("duplicate key") || message.includes("unique constraint")) {
    return {
      type: "duplicate_action",
      message: "This action was already completed.",
      action: "unknown",
    };
  }

  if (message.includes("connection") || message.includes("network") || message.includes("fetch")) {
    return {
      type: "supabase_error",
      message: "Connection issue. Please check your internet.",
      code: "NETWORK",
    };
  }

  // AI errors
  if (message.includes("AI") || message.includes("gateway") || message.includes("rate limit")) {
    return {
      type: "ai_unavailable",
      message: "AI teacher is temporarily unavailable.",
      fallback: "Let me try a different approach. Please continue with the lesson.",
    };
  }

  // Missing data
  if (message.includes("not found") || message.includes("no rows")) {
    if (message.includes("lesson")) {
      return { type: "missing_lesson", message: "This lesson could not be found.", lessonId: "" };
    }
    if (message.includes("session")) {
      return {
        type: "missing_session",
        message: "This session could not be found.",
        sessionId: "",
      };
    }
  }

  return { type: "unknown", message };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback Responses (used when AI fails)
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_TEACHER_RESPONSES: Record<string, string[]> = {
  hook: [
    "Let's explore this topic together. Think about what you already know about this subject.",
    "Welcome to today's lesson! We're going to learn something exciting.",
  ],
  concept: [
    "The key idea here is fundamental. Let me break it down for you step by step.",
    "This concept builds on what we discussed. Let me explain the core principles.",
  ],
  worked_example: [
    "Let me show you a clear example. Watch how we apply the concept.",
    "Here's a worked example that demonstrates the key idea.",
  ],
  guided_practice: [
    "Now it's your turn! Try applying what you've learned.",
    "Let's practice together. Follow along step by step.",
  ],
  independent_question: [
    "What do you think about this? Take a moment to formulate your answer.",
    "Consider this question carefully. There's no rush.",
  ],
  correction: [
    "Good effort! Let me help you understand where the approach can be improved.",
    "Not quite, but that's okay! Learning from mistakes is part of the process.",
  ],
  quiz: [
    "Time to check your understanding! Answer these questions to the best of your ability.",
    "Let's see how well you've grasped this material with a quick quiz.",
  ],
  summary: [
    "Great work today! Let's recap what we've learned in this session.",
    "You've made excellent progress. Here's a summary of the key takeaways.",
  ],
};

export function getFallbackTeacherResponse(step: string): string {
  const responses = FALLBACK_TEACHER_RESPONSES[step] ?? FALLBACK_TEACHER_RESPONSES.concept;
  return responses[Math.floor(Math.random() * responses.length)];
}

// ─────────────────────────────────────────────────────────────────────────────
// Retry Logic
// ─────────────────────────────────────────────────────────────────────────────

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// ─────────────────────────────────────────────────────────────────────────────
// User-Facing Error Messages
// ─────────────────────────────────────────────────────────────────────────────

export function getUserMessage(error: AppError): string {
  switch (error.type) {
    case "ai_unavailable":
      return "The AI teacher is taking a moment. The lesson will continue shortly.";
    case "supabase_error":
      return "We're having trouble connecting. Your work is saved locally.";
    case "missing_lesson":
      return "This lesson isn't available right now. Try another lesson.";
    case "missing_session":
      return "This session couldn't be found. Start a new session from your dashboard.";
    case "duplicate_action":
      return "You've already done this. No need to click twice!";
    case "stale_data":
      return "Your data is being refreshed. One moment...";
    case "auth_error":
      return "Please log in again to continue.";
    default:
      return "Something went wrong. Please try again.";
  }
}
