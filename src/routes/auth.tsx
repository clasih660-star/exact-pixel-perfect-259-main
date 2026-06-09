import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Klassruum" },
      { name: "description", content: "Sign in to your Klassruum institution or learner account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
      }
      toast.success("Welcome to Klassruum");
      navigate({ to: "/institution/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        {/* Real classroom photo */}
        <img
          src="/images/auth-side.png"
          alt="Students learning together with Klassruum"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        {/* Royal-blue overlay tuned for strong legibility */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,29,77,0.94) 0%, rgba(29,78,216,0.86) 45%, rgba(37,99,235,0.55) 100%)",
          }}
        />
        {/* Bottom scrim so the headline & stats stay crisp over the photo */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{ background: "linear-gradient(to top, rgba(8,18,54,0.85), transparent)" }}
        />
        {/* Decorative overlay circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/[0.08]" />

        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <LogoMark size={40} />
          <span className="text-2xl font-extrabold tracking-tight text-white">Klassruum</span>
        </Link>
        <div className="relative z-10">
          <h2 className="max-w-md text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            Virtual classrooms for every learner.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
            AI-powered lessons that speak, write, explain, and adapt to each student's needs. Sign in to manage your institution, classrooms, and resources.
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

      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          {/* Branded logo + name above the welcome text (both mobile and desktop) */}
          <Link to="/" className="mb-8 flex items-center gap-2.5">
            <LogoMark size={38} />
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              Klass<span className="text-[var(--primary)]">ruum</span>
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to your Klassruum account."
              : "Create a personal account, or register an institution."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full gap-2" type="button">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.2 7.9 3l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.2 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.9 35.8 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full gap-2" type="button">
              <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#7FBA00" d="M12 1h10v10H12z" />
                <path fill="#00A4EF" d="M1 12h10v10H1z" />
                <path fill="#FFB900" d="M12 12h10v10H12z" />
              </svg>
              Microsoft
            </Button>
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
            <Link to="/institutions/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
