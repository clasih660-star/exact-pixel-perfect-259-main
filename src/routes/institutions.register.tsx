import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { registerInstitution } from "@/lib/institutions-register.functions";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/institutions/register")({
  head: () => ({
    meta: [
      { title: "Register Your Institution — Klassruum AI Virtual Classrooms" },
      {
        name: "description",
        content:
          "Register your school, university, tutoring center, or training provider on Klassruum. Create AI-powered virtual classrooms with an AI teacher, interactive whiteboard, captions, notes, transcripts, accessibility modes, and learner progress tracking.",
      },
      {
        name: "keywords",
        content:
          "register school, register institution, AI classroom setup, virtual classroom for schools, Klassruum registration",
      },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Register Your Institution — Klassruum" },
      {
        property: "og:description",
        content: "Create AI-powered virtual classrooms for your institution.",
      },
      { property: "og:url", content: `${SITE_URL}/institutions/register` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/institutions/register` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Register Your Institution on Klassruum",
          url: `${SITE_URL}/institutions/register`,
          description:
            "Register your school, university, tutoring center, or training provider on Klassruum to create AI-powered virtual classrooms.",
        }),
      },
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

const BENEFITS = [
  {
    icon: "🎓",
    title: "AI teacher-led lessons",
    body: "Virtual teacher delivers structured lessons with voice, captions, and real-time interaction.",
  },
  {
    icon: "📝",
    title: "Materials to lessons",
    body: "Upload PDFs, slides, and documents — AI generates ready-to-teach structured lessons.",
  },
  {
    icon: "♿",
    title: "Built-in accessibility",
    body: "Live captions, transcripts, learning modes for deaf, blind, ADHD, and more.",
  },
  {
    icon: "📊",
    title: "Progress tracking",
    body: "Track lessons started, questions asked, checkpoints reached, and areas needing review.",
  },
  {
    icon: "🔒",
    title: "Data control",
    body: "Institution-owned data with role-based access, encrypted storage, and audit logging.",
  },
  {
    icon: "🌍",
    title: "Works everywhere",
    body: "Browser-based, low-bandwidth friendly, runs on modest devices and patchy connections.",
  },
];

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
    <div className="flex min-h-screen">
      {/* Left panel — brand + benefits */}
      <div className="hidden lg:flex lg:w-[520px] xl:w-[580px] flex-col justify-between overflow-hidden bg-[#1A3233] p-10 relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F7C80]/25 via-transparent to-[#5F5B46]/15" />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #1F7C80 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={36} />
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
            Create your institution's AI-powered classroom.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#A3ADAD]">
            Register your school, university, tutoring center, or training provider. Start
            delivering structured, accessible, teacher-led lessons at scale.
          </p>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-xl border border-white/12 bg-[rgba(15,23,42,0.56)] p-4 shadow-[0_12px_28px_rgba(2,8,23,0.18)] backdrop-blur-xl">
                <div className="text-2xl">{b.icon}</div>
                <h3 className="mt-2 text-sm font-semibold text-white">{b.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">{b.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="relative z-10">
          <div className="h-1 w-16 rounded-full bg-[#1F7C80]" />
          <p className="mt-3 text-xs text-[#A3ADAD]">
            © {new Date().getFullYear()} Klassruum. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-start justify-center bg-white px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[560px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo size={32} />
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1A3233]">
              Register your institution
            </h2>
            <p className="mt-2 text-sm text-[#A3ADAD]">
              Create a branded virtual classroom space for your learners.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              mut.mutate();
            }}
          >
            {/* Institution section */}
            <section className="rounded-2xl border border-[#d1eceb] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#A3ADAD]">
                Institution details
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="iname" className="block text-sm font-medium text-[#1A3233]">
                    Institution name *
                  </label>
                  <input
                    id="iname"
                    required
                    maxLength={200}
                    value={form.institution_name}
                    onChange={(e) => setForm({ ...form, institution_name: e.target.value })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                    placeholder="e.g. Greenwood Academy"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#1A3233]">
                    Institution type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  >
                    {INSTITUTION_TYPES.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="ilearners" className="block text-sm font-medium text-[#1A3233]">
                    Number of learners
                  </label>
                  <input
                    id="ilearners"
                    type="number"
                    min={0}
                    value={form.learner_count}
                    onChange={(e) => setForm({ ...form, learner_count: e.target.value })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                    placeholder="e.g. 500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="icountry" className="block text-sm font-medium text-[#1A3233]">
                    Country *
                  </label>
                  <input
                    id="icountry"
                    required
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="icity" className="block text-sm font-medium text-[#1A3233]">
                    City *
                  </label>
                  <input
                    id="icity"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-sm font-medium text-[#1A3233]">
                    Preferred use case
                  </label>
                  <select
                    value={form.preferred_use_case}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        preferred_use_case: e.target.value as typeof form.preferred_use_case,
                      })
                    }
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  >
                    {USE_CASES.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Admin account section */}
            <section className="rounded-2xl border border-[#d1eceb] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#A3ADAD]">
                Admin account
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="aname" className="block text-sm font-medium text-[#1A3233]">
                    Full name *
                  </label>
                  <input
                    id="aname"
                    required
                    value={form.admin_full_name}
                    onChange={(e) => setForm({ ...form, admin_full_name: e.target.value })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="aemail" className="block text-sm font-medium text-[#1A3233]">
                    Email *
                  </label>
                  <input
                    id="aemail"
                    type="email"
                    required
                    value={form.admin_email}
                    onChange={(e) => setForm({ ...form, admin_email: e.target.value })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="aphone" className="block text-sm font-medium text-[#1A3233]">
                    Phone *
                  </label>
                  <input
                    id="aphone"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="apass" className="block text-sm font-medium text-[#1A3233]">
                    Password *
                  </label>
                  <input
                    id="apass"
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-[#d1eceb] bg-white px-4 py-3 text-sm text-[#1A3233] outline-none transition-all focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                    placeholder="At least 8 characters"
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center justify-between">
              <Link to="/" className="text-sm font-medium text-[#A3ADAD] hover:text-[#1A3233]">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={mut.isPending}
                className="rounded-xl bg-[#1F7C80] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1F7C80]/25 transition-all hover:bg-[#1A5256] hover:shadow-xl hover:shadow-[#1F7C80]/30 focus:outline-none focus:ring-2 focus:ring-[#1F7C80] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mut.isPending ? "Creating…" : "Create institution"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-[#A3ADAD]">
            Already have an account?{" "}
            <Link to="/auth" className="font-semibold text-[#1F7C80] hover:text-[#1A5256]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
