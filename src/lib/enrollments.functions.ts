import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listEnrollments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { data: rows, error } = await context.supabase
      .from("course_enrollments")
      .select("id, student_id, status, enrolled_at, completed_at")
      .eq("course_id", data.course_id)
      .order("enrolled_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = (rows ?? []).map((r: any) => r.student_id);
    let profiles: Record<string, { full_name: string | null; email: string | null }> = {};
    if (ids.length) {
      const { data: profs } = await context.supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", ids);
      profiles = Object.fromEntries(
        (profs ?? []).map((p: any) => [p.id, { full_name: p.full_name, email: p.email }]),
      );
    }
    return {
      enrollments: (rows ?? []).map((r: any) => ({
        ...r,
        profile: profiles[r.student_id] ?? null,
      })),
    };
  });

export const enrollStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        course_id: z.string().uuid(),
        email: z.string().email(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { data: course, error: cErr } = await context.supabase
      .from("courses")
      .select("id, institution_id")
      .eq("id", data.course_id)
      .single();
    if (cErr) throw new Error(cErr.message);

    const { data: profile, error: pErr } = await context.supabase
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();
    if (pErr) throw new Error(pErr.message);
    if (!profile) throw new Error("No registered user with that email. Ask them to sign up first.");

    const { error } = await context.supabase.from("course_enrollments").insert({
      institution_id: course.institution_id,
      course_id: course.id,
      student_id: profile.id,
      status: "active",
      enrolled_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ enrollment_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }: any) => {
    const { error } = await context.supabase
      .from("course_enrollments")
      .update({ status: "removed" })
      .eq("id", data.enrollment_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
