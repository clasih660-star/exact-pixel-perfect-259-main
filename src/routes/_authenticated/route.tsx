import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { RoleResolution, UserRole } from "@/lib/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { requiresEmailVerification } from "@/lib/auth-verification";
import { getRoleResolution } from "@/lib/route-guards";
import { isDemoModeAllowed } from "@/lib/runtime-mode";
import { SecurityConfigurationError } from "@/lib/security-errors";
import { getStoredDemoRole, isBrowserDemoSessionActive } from "@/lib/demo-mode";

/** Demo roles available without Supabase. */
/**
 * Read the demo role from localStorage. Defaults to "student".
 * Users can switch via the auth page demo role selector.
 */
function getDemoRole(): UserRole {
  return getStoredDemoRole();
}

function demoRoleResolution(role: UserRole): RoleResolution {
  switch (role) {
    case "platform_admin":
      return {
        role,
        persona: "platform_admin",
        institutionId: null,
        teacherType: null,
        learnerType: null,
      };
    case "institution_admin":
      return {
        role,
        persona: "institution_admin",
        institutionId: "demo-institution",
        teacherType: null,
        learnerType: null,
      };
    case "teacher":
      return {
        role,
        persona: "institution_teacher",
        teacherType: "institution",
        learnerType: null,
        institutionId: "demo-institution",
      };
    case "parent":
      return { role, persona: "parent", institutionId: null, teacherType: null, learnerType: null };
    case "owner":
      return {
        role,
        persona: "institution_admin",
        institutionId: "demo-institution",
        teacherType: null,
        learnerType: null,
      };
    case "student":
    default:
      return {
        role: "student",
        persona: "institution_learner",
        learnerType: "institution",
        teacherType: null,
        institutionId: "demo-institution",
      };
  }
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (isBrowserDemoSessionActive()) {
      if (!isDemoModeAllowed()) {
        throw new SecurityConfigurationError("Demo auth is disabled in production.");
      }

      const role = getDemoRole();
      const resolution = demoRoleResolution(role);
      return {
        user: { id: "demo-user-0000", email: `demo.${role}@klassruum.com` },
        role: resolution.role,
        persona: resolution.persona,
        teacherType: resolution.teacherType ?? null,
        learnerType: resolution.learnerType ?? null,
        institutionId: resolution.institutionId ?? null,
      };
    }

    // ── Demo mode: Supabase not configured ───────────────────────────────
    // When credentials are missing or are placeholders, bypass all auth and
    // use the demo role from localStorage. The entire app runs as if the
    // user is logged in with the selected demo role.
    if (!isSupabaseConfigured()) {
      if (!isDemoModeAllowed()) {
        throw new SecurityConfigurationError(
          "Authentication is not configured for this production environment.",
        );
      }

      const role = getDemoRole();
      const resolution = demoRoleResolution(role);
      return {
        user: { id: "demo-user-0000", email: `demo@klassruum.com` },
        role: resolution.role,
        persona: resolution.persona,
        teacherType: resolution.teacherType ?? null,
        learnerType: resolution.learnerType ?? null,
        institutionId: resolution.institutionId ?? null,
      };
    }

    // ── Production: real Supabase auth ───────────────────────────────────
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        throw redirect({ to: "/auth" });
      }

      if (requiresEmailVerification(data.user)) {
        throw redirect({ to: "/auth/verify-email" });
      }

      const resolution = await getRoleResolution(data.user.id);

      if (!resolution?.role) {
        throw redirect({ to: "/auth/complete-profile" });
      }

      return {
        user: data.user,
        role: resolution.role,
        persona: resolution.persona,
        teacherType: resolution.teacherType ?? null,
        learnerType: resolution.learnerType ?? null,
        institutionId: resolution.institutionId ?? null,
      };
    } catch (err) {
      // Re-throw redirects
      if (err && typeof err === "object" && "to" in err) throw err;
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
