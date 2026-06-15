import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const UploadSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().trim().min(1).max(255),
  type: z.enum(["pdf", "document", "slide", "image", "text", "link", "worksheet", "syllabus"]),
  file_url: z.string().url().optional(),
  link_url: z.string().url().optional(),
  extracted_text: z.string().max(100000).optional(),
  syllabus_reference: z.string().max(255).optional(),
});

const UpdateStatusSchema = z.object({
  material_id: z.string().uuid(),
  processing_status: z.enum(["pending", "processing", "ready", "failed"]),
  processing_error: z.string().max(500).optional(),
});

const DeleteSchema = z.object({
  material_id: z.string().uuid(),
});

const ListSchema = z.object({
  course_id: z.string().uuid(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Upload Material
// ─────────────────────────────────────────────────────────────────────────────

export const uploadCourseMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => UploadSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    // Verify user is admin/teacher of the course's institution
    const { data: course, error: courseErr } = await context.supabase
      .from("courses")
      .select("institution_id")
      .eq("id", data.course_id)
      .single();

    if (courseErr) throw new Error(`Course not found: ${courseErr.message}`);

    const { data: member, error: memberErr } = await context.supabase
      .from("institution_members")
      .select("role")
      .eq("institution_id", course.institution_id)
      .eq("user_id", context.userId)
      .single();

    if (memberErr || !member || !["admin", "teacher"].includes(member.role)) {
      throw new Error("Not authorized to upload materials for this course");
    }

    // Insert material
    const { data: material, error: insertErr } = await context.supabase
      .from("course_materials")
      .insert({
        institution_id: course.institution_id,
        course_id: data.course_id,
        title: data.title,
        type: data.type,
        file_url: data.file_url || null,
        link_url: data.link_url || null,
        extracted_text: data.extracted_text || null,
        syllabus_reference: data.syllabus_reference || null,
        processing_status: "ready", // For Phase 1, assume ready (no extraction pipeline yet)
        processing_error: null,
        uploaded_by: context.userId,
      })
      .select("id, processing_status, title")
      .single();

    if (insertErr) throw new Error(`Upload failed: ${insertErr.message}`);

    return {
      success: true,
      materialId: material.id,
      title: material.title,
      processingStatus: material.processing_status,
      message: "Material uploaded successfully",
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// List Course Materials
// ─────────────────────────────────────────────────────────────────────────────

export const listCourseMaterials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => ListSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const { data: materials, error } = await context.supabase
      .from("course_materials")
      .select(
        "id, title, type, processing_status, processing_error, file_url, link_url, created_at, uploaded_by",
      )
      .eq("course_id", data.course_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return {
      materials: materials ?? [],
      count: materials?.length ?? 0,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Get Material Detail
// ─────────────────────────────────────────────────────────────────────────────

export const getCourseMaterial = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { material_id: string }) =>
    z.object({ material_id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { data: material, error } = await context.supabase
      .from("course_materials")
      .select("*")
      .eq("id", data.material_id)
      .single();

    if (error) throw new Error(error.message);
    return { material };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Update Material Status (for processing pipeline)
// ─────────────────────────────────────────────────────────────────────────────

export const updateMaterialStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => UpdateStatusSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const { error } = await context.supabase
      .from("course_materials")
      .update({
        processing_status: data.processing_status,
        processing_error: data.processing_error || null,
      })
      .eq("id", data.material_id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Delete Material
// ─────────────────────────────────────────────────────────────────────────────

export const deleteCourseMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => DeleteSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    // Get material to verify ownership
    const { data: material, error: getErr } = await context.supabase
      .from("course_materials")
      .select("id, course_id, courses(institution_id)")
      .eq("id", data.material_id)
      .single();

    if (getErr) throw new Error(getErr.message);

    // Verify authorization
    const { data: member, error: memberErr } = await context.supabase
      .from("institution_members")
      .select("role")
      .eq("institution_id", (material.courses as any).institution_id)
      .eq("user_id", context.userId)
      .single();

    if (memberErr || !member || !["admin", "teacher"].includes(member.role)) {
      throw new Error("Not authorized to delete this material");
    }

    // Delete material_images first (cascade)
    await context.supabase
      .from("material_images")
      .delete()
      .eq("course_material_id", data.material_id);

    // Delete material
    const { error: deleteErr } = await context.supabase
      .from("course_materials")
      .delete()
      .eq("id", data.material_id);

    if (deleteErr) throw new Error(deleteErr.message);
    return { ok: true, message: "Material deleted successfully" };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Get Total Text from All Ready Materials (for lesson generation context)
// ─────────────────────────────────────────────────────────────────────────────

export const getCourseMateriaisText = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => ListSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const { data: materials, error } = await context.supabase
      .from("course_materials")
      .select("title, extracted_text, type, processing_status")
      .eq("course_id", data.course_id)
      .eq("processing_status", "ready")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    const combinedText = materials
      ?.map((m: any) => {
        const header = `[${m.title} - ${m.type}]`;
        const content = m.extracted_text || "(No text extracted)";
        return `${header}\n${content}`;
      })
      .join("\n\n");

    return {
      combinedText: combinedText || "",
      materialCount: materials?.length ?? 0,
      materialsList: materials?.map((m: any) => ({ title: m.title, type: m.type })) ?? [],
    };
  });
