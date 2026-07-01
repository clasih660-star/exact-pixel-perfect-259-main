import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "course"
  );
}

export const listCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { data: rows, error } = await context.supabase
      .from("courses")
      .select("*")
      .eq("institution_id", data.institution_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { courses: rows ?? [] };
  });

export const getCourse = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { data: course, error } = await context.supabase
      .from("courses")
      .select("*")
      .eq("id", data.course_id)
      .single();
    if (error) throw new Error(error.message);
    const [lessons, enrollments] = await Promise.all([
      context.supabase
        .from("lessons")
        .select("*")
        .eq("course_id", data.course_id)
        .order("order_index"),
      context.supabase
        .from("course_enrollments")
        .select("id, student_id, status, enrolled_at")
        .eq("course_id", data.course_id),
    ]);
    return {
      course,
      lessons: lessons.data ?? [],
      enrollments: enrollments.data ?? [],
    };
  });

const CreateSchema = z.object({
  institution_id: z.string().uuid(),
  programme_id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  subject: z.string().trim().max(120).optional(),
  level: z.string().trim().max(80).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  source_type: z.enum(["institution", "kingpin"]).default("institution"),
  price_usd: z.coerce.number().min(0).max(100000).default(0),
  pricing_label: z.string().trim().max(60).optional(),
  country: z.string().trim().max(80).optional(),
  curriculum_family: z.string().trim().max(80).optional(),
  grade: z.coerce.number().int().min(1).max(20).optional(),
  curriculum_subject: z.string().trim().max(120).optional(),
  curriculum_subject_slug: z.string().trim().max(120).optional(),
  curriculum_metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => CreateSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const baseSlug = slugify(data.title);
    let slug = baseSlug;
    for (let i = 1; i < 20; i++) {
      const { data: existing } = await context.supabase
        .from("courses")
        .select("id")
        .eq("institution_id", data.institution_id)
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${i + 1}`;
    }
    const { data: row, error } = await context.supabase
      .from("courses")
      .insert({
        institution_id: data.institution_id,
        programme_id: data.programme_id ?? null,
        title: data.title,
        slug,
        description: data.description ?? null,
        subject: data.subject ?? null,
        level: data.level ?? null,
        status: data.status,
        source_type: data.source_type,
        price_usd: data.price_usd ?? 0,
        currency: "USD",
        pricing_label: data.pricing_label ?? null,
        country: data.country ?? null,
        curriculum_family: data.curriculum_family ?? null,
        grade: data.grade ?? null,
        curriculum_subject: data.curriculum_subject ?? data.subject ?? null,
        curriculum_subject_slug: data.curriculum_subject_slug ?? null,
        curriculum_metadata: data.curriculum_metadata ?? {},
        created_by: context.userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { course: row };
  });

export const updateCourseStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        course_id: z.string().uuid(),
        status: z.enum(["draft", "published", "archived"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { error } = await context.supabase
      .from("courses")
      .update({ status: data.status })
      .eq("id", data.course_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
