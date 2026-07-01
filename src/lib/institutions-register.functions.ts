import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { createAuditLog } from "@/lib/institution-admin.foundation";
import { getAppUrl, queueEmailJob } from "@/lib/onboarding.foundation";
import { SecurityConfigurationError } from "@/lib/security-errors";
import { isProductionRuntime } from "@/lib/runtime-mode";

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
  captchaToken: z.string().max(4096).optional(),
  website: z.string().max(0).optional(),
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

const WINDOW_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 5;
const registrationAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request | undefined) {
  const forwarded = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request?.headers.get("cf-connecting-ip")?.trim() ||
    request?.headers.get("x-real-ip")?.trim() ||
    forwarded ||
    "unknown"
  );
}

function rateLimitKey(data: z.infer<typeof RegisterSchema>, request: Request | undefined) {
  return `${getClientIp(request)}:${data.admin_email.toLowerCase()}`;
}

function assertRegistrationRateLimit(key: string) {
  const now = Date.now();
  const current = registrationAttempts.get(key);
  if (!current || current.resetAt <= now) {
    registrationAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  if (current.count >= MAX_ATTEMPTS_PER_WINDOW) {
    throw new Error("Too many registration attempts. Please wait before trying again.");
  }

  current.count += 1;
}

async function verifyTurnstileToken(token: string | undefined, request: Request | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (isProductionRuntime()) {
      throw new SecurityConfigurationError("TURNSTILE_SECRET_KEY is required for public registration.");
    }
    return;
  }

  if (!token) {
    throw new Error("Please complete the security check before creating an institution.");
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  const remoteIp = getClientIp(request);
  if (remoteIp !== "unknown") body.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = (await response.json().catch(() => ({}))) as { success?: boolean };
  if (!response.ok || !result.success) {
    throw new Error("Security check failed. Please refresh and try again.");
  }
}

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
  .validator((data: unknown) => RegisterSchema.parse(data))
  .handler(async ({ data }) => {
    if (process.env.PUBLIC_REGISTRATION_ENABLED === "false") {
      throw new Error("Institution self-registration is temporarily disabled.");
    }

    const request = getRequest();
    assertRegistrationRateLimit(rateLimitKey(data, request));
    await verifyTurnstileToken(data.captchaToken, request);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Create auth user
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.admin_email,
      password: data.password,
      email_confirm: false,
      user_metadata: {
        full_name: data.admin_full_name,
        phone: data.phone,
      },
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message || "Could not create account.");
    }
    const userId = created.user.id;
    const verificationResult = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: data.admin_email,
      options: {
        redirectTo: `${getAppUrl()}/auth/callback`,
      },
    });
    const verificationUrl = verificationResult.data?.properties?.action_link;
    if (verificationResult.error || !verificationUrl) {
      await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
      throw new Error(verificationResult.error?.message || "Could not create a verification link.");
    }

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
        onboarding_status: "owner_created",
        onboarding_started_at: new Date().toISOString(),
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
    if (memErr) {
      await supabaseAdmin.from("institutions").delete().eq("id", inst.id);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error(memErr.message);
    }

    // 5. Ensure the profile has the correct global role for dashboard redirects.
    const { error: profileErr } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        full_name: data.admin_full_name,
        email: data.admin_email,
        phone: data.phone,
        role: "owner",
      },
      { onConflict: "id" },
    );
    if (profileErr) {
      throw new Error(profileErr.message);
    }

    // 6. Queue verification and welcome/onboarding email jobs. Delivery is handled by the worker layer.
    await queueEmailJob(supabaseAdmin, {
      institutionId: inst.id,
      relatedUserId: userId,
      kind: "institution_owner_verify_email",
      templateKey: "institution_owner_verify_email",
      toEmail: data.admin_email,
      toName: data.admin_full_name,
      subject: "Verify your Klassruum institution account",
      idempotencyKey: `institution:${inst.id}:owner_verify:${userId}`,
      payload: {
        institution_id: inst.id,
        institution_slug: inst.slug,
        institution_name: data.institution_name,
        owner_name: data.admin_full_name,
        verification_url: verificationUrl,
      },
    });

    await queueEmailJob(supabaseAdmin, {
      institutionId: inst.id,
      relatedUserId: userId,
      kind: "institution_owner_welcome",
      templateKey: "institution_owner_welcome",
      toEmail: data.admin_email,
      toName: data.admin_full_name,
      subject: `Welcome to Klassruum, ${data.admin_full_name}`,
      idempotencyKey: `institution:${inst.id}:owner_welcome:${userId}`,
      payload: {
        institution_id: inst.id,
        institution_slug: inst.slug,
        institution_name: data.institution_name,
        owner_name: data.admin_full_name,
        next_steps: [
          "Review your institution profile",
          "Invite teachers and learners",
          "Create your first programme and course",
        ],
      },
    });

    await createAuditLog(supabaseAdmin, {
      institutionId: inst.id,
      actorUserId: userId,
      actorRole: "owner",
      action: "institution.registered",
      entityType: "institution",
      entityId: inst.id,
      summary: `Registered institution ${data.institution_name}`,
      details: { slug: inst.slug, type: data.type },
    });

    return { ok: true, institution_id: inst.id, slug: inst.slug, requiresEmailVerification: true };
  });
