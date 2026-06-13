import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { UserRole } from "@/lib/types";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

/** Demo roles available without Supabase. */
const DEMO_ROLES: UserRole[] = [
  "student",
  "teacher",
  "institution_admin",
  "platform_admin",
  "parent",
];

/**
 * Read the demo role from localStorage. Defaults to "student".
 * Users can switch via the auth page demo role selector.
 */
function getDemoRole(): UserRole {
  if (typeof window === "undefined") return "student";
  const stored = localStorage.getItem("klassruum_demo_role");
  if (stored && DEMO_ROLES.includes(stored as UserRole)) {
    return stored as UserRole;
  }
  return "student";
}

/**
 * Fetch the user's role from the profiles table.
 * Returns null in dev mode (when using demo user) or on error.
 */
async function fetchUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as any)?.role as UserRole) ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // ── Demo mode: Supabase not configured ───────────────────────────────
    // When credentials are missing or are placeholders, bypass all auth and
    // use the demo role from localStorage. The entire app runs as if the
    // user is logged in with the selected demo role.
    if (!isSupabaseConfigured()) {
      const role = getDemoRole();
      return {
        user: { id: "demo-user-0000", email: `demo@klassruum.com` },
        role,
      };
    }

    // ── Dev mode with real Supabase: quick bypass for local dev ──────────
    if (import.meta.env.DEV) {
      const role = getDemoRole();
      return {
        user: { id: "demo-user-0000", email: "demo@klassruum.com" },
        role,
      };
    }

    // ── Production: real Supabase auth ───────────────────────────────────
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        throw redirect({ to: "/auth" });
      }

      // Fetch the user's role from their profile
      const role = await fetchUserRole(data.user.id);

      return { user: data.user, role };
    } catch (err) {
      // Re-throw redirects
      if (err && typeof err === "object" && "to" in err) throw err;
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
