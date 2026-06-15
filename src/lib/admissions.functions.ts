import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAuditLog, ensureStudentMembership, requireInstitutionAdminAccess } from "@/lib/institution-admin.foundation";
import {
    createInviteToken,
    getAppUrl,
    normalizeEmail,
    queueEmailJob,
    sha256Hex,
} from "@/lib/onboarding.foundation";

export const listAdmissionCycles = createServerFn({ method: "GET" })
    .middleware([requireSupabaseAuth])
    .validator((data: { institution_id: string }) => data)
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);
        const { data: rows, error } = await supabaseAdmin
            .from("admission_cycles")
            .select("*")
            .eq("institution_id", data.institution_id)
            .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return { cycles: rows ?? [] };
    });

export const createAdmissionCycle = createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((data: unknown) =>
        z
            .object({
                institution_id: z.string().uuid(),
                title: z.string().trim().min(1).max(200),
                description: z.string().trim().max(2000).optional(),
                status: z.enum(["draft", "open", "closed", "archived"]).default("draft"),
                opens_at: z.string().datetime().optional(),
                closes_at: z.string().datetime().optional(),
                default_programme_id: z.string().uuid().optional(),
            })
            .parse(data),
    )
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const access = await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);
        const { data: cycle, error } = await supabaseAdmin
            .from("admission_cycles")
            .insert({
                institution_id: data.institution_id,
                title: data.title,
                description: data.description ?? null,
                status: data.status,
                opens_at: data.opens_at ?? null,
                closes_at: data.closes_at ?? null,
                default_programme_id: data.default_programme_id ?? null,
                created_by: context.userId,
            })
            .select("*")
            .single();
        if (error) throw new Error(error.message);

        await createAuditLog(supabaseAdmin, {
            institutionId: data.institution_id,
            actorUserId: context.userId,
            actorRole: access.role,
            action: "admission_cycle.created",
            entityType: "admission_cycle",
            entityId: cycle.id,
            summary: `Created admission cycle ${cycle.title}`,
            details: { status: cycle.status },
        });
        return { cycle };
    });

export const listAdmissionApplications = createServerFn({ method: "GET" })
    .middleware([requireSupabaseAuth])
    .validator((data: { institution_id: string; status?: string }) => data)
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);
        let query = supabaseAdmin
            .from("admission_applications")
            .select("*")
            .eq("institution_id", data.institution_id)
            .order("created_at", { ascending: false });
        if (data.status) query = query.eq("status", data.status);
        const { data: rows, error } = await query;
        if (error) throw new Error(error.message);
        return { applications: rows ?? [] };
    });

export const submitAdmissionApplication = createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((data: unknown) =>
        z
            .object({
                institution_id: z.string().uuid(),
                admission_cycle_id: z.string().uuid().optional(),
                target_course_id: z.string().uuid().optional(),
                full_name: z.string().trim().min(1).max(200),
                email: z.string().trim().email().max(255),
                phone: z.string().trim().max(40).optional(),
                application_notes: z.string().trim().max(4000).optional(),
            })
            .parse(data),
    )
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const access = await requireInstitutionAdminAccess(supabaseAdmin, data.institution_id, context.userId);
        const { data: application, error } = await supabaseAdmin
            .from("admission_applications")
            .insert({
                institution_id: data.institution_id,
                admission_cycle_id: data.admission_cycle_id ?? null,
                target_course_id: data.target_course_id ?? null,
                full_name: data.full_name,
                email: normalizeEmail(data.email),
                phone: data.phone ?? null,
                status: "submitted",
                application_notes: data.application_notes ?? null,
                submitted_by: context.userId,
                submitted_at: new Date().toISOString(),
            })
            .select("*")
            .single();
        if (error) throw new Error(error.message);

        await createAuditLog(supabaseAdmin, {
            institutionId: data.institution_id,
            actorUserId: context.userId,
            actorRole: access.role,
            action: "admission_application.submitted",
            entityType: "admission_application",
            entityId: application.id,
            summary: `Submitted admission application for ${application.email}`,
            details: { target_course_id: application.target_course_id },
        });

        return { application };
    });

export const reviewAdmissionApplication = createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((data: unknown) =>
        z
            .object({
                application_id: z.string().uuid(),
                status: z.enum(["reviewing", "accepted", "rejected", "waitlisted"]),
                internal_notes: z.string().trim().max(4000).optional(),
            })
            .parse(data),
    )
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: application, error: appError } = await supabaseAdmin
            .from("admission_applications")
            .select("*")
            .eq("id", data.application_id)
            .single();
        if (appError || !application) throw new Error(appError?.message || "Admission application not found.");
        const access = await requireInstitutionAdminAccess(supabaseAdmin, application.institution_id, context.userId);

        const decisionAt = ["accepted", "rejected", "waitlisted"].includes(data.status)
            ? new Date().toISOString()
            : null;
        const { data: updated, error } = await supabaseAdmin
            .from("admission_applications")
            .update({
                status: data.status,
                internal_notes: data.internal_notes ?? application.internal_notes,
                reviewed_by: context.userId,
                decision_at: decisionAt,
            })
            .eq("id", data.application_id)
            .select("*")
            .single();
        if (error) throw new Error(error.message);

        await queueEmailJob(supabaseAdmin, {
            institutionId: updated.institution_id,
            kind: "admission_status_update",
            templateKey: "admission_status_update",
            toEmail: updated.email,
            toName: updated.full_name,
            subject: `Your admission application is now ${data.status}`,
            idempotencyKey: `admission:${updated.id}:status:${data.status}`,
            payload: {
                admission_application_id: updated.id,
                status: data.status,
                institution_id: updated.institution_id,
            },
        });

        await createAuditLog(supabaseAdmin, {
            institutionId: updated.institution_id,
            actorUserId: context.userId,
            actorRole: access.role,
            action: `admission_application.${data.status}`,
            entityType: "admission_application",
            entityId: updated.id,
            summary: `Marked admission application ${updated.id} as ${data.status}`,
            details: { email: updated.email },
        });

        return { application: updated };
    });

export const convertAdmissionToEnrollment = createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((data: unknown) =>
        z
            .object({
                application_id: z.string().uuid(),
                course_id: z.string().uuid().optional(),
            })
            .parse(data),
    )
    .handler(async ({ data, context }: any) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: application, error: appError } = await supabaseAdmin
            .from("admission_applications")
            .select("*")
            .eq("id", data.application_id)
            .single();
        if (appError || !application) throw new Error(appError?.message || "Admission application not found.");
        const access = await requireInstitutionAdminAccess(supabaseAdmin, application.institution_id, context.userId);

        if (![
            "accepted",
            "waitlisted",
            "reviewing",
        ].includes(application.status)) {
            throw new Error("Only accepted, waitlisted, or reviewing applications can continue to enrollment.");
        }

        const courseId = data.course_id ?? application.target_course_id;
        if (!courseId) throw new Error("A target course is required for enrollment.");

        const { data: course, error: courseError } = await supabaseAdmin
            .from("courses")
            .select("id, institution_id, title")
            .eq("id", courseId)
            .single();
        if (courseError || !course) throw new Error(courseError?.message || "Course not found.");

        const normalizedEmail = normalizeEmail(application.email);
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("id, email")
            .eq("email", normalizedEmail)
            .maybeSingle();
        if (profileError) throw new Error(profileError.message);

        let inviteId: string | null = null;
        if (!profile?.id) {
            const token = createInviteToken();
            const tokenHash = await sha256Hex(token);
            const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
            const { data: invite, error: inviteError } = await supabaseAdmin
                .from("institution_invites")
                .insert({
                    institution_id: course.institution_id,
                    email: normalizedEmail,
                    full_name: application.full_name,
                    role: "student",
                    invited_by: context.userId,
                    status: "sent",
                    token_hash: tokenHash,
                    expires_at: expiresAt,
                    message: "Your admission application has been approved. Join Klassruum to complete enrollment.",
                    metadata_json: { source: "admission_conversion", admission_application_id: application.id },
                })
                .select("id")
                .single();
            if (inviteError || !invite) throw new Error(inviteError?.message || "Could not create invite.");
            inviteId = invite.id;

            await queueEmailJob(supabaseAdmin, {
                institutionId: course.institution_id,
                relatedInviteId: invite.id,
                kind: "admission_enrollment_invite",
                templateKey: "admission_enrollment_invite",
                toEmail: normalizedEmail,
                toName: application.full_name,
                subject: `Complete your enrollment for ${course.title}`,
                idempotencyKey: `admission:${application.id}:invite`,
                payload: {
                    invite_url: `${getAppUrl()}/auth?invite=${encodeURIComponent(token)}`,
                    course_title: course.title,
                    admission_application_id: application.id,
                },
            });
        } else {
            await ensureStudentMembership(supabaseAdmin, course.institution_id, profile.id);

            const { error: enrollmentError } = await supabaseAdmin.from("course_enrollments").upsert(
                {
                    institution_id: course.institution_id,
                    course_id: course.id,
                    student_id: profile.id,
                    status: "active",
                    enrolled_by: context.userId,
                },
                { onConflict: "course_id,student_id" },
            );
            if (enrollmentError) throw new Error(enrollmentError.message);
        }

        const finalStatus = profile?.id ? "enrolled" : "accepted";
        const { data: updated, error: updateError } = await supabaseAdmin
            .from("admission_applications")
            .update({
                status: finalStatus,
                target_course_id: course.id,
                metadata_json: {
                    ...(application.metadata_json ?? {}),
                    enrollment_invite_id: inviteId,
                    converted_course_id: course.id,
                },
            })
            .eq("id", application.id)
            .select("*")
            .single();
        if (updateError) throw new Error(updateError.message);

        await createAuditLog(supabaseAdmin, {
            institutionId: course.institution_id,
            actorUserId: context.userId,
            actorRole: access.role,
            action: "admission_application.converted",
            entityType: "admission_application",
            entityId: application.id,
            summary: `Converted admission application ${application.id} for ${normalizedEmail}`,
            details: { course_id: course.id, invited: !profile?.id },
        });

        return {
            application: updated,
            enrolled: Boolean(profile?.id),
            invite_created: inviteId,
        };
    });