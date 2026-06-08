import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listLessons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("lessons")
      .select("*")
      .eq("course_id", data.course_id)
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return { lessons: rows ?? [] };
  });

export const getLesson = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { lesson_id: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: lesson, error } = await context.supabase
      .from("lessons")
      .select("*, courses(id, title, institution_id, status)")
      .eq("id", data.lesson_id)
      .single();
    if (error) throw new Error(error.message);
    return { lesson };
  });

const CreateSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  duration_minutes: z.number().int().min(1).max(600).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const createLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => CreateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: course, error: cErr } = await context.supabase
      .from("courses")
      .select("institution_id")
      .eq("id", data.course_id)
      .single();
    if (cErr) throw new Error(cErr.message);

    const { count } = await context.supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("course_id", data.course_id);

    const { data: row, error } = await context.supabase
      .from("lessons")
      .insert({
        institution_id: course.institution_id,
        course_id: data.course_id,
        title: data.title,
        description: data.description ?? null,
        difficulty: data.difficulty ?? null,
        duration_minutes: data.duration_minutes ?? null,
        order_index: count ?? 0,
        status: data.status,
        created_by: context.userId,
        lesson_data_json: {},
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { lesson: row };
  });

export const updateLessonStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        lesson_id: z.string().uuid(),
        status: z.enum(["draft", "published", "archived"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("lessons")
      .update({ status: data.status })
      .eq("id", data.lesson_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
