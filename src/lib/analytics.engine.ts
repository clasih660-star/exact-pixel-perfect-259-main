/**
 * analytics.engine.ts
 *
 * Analytics tracking and notification generation.
 * Tracks session starts, completions, quiz scores, time spent,
 * confusion spikes, access setting usage, replay/notes usage, and drop-offs.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ─────────────────────────────────────────────────────────────────────────────
// Analytics Types
// ─────────────────────────────────────────────────────────────────────────────

export type AnalyticsEvent = {
  event_type: string;
  payload: Record<string, unknown>;
};

export type StudentAnalytics = {
  totalSessions: number;
  completedSessions: number;
  totalQuizCount: number;
  avgQuizScore: number;
  totalTimeMinutes: number;
  avgConfusionScore: number;
  accessSettingUsage: Record<string, number>;
  replayUsage: number;
  notesUsage: number;
  dropOffPoints: Array<{ step: string; count: number }>;
  weeklyProgress: Array<{ week: string; sessions: number; minutes: number }>;
  streakDays: number;
  longestStreak: number;
  masteryByTopic: Array<{ topic: string; score: number; trend: "up" | "down" | "flat" }>;
};

export type NotificationRule = {
  type: "reminder" | "nudge" | "summary_ready" | "quiz_ready" | "session_update" | "system";
  title: string;
  body: string;
  targetUrl: string | null;
  condition: (analytics: StudentAnalytics) => boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Student Analytics
// ─────────────────────────────────────────────────────────────────────────────

export const getStudentAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const supabase = context.supabase;
    const userId = context.userId;

    const [sessions, progressRows, quizResults, events, notes] = await Promise.all([
      supabase
        .from("classroom_sessions")
        .select("id, status, started_at, ended_at")
        .eq("host_user_id", userId)
        .order("started_at", { ascending: false })
        .limit(100),
      supabase
        .from("lesson_progress")
        .select("confusion_score, time_spent_minutes, current_step, updated_at")
        .eq("student_id", userId),
      supabase
        .from("quiz_results")
        .select("percentage, completed_at, feedback_json")
        .eq("student_id", userId)
        .order("completed_at", { ascending: false })
        .limit(50),
      supabase
        .from("session_events")
        .select("event_type, payload_json, created_at")
        .eq("student_id", userId)
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("session_notes").select("id, source_type").eq("student_id", userId),
    ]);

    const sessionRows = sessions.data ?? [];
    const progressData = progressRows.data ?? [];
    const quizData = quizResults.data ?? [];
    const eventData = events.data ?? [];
    const noteData = notes.data ?? [];

    // Calculate analytics
    const totalSessions = sessionRows.length;
    const completedSessions = sessionRows.filter((s: any) => s.status === "completed").length;
    const totalQuizCount = quizData.length;
    const avgQuizScore =
      totalQuizCount > 0
        ? Math.round(
            quizData.reduce((s: number, q: any) => s + (q.percentage ?? 0), 0) / totalQuizCount,
          )
        : 0;
    const totalTimeMinutes = progressData.reduce(
      (s: number, p: any) => s + (p.time_spent_minutes ?? 0),
      0,
    );
    const avgConfusionScore =
      progressData.length > 0
        ? progressData.reduce((s: number, p: any) => s + (p.confusion_score ?? 0), 0) /
          progressData.length
        : 0;

    // Access setting usage from events
    const accessSettingUsage: Record<string, number> = {};
    eventData
      .filter((e: any) => e.event_type === "access_updated")
      .forEach((e: any) => {
        const changes = (e.payload_json as any)?.changes ?? [];
        changes.forEach((c: string) => {
          accessSettingUsage[c] = (accessSettingUsage[c] ?? 0) + 1;
        });
      });

    // Replay usage
    const replayUsage = eventData.filter((e: any) => e.event_type === "replay_viewed").length;

    // Notes usage
    const notesUsage = noteData.length;

    // Drop-off points (steps where sessions ended most)
    const dropOffMap: Record<string, number> = {};
    eventData
      .filter((e: any) => e.event_type === "session_ended")
      .forEach((e: any) => {
        const step = (e.payload_json as any)?.finalStep ?? "unknown";
        dropOffMap[step] = (dropOffMap[step] ?? 0) + 1;
      });
    const dropOffPoints = Object.entries(dropOffMap)
      .map(([step, count]) => ({ step, count }))
      .sort((a, b) => b.count - a.count);

    // Weekly progress
    const weeklyMap: Record<string, { sessions: number; minutes: number }> = {};
    sessionRows.forEach((s: any) => {
      if (!s.started_at) return;
      const weekStart = getWeekStart(new Date(s.started_at));
      const key = weekStart.toISOString().split("T")[0];
      if (!weeklyMap[key]) weeklyMap[key] = { sessions: 0, minutes: 0 };
      weeklyMap[key].sessions++;
      const dur =
        s.ended_at && s.started_at
          ? Math.round((new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 60000)
          : 0;
      weeklyMap[key].minutes += dur;
    });
    const weeklyProgress = Object.entries(weeklyMap)
      .map(([week, data]) => ({ week, ...data }))
      .sort((a, b) => a.week.localeCompare(b.week));

    // Streak calculation
    const sessionDates = [
      ...new Set<string>(sessionRows.map((s: any) => s.started_at?.split("T")[0]).filter(Boolean)),
    ]
      .sort()
      .reverse() as string[];

    let streakDays = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    const today = new Date().toISOString().split("T")[0];

    for (let i = 0; i < sessionDates.length; i++) {
      const date = sessionDates[i];
      const prevDate = i > 0 ? sessionDates[i - 1] : null;
      if (i === 0 && date === today) {
        currentStreak = 1;
      } else if (prevDate && isConsecutiveDay(date, prevDate)) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = i === 0 ? 1 : 0;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    streakDays = currentStreak;

    // Mastery by topic from quiz results
    const topicMap: Record<string, { scores: number[]; dates: string[] }> = {};
    quizData.forEach((q: any) => {
      const topics = (q.feedback_json as any)?.weakTopics ?? ["general"];
      topics.forEach((t: string) => {
        if (!topicMap[t]) topicMap[t] = { scores: [], dates: [] };
        topicMap[t].scores.push(q.percentage ?? 0);
        topicMap[t].dates.push(q.completed_at ?? "");
      });
    });
    const masteryByTopic = Object.entries(topicMap).map(([topic, data]) => {
      const recent = data.scores.slice(0, 3);
      const older = data.scores.slice(3, 6);
      const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
      const olderAvg =
        older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
      const trend: "up" | "down" | "flat" =
        recentAvg > olderAvg + 5 ? "up" : recentAvg < olderAvg - 5 ? "down" : "flat";
      return { topic, score: Math.round(recentAvg), trend };
    });

    const analytics: StudentAnalytics = {
      totalSessions,
      completedSessions,
      totalQuizCount,
      avgQuizScore,
      totalTimeMinutes,
      avgConfusionScore,
      accessSettingUsage,
      replayUsage,
      notesUsage,
      dropOffPoints,
      weeklyProgress,
      streakDays,
      longestStreak,
      masteryByTopic,
    };

    return analytics;
  });

// ─────────────────────────────────────────────────────────────────────────────
// Notification Rules
// ─────────────────────────────────────────────────────────────────────────────

const NOTIFICATION_RULES: NotificationRule[] = [
  {
    type: "reminder",
    title: "Continue your lesson",
    body: "You have an unfinished session. Pick up where you left off!",
    targetUrl: "/dashboard",
    condition: (a) => a.completedSessions < a.totalSessions && a.totalSessions > 0,
  },
  {
    type: "nudge",
    title: "Time to study!",
    body: "You haven't studied today. Keep your streak going!",
    targetUrl: "/dashboard",
    condition: (a) => a.streakDays > 0 && a.totalSessions > 0,
  },
  {
    type: "quiz_ready",
    title: "Quiz ready for retry",
    body: "Your last quiz score was below average. Try again to improve!",
    targetUrl: null,
    condition: (a) => a.avgQuizScore < 60 && a.totalQuizCount > 0,
  },
  {
    type: "summary_ready",
    title: "Review your weak topics",
    body: "We identified some areas where you could improve. Check your recommendations.",
    targetUrl: null,
    condition: (a) => a.avgConfusionScore > 0.5,
  },
  {
    type: "system",
    title: "You're doing great!",
    body: `You've completed ${0} sessions. Keep up the amazing work!`,
    targetUrl: null,
    condition: (a) => a.completedSessions >= 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Generate Notifications
// ─────────────────────────────────────────────────────────────────────────────

export const generateNotifications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const supabase = context.supabase;
    const userId = context.userId;

    // Get current analytics
    const analyticsResult = await getStudentAnalytics({ context } as any);
    const analytics = analyticsResult as unknown as StudentAnalytics;

    // Check which notification rules fire
    const firedRules = NOTIFICATION_RULES.filter((rule) => rule.condition(analytics));

    // Check for existing unread notifications of same type to avoid duplicates
    const { data: existing } = await supabase
      .from("notifications")
      .select("notification_type, title")
      .eq("user_id", userId)
      .is("read_at", null);

    const existingTypes = new Set((existing ?? []).map((n: any) => n.notification_type));

    const toInsert = firedRules
      .filter((rule) => !existingTypes.has(rule.type))
      .map((rule) => ({
        user_id: userId,
        notification_type: rule.type,
        title: rule.title,
        body: rule.body,
        target_url: rule.targetUrl,
        payload_json: {},
      }));

    if (toInsert.length > 0) {
      await (supabase as any).from("notifications").insert(toInsert);
    }

    return { generated: toInsert.length, skipped: firedRules.length - toInsert.length };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Get Notifications
// ─────────────────────────────────────────────────────────────────────────────

export const getNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const supabase = context.supabase;
    const userId = context.userId;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw new Error(error.message);

    const unreadCount = (data ?? []).filter((n: any) => !n.read_at).length;

    return {
      notifications: (data ?? []).map((n: any) => ({
        id: n.id,
        type: n.notification_type,
        title: n.title,
        body: n.body,
        targetUrl: n.target_url,
        readAt: n.read_at,
        createdAt: n.created_at,
      })),
      unreadCount,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Mark Notification Read
// ─────────────────────────────────────────────────────────────────────────────

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { notification_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", data.notification_id)
      .eq("user_id", context.userId);
    return { ok: true };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isConsecutiveDay(dateStr1: string, dateStr2: string): boolean {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return diff <= 24 * 60 * 60 * 1000;
}
