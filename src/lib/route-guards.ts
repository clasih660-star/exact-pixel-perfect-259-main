/**
 * Route Guards for Klassruum
 *
 * Role-based access control for authenticated routes.
 * These functions are designed to be called in TanStack Router's `beforeLoad`.
 *
 * The role is fetched once in `_authenticated/route.tsx` and stored in route
 * context. Guards can read it from context or fall back to DB lookup.
 *
 * In demo mode (Supabase not configured), all guards pass silently.
 */
import { redirect, type RouteContext } from "@tanstack/react-router";
import type { LearnerType, RoleResolution, TeacherType, UserPersona, UserRole } from "./types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { requiresEmailVerification } from "@/lib/auth-verification";
import { isDemoModeAllowed } from "@/lib/runtime-mode";
import { SecurityConfigurationError } from "@/lib/security-errors";
import { getStoredDemoRole, isBrowserDemoSessionActive } from "@/lib/demo-mode";

type AuthContext = {
  user?: { id: string; email?: string } | null;
  /** Role stored in route context by _authenticated/route.tsx */
  role?: UserRole | null;
  persona?: UserPersona | null;
  teacherType?: TeacherType | null;
  learnerType?: LearnerType | null;
  institutionId?: string | null;
};

type ProfileRecord = {
  role?: UserRole | null;
  teacher_type?: TeacherType | null;
  learner_type?: LearnerType | null;
  institution_id?: string | null;
};

type MembershipRecord = {
  institution_id?: string | null;
  role?: "owner" | "admin" | "teacher" | "student" | null;
};

function isActiveDemoContext(user?: AuthContext["user"]) {
  return isBrowserDemoSessionActive() || user?.id === "demo-user-0000";
}

function demoRoleResolutionFromContext({
  role: contextRole,
  persona,
  teacherType,
  learnerType,
  institutionId,
}: AuthContext): RoleResolution {
  return {
    role: contextRole ?? "student",
    persona:
      persona ??
      (contextRole === "teacher"
        ? "institution_teacher"
        : contextRole === "platform_admin"
          ? "platform_admin"
          : contextRole === "institution_admin" || contextRole === "owner"
            ? "institution_admin"
            : contextRole === "parent"
              ? "parent"
              : "institution_learner"),
    teacherType: teacherType ?? (contextRole === "teacher" ? "institution" : null),
    learnerType: learnerType ?? (contextRole === "student" ? "institution" : null),
    institutionId:
      institutionId ??
      (contextRole === "institution_admin" ||
      contextRole === "owner" ||
      contextRole === "teacher" ||
      contextRole === "student"
        ? "demo-institution"
        : null),
  };
}

function derivePersonaFromRole(
  profile: ProfileRecord,
  membership?: MembershipRecord | null,
): UserPersona {
  switch (profile.role) {
    case "platform_admin":
      return "platform_admin";
    case "institution_admin":
    case "owner":
      return "institution_admin";
    case "teacher":
      switch (profile.teacher_type) {
        case "private":
          return "private_teacher";
        case "kingpin":
          return "kingpin_teacher";
        case "institution":
          return "institution_teacher";
        default:
          return membership?.role === "teacher" ? "institution_teacher" : "private_teacher";
      }
    case "student":
      switch (profile.learner_type) {
        case "private":
          return "private_learner";
        case "teacher_enrolled":
          return "teacher_enrolled_learner";
        case "institution":
          return "institution_learner";
        default:
          return membership?.role === "student" ? "institution_learner" : "private_learner";
      }
    case "parent":
      return "parent";
    default:
      return "institution_learner";
  }
}

function toRoleResolution(
  profile: ProfileRecord,
  membership?: MembershipRecord | null,
): RoleResolution | null {
  if (!profile.role) return null;

  const persona = derivePersonaFromRole(profile, membership);
  const institutionId = profile.institution_id ?? membership?.institution_id ?? null;

  return {
    role: profile.role,
    persona,
    teacherType:
      profile.teacher_type ??
      (profile.role === "teacher"
        ? persona === "institution_teacher"
          ? "institution"
          : persona === "kingpin_teacher"
            ? "kingpin"
            : "private"
        : null),
    learnerType:
      profile.learner_type ??
      (profile.role === "student"
        ? persona === "institution_learner"
          ? "institution"
          : persona === "teacher_enrolled_learner"
            ? "teacher_enrolled"
            : "private"
        : null),
    institutionId,
  };
}

async function getActiveInstitutionMembership(userId: string): Promise<MembershipRecord | null> {
  try {
    const { data } = await supabase
      .from("institution_members")
      .select("institution_id, role")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1);

    return ((data as MembershipRecord[] | null)?.[0] ?? null) as MembershipRecord | null;
  } catch {
    return null;
  }
}

/**
 * Fetch user profile with role/persona fields from Supabase.
 * Falls back to a default learner resolution in dev mode.
 */
export async function getRoleResolution(userId: string): Promise<RoleResolution | null> {
  try {
    const [{ data: profileData }, membership] = await Promise.all([
      supabase
        .from("profiles")
        .select("role, teacher_type, learner_type, institution_id")
        .eq("id", userId)
        .single(),
      getActiveInstitutionMembership(userId),
    ]);

    return toRoleResolution((profileData as ProfileRecord | null) ?? {}, membership);
  } catch {
    if (import.meta.env.DEV) {
      return {
        role: "student",
        persona: "institution_learner",
        learnerType: "institution",
        teacherType: null,
        institutionId: null,
      };
    }
    return null;
  }
}

/**
 * Get the user's role resolution, preferring the value already in route context
 * but falling back to a DB lookup when needed.
 */
async function resolveRoleResolution(
  userId: string,
  context?: AuthContext,
): Promise<RoleResolution | null> {
  if (context?.role && context.persona) {
    return {
      role: context.role,
      persona: context.persona,
      teacherType: context.teacherType ?? null,
      learnerType: context.learnerType ?? null,
      institutionId: context.institutionId ?? null,
    };
  }

  return getRoleResolution(userId);
}

/**
 * Redirect unauthenticated users to /auth.
 * Returns the user context if authenticated.
 */
export async function requireAuth({ user }: AuthContext) {
  if (isActiveDemoContext(user)) {
    if (isDemoModeAllowed()) return;
    throw new SecurityConfigurationError("Demo auth is disabled in production.");
  }

  // In demo mode or when Supabase isn't configured, always pass
  if (!isSupabaseConfigured()) {
    if (isDemoModeAllowed()) return;
    throw new SecurityConfigurationError("Authentication is not configured for this environment.");
  }
  if (!user) {
    throw redirect({ to: "/auth" });
  }

  if (
    requiresEmailVerification(user as unknown as Parameters<typeof requiresEmailVerification>[0])
  ) {
    throw redirect({ to: "/auth/verify-email" });
  }
}

/**
 * Require that the authenticated user has one of the specified roles.
 * Redirects to the user's own dashboard if role doesn't match.
 *
 * In demo mode, all role checks pass (the user can explore any dashboard).
 */
export async function requireRole(ctx: AuthContext, roles: UserRole[]) {
  const { user, role: contextRole, persona, teacherType, learnerType, institutionId } = ctx;

  if (isActiveDemoContext(user)) {
    if (!isDemoModeAllowed()) {
      throw new SecurityConfigurationError("Demo authorization is disabled in production.");
    }

    const resolution = demoRoleResolutionFromContext(ctx);
    if (!roles.includes(resolution.role)) {
      throw redirect({ to: roleDashboardPath(resolution.role) });
    }
    return resolution;
  }

  if (!isSupabaseConfigured()) {
    if (!isDemoModeAllowed()) {
      throw new SecurityConfigurationError(
        "Authorization cannot run without Supabase in production.",
      );
    }

    const resolution: RoleResolution = {
      role: contextRole ?? "student",
      persona:
        persona ??
        (contextRole === "teacher"
          ? "institution_teacher"
          : contextRole === "platform_admin"
            ? "platform_admin"
            : contextRole === "institution_admin" || contextRole === "owner"
              ? "institution_admin"
              : contextRole === "parent"
                ? "parent"
                : "institution_learner"),
      teacherType: teacherType ?? (contextRole === "teacher" ? "institution" : null),
      learnerType: learnerType ?? (contextRole === "student" ? "institution" : null),
      institutionId:
        institutionId ??
        (contextRole === "institution_admin" ||
        contextRole === "owner" ||
        contextRole === "teacher" ||
        contextRole === "student"
          ? "demo-institution"
          : null),
    };
    if (!roles.includes(resolution.role)) {
      throw redirect({ to: roleDashboardPath(resolution.role) });
    }
    return resolution;
  }

  await requireAuth({ user });

  const resolution = await resolveRoleResolution(user!.id, {
    user,
    role: contextRole,
    persona,
    teacherType,
    learnerType,
    institutionId,
  });
  const role = resolution?.role ?? null;

  if (!role || !roles.includes(role)) {
    const dashboardPath = roleDashboardPath(role);
    throw redirect({ to: dashboardPath });
  }

  return resolution;
}

/**
 * Require platform_admin role.
 */
export async function requirePlatformAdmin(ctx: AuthContext) {
  return requireRole(ctx, ["platform_admin"]);
}

/**
 * Require institution_admin role.
 */
export async function requireInstitutionAdmin(ctx: AuthContext) {
  const resolution = await requireRole(ctx, ["institution_admin", "owner"]);

  if (!resolution?.institutionId) {
    throw redirect({ to: roleDashboardPath(resolution?.role ?? null) });
  }

  return resolution;
}

/**
 * Require owner role.
 */
export async function requireOwner(ctx: AuthContext) {
  return requireRole(ctx, ["owner"]);
}

/**
 * Require teacher role.
 */
export async function requireTeacher(ctx: AuthContext) {
  return requireRole(ctx, ["teacher"]);
}

/**
 * Require student role.
 */
export async function requireStudent(ctx: AuthContext) {
  return requireRole(ctx, ["student"]);
}

/**
 * Require parent role.
 */
export async function requireParent(ctx: AuthContext) {
  return requireRole(ctx, ["parent"]);
}

/**
 * Require institution_admin or teacher (for shared management routes).
 */
export async function requireInstitutionStaff(ctx: AuthContext) {
  const resolution = await requireRole(ctx, ["institution_admin", "owner", "teacher"]);

  if (!resolution) return resolution;

  const hasInstitutionScope =
    resolution.role === "institution_admin" || resolution.role === "owner"
      ? Boolean(resolution.institutionId)
      : resolution.role === "teacher"
        ? resolution.persona === "institution_teacher" && Boolean(resolution.institutionId)
        : false;

  if (!hasInstitutionScope) {
    throw redirect({ to: roleDashboardPath(resolution.role) });
  }

  return resolution;
}

/**
 * Get the dashboard path for a given role.
 * Used for post-login redirect.
 */
export function roleDashboardPath(role?: UserRole | null): string {
  return role ? resolveDashboardPath({ role }) : "/student/dashboard";
}

export function resolveDashboardPath(
  resolution?: { role?: UserRole | null; persona?: UserPersona | null } | null,
): string {
  switch (resolution?.role) {
    case "platform_admin":
      return "/admin/dashboard";
    case "institution_admin":
    case "owner":
      return "/institution/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/student/dashboard";
    case "parent":
      return "/parent/dashboard";
    default:
      return "/student/dashboard";
  }
}

/**
 * Determine the user's role and redirect to the appropriate dashboard.
 * Called from the root authenticated layout.
 *
 * Accepts an optional `contextRole` to avoid a redundant DB call.
 */
export async function redirectByRole({ user, role: contextRole }: AuthContext) {
  if (!user) {
    if (!isSupabaseConfigured()) {
      if (isDemoModeAllowed()) return;
      throw new SecurityConfigurationError(
        "Authentication is not configured for this environment.",
      );
    }
    throw redirect({ to: "/auth" });
  }

  const resolution = await resolveRoleResolution(user.id, { user, role: contextRole });
  const path = resolveDashboardPath(resolution);
  throw redirect({ to: path });
}

/**
 * Guard public route files that still open protected product surfaces outside
 * the `_authenticated` route tree, such as direct classroom/session URLs.
 */
export async function requireClientAuthRoute() {
  if (isBrowserDemoSessionActive()) {
    if (isDemoModeAllowed()) return;
    throw new SecurityConfigurationError("Demo auth is disabled in production.");
  }

  if (!isSupabaseConfigured()) {
    if (isDemoModeAllowed()) return;
    throw new SecurityConfigurationError("Authentication is not configured for this environment.");
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw redirect({ to: "/auth" });
  }

  if (
    requiresEmailVerification(data.user as unknown as Parameters<typeof requiresEmailVerification>[0])
  ) {
    throw redirect({ to: "/auth/verify-email" });
  }

  return data.user;
}

export async function requireClientRoleRoute(roles: UserRole[]) {
  const user = await requireClientAuthRoute();
  if (!user || user.id === "demo-user-0000") {
    const resolution = demoRoleResolutionFromContext({
      user: user ?? { id: "demo-user-0000" },
      role: getStoredDemoRole(),
    });
    if (!roles.includes(resolution.role)) {
      throw redirect({ to: roleDashboardPath(resolution.role) });
    }
    return resolution;
  }

  const resolution = await getRoleResolution(user.id);
  if (!resolution?.role) {
    throw redirect({ to: "/auth/complete-profile" });
  }
  if (!roles.includes(resolution.role)) {
    throw redirect({ to: roleDashboardPath(resolution.role) });
  }
  return resolution;
}

export async function redirectAuthenticatedUsers() {
  if (!isSupabaseConfigured()) return;

  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  if (
    requiresEmailVerification(data.user as unknown as Parameters<typeof requiresEmailVerification>[0])
  ) {
    throw redirect({ to: "/auth/verify-email" });
  }

  const resolution = await getRoleResolution(data.user.id);
  if (!resolution?.role) {
    throw redirect({ to: "/auth/complete-profile" });
  }

  throw redirect({ to: resolveDashboardPath(resolution) });
}
