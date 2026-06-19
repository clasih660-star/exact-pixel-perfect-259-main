import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listResources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string; course_id?: string }) => data)
  .handler(async ({ data, context }: any) => {
    let query = context.supabase
      .from("classroom_resources")
      .select("*")
      .eq("institution_id", data.institution_id);
    if (data.course_id) query = query.eq("course_id", data.course_id);
    const { data: rows, error } = query.order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { resources: rows ?? [] };
  });

const CreateSchema = z.object({
  institution_id: z.string().uuid(),
  course_id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  type: z.enum(["pdf", "text", "image", "link", "video", "audio", "slides", "document"]),
  file_url: z.string().trim().max(2000).optional(),
  external_url: z.string().trim().url().max(2000).optional(),
  subject: z.string().trim().max(120).optional(),
  grade_level: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
});

export const createResource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => CreateSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const { error, data: row } = await context.supabase
      .from("classroom_resources")
      .insert({
        institution_id: data.institution_id,
        course_id: data.course_id ?? null,
        title: data.title,
        description: data.description ?? null,
        type: data.type,
        file_url: data.file_url ?? null,
        external_url: data.external_url ?? null,
        subject: data.subject ?? null,
        grade_level: data.grade_level ?? null,
        tags: data.tags,
        status: "ready",
        uploaded_by: context.userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { resource: row };
  });
