import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAuditLog, requireInstitutionAdminAccess } from "@/lib/institution-admin.foundation";

export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(
    (data: { institution_id: string; action?: string; entity_type?: string; limit?: number }) =>
      data,
  )
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);
    let query = supabaseAdmin
      .from("audit_logs")
      .select("*")
      .eq("institution_id", data.institution_id)
      .order("created_at", { ascending: false })
      .limit(Math.min(data.limit ?? 100, 300));
    if (data.action) query = query.eq("action", data.action);
    if (data.entity_type) query = query.eq("entity_type", data.entity_type);
    const { data: logs, error } = await query;
    if (error) throw new Error(error.message);
    return { logs: logs ?? [] };
  });

export const requestDataExport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        institution_id: z.string().uuid(),
        export_type: z.string().trim().min(1).max(120),
        filters: z.record(z.string(), z.any()).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const access = await requireInstitutionAdminAccess(
      supabaseAdmin,
      data.institution_id,
      context.userId,
    );
    const { data: job, error } = await supabaseAdmin
      .from("data_export_jobs")
      .insert({
        institution_id: data.institution_id,
        requested_by: context.userId,
        export_type: data.export_type,
        status: "queued",
        filters_json: data.filters ?? {},
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await createAuditLog(supabaseAdmin, {
      institutionId: data.institution_id,
      actorUserId: context.userId,
      actorRole: access.role,
      action: "data_export.requested",
      entityType: "data_export_job",
      entityId: job.id,
      summary: `Requested ${data.export_type} export`,
      details: data.filters ?? {},
    });

    return { job };
  });

export const listDataExportJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);
    const { data: jobs, error } = await supabaseAdmin
      .from("data_export_jobs")
      .select("*")
      .eq("institution_id", data.institution_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { jobs: jobs ?? [] };
  });
