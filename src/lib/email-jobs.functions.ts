import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAuditLog, requireInstitutionAdminAccess } from "@/lib/institution-admin.foundation";

export const listOutboundEmailJobs = createServerFn({ method: "GET" })
    .middleware([requireSupabaseAuth])
    .validator((data: { institution_id: string; status?: string; limit?: number }) => data)
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);

        let query = supabaseAdmin
            .from("outbound_email_jobs")
            .select("*")
            .eq("institution_id", data.institution_id)
            .order("created_at", { ascending: false })
            .limit(Math.min(data.limit ?? 100, 200));

        if (data.status) query = query.eq("status", data.status);
        const { data: jobs, error } = await query;
        if (error) throw new Error(error.message);
        return { jobs: jobs ?? [] };
    });

export const updateOutboundEmailJobStatus = createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((data: unknown) =>
        z
            .object({
                job_id: z.string().uuid(),
                status: z.enum(["pending", "processing", "sent", "failed", "cancelled"]),
                last_error: z.string().max(4000).optional(),
            })
            .parse(data),
    )
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: job, error: jobError } = await supabaseAdmin
            .from("outbound_email_jobs")
            .select("id, institution_id, status, attempt_count")
            .eq("id", data.job_id)
            .single();
        if (jobError || !job) throw new Error(jobError?.message || "Email job not found.");

        const access = await requireInstitutionAdminAccess(supabaseAdmin, job.institution_id, context.userId);
        const patch: Record<string, unknown> = {
            status: data.status,
            last_error: data.last_error ?? null,
        };
        if (data.status === "processing") patch.attempt_count = (job.attempt_count ?? 0) + 1;
        if (data.status === "sent") patch.sent_at = new Date().toISOString();

        const { data: updated, error } = await supabaseAdmin
            .from("outbound_email_jobs")
            .update(patch)
            .eq("id", data.job_id)
            .select("*")
            .single();
        if (error) throw new Error(error.message);

        await createAuditLog(supabaseAdmin, {
            institutionId: job.institution_id,
            actorUserId: context.userId,
            actorRole: access.role,
            action: `email_job.${data.status}`,
            entityType: "outbound_email_job",
            entityId: job.id,
            summary: `Email job ${job.id} marked as ${data.status}`,
            details: { last_error: data.last_error ?? null },
        });

        return { job: updated };
    });

export const retryOutboundEmailJob = createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((data: unknown) => z.object({ job_id: z.string().uuid() }).parse(data))
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: job, error: jobError } = await supabaseAdmin
            .from("outbound_email_jobs")
            .select("id, institution_id")
            .eq("id", data.job_id)
            .single();
        if (jobError || !job) throw new Error(jobError?.message || "Email job not found.");

        const access = await requireInstitutionAdminAccess(supabaseAdmin, job.institution_id, context.userId);
        const { data: updated, error } = await supabaseAdmin
            .from("outbound_email_jobs")
            .update({ status: "pending", last_error: null, scheduled_for: new Date().toISOString() })
            .eq("id", data.job_id)
            .select("*")
            .single();
        if (error) throw new Error(error.message);

        await createAuditLog(supabaseAdmin, {
            institutionId: job.institution_id,
            actorUserId: context.userId,
            actorRole: access.role,
            action: "email_job.retry",
            entityType: "outbound_email_job",
            entityId: job.id,
            summary: `Queued retry for email job ${job.id}`,
            details: {},
        });

        return { job: updated };
    });