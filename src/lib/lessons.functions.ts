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

const UpdateDetailsSchema = z.object({
  lesson_id: z.string().uuid(),
  title: z.string().trim().min(1).max(160).optional(),
  objective: z.string().trim().max(1000).optional(),
  duration_minutes: z.number().int().min(15).max(600).optional(),
  syllabus_reference: z.string().max(255).optional(),
});

export const updateLessonDetails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => UpdateDetailsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("lessons")
      .update({
        title: data.title,
        objective: data.objective,
        duration_minutes: data.duration_minutes,
        syllabus_reference: data.syllabus_reference,
      })
      .eq("id", data.lesson_id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

const UpdateSectionSchema = z.object({
  section_id: z.string().uuid(),
  title: z.string().trim().min(1).max(255).optional(),
  type: z.string().optional(),
  estimated_minutes: z.number().int().min(1).max(60).optional(),
});

export const updateLessonSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => UpdateSectionSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("lesson_sections")
      .update({
        title: data.title,
        type: data.type,
        estimated_minutes: data.estimated_minutes,
      })
      .eq("id", data.section_id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

const UpdateTeachingItemSchema = z.object({
  item_id: z.string().uuid(),
  board_text: z.string().trim().max(500).optional(),
  exact_spoken_text: z.string().trim().max(1000).optional(),
  teacher_explanation: z.string().trim().max(2000).optional(),
  learner_notes: z.string().trim().max(1000).optional(),
  accessible_description: z.string().trim().max(1000).optional(),
  why_this_matters: z.string().trim().max(500).optional(),
  common_mistake: z.string().trim().max(500).optional(),
});

export const updateTeachingItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => UpdateTeachingItemSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("teaching_items")
      .update({
        board_text: data.board_text,
        exact_spoken_text: data.exact_spoken_text,
        teacher_explanation: data.teacher_explanation,
        learner_notes: data.learner_notes,
        accessible_description: data.accessible_description,
        why_this_matters: data.why_this_matters,
        common_mistake: data.common_mistake,
      })
      .eq("id", data.item_id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTeachingItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { item_id: string }) => z.object({ item_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("teaching_items")
      .delete()
      .eq("id", data.item_id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const publishLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { lesson_id: string }) => z.object({ lesson_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("lessons")
      .update({ status: "published" })
      .eq("id", data.lesson_id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
