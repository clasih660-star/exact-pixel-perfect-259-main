import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
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
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{ background: "var(--gradient-brand)" }}
      >
        {/* Decorative overlay circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-white/5" />

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <Logo />
        </Link>
        <div className="relative z-10">
          <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight">
            Virtual classrooms for every learner.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
            AI-powered lessons that speak, write, explain, and adapt to each student's needs. Sign in to manage your institution, classrooms, and resources.
          </p>
          <div className="mt-8 flex gap-6">
            <div>
              <p className="text-2xl font-extrabold">10k+</p>
              <p className="mt-0.5 text-xs text-white/60">Active Learners</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">500+</p>
              <p className="mt-0.5 text-xs text-white/60">Institutions</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">98%</p>
              <p className="mt-0.5 text-xs text-white/60">Satisfaction</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} Klassruum. Built for every learner.
        </p>
      </div>

      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
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
            <Button variant="outline" className="w-full" type="button">
              Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
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
