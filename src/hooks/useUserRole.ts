/**
 * Hook to access the authenticated user's role from router context.
 *
 * The role is fetched once in `_authenticated/route.tsx` beforeLoad and
 * stored in the route context. All child routes can read it via this hook.
 */
import { useRouteContext, useRouter } from "@tanstack/react-router";
import type { LearnerType, TeacherType, UserPersona, UserRole } from "@/lib/types";
import { resolveDashboardPath, roleDashboardPath } from "@/lib/route-guards";

type AuthenticatedContext = {
  user: { id: string; email?: string } | null;
  role: UserRole | null;
  persona?: UserPersona | null;
  teacherType?: TeacherType | null;
  learnerType?: LearnerType | null;
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
    return { user: null, role: null, persona: null, teacherType: null, learnerType: null };
  }
}

export function useUserPersona(): UserPersona {
  const { persona, role, teacherType, learnerType } = useAuthContext();

  if (persona) return persona;
  if (role === "teacher") {
    if (teacherType === "private") return "private_teacher";
    if (teacherType === "kingpin") return "kingpin_teacher";
    return "institution_teacher";
  }
  if (role === "student") {
    if (learnerType === "private") return "private_learner";
    if (learnerType === "teacher_enrolled") return "teacher_enrolled_learner";
    return "institution_learner";
  }
  if (role === "platform_admin") return "platform_admin";
  if (role === "institution_admin" || role === "owner") return "institution_admin";
  if (role === "parent") return "parent";
  return "institution_learner";
}

/**
 * Redirects to the dashboard matching the user's role.
 * Useful after login or profile completion.
 */
export function useRedirectToDashboard() {
  const router = useRouter();
  const { role, persona } = useAuthContext();

  return () => {
    const path = role
      ? resolveDashboardPath({ role, ...(persona ? { persona } : {}) })
      : roleDashboardPath(null);
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
