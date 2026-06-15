/**
 * Hook to access the authenticated user's role from router context.
 *
 * The role is fetched once in `_authenticated/route.tsx` beforeLoad and
 * stored in the route context. All child routes can read it via this hook.
 */
import { useRouteContext, useRouter } from "@tanstack/react-router";
import type { UserRole } from "@/lib/types";
import { roleDashboardPath } from "@/lib/route-guards";

type AuthenticatedContext = {
  user: { id: string; email?: string } | null;
  role: UserRole | null;
};

/**
 * Returns the current user's role from the authenticated route context.
 * Falls back to `"student"` in dev mode when no real role is available.
 */
export function useUserRole(): UserRole {
  try {
    const { role } = useRouteContext({ from: "/_authenticated" }) as AuthenticatedContext;
    return role ?? "student";
  } catch {
    // Outside authenticated layout or context not yet loaded
    return "student";
  }
}

/**
 * Returns the full authenticated context (user + role).
 */
export function useAuthContext(): AuthenticatedContext {
  try {
    return useRouteContext({ from: "/_authenticated" }) as AuthenticatedContext;
  } catch {
    return { user: null, role: null };
  }
}

/**
 * Redirects to the dashboard matching the user's role.
 * Useful after login or profile completion.
 */
export function useRedirectToDashboard() {
  const router = useRouter();
  const role = useUserRole();

  return () => {
    const path = roleDashboardPath(role);
    router.navigate({ to: path });
  };
}

/**
 * Checks if the current user has one of the specified roles.
 */
export function useHasRole(...roles: UserRole[]): boolean {
  const currentRole = useUserRole();
  return roles.includes(currentRole);
}
