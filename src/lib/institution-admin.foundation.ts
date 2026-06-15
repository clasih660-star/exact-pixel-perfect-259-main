import { memberRoleToUserRole } from "@/lib/onboarding.foundation";

export async function requireInstitutionAdminAccess(
    supabaseAdmin: any,
    institutionId: string,
    userId: string,
) {
    const { data, error } = await supabaseAdmin
        .from("institution_members")
        .select("role, status, institution:institutions(id, name, slug)")
        .eq("institution_id", institutionId)
        .eq("user_id", userId)
        .eq("status", "active")
        .in("role", ["owner", "admin"])
        .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("You do not have permission to manage this institution.");
    return data;
}

export async function requireInstitutionStaffAccess(
    supabaseAdmin: any,
    institutionId: string,
    userId: string,
) {
    const { data, error } = await supabaseAdmin
        .from("institution_members")
        .select("role, status, institution:institutions(id, name, slug)")
        .eq("institution_id", institutionId)
        .eq("user_id", userId)
        .eq("status", "active")
        .in("role", ["owner", "admin", "teacher"])
        .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("You do not have staff access to this institution.");
    return data;
}

export async function getUserProfileRole(supabaseAdmin: any, userId: string) {
    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.role ?? null;
}

export async function ensureStudentMembership(
    supabaseAdmin: any,
    institutionId: string,
    userId: string,
) {
    const { error } = await supabaseAdmin.from("institution_members").upsert(
        {
            institution_id: institutionId,
            user_id: userId,
            role: "student",
            status: "active",
        },
        { onConflict: "institution_id,user_id" },
    );
    if (error) throw new Error(error.message);

    const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ role: memberRoleToUserRole("student") })
        .eq("id", userId);
    if (profileError) throw new Error(profileError.message);
}

export async function createAuditLog(
    supabaseAdmin: any,
    input: {
        institutionId?: string | null;
        actorUserId?: string | null;
        actorRole?: string | null;
        action: string;
        entityType: string;
        entityId?: string | null;
        summary?: string | null;
        details?: Record<string, unknown>;
    },
) {
    const { error } = await supabaseAdmin.from("audit_logs").insert({
        institution_id: input.institutionId ?? null,
        actor_user_id: input.actorUserId ?? null,
        actor_role: input.actorRole ?? null,
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId ?? null,
        summary: input.summary ?? null,
        details_json: input.details ?? {},
    });
    if (error) throw new Error(error.message);
}