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
import type { UserRole } from "./types";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

type AuthContext = {
  user?: { id: string; email?: string } | null;
  /** Role stored in route context by _authenticated/route.tsx */
  role?: UserRole | null;
};

/**
 * Fetch user profile with role from Supabase.
 * Falls back to null in dev mode.
 */
async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as any)?.role as UserRole) ?? null;
  } catch {
    if (import.meta.env.DEV) return "student";
    return null;
  }
}

/**
 * Get the user's role, preferring the value already in route context
 * but falling back to a DB lookup when needed.
 */
async function resolveRole(
  userId: string,
  contextRole?: UserRole | null,
): Promise<UserRole | null> {
  if (contextRole) return contextRole;
  return getUserRole(userId);
}

/**
 * Redirect unauthenticated users to /auth.
 * Returns the user context if authenticated.
 */
export async function requireAuth({ user }: AuthContext) {
  // In demo mode or when Supabase isn't configured, always pass
  if (!isSupabaseConfigured() || import.meta.env.DEV) return;
  if (!user) {
    throw redirect({ to: "/auth" });
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
  if (!isSupabaseConfigured() || import.meta.env.DEV) {
    return { role: contextRole ?? "student" };
  }

  await requireAuth({ user });

  const role = await resolveRole(user!.id, contextRole);

  if (!role || !roles.includes(role)) {
    const dashboardPath = roleDashboardPath(role);
    throw redirect({ to: dashboardPath });
  }

  return { role };
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
  switch (role) {
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
    if (!isSupabaseConfigured() || import.meta.env.DEV) return;
    throw redirect({ to: "/auth" });
  }

  const role = await resolveRole(user.id, contextRole);
  const path = roleDashboardPath(role);
  throw redirect({ to: path });
}
