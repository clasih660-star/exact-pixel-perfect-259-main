import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAuditLog } from "@/lib/institution-admin.foundation";
import {
  createInviteToken,
  getAppUrl,
  memberRoleToUserRole,
  normalizeEmail,
  queueEmailJob,
  sha256Hex,
} from "@/lib/onboarding.foundation";

const InviteRoleSchema = z.enum(["admin", "teacher", "student"]);

const CreateInviteSchema = z.object({
  institution_id: z.string().uuid(),
  email: z.string().trim().email().max(255),
  full_name: z.string().trim().max(200).optional(),
  role: InviteRoleSchema,
  message: z.string().trim().max(1000).optional(),
  expires_in_days: z.number().int().min(1).max(90).default(14),
});

const AcceptInviteSchema = z.object({
  token: z.string().min(24).max(512),
});

async function requireInstitutionAdminMembership(
  supabaseAdmin: any,
  institutionId: string,
  userId: string,
) {
  const { data, error } = await supabaseAdmin
    .from("institution_members")
    .select("id, role, status")
    .eq("institution_id", institutionId)
    .eq("user_id", userId)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("You do not have permission to manage invites for this institution.");
  return data;
}

export const listInstitutionInvites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await requireInstitutionAdminMembership(supabaseAdmin, data.institution_id, context.userId);

    const { data: invites, error } = await supabaseAdmin
      .from("institution_invites")
      .select(
        "id, email, full_name, role, status, expires_at, accepted_at, accepted_user_id, message, created_at, updated_at",
      )
      .eq("institution_id", data.institution_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { invites: invites ?? [] };
  });

export const createInstitutionInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => CreateInviteSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await requireInstitutionAdminMembership(supabaseAdmin, data.institution_id, context.userId);

    const normalizedEmail = normalizeEmail(data.email);
    const { data: institution, error: instError } = await supabaseAdmin
      .from("institutions")
      .select("id, name, slug, onboarding_status")
      .eq("id", data.institution_id)
      .single();
    if (instError || !institution) throw new Error(instError?.message || "Institution not found.");

    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("email", normalizedEmail)
      .maybeSingle();
    if (profileError) throw new Error(profileError.message);

    if (existingProfile?.id) {
      const { data: existingMembership, error: memberError } = await supabaseAdmin
        .from("institution_members")
        .select("id, status, role")
        .eq("institution_id", institution.id)
        .eq("user_id", existingProfile.id)
        .maybeSingle();
      if (memberError) throw new Error(memberError.message);
      if (existingMembership?.status === "active") {
        throw new Error("That user is already an active member of this institution.");
      }
    }

    await supabaseAdmin
      .from("institution_invites")
      .update({ status: "revoked" })
      .eq("institution_id", institution.id)
      .eq("email", normalizedEmail)
      .in("status", ["pending", "sent"]);

    const token = createInviteToken();
    const tokenHash = await sha256Hex(token);
    const expiresAt = new Date(
      Date.now() + data.expires_in_days * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("institution_invites")
      .insert({
        institution_id: institution.id,
        email: normalizedEmail,
        full_name: data.full_name ?? null,
        role: data.role,
        invited_by: context.userId,
        status: "sent",
        token_hash: tokenHash,
        expires_at: expiresAt,
        message: data.message ?? null,
        metadata_json: {
          institution_slug: institution.slug,
          invited_existing_user: Boolean(existingProfile?.id),
        },
      })
      .select("id, email, role, status, expires_at")
      .single();
    if (inviteError || !invite) throw new Error(inviteError?.message || "Could not create invite.");

    const inviteUrl = `${getAppUrl()}/auth?invite=${encodeURIComponent(token)}`;

    await queueEmailJob(supabaseAdmin, {
      institutionId: institution.id,
      relatedInviteId: invite.id,
      relatedUserId: existingProfile?.id ?? null,
      kind: "institution_invite",
      templateKey: "institution_member_invite",
      toEmail: normalizedEmail,
      toName: data.full_name ?? null,
      subject: `You have been invited to join ${institution.name} on Klassruum`,
      idempotencyKey: `invite:${invite.id}:institution_member_invite`,
      payload: {
        institution_name: institution.name,
        institution_slug: institution.slug,
        invite_url: inviteUrl,
        role: data.role,
        expires_at: expiresAt,
        message: data.message ?? null,
      },
    });

    await supabaseAdmin
      .from("institutions")
      .update({
        onboarding_status:
          institution.onboarding_status === "owner_created"
            ? "invites_sent"
            : institution.onboarding_status,
      })
      .eq("id", institution.id);

    await createAuditLog(supabaseAdmin, {
      institutionId: institution.id,
      actorUserId: context.userId,
      actorRole: "admin",
      action: "institution_invite.created",
      entityType: "institution_invite",
      entityId: invite.id,
      summary: `Created ${data.role} invite for ${normalizedEmail}`,
      details: { expires_at: expiresAt },
    });

    return { ok: true, invite, invite_url: inviteUrl };
  });

export const acceptInstitutionInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => AcceptInviteSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const emailFromClaims = normalizeEmail(context.claims?.email ?? "");
    if (!emailFromClaims) throw new Error("Your account email could not be verified.");

    const tokenHash = await sha256Hex(data.token);
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("institution_invites")
      .select("id, institution_id, email, full_name, role, status, expires_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();
    if (inviteError) throw new Error(inviteError.message);
    if (!invite) throw new Error("Invite not found or already used.");

    if (!["pending", "sent"].includes(invite.status)) {
      throw new Error("This invite is no longer active.");
    }
    if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
      await supabaseAdmin
        .from("institution_invites")
        .update({ status: "expired" })
        .eq("id", invite.id);
      throw new Error("This invite has expired.");
    }
    if (normalizeEmail(invite.email) !== emailFromClaims) {
      throw new Error("This invite belongs to a different email address.");
    }

    const membershipRole = invite.role as "owner" | "admin" | "teacher" | "student";
    const profileRole = memberRoleToUserRole(membershipRole);

    const { error: profileUpdateError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: context.userId,
        email: emailFromClaims,
        full_name: invite.full_name ?? null,
        role: profileRole,
      },
      { onConflict: "id" },
    );
    if (profileUpdateError) throw new Error(profileUpdateError.message);

    const { error: membershipError } = await supabaseAdmin.from("institution_members").upsert(
      {
        institution_id: invite.institution_id,
        user_id: context.userId,
        role: membershipRole,
        status: "active",
      },
      { onConflict: "institution_id,user_id" },
    );
    if (membershipError) throw new Error(membershipError.message);

    const acceptedAt = new Date().toISOString();
    const { error: acceptError } = await supabaseAdmin
      .from("institution_invites")
      .update({
        status: "accepted",
        accepted_at: acceptedAt,
        accepted_user_id: context.userId,
      })
      .eq("id", invite.id);
    if (acceptError) throw new Error(acceptError.message);

    await queueEmailJob(supabaseAdmin, {
      institutionId: invite.institution_id,
      relatedInviteId: invite.id,
      relatedUserId: context.userId,
      kind: "institution_invite_accepted",
      templateKey: "institution_invite_accepted",
      toEmail: emailFromClaims,
      toName: invite.full_name ?? null,
      subject: "Your Klassruum institution invite has been accepted",
      idempotencyKey: `invite:${invite.id}:accepted:${context.userId}`,
      payload: {
        accepted_at: acceptedAt,
        institution_id: invite.institution_id,
        role: membershipRole,
      },
    });

    await createAuditLog(supabaseAdmin, {
      institutionId: invite.institution_id,
      actorUserId: context.userId,
      actorRole: profileRole,
      action: "institution_invite.accepted",
      entityType: "institution_invite",
      entityId: invite.id,
      summary: `Accepted institution invite for ${emailFromClaims}`,
      details: { membership_role: membershipRole },
    });

    return {
      ok: true,
      institution_id: invite.institution_id,
      membership_role: membershipRole,
      profile_role: profileRole,
    };
  });
