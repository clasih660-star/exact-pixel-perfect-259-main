/**
 * Route Guards for Klassruum
 *
 * Role-based access control for authenticated routes.
 * These functions are designed to be called in TanStack Router's `beforeLoad`.
 */
import { redirect } from "@tanstack/react-router";
import type { UserRole } from "./types";

type AuthContext = {
  user?: { id: string; email?: string } | null;
};

/**
 * Fetch user profile with role from Supabase.
 * Falls back to null in dev mode.
 */
async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as any)?.role as UserRole) ?? null;
  } catch {
    if (import.meta.env.DEV) return "student";
    return null;
  }
}

/**
 * Redirect unauthenticated users to /auth.
 * Returns the user context if authenticated.
 */
export async function requireAuth({ user }: AuthContext) {
  if (!user) {
    if (import.meta.env.DEV) return;
    throw redirect({ to: "/auth" });
  }
}

/**
 * Require that the authenticated user has one of the specified roles.
 * Redirects to the user's own dashboard if role doesn't match.
 */
export async function requireRole(
  { user }: AuthContext,
  roles: UserRole[]
) {
  await requireAuth({ user });

  if (import.meta.env.DEV && !user) return;

  const role = await getUserRole(user!.id);

  if (!role || !roles.includes(role)) {
    // Redirect to the user's own dashboard based on their actual role
    const dashboardPath = roleDashboardPath(role);
    throw redirect({ to: dashboardPath });
  }

  return { role };
}

/**
 * Require platform_admin role.
 */
export async function requirePlatformAdmin({ user }: AuthContext) {
  return requireRole({ user }, ["platform_admin"]);
}

/**
 * Require institution_admin role.
 */
export async function requireInstitutionAdmin({ user }: AuthContext) {
  return requireRole({ user }, ["institution_admin"]);
}

/**
 * Require teacher role.
 */
export async function requireTeacher({ user }: AuthContext) {
  return requireRole({ user }, ["teacher"]);
}

/**
 * Require student role.
 */
export async function requireStudent({ user }: AuthContext) {
  return requireRole({ user }, ["student"]);
}

/**
 * Require parent role.
 */
export async function requireParent({ user }: AuthContext) {
  return requireRole({ user }, ["parent"]);
}

/**
 * Require institution_admin or teacher (for shared management routes).
 */
export async function requireInstitutionStaff({ user }: AuthContext) {
  return requireRole({ user }, ["institution_admin", "teacher"]);
}

/**
 * Get the dashboard path for a given role.
 * Used for post-login redirect.
 */
export function roleDashboardPath(role?: UserRole | null): string {
  switch (role) {
    case "platform_admin":
      return "/admin/dashboard";
    case "institution_admin":
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
 */
export async function redirectByRole({ user }: AuthContext) {
  if (!user) {
    if (import.meta.env.DEV) return;
    throw redirect({ to: "/auth" });
  }

  const role = await getUserRole(user.id);
  const path = roleDashboardPath(role);
  throw redirect({ to: path });
}