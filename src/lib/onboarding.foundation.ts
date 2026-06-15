import { getServerConfig } from "@/lib/config.server";

type QueueEmailJobInput = {
    institutionId?: string | null;
    relatedUserId?: string | null;
    relatedInviteId?: string | null;
    kind: string;
    templateKey?: string | null;
    toEmail: string;
    toName?: string | null;
    subject: string;
    payload?: Record<string, unknown>;
    idempotencyKey?: string | null;
    scheduledFor?: string | null;
};

export async function sha256Hex(value: string) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export function createInviteToken() {
    return `${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g, "")}`;
}

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function memberRoleToUserRole(role: "owner" | "admin" | "teacher" | "student") {
    switch (role) {
        case "owner":
            return "owner" as const;
        case "admin":
            return "institution_admin" as const;
        case "teacher":
            return "teacher" as const;
        case "student":
        default:
            return "student" as const;
    }
}

export function getAppUrl() {
    const config = getServerConfig();
    return (config.appUrl || "http://localhost:3000").replace(/\/$/, "");
}

export async function queueEmailJob(supabaseAdmin: any, input: QueueEmailJobInput) {
    const { data, error } = await supabaseAdmin
        .from("outbound_email_jobs")
        .insert({
            institution_id: input.institutionId ?? null,
            related_user_id: input.relatedUserId ?? null,
            related_invite_id: input.relatedInviteId ?? null,
            kind: input.kind,
            template_key: input.templateKey ?? null,
            to_email: normalizeEmail(input.toEmail),
            to_name: input.toName ?? null,
            subject: input.subject,
            payload_json: input.payload ?? {},
            status: "pending",
            provider: "internal_queue",
            idempotency_key: input.idempotencyKey ?? null,
            scheduled_for: input.scheduledFor ?? new Date().toISOString(),
        })
        .select("id, status, to_email, kind, scheduled_for")
        .single();

    if (error) throw new Error(error.message);
    return data;
}