import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerInstitution } from "@/lib/institutions-register.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/institutions/register")({
  head: () => ({
    meta: [
      { title: "Register your institution — Klassruum" },
      { name: "description", content: "Create your branded virtual classroom space on Klassruum." },
    ],
  }),
  component: RegisterPage,
});

const INSTITUTION_TYPES = [
  ["school", "School"],
  ["university", "University"],
  ["college", "College"],
  ["tuition_center", "Tuition Center"],
  ["online_tutor", "Online Tutor"],
  ["ngo", "NGO"],
  ["company_training", "Company Training"],
  ["religious_institution", "Religious Institution"],
  ["government_program", "Government Program"],
  ["other", "Other"],
] as const;

const USE_CASES = [
  ["ai_classroom", "AI classroom"],
  ["human_teacher_classroom", "Human teacher classroom"],
  ["hybrid_classroom", "Hybrid classroom"],
  ["training_program", "Training program"],
  ["exam_preparation", "Exam preparation"],
  ["accessibility_focused", "Accessibility-focused learning"],
] as const;

function RegisterPage() {
  const navigate = useNavigate();
  const fn = useServerFn(registerInstitution);

  const [form, setForm] = useState({
    institution_name: "",
    type: "school" as (typeof INSTITUTION_TYPES)[number][0],
    country: "",
    city: "",
    admin_full_name: "",
    admin_email: "",
    phone: "",
    password: "",
    learner_count: "",
    preferred_use_case: "ai_classroom" as (typeof USE_CASES)[number][0],
  });

  const mut = useMutation({
    mutationFn: async () => {
      await fn({
        data: {
          institution_name: form.institution_name,
          type: form.type,
          country: form.country,
          city: form.city,
          admin_full_name: form.admin_full_name,
          admin_email: form.admin_email,
          phone: form.phone,
          password: form.password,
          learner_count: form.learner_count ? Number(form.learner_count) : undefined,
          preferred_use_case: form.preferred_use_case,
        },
      });
      // Auto sign-in
      const { error } = await supabase.auth.signInWithPassword({
        email: form.admin_email,
        password: form.password,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Your institution is ready");
      navigate({ to: "/institution/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/">
            <Logo />
          </Link>
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
            Already have an account? Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Register your institution</h1>
        <p className="mt-2 text-muted-foreground">
          Create a branded virtual classroom space for your learners.
        </p>

        <form
          className="mt-10 space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Institution
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="iname">Institution name *</Label>
                <Input
                  id="iname"
                  required
                  maxLength={200}
                  value={form.institution_name}
                  onChange={(e) => setForm({ ...form, institution_name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Institution type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as typeof form.type })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTITUTION_TYPES.map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ilearners">Number of learners</Label>
                <Input
                  id="ilearners"
                  type="number"
                  min={0}
                  value={form.learner_count}
                  onChange={(e) => setForm({ ...form, learner_count: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="icountry">Country *</Label>
                <Input
                  id="icountry"
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="icity">City *</Label>
                <Input
                  id="icity"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Preferred use case</Label>
                <Select
                  value={form.preferred_use_case}
                  onValueChange={(v) =>
                    setForm({ ...form, preferred_use_case: v as typeof form.preferred_use_case })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USE_CASES.map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Admin account
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="aname">Full name *</Label>
                <Input
                  id="aname"
                  required
                  value={form.admin_full_name}
                  onChange={(e) => setForm({ ...form, admin_full_name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="aemail">Email *</Label>
                <Input
                  id="aemail"
                  type="email"
                  required
                  value={form.admin_email}
                  onChange={(e) => setForm({ ...form, admin_email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="aphone">Phone *</Label>
                <Input
                  id="aphone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="apass">Password *</Label>
                <Input
                  id="apass"
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link to="/">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              size="lg"
              disabled={mut.isPending}
              className="shadow-[var(--shadow-brand)]"
            >
              {mut.isPending ? "Creating…" : "Create institution"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
