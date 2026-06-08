import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listClassrooms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { institution_id: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("virtual_classrooms")
      .select("*")
      .eq("institution_id", data.institution_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { classrooms: rows ?? [] };
  });

const CreateSchema = z.object({
  institution_id: z.string().uuid(),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  subject: z.string().trim().max(120).optional(),
  level: z.string().trim().max(80).optional(),
  mode: z.enum(["ai_teacher", "human_teacher", "hybrid"]),
  capacity: z.number().int().min(1).max(100000).optional(),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
});

export const createClassroom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => CreateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error, data: row } = await context.supabase
      .from("virtual_classrooms")
      .insert({
        institution_id: data.institution_id,
        name: data.name,
        description: data.description ?? null,
        subject: data.subject ?? null,
        level: data.level ?? null,
        mode: data.mode,
        capacity: data.capacity ?? null,
        status: data.status,
        created_by: context.userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { classroom: row };
  });
