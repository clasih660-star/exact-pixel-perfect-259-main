import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { resolvePostAuthPath } from "@/lib/auth-redirects";
import {
  clearPendingVerification,
  getAuthCallbackUrl,
  rememberPendingVerification,
  requiresEmailVerification,
} from "@/lib/auth-verification";
import { beginGoogleOAuth } from "@/lib/google-oauth.functions";
import { acceptInstitutionInvite } from "@/lib/institution-invites.functions";
import { redirectAuthenticatedUsers, roleDashboardPath } from "@/lib/route-guards";
import { setDemoSessionRole } from "@/lib/demo-mode";
import { isDemoModeAllowed } from "@/lib/runtime-mode";
import type { UserRole } from "@/lib/types";
import { GraduationCap, School, Building2, Shield, Users, Play } from "lucide-react";

/** Google OAuth sign-in — redirects to Google consent screen. */
async function signInWithGoogle(getRedirectTo: (inviteToken?: string | null) => Promise<string>) {
  const inviteToken =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("invite")
      : null;
  const redirectTo = await getRedirectTo(inviteToken);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });
  if (error) {
    toast.error(error.message);
  }
}

export const Route = createFileRoute("/auth")({
  beforeLoad: () => redirectAuthenticatedUsers(),
  head: () => ({
    meta: [
      { title: "Sign in — Klassruum" },
      { name: "description", content: "Sign in to your Klassruum institution or learner account." },
    ],
  }),
  component: AuthPage,
});

const DEMO_ROLES: Array<{
  role: UserRole;
  label: string;
  description: string;
  icon: typeof GraduationCap;
  color: string;
}> = [
  {
    role: "student",
    label: "Student",
    description: "Enter classrooms, take lessons, track progress",
    icon: GraduationCap,
    color: "bg-[#10233f]",
  },
  {
    role: "teacher",
    label: "Teacher",
    description: "Manage courses, create lessons, monitor students",
    icon: School,
    color: "bg-[#10233f]",
  },
  {
    role: "institution_admin",
    label: "Institution Admin",
    description: "Manage programmes, teachers, students, billing",
    icon: Building2,
    color: "bg-[#7C3AED]",
  },
  {
    role: "platform_admin",
    label: "Platform Admin",
    description: "Full platform control, institutions, AI settings",
    icon: Shield,
    color: "bg-[#DC2626]",
  },
  {
    role: "parent",
    label: "Parent",
    description: "Monitor learner progress, sessions, reports",
    icon: Users,
    color: "bg-[#F59E0B]",
  },
];

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const supabaseReady = isSupabaseConfigured();
  const demoModeAllowed = isDemoModeAllowed();
  const acceptInviteFn = useServerFn(acceptInstitutionInvite);
  const googleOAuthFn = useServerFn(beginGoogleOAuth);
  const inviteToken =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("invite")
      : null;

  const acceptPendingInviteIfPresent = async () => {
    if (!inviteToken) return null;
    const result = await acceptInviteFn({ data: { token: inviteToken } });
    toast.success("Institution invite accepted.");
    return result;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseReady) {
      toast.error("Supabase is not configured. Use the demo mode buttons below.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (requiresEmailVerification(data.user)) {
          rememberPendingVerification(data.user.email ?? email, inviteToken);
          await supabase.auth.signOut();
          toast.error("Please verify your email before signing in.");
          navigate({ to: "/auth/verify-email" });
          return;
        }

        const acceptedInvite = await acceptPendingInviteIfPresent();
        clearPendingVerification();
        toast.success("Welcome to Klassruum");
        if (acceptedInvite?.profile_role) {
          navigate({ to: roleDashboardPath(acceptedInvite.profile_role as UserRole) });
          return;
        }
        navigate({ to: await resolvePostAuthPath(data.user.id) });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getAuthCallbackUrl(inviteToken),
            data: { full_name: name.trim() },
          },
        });
        if (error) throw error;
        rememberPendingVerification(email, inviteToken);
        toast.success(
          inviteToken
            ? "Account created. Verify your email first, then your invite will be completed after confirmation."
            : "Account created. Check your email to verify your account.",
        );
        navigate({ to: "/auth/verify-email" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  /** Enter demo mode with the selected role. */
  const enterDemo = (role: UserRole) => {
    if (!demoModeAllowed) {
      toast.error("Demo mode is not available in production.");
      return;
    }

    setDemoSessionRole(role);
    toast.success(`Opening ${role.replace("_", " ")} demo.`);
    navigate({ to: roleDashboardPath(role) });
  };

  return (
    <div className="auth-tech-page grid min-h-screen lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="auth-tech-brand relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <img
          src="/images/auth-side.png"
          alt="Students learning together with Klassruum"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(3,7,18,0.94) 0%, rgba(7,17,31,0.9) 55%, rgba(16,35,63,0.82) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{ background: "linear-gradient(to top, rgba(10,24,38,0.88), transparent)" }}
        />

        <Link to="/" className="relative z-10 flex items-center">
          <Logo size={40} variant="light" />
        </Link>
        <div className="relative z-10">
          <h2 className="max-w-md text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            Virtual classrooms for every learner.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
            AI-powered lessons that speak, write, explain, and adapt to each student's needs. Sign
            in to manage your institution, classrooms, and resources.
          </p>
          <div className="mt-10 flex items-center gap-8">
            <div>
              <p className="text-3xl font-extrabold">10k+</p>
              <p className="mt-0.5 text-xs font-semibold text-white/85">Active Learners</p>
            </div>
            <div className="h-10 w-px bg-white/25" />
            <div>
              <p className="text-3xl font-extrabold">500+</p>
              <p className="mt-0.5 text-xs font-semibold text-white/85">Institutions</p>
            </div>
            <div className="h-10 w-px bg-white/25" />
            <div>
              <p className="text-3xl font-extrabold">98%</p>
              <p className="mt-0.5 text-xs font-semibold text-white/85">Satisfaction</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} Klassruum. Built for every learner.
        </p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex items-center justify-center p-6 sm:p-8">
        <div className="auth-tech-panel w-full max-w-md p-6 sm:p-8">
          <Link to="/" className="mb-8 flex items-center">
            <Logo size={38} />
          </Link>

          {/* ── Demo mode banner ──────────────────────────────────────── */}
          {!supabaseReady && demoModeAllowed && (
            <div className="mb-6 rounded-xl border border-border bg-soft-blue p-4">
              <p className="text-sm font-semibold text-heading">Demo Mode</p>
              <p className="mt-1 text-xs text-[#475569]">
                Supabase is not configured. Pick a role below to explore the full app with demo
                data.
              </p>
            </div>
          )}

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to your Klassruum account."
              : "Create a personal account, or register an institution."}
          </p>

          {/* ── Demo role picker ──────────────────────────────────────── */}
          {demoModeAllowed && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                {supabaseReady ? "Quick demo" : "Choose your role"}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {DEMO_ROLES.map(({ role, label, description, icon: Icon, color }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => enterDemo(role)}
                    className="auth-role-button group flex items-center gap-3 p-3 text-left transition-all"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color} text-white`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-heading">{label}</p>
                      <p className="truncate text-xs text-muted">{description}</p>
                    </div>
                    <Play className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-heading" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Divider ───────────────────────────────────────────────── */}
          {supabaseReady && (
            <>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or sign in with email</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* ── Auth form ───────────────────────────────────────────── */}
              <form className="mt-4 space-y-4" onSubmit={submit}>
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "signin" && (
                      <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
                        Forgot password?
                      </span>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>

              {/* ── Google OAuth ──────────────────────────────────────── */}
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    signInWithGoogle(async (currentInviteToken) => {
                      const result = await googleOAuthFn({
                        data: { inviteToken: currentInviteToken ?? undefined },
                      });
                      return result.redirectTo;
                    })
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#1A3233] transition-all hover:bg-[#f8fafb] hover:border-[#A3ADAD]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signin" ? "New to Klassruum?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                >
                  {mode === "signin" ? "Create one" : "Sign in"}
                </button>
              </p>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Running an institution?{" "}
                <Link
                  to="/institutions/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Register here
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
