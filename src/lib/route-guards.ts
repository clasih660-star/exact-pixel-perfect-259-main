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
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { requiresEmailVerification } from "@/lib/auth-verification";

type AuthContext = {
  user?: { id: string; email?: string } | null;
  /** Role stored in route context by _authenticated/route.tsx */
  role?: UserRole | null;
};

type ProfileRecord = {
  role?: UserRole | null;
  teacher_type?: TeacherType | null;
  learner_type?: LearnerType | null;
  institution_id?: string | null;
};

function derivePersonaFromRole(profile: ProfileRecord): UserPersona {
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
        default:
          return "institution_teacher";
      }
    case "student":
      switch (profile.learner_type) {
        case "private":
          return "private_learner";
        case "teacher_enrolled":
          return "teacher_enrolled_learner";
        case "institution":
        default:
          return "institution_learner";
      }
    case "parent":
      return "parent";
    default:
      return "institution_learner";
  }
}

function toRoleResolution(profile: ProfileRecord): RoleResolution | null {
  if (!profile.role) return null;
  return {
    role: profile.role,
    persona: derivePersonaFromRole(profile),
    teacherType: profile.teacher_type ?? null,
    learnerType: profile.learner_type ?? null,
    institutionId: profile.institution_id ?? null,
  };
}

/**
 * Fetch user profile with role/persona fields from Supabase.
 * Falls back to a default learner resolution in dev mode.
 */
async function getRoleResolution(userId: string): Promise<RoleResolution | null> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase
      .from("profiles")
      .select("role, teacher_type, learner_type, institution_id")
      .eq("id", userId)
      .single();

    return toRoleResolution((data as ProfileRecord | null) ?? {});
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
  contextRole?: UserRole | null,
): Promise<RoleResolution | null> {
  if (contextRole) {
    return toRoleResolution({ role: contextRole });
  }
  return getRoleResolution(userId);
}

/**
 * Redirect unauthenticated users to /auth.
 * Returns the user context if authenticated.
 */
export async function requireAuth({ user }: AuthContext) {
  // In demo mode or when Supabase isn't configured, always pass
  if (!isSupabaseConfigured()) return;
  if (!user) {
    throw redirect({ to: "/auth" });
  }

  if (requiresEmailVerification(user as Parameters<typeof requiresEmailVerification>[0])) {
    throw redirect({ to: "/auth/verify-email" });
  }
}

/**
 * Require that the authenticated user has one of the specified roles.
 * Redirects to the user's own dashboard if role doesn't match.
 *
 * In demo mode, all role checks pass (the user can explore any dashboard).
 */
export async function requireRole({ user, role: contextRole }: AuthContext, roles: UserRole[]) {
  // In demo mode, all role checks pass
  if (!isSupabaseConfigured()) {
    return {
      role: contextRole ?? "student",
      persona: contextRole === "teacher" ? "institution_teacher" : "institution_learner",
    };
  }

  await requireAuth({ user });

  const resolution = await resolveRoleResolution(user!.id, contextRole);
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
  return requireRole(ctx, ["institution_admin", "owner"]);
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
  return requireRole(ctx, ["institution_admin", "owner", "teacher"]);
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
    if (!isSupabaseConfigured()) return;
    throw redirect({ to: "/auth" });
  }

  const resolution = await resolveRoleResolution(user.id, contextRole);
  const path = resolveDashboardPath(resolution);
  throw redirect({ to: path });
}
