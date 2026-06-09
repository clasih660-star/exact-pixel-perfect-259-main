import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        // In dev mode, allow bypass - return demo user
        if (import.meta.env.DEV) {
          return { user: { id: "demo-user-123", email: "demo@klassruum.com" } };
        }
        throw redirect({ to: "/auth" });
      }
      return { user: data.user };
    } catch (err) {
      // If Supabase client fails in dev, allow bypass with demo user
      if (import.meta.env.DEV) {
        return { user: { id: "demo-user-123", email: "demo@klassruum.com" } };
      }
      // Re-throw redirects
      if (err && typeof err === "object" && "to" in err) throw err;
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});