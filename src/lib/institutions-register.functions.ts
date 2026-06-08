import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RegisterSchema = z.object({
  institution_name: z.string().trim().min(1).max(200),
  type: z.enum([
    "school",
    "university",
    "college",
    "tuition_center",
    "online_tutor",
    "ngo",
    "company_training",
    "religious_institution",
    "government_program",
    "other",
  ]),
  country: z.string().trim().min(1).max(100),
  city: z.string().trim().min(1).max(100),
  admin_full_name: z.string().trim().min(1).max(200),
  admin_email: z.string().trim().email().max(255),
  phone: z.string().trim().min(3).max(40),
  password: z.string().min(8).max(128),
  learner_count: z.number().int().min(0).max(10_000_000).optional(),
  preferred_use_case: z
    .enum([
      "ai_classroom",
      "human_teacher_classroom",
      "hybrid_classroom",
      "training_program",
      "exam_preparation",
      "accessibility_focused",
    ])
    .optional(),
});

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "institution"
  );
}

export const registerInstitution = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RegisterSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Create auth user
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.admin_email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.admin_full_name,
        phone: data.phone,
      },
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message || "Could not create account.");
    }
    const userId = created.user.id;

    // 2. Unique slug
    const base = slugify(data.institution_name);
    let slug = base;
    for (let i = 1; i < 50; i++) {
      const { data: existing } = await supabaseAdmin
        .from("institutions")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${base}-${i}`;
    }

    // 3. Create institution
    const { data: inst, error: instErr } = await supabaseAdmin
      .from("institutions")
      .insert({
        name: data.institution_name,
        slug,
        type: data.type,
        country: data.country,
        city: data.city,
        contact_email: data.admin_email,
        phone: data.phone,
        learner_count: data.learner_count ?? null,
        preferred_use_case: data.preferred_use_case ?? null,
        status: "active",
        created_by: userId,
      })
      .select("id, slug")
      .single();
    if (instErr || !inst) {
      await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
      throw new Error(instErr?.message || "Could not create institution.");
    }

    // 4. Membership (owner)
    const { error: memErr } = await supabaseAdmin
      .from("institution_members")
      .insert({ institution_id: inst.id, user_id: userId, role: "owner", status: "active" });
    if (memErr) throw new Error(memErr.message);

    return { ok: true, institution_id: inst.id, slug: inst.slug };
  });
