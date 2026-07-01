import type { RoleResolution, UserPersona, UserRole } from "./types";
import { isDemoModeAllowed } from "./runtime-mode";
import { ForbiddenError, UnauthorizedError } from "./security-errors";

type InstitutionMemberRole = "owner" | "admin" | "teacher" | "student";

type ServerAuthContext = {
  supabase?: any;
  userId?: string;
  claims?: Record<string, unknown> | null;
};

type ActiveMembership = {
  institution_id: string;
  role: InstitutionMemberRole;
};

type ActorResolution = RoleResolution & {
  memberships: ActiveMembership[];
};

function derivePersona(
  role: UserRole,
  teacherType?: string | null,
  learnerType?: string | null,
  membershipRole?: InstitutionMemberRole | null,
): UserPersona {
  switch (role) {
    case "platform_admin":
      return "platform_admin";
    case "institution_admin":
    case "owner":
      return "institution_admin";
    case "teacher":
      switch (teacherType) {
        case "private":
          return "private_teacher";
        case "kingpin":
          return "kingpin_teacher";
        case "institution":
          return "institution_teacher";
        default:
          return membershipRole === "teacher" ? "institution_teacher" : "private_teacher";
      }
    case "student":
      switch (learnerType) {
        case "private":
          return "private_learner";
        case "teacher_enrolled":
          return "teacher_enrolled_learner";
        case "institution":
          return "institution_learner";
        default:
          return membershipRole === "student" ? "institution_learner" : "private_learner";
      }
    case "parent":
      return "parent";
    default:
      return "institution_learner";
  }
}

function getDemoResolution(role: UserRole = "student"): ActorResolution {
  switch (role) {
    case "platform_admin":
      return {
        role,
        persona: "platform_admin",
        learnerType: null,
        teacherType: null,
        institutionId: null,
        memberships: [],
      };
    case "institution_admin":
    case "owner":
      return {
        role,
        persona: "institution_admin",
        learnerType: null,
        teacherType: null,
        institutionId: "demo-institution",
        memberships: [{ institution_id: "demo-institution", role: "owner" }],
      };
    case "teacher":
      return {
        role,
        persona: "institution_teacher",
        learnerType: null,
        teacherType: "institution",
        institutionId: "demo-institution",
        memberships: [{ institution_id: "demo-institution", role: "teacher" }],
      };
    case "parent":
      return {
        role,
        persona: "parent",
        learnerType: null,
        teacherType: null,
        institutionId: null,
        memberships: [],
      };
    case "student":
    default:
      return {
        role: "student",
        persona: "institution_learner",
        learnerType: "institution",
        teacherType: null,
        institutionId: "demo-institution",
        memberships: [{ institution_id: "demo-institution", role: "student" }],
      };
  }
}

export async function getServerActorResolution(
  context: ServerAuthContext,
): Promise<ActorResolution> {
  if (!context.userId) {
    throw new UnauthorizedError();
  }

  if (!context.supabase) {
    if (isDemoModeAllowed()) {
      return getDemoResolution(context.claims?.demoRole as UserRole | undefined);
    }

    throw new UnauthorizedError("Authenticated database context is unavailable.");
  }

  const [
    { data: profileData, error: profileError },
    { data: membershipData, error: membershipError },
  ] = await Promise.all([
    context.supabase
      .from("profiles")
      .select("role, teacher_type, learner_type, institution_id")
      .eq("id", context.userId)
      .maybeSingle(),
    context.supabase
      .from("institution_members")
      .select("institution_id, role")
      .eq("user_id", context.userId)
      .eq("status", "active"),
  ]);

  if (profileError) {
    throw new ForbiddenError("Unable to resolve your profile permissions.");
  }

  if (membershipError) {
    throw new ForbiddenError("Unable to resolve your institution memberships.");
  }

  const profile = (profileData ?? {}) as {
    role?: UserRole | null;
    teacher_type?: string | null;
    learner_type?: string | null;
    institution_id?: string | null;
  };
  const memberships = ((membershipData ?? []) as ActiveMembership[]).filter((membership) =>
    Boolean(membership.institution_id && membership.role),
  );

  if (!profile.role) {
    throw new ForbiddenError("Your account does not have an assigned role.");
  }

  return {
    role: profile.role,
    persona: derivePersona(
      profile.role,
      profile.teacher_type ?? null,
      profile.learner_type ?? null,
      memberships[0]?.role ?? null,
    ),
    teacherType: (profile.teacher_type as RoleResolution["teacherType"]) ?? null,
    learnerType: (profile.learner_type as RoleResolution["learnerType"]) ?? null,
    institutionId: profile.institution_id ?? memberships[0]?.institution_id ?? null,
    memberships,
  };
}

export async function assertActorHasAnyRole(context: ServerAuthContext, allowedRoles: UserRole[]) {
  const actor = await getServerActorResolution(context);

  if (!allowedRoles.includes(actor.role)) {
    throw new ForbiddenError("Your account role is not allowed to access this endpoint.");
  }

  return actor;
}

export async function assertActorCanAccessInstitution(
  context: ServerAuthContext,
  institutionId: string,
  options: { requireStaff?: boolean } = {},
) {
  const actor = await getServerActorResolution(context);

  if (actor.role === "platform_admin") {
    return actor;
  }

  const membership = actor.memberships.find((item) => item.institution_id === institutionId);
  if (!membership) {
    throw new ForbiddenError("You are not a member of this institution.");
  }

  if (options.requireStaff && !["owner", "admin", "teacher"].includes(membership.role)) {
    throw new ForbiddenError("Institution staff access is required for this action.");
  }

  return actor;
}

export async function assertActorCanAccessLesson(
  context: ServerAuthContext,
  lessonId: string,
  options: { requireStaff?: boolean; allowEnrolledStudent?: boolean } = {},
) {
  if (!context.supabase) {
    if (isDemoModeAllowed()) {
      return { id: lessonId, course_id: null, institution_id: "demo-institution" };
    }

    throw new UnauthorizedError();
  }

  const actor = await getServerActorResolution(context);
  const { data: lesson, error } = await context.supabase
    .from("lessons")
    .select("id, course_id, institution_id")
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    throw new ForbiddenError(error?.message || "Lesson not found.");
  }

  if (actor.role === "platform_admin") {
    return lesson;
  }

  const membership = actor.memberships.find(
    (item) => item.institution_id === lesson.institution_id,
  );
  if (membership) {
    if (!options.requireStaff || ["owner", "admin", "teacher"].includes(membership.role)) {
      return lesson;
    }
  }

  if (options.requireStaff) {
    throw new ForbiddenError("Institution staff access is required for this lesson.");
  }

  if (options.allowEnrolledStudent !== false && lesson.course_id) {
    const { data: enrollment } = await context.supabase
      .from("course_enrollments")
      .select("id")
      .eq("course_id", lesson.course_id)
      .eq("student_id", context.userId)
      .maybeSingle();

    if (enrollment) {
      return lesson;
    }
  }

  throw new ForbiddenError("You do not have access to this lesson.");
}

export async function assertActorCanAccessSession(
  context: ServerAuthContext,
  sessionId: string,
  options: { requireModerator?: boolean } = {},
) {
  if (!context.supabase) {
    if (isDemoModeAllowed()) {
      return {
        id: sessionId,
        institution_id: "demo-institution",
        course_id: null,
        lesson_id: null,
        host_user_id: context.userId ?? "demo-user-0000",
      };
    }

    throw new UnauthorizedError();
  }

  const actor = await getServerActorResolution(context);
  const { data: session, error } = await context.supabase
    .from("classroom_sessions")
    .select("id, institution_id, course_id, lesson_id, host_user_id")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    throw new ForbiddenError(error?.message || "Session not found.");
  }

  const isPlatformAdmin = actor.role === "platform_admin";
  const isHost = session.host_user_id === context.userId;
  const institutionMembership = actor.memberships.find(
    (item) => item.institution_id === session.institution_id,
  );
  const isInstitutionStaff = Boolean(
    institutionMembership && ["owner", "admin", "teacher"].includes(institutionMembership.role),
  );

  if (options.requireModerator) {
    if (isPlatformAdmin || isHost || isInstitutionStaff) {
      return session;
    }

    throw new ForbiddenError("Only session hosts or institution staff can perform this action.");
  }

  if (isPlatformAdmin || isHost || isInstitutionStaff) {
    return session;
  }

  const { data: participant } = await context.supabase
    .from("session_participants")
    .select("id")
    .eq("session_id", sessionId)
    .eq("user_id", context.userId)
    .maybeSingle();

  if (participant) {
    return session;
  }

  if (session.course_id) {
    const { data: enrollment } = await context.supabase
      .from("course_enrollments")
      .select("id")
      .eq("course_id", session.course_id)
      .eq("student_id", context.userId)
      .maybeSingle();

    if (enrollment) {
      return session;
    }
  }

  throw new ForbiddenError("You do not have access to this classroom session.");
}
