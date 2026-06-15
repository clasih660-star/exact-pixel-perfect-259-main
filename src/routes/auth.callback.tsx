import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { acceptInstitutionInvite } from "@/lib/institution-invites.functions";
import { roleDashboardPath } from "@/lib/route-guards";
import type { UserRole } from "@/lib/types";
import { LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error" | "redirecting">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const acceptInviteFn = useServerFn(acceptInstitutionInvite);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      navigate({ to: "/auth" });
      return;
    }

    let cancelled = false;
    const inviteToken =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("invite") : null;

    async function handleCallback() {
      try {
        // Exchange the auth code for a session
        // Supabase automatically detects the code from the URL hash/query
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw new Error(error.message);
        }

        if (!data.session?.user) {
          // No session found — the code may be invalid or expired
          throw new Error(
            "No session found. The link may have expired. Please try signing in again.",
          );
        }

        const user = data.session.user;

        if (inviteToken) {
          const acceptedInvite = await acceptInviteFn({ data: { token: inviteToken } });
          if (cancelled) return;
          setStatus("redirecting");
          navigate({ to: roleDashboardPath(acceptedInvite.profile_role as UserRole) });
          return;
        }

        // Check if the user has a profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, role, full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (cancelled) return;

        if (profileError) {
          console.warn("[Auth Callback] Profile fetch error:", profileError.message);
        }

        if (!profile) {
          // New user — needs to complete their profile
          setStatus("redirecting");
          navigate({ to: "/auth/complete-profile" });
          return;
        }

        // Existing user — redirect to their dashboard
        const role = (profile.role as UserRole) ?? null;
        setStatus("redirecting");
        navigate({ to: roleDashboardPath(role) });
      } catch (err) {
        if (cancelled) return;
        const message = (err as Error).message || "Authentication failed.";
        setErrorMsg(message);
        setStatus("error");
        // Auto-redirect to auth page after 5 seconds
        setTimeout(() => {
          if (!cancelled) navigate({ to: "/auth" });
        }, 5000);
      }
    }

    handleCallback();

    return () => {
      cancelled = true;
    };
  }, [acceptInviteFn, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gray-50)]">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <LogoMark size={48} />
        </div>

        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#1F7C80] border-t-transparent" />
            <div>
              <h2 className="text-lg font-semibold text-[#1A3233]">Signing you in…</h2>
              <p className="mt-1 text-sm text-[#A3ADAD]">Verifying your credentials with Google.</p>
            </div>
          </div>
        )}

        {status === "redirecting" && (
          <div className="space-y-4">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#1F7C80] border-t-transparent" />
            <div>
              <h2 className="text-lg font-semibold text-[#1A3233]">Redirecting…</h2>
              <p className="mt-1 text-sm text-[#A3ADAD]">Taking you to your dashboard.</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1A3233]">Authentication failed</h2>
              <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
              <p className="mt-3 text-xs text-[#A3ADAD]">
                Redirecting to sign-in page in a few seconds…
              </p>
            </div>
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="mt-2 rounded-xl bg-[#1F7C80] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1A5256]"
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
