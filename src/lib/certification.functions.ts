import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAuditLog, requireInstitutionAdminAccess } from "@/lib/institution-admin.foundation";
import { queueEmailJob } from "@/lib/onboarding.foundation";

function buildCertificateNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `KR-${stamp}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function buildVerificationCode() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 24).toUpperCase();
}

export const listCompletionRules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string; course_id?: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);
    let query = supabaseAdmin
      .from("completion_rules")
      .select("*")
      .eq("institution_id", data.institution_id)
      .order("created_at", { ascending: false });
    if (data.course_id) query = query.eq("course_id", data.course_id);
    const { data: rules, error } = await query;
    if (error) throw new Error(error.message);
    return { rules: rules ?? [] };
  });

export const upsertCompletionRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        rule_id: z.string().uuid().optional(),
        institution_id: z.string().uuid(),
        course_id: z.string().uuid().optional(),
        title: z.string().trim().min(1).max(200),
        min_progress_percentage: z.number().min(0).max(100).default(100),
        require_active_enrollment: z.boolean().default(true),
        require_quiz_pass: z.boolean().default(false),
        min_quiz_percentage: z.number().min(0).max(100).default(0),
        auto_issue_certificate: z.boolean().default(false),
        status: z.enum(["draft", "active", "archived"]).default("draft"),
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
    const payload = {
      institution_id: data.institution_id,
      course_id: data.course_id ?? null,
      title: data.title,
      min_progress_percentage: data.min_progress_percentage,
      require_active_enrollment: data.require_active_enrollment,
      require_quiz_pass: data.require_quiz_pass,
      min_quiz_percentage: data.min_quiz_percentage,
      auto_issue_certificate: data.auto_issue_certificate,
      status: data.status,
      created_by: context.userId,
    };

    const { data: rule, error } = data.rule_id
      ? await supabaseAdmin
          .from("completion_rules")
          .update(payload)
          .eq("id", data.rule_id)
          .select("*")
          .single()
      : await supabaseAdmin.from("completion_rules").insert(payload).select("*").single();
    if (error) throw new Error(error.message);

    await createAuditLog(supabaseAdmin, {
      institutionId: data.institution_id,
      actorUserId: context.userId,
      actorRole: access.role,
      action: data.rule_id ? "completion_rule.updated" : "completion_rule.created",
      entityType: "completion_rule",
      entityId: rule.id,
      summary: `${data.rule_id ? "Updated" : "Created"} completion rule ${rule.title}`,
      details: { course_id: rule.course_id, status: rule.status },
    });

    return { rule };
  });

export const listCertificates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string; course_id?: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);
    let query = supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("institution_id", data.institution_id)
      .order("issued_at", { ascending: false });
    if (data.course_id) query = query.eq("course_id", data.course_id);
    const { data: certificates, error } = await query;
    if (error) throw new Error(error.message);
    return { certificates: certificates ?? [] };
  });

export const issueCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        institution_id: z.string().uuid(),
        course_id: z.string().uuid(),
        student_id: z.string().uuid(),
        completion_rule_id: z.string().uuid().optional(),
        override: z.boolean().default(false),
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

    const [existingCertRes, enrollmentRes, progressRes, quizRes, ruleRes, studentProfileRes] =
      await Promise.all([
        supabaseAdmin
          .from("certificates")
          .select("*")
          .eq("institution_id", data.institution_id)
          .eq("course_id", data.course_id)
          .eq("student_id", data.student_id)
          .eq("status", "issued")
          .maybeSingle(),
        supabaseAdmin
          .from("course_enrollments")
          .select("*")
          .eq("institution_id", data.institution_id)
          .eq("course_id", data.course_id)
          .eq("student_id", data.student_id)
          .maybeSingle(),
        supabaseAdmin
          .from("learning_results")
          .select("progress_percentage")
          .eq("institution_id", data.institution_id)
          .eq("course_id", data.course_id)
          .eq("student_id", data.student_id),
        supabaseAdmin
          .from("quiz_results")
          .select("percentage")
          .eq("institution_id", data.institution_id)
          .eq("course_id", data.course_id)
          .eq("student_id", data.student_id),
        data.completion_rule_id
          ? supabaseAdmin
              .from("completion_rules")
              .select("*")
              .eq("id", data.completion_rule_id)
              .single()
          : Promise.resolve({ data: null, error: null }),
        supabaseAdmin
          .from("profiles")
          .select("email, full_name")
          .eq("id", data.student_id)
          .maybeSingle(),
      ]);

    if (existingCertRes.data) return { certificate: existingCertRes.data, alreadyIssued: true };
    if (existingCertRes.error) throw new Error(existingCertRes.error.message);
    if (enrollmentRes.error) throw new Error(enrollmentRes.error.message);
    if (ruleRes.error) throw new Error(ruleRes.error.message);
    if (studentProfileRes.error) throw new Error(studentProfileRes.error.message);

    const enrollment = enrollmentRes.data;
    const rule = ruleRes.data;
    const maxProgress = Math.max(
      0,
      ...(progressRes.data ?? []).map((r: any) => r.progress_percentage ?? 0),
    );
    const quizPercentages = (quizRes.data ?? []).map((r: any) => r.percentage ?? 0);
    const avgQuiz = quizPercentages.length
      ? quizPercentages.reduce((sum: number, value: number) => sum + value, 0) /
        quizPercentages.length
      : 0;

    if (!data.override) {
      if (!enrollment && (rule?.require_active_enrollment ?? true)) {
        throw new Error("Learner must have an active enrollment before receiving a certificate.");
      }
      if (maxProgress < (rule?.min_progress_percentage ?? 100)) {
        throw new Error("Learner has not met the required progress threshold.");
      }
      if (rule?.require_quiz_pass && avgQuiz < (rule?.min_quiz_percentage ?? 0)) {
        throw new Error("Learner has not met the required quiz threshold.");
      }
    }

    const { data: certificate, error } = await supabaseAdmin
      .from("certificates")
      .insert({
        institution_id: data.institution_id,
        course_id: data.course_id,
        student_id: data.student_id,
        completion_rule_id: data.completion_rule_id ?? null,
        certificate_number: buildCertificateNumber(),
        verification_code: buildVerificationCode(),
        issued_by: context.userId,
        status: "issued",
        metadata_json: {
          max_progress: maxProgress,
          average_quiz_percentage: avgQuiz,
          override: data.override,
        },
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await supabaseAdmin
      .from("course_enrollments")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("institution_id", data.institution_id)
      .eq("course_id", data.course_id)
      .eq("student_id", data.student_id);

    if (studentProfileRes.data?.email) {
      await queueEmailJob(supabaseAdmin, {
        institutionId: data.institution_id,
        relatedUserId: data.student_id,
        kind: "certificate_issued",
        templateKey: "certificate_issued",
        toEmail: studentProfileRes.data.email,
        toName: studentProfileRes.data.full_name ?? null,
        subject: "Your Klassruum certificate is ready",
        idempotencyKey: `certificate:${certificate.id}:email`,
        payload: {
          certificate_id: certificate.id,
          certificate_number: certificate.certificate_number,
          verification_code: certificate.verification_code,
        },
      });
    }

    await createAuditLog(supabaseAdmin, {
      institutionId: data.institution_id,
      actorUserId: context.userId,
      actorRole: access.role,
      action: "certificate.issued",
      entityType: "certificate",
      entityId: certificate.id,
      summary: `Issued certificate ${certificate.certificate_number}`,
      details: { student_id: data.student_id, course_id: data.course_id },
    });

    return { certificate, alreadyIssued: false };
  });
