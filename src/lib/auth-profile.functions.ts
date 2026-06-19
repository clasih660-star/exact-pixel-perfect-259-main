import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { LearnerType, TeacherType, UserRole } from "@/lib/types";

const CompleteAuthProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  role: z.enum(["student", "teacher", "parent", "institution_admin", "owner"]),
});

type IdentifierRow = {
  public_id: string | null;
  student_number: string | null;
  teacher_number: string | null;
  institution_code: string | null;
};

function deriveProfileFields(role: UserRole, institutionId: string | null) {
  let teacherType: TeacherType | null = null;
  let learnerType: LearnerType | null = null;

  if (role === "teacher") {
    teacherType = institutionId ? "institution" : "private";
  }

  if (role === "student") {
    learnerType = institutionId ? "institution" : "private";
  }

  return {
    teacherType,
    learnerType,
    institutionRole: role === "institution_admin" ? "admin" : role === "owner" ? "owner" : null,
    normalizedRole: role,
  };
}

export const completeAuthProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => CompleteAuthProfileSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const userId = context.userId as string;
    const email = (context.claims?.email as string | undefined) ?? null;
    const avatarUrl = (context.claims?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url ?? null;

    const { data: memberships, error: membershipError } = await supabaseAdmin
      .from("institution_members")
      .select("institution_id, role")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1);

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    const membership = ((memberships ?? [])[0] ?? null) as
      | { institution_id: string; role: "owner" | "admin" | "teacher" | "student" }
      | null;

    const institutionId = membership?.institution_id ?? null;
    const derived = deriveProfileFields(data.role, institutionId);

    if ((data.role === "institution_admin" || data.role === "owner") && !institutionId) {
      throw new Error("Institution administrator accounts require an active institution membership.");
    }

    if (data.role === "teacher" && membership && membership.role === "teacher") {
      derived.teacherType = "institution";
    }

    if (data.role === "student" && membership && membership.role === "student") {
      derived.learnerType = "institution";
    }

    const { data: existingProfile, error: existingProfileError } = await supabaseAdmin
      .from("profiles")
      .select(
        "public_id, student_number, teacher_number, institution_code, institution_id, role, teacher_type, learner_type",
      )
      .eq("id", userId)
      .maybeSingle();

    if (existingProfileError) {
      throw new Error(existingProfileError.message);
    }

    let identifiers = {
      public_id: (existingProfile as IdentifierRow | null)?.public_id ?? null,
      student_number: (existingProfile as IdentifierRow | null)?.student_number ?? null,
      teacher_number: (existingProfile as IdentifierRow | null)?.teacher_number ?? null,
      institution_code: (existingProfile as IdentifierRow | null)?.institution_code ?? null,
    };

    const needsStudentNumber = data.role === "student" && !identifiers.student_number;
    const needsTeacherNumber = data.role === "teacher" && !identifiers.teacher_number;
    const needsInstitutionCode =
      (data.role === "institution_admin" || data.role === "owner") && !identifiers.institution_code;
    const needsPublicId = !identifiers.public_id;

    if (needsPublicId || needsStudentNumber || needsTeacherNumber || needsInstitutionCode) {
      const rpcArgs: Database["public"]["Functions"]["generate_profile_public_id"]["Args"] = {
        _role: data.role,
      };
      if (institutionId) {
        rpcArgs._institution_id = institutionId;
      }

      const { data: generated, error: generatedError } = await supabaseAdmin.rpc(
        "generate_profile_public_id",
        rpcArgs,
      );

      if (generatedError) {
        throw new Error(generatedError.message);
      }

      const row = (Array.isArray(generated) ? generated[0] : generated) as IdentifierRow | null;
      if (!row) {
        throw new Error("Failed to generate account identifiers.");
      }

      identifiers = {
        public_id: identifiers.public_id ?? row.public_id ?? null,
        student_number: identifiers.student_number ?? row.student_number ?? null,
        teacher_number: identifiers.teacher_number ?? row.teacher_number ?? null,
        institution_code: identifiers.institution_code ?? row.institution_code ?? null,
      };
    }

    // All columns now present in regenerated types
    const profileUpdate = {
      id: userId,
      full_name: data.fullName,
      email,
      avatar_url: avatarUrl,
      role: data.role,
      institution_id: institutionId,
      teacher_type: derived.teacherType,
      learner_type: derived.learnerType,
      public_id: identifiers.public_id,
      student_number: data.role === "student" ? identifiers.student_number : null,
      teacher_number: data.role === "teacher" ? identifiers.teacher_number : null,
      institution_code:
        data.role === "institution_admin" || data.role === "owner" ? identifiers.institution_code : null,
    };

    const { error: upsertError } = await supabaseAdmin.from("profiles").upsert(profileUpdate, {
      onConflict: "id",
    });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    if (institutionId && derived.institutionRole && membership && membership.role !== derived.institutionRole) {
      const memberRole = derived.institutionRole as Database["public"]["Enums"]["member_role"];
      const { error: membershipUpdateError } = await supabaseAdmin
        .from("institution_members")
        .update({ role: memberRole })
        .eq("institution_id", institutionId)
        .eq("user_id", userId)
        .eq("status", "active");

      if (membershipUpdateError) {
        throw new Error(membershipUpdateError.message);
      }
    }

    return {
      ok: true as const,
      role: data.role as UserRole,
      institutionId,
      publicId: identifiers.public_id,
      studentNumber: data.role === "student" ? identifiers.student_number : null,
      teacherNumber: data.role === "teacher" ? identifiers.teacher_number : null,
      institutionCode:
        data.role === "institution_admin" || data.role === "owner" ? identifiers.institution_code : null,
    };
  });
