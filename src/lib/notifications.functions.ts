import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type NotificationType =
  | "system"
  | "reminder"
  | "nudge"
  | "summary_ready"
  | "quiz_ready"
  | "session_update"
  | "course_update"
  | "lesson_update"
  | "message"
  | "achievement";

export type NotificationRecord = {
  id: string;
  type: NotificationType | string;
  title: string;
  body: string;
  targetUrl: string | null;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

type CreateNotificationInput = {
  userId: string | null | undefined;
  institutionId?: string | null;
  type?: NotificationType | string;
  title: string;
  body: string;
  targetUrl?: string | null;
  payload?: Record<string, unknown>;
};

export const demoNotifications: NotificationRecord[] = [
  {
    id: "demo-session-ready",
    type: "session_update",
    title: "Next classroom is ready",
    body: "Your Quadratic Equations classroom is available to continue.",
    targetUrl: "/student/dashboard",
    payload: { demo: true },
    readAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-quiz-ready",
    type: "quiz_ready",
    title: "Quiz result ready",
    body: "Review your latest quiz feedback and weak topics.",
    targetUrl: "/student/quizzes",
    payload: { demo: true },
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
];

function mapNotification(row: any): NotificationRecord {
  return {
    id: row.id,
    type: row.notification_type,
    title: row.title,
    body: row.body,
    targetUrl: row.target_url,
    payload: (row.payload_json ?? {}) as Record<string, unknown>,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function createNotificationOnce(
  supabase: any,
  input: CreateNotificationInput,
): Promise<{ inserted: boolean; id?: string }> {
  if (!supabase || !input.userId) return { inserted: false };

  const type = input.type ?? "system";
  const targetUrl = input.targetUrl ?? null;
  const payload = input.payload ?? {};

  const { data: existing, error: existingError } = await supabase
    .from("notifications")
    .select("id")
    .eq("user_id", input.userId)
    .eq("notification_type", type)
    .eq("title", input.title)
    .is("read_at", null)
    .limit(1)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);
  if (existing?.id) return { inserted: false, id: existing.id };

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.userId,
      institution_id: input.institutionId ?? null,
      notification_type: type,
      title: input.title,
      body: input.body,
      target_url: targetUrl,
      payload_json: payload,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { inserted: true, id: data?.id };
}

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const supabase = context.supabase;
    const userId = context.userId;

    if (!supabase) {
      return {
        notifications: demoNotifications,
        unreadCount: demoNotifications.filter((item) => !item.readAt).length,
      };
    }

    const [{ data, error }, unreadResult] = await Promise.all([
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("read_at", null),
    ]);

    if (error) throw new Error(error.message);
    if (unreadResult.error) throw new Error(unreadResult.error.message);

    return {
      notifications: (data ?? []).map(mapNotification),
      unreadCount: unreadResult.count ?? 0,
    };
  });

export const ensureAutomatedNotifications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    const supabase = context.supabase;
    const userId = context.userId;
    if (!supabase) return { generated: 0 };

    let generated = 0;

    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count ?? 0) === 0) {
      const result = await createNotificationOnce(supabase, {
        userId,
        type: "system",
        title: "Notifications are on",
        body: "You will see lesson updates, quiz results, session reminders, and system notices here.",
        targetUrl: null,
        payload: { source: "notifications.ensureAutomatedNotifications" },
      });
      if (result.inserted) generated++;
    }

    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id, progress_percentage, lessons(title)")
      .eq("student_id", userId)
      .neq("status", "completed")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (progress) {
      const result = await createNotificationOnce(supabase, {
        userId,
        type: "reminder",
        title: "Continue your lesson",
        body: `Pick up where you left off${progress.lessons?.title ? ` in ${progress.lessons.title}` : ""}.`,
        targetUrl: progress.lesson_id ? `/student/lessons/${progress.lesson_id}` : "/student/dashboard",
        payload: { lessonId: progress.lesson_id },
      });
      if (result.inserted) generated++;
    }

    const { data: quiz } = await supabase
      .from("quiz_results")
      .select("id, percentage, lesson_id, completed_at")
      .eq("student_id", userId)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (quiz && Number(quiz.percentage ?? 100) < 70) {
      const result = await createNotificationOnce(supabase, {
        userId,
        type: "quiz_ready",
        title: "Quiz feedback ready",
        body: `Your latest score was ${Math.round(Number(quiz.percentage ?? 0))}%. Review feedback and retry when ready.`,
        targetUrl: "/student/quizzes",
        payload: { quizResultId: quiz.id, lessonId: quiz.lesson_id },
      });
      if (result.inserted) generated++;
    }

    return { generated };
  });

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ notification_id: z.string().min(1) }).parse(data))
  .handler(async ({ data, context }: any) => {
    if (!context.supabase) return { ok: true };

    const { error } = await context.supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", data.notification_id)
      .eq("user_id", context.userId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const markAllNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }: any) => {
    if (!context.supabase) return { ok: true };

    const { error } = await context.supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", context.userId)
      .is("read_at", null);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
