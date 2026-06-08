/**
 * recommendations.engine.ts
 *
 * AI-powered recommendation logic that generates personalized suggestions
 * based on confusion scores, step completion, quiz results, weak topics,
 * time spent, and recent session behavior.
 *
 * Includes fallback responses when AI is unavailable.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type RecommendationInput = {
  confusionScore: number;
  stepsCompleted: number;
  totalSteps: number;
  recentQuizScores: number[];
  weakTopics: string[];
  timeSpentMinutes: number;
  sessionsThisWeek: number;
  currentStep: string;
  studentLevel: "beginner" | "intermediate" | "advanced";
  streakDays: number;
};

export type GeneratedRecommendation = {
  type: "next_lesson" | "review_topic" | "quiz_retry" | "accessibility_tip" | "focus_mode" | "study_plan";
  title: string;
  description: string;
  reason: string;
  targetUrl: string | null;
  priority: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Recommendation Rules Engine
// ─────────────────────────────────────────────────────────────────────────────

export function generateRecommendations(input: RecommendationInput): GeneratedRecommendation[] {
  const recs: GeneratedRecommendation[] = [];

  // Rule 1: High confusion → review topic
  if (input.confusionScore > 0.6) {
    recs.push({
      type: "review_topic",
      title: "Review this topic",
      description: `Your confusion score is ${Math.round(input.confusionScore * 100)}%. Consider revisiting the key concepts before moving on.`,
      reason: "high_confusion_score",
      targetUrl: null,
      priority: 90,
    });
  }

  // Rule 2: Low quiz scores → quiz retry
  if (input.recentQuizScores.length > 0) {
    const avgScore = input.recentQuizScores.reduce((a, b) => a + b, 0) / input.recentQuizScores.length;
    if (avgScore < 60) {
      recs.push({
        type: "quiz_retry",
        title: "Retry your quiz",
        description: `Your average quiz score is ${Math.round(avgScore)}%. Practice makes perfect — try again!`,
        reason: "low_quiz_average",
        targetUrl: null,
        priority: 85,
      });
    }
  }

  // Rule 3: Weak topics → targeted review
  if (input.weakTopics.length > 0) {
    recs.push({
      type: "review_topic",
      title: `Review: ${input.weakTopics[0]}`,
      description: `You've struggled with ${input.weakTopics.slice(0, 3).join(", ")}. Focus on these areas for better results.`,
      reason: "weak_topics_identified",
      targetUrl: null,
      priority: 80,
    });
  }

  // Rule 4: Step completion > 75% → next lesson
  if (input.stepsCompleted / input.totalSteps > 0.75) {
    recs.push({
      type: "next_lesson",
      title: "Ready for the next lesson",
      description: `You've completed ${input.stepsCompleted}/${input.totalSteps} steps. You're almost there!`,
      reason: "high_step_completion",
      targetUrl: null,
      priority: 75,
    });
  }

  // Rule 5: Beginner + high time → focus mode
  if (input.studentLevel === "beginner" && input.timeSpentMinutes > 30) {
    recs.push({
      type: "focus_mode",
      title: "Try Focus Mode",
      description: "You've been studying for a while. Focus Mode can help reduce distractions and improve concentration.",
      reason: "beginner_long_session",
      targetUrl: null,
      priority: 60,
    });
  }

  // Rule 6: Low session count → study plan
  if (input.sessionsThisWeek < 3) {
    recs.push({
      type: "study_plan",
      title: "Build a study routine",
      description: `You've had ${input.sessionsThisWeek} sessions this week. Try to study at least 3 times per week for best results.`,
      reason: "low_session_frequency",
      targetUrl: null,
      priority: 55,
    });
  }

  // Rule 7: Good streak → encouragement
  if (input.streakDays >= 7) {
    recs.push({
      type: "next_lesson",
      title: `Keep your ${input.streakDays}-day streak going!`,
      description: "You're on a great streak. Keep it up with today's lesson!",
      reason: "streak_maintenance",
      targetUrl: null,
      priority: 70,
    });
  }

  // Rule 8: Accessibility tip for beginners
  if (input.studentLevel === "beginner" && input.sessionsThisWeek <= 2) {
    recs.push({
      type: "accessibility_tip",
      title: "Customize your learning experience",
      description: "You can adjust speech rate, captions, and explanation style to match your learning preferences.",
      reason: "new_student_tip",
      targetUrl: "/student/access",
      priority: 40,
    });
  }

  // Sort by priority descending
  return recs.sort((a, b) => b.priority - a.priority);
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary Generation
// ─────────────────────────────────────────────────────────────────────────────

export type GeneratedSummary = {
  humanReadable: string;
  weakTopics: string[];
  recommendedNextAction: string;
  confidenceTrend: "improving" | "stable" | "declining";
  teacherNotesExcerpt: string;
};

export function generateSessionSummary(params: {
  lessonTitle: string;
  stepsCompleted: number;
  totalSteps: number;
  confusionTrend: Array<{ step: string; score: number }>;
  quizScore: number | null;
  weakTopics: string[];
  timeSpentMinutes: number;
  messageCount: number;
}): GeneratedSummary {
  const {
    lessonTitle,
    stepsCompleted,
    totalSteps,
    confusionTrend,
    quizScore,
    weakTopics,
    timeSpentMinutes,
    messageCount,
  } = params;

  // Determine confidence trend
  let confidenceTrend: "improving" | "stable" | "declining" = "stable";
  if (confusionTrend.length >= 2) {
    const first = confusionTrend[0].score;
    const last = confusionTrend[confusionTrend.length - 1].score;
    if (last < first - 0.1) confidenceTrend = "improving";
    else if (last > first + 0.1) confidenceTrend = "declining";
  }

  // Build human-readable summary
  const completionPct = Math.round((stepsCompleted / totalSteps) * 100);
  const quizPart = quizScore !== null ? ` Your quiz score was ${Math.round(quizScore)}%.` : "";
  const trendPart =
    confidenceTrend === "improving"
      ? "Your understanding improved throughout the session."
      : confidenceTrend === "declining"
        ? "Some concepts were challenging — consider reviewing."
        : "Your understanding remained steady.";

  const humanReadable = `In this session on "${lessonTitle}", you completed ${stepsCompleted}/${totalSteps} steps (${completionPct}%) in ${timeSpentMinutes} minutes.${quizPart} ${trendPart} You sent ${messageCount} messages to your AI teacher.`;

  // Recommended next action
  let recommendedNextAction = "Continue with the next lesson.";
  if (weakTopics.length > 0) {
    recommendedNextAction = `Review "${weakTopics[0]}" before moving on.`;
  } else if (quizScore !== null && quizScore < 70) {
    recommendedNextAction = "Retry the quiz to improve your score.";
  } else if (completionPct < 50) {
    recommendedNextAction = "Resume this lesson to make more progress.";
  }

  return {
    humanReadable,
    weakTopics,
    recommendedNextAction,
    confidenceTrend,
    teacherNotesExcerpt: `Lesson: ${lessonTitle}. Steps completed: ${stepsCompleted}/${totalSteps}. ${trendPart}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Server function: Generate and store recommendations
// ─────────────────────────────────────────────────────────────────────────────

export const generateAndStoreRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const userId = context.userId;

    // Gather data for recommendation generation
    const [progressRows, quizResults, sessions] = await Promise.all([
      supabase
        .from("lesson_progress")
        .select("confusion_score, current_step, time_spent_minutes, student_level, progress_percentage")
        .eq("student_id", userId)
        .order("updated_at", { ascending: false })
        .limit(10),
      supabase
        .from("quiz_results")
        .select("percentage, feedback_json")
        .eq("student_id", userId)
        .order("completed_at", { ascending: false })
        .limit(5),
      supabase
        .from("classroom_sessions")
        .select("id, started_at")
        .eq("host_user_id", userId)
        .gte("started_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    const progresses = progressRows.data ?? [];
    const quizzes = quizResults.data ?? [];
    const weekSessions = sessions.data ?? [];

    // Extract weak topics from quiz feedback
    const weakTopics: string[] = [...new Set(
      quizzes.flatMap((q: any) => q.feedback_json?.weakTopics ?? []),
    )] as string[];

    // Build input
    const latestProgress = progresses[0] as any;
    const input: RecommendationInput = {
      confusionScore: latestProgress?.confusion_score ?? 0,
      stepsCompleted: Math.round((latestProgress?.progress_percentage ?? 0) / 12.5),
      totalSteps: 8,
      recentQuizScores: quizzes.map((q: any) => q.percentage ?? 0),
      weakTopics,
      timeSpentMinutes: progresses.reduce((s: number, p: any) => s + (p.time_spent_minutes ?? 0), 0),
      sessionsThisWeek: weekSessions.length,
      currentStep: latestProgress?.current_step ?? "hook",
      studentLevel: latestProgress?.student_level ?? "intermediate",
      streakDays: 0, // Would need a separate streak calculation
    };

    // Generate recommendations
    const recommendations = generateRecommendations(input);

    // Store top recommendations (max 5)
    const toStore = recommendations.slice(0, 5).map((rec, i) => ({
      student_id: userId,
      institution_id: null as string | null,
      recommendation_type: rec.type,
      title: rec.title,
      description: rec.description,
      reason_json: { reason: rec.reason, priority: rec.priority },
      target_url: rec.targetUrl,
      priority: rec.priority - i, // Slightly lower priority for each subsequent
      is_read: false,
    }));

    // Clear old unread recommendations and insert new ones
    if (toStore.length > 0) {
      // Get institution from membership
      const { data: membership } = await supabase
        .from("institution_members")
        .select("institution_id")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      const institutionId = membership?.institution_id;

      // Mark old recommendations as read
      await supabase
        .from("recommendations")
        .update({ is_read: true })
        .eq("student_id", userId)
        .eq("is_read", false);

      // Insert new recommendations
      const insertPayload = toStore.map((r) => ({
        ...r,
        institution_id: institutionId,
      }));

      await (supabase as any).from("recommendations").insert(insertPayload);
    }

    return { generated: recommendations.length, stored: toStore.length };
  });