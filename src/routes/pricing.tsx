import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, ArrowRight, Sparkles, Building2, ChevronDown } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import "@/styles/landing.css";
import { LogoMark } from "@/components/brand/Logo";
import { CTAButton } from "@/components/landing/primitives";
import { CinematicCursor } from "@/components/landing/CinematicCursor";
import { InteractionLayer } from "@/components/landing/InteractionLayer";
import { createSeoHead, faqSchema, webPageSchema } from "@/lib/seo";
import { useState } from "react";

const DESCRIPTION =
  "Simple, transparent Klassruum pricing for AI virtual classrooms. Start with a free demo and scale to institution plans for schools, universities, training providers, tutoring centres, and NGOs.";

const PRICING_FAQ = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes. The Starter plan lets you explore the full demo classroom with no account required. It includes an AI teacher-led lesson, captions, transcripts, and accessibility modes.",
  },
  {
    question: "How are institutional plans priced?",
    answer:
      "School and Enterprise plans are priced per institution per year, based on implementation needs, usage, support level, integrations, onboarding, and governance requirements.",
  },
  {
    question: "Are there per-learner charges?",
    answer:
      "Klassruum is designed for institutional scale. Plans can include unlimited teachers and learners so schools and organisations can focus on rollout instead of seat counting.",
  },
  {
    question: "Do you offer discounts for NGOs?",
    answer:
      "Yes. We offer mission-aligned pricing for non-profit organizations and humanitarian programmes. Contact us to discuss your deployment context.",
  },
  {
    question: "Can I try before I commit?",
    answer:
      "Absolutely. The demo classroom is always free. For institutional plans, contact us for a guided walkthrough and pilot programme.",
  },
];

export const Route = createFileRoute("/pricing")({
  head: () =>
    createSeoHead({
      title: "Pricing — AI Virtual Classroom Plans for Institutions | Klassruum",
      description: DESCRIPTION,
      path: "/pricing",
      keywords:
        "Klassruum pricing, AI classroom pricing, virtual classroom platform cost, school AI platform pricing, accessible learning platform pricing, institution LMS alternative pricing",
      jsonLd: [webPageSchema("Klassruum Pricing", "/pricing", DESCRIPTION), faqSchema(PRICING_FAQ)],
    }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "to explore",
    description: "Explore the full demo classroom with no setup required.",
    accent: "from-[#1A3233] to-[#1F7C80]",
    features: [
      "Full demo classroom",
      "AI teacher-led lesson",
      "Captions & transcript",
      "Accessibility modes",
      "No account required",
    ],
    cta: { label: "Try Demo Classroom", to: "/demo/classroom" },
    highlighted: false,
  },
  {
    name: "School",
    price: "Custom",
    period: "per institution / year",
    description: "For schools ready to deploy AI classrooms across classes and cohorts.",
    accent: "from-[#1F7C80] to-[#3fa8ab]",
    features: [
      "Unlimited teachers & learners",
      "Course & lesson management",
      "Curriculum-aligned content",
      "Institution dashboard",
      "Progress tracking & reports",
      "Priority support",
      "Data export",
      "Dedicated onboarding",
    ],
    cta: { label: "Register Your School", to: "/institutions/register" },
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per institution / year",
    description: "For universities, training providers, and large organizations.",
    accent: "from-[#6366f1] to-[#8b5cf6]",
    features: [
      "Everything in School",
      "Custom branding",
      "SSO & advanced security",
      "API & integrations",
      "Dedicated account manager",
      "SLA & compliance",
      "Custom retention policies",
      "Priority feature requests",
    ],
    cta: { label: "Contact Sales", to: "/contact" },
    highlighted: false,
  },
];

function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbfc_0%,#ffffff_20%,#f7fbfc_58%,#eef6f7_100%)] text-[#0F172A] antialiased">
      <CinematicCursor />
      <InteractionLayer />

      {/* Premium Header — matches landing page style */}
      <header className="sticky top-0 z-50 border-b border-[#DCE7EC] bg-[rgba(255,255,255,0.84)] backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.9),0_20px_60px_rgba(15,23,42,0.10)]">
        <div className="mx-auto flex h-[72px] w-[98%] max-w-[1760px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="group flex items-center gap-3 outline-none" aria-label="Klassruum home">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-2 rounded-xl bg-[#1F7C80]/0 transition-all duration-300 group-hover:bg-[#1F7C80]/12" />
              <LogoMark size={34} className="relative" />
            </div>
            <span className="text-[17px] font-extrabold tracking-tight text-[#0F172A]">
              Klass<span className="text-[#3fa8ab]">ruum</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-white hover:text-[#0F172A] sm:inline-flex">
              Home
            </Link>
            <Link to="/demo/classroom" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-white hover:text-[#0F172A] sm:inline-flex">
              Demo
            </Link>
            <Link
              to="/auth"
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-white hover:text-[#0F172A]"
            >
              Sign in
            </Link>
            <CTAButton
              to="/institutions/register"
              variant="primary"
              size="md"
              showArrow
            >
              Get started
            </CTAButton>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] pb-24 pt-24">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_20%_0%,rgba(31,124,128,0.12),transparent_60%),radial-gradient(ellipse_50%_50%_at_85%_20%,rgba(99,102,241,0.10),transparent_55%)]" aria-hidden />
        <div className="lp-grid-glow absolute inset-x-0 top-0 h-[520px] opacity-50" aria-hidden />
        <div className="relative mx-auto w-[98%] max-w-[1760px] px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1F7C80]/30 bg-[#1F7C80]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#3fa8ab]">
            <Sparkles className="h-3.5 w-3.5" />
            Pricing Plans
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-[42px] font-extrabold tracking-[-0.045em] text-[#0F172A] sm:text-[54px] lg:text-[68px]">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-slate-600">
            Start with a free demo. Institutional plans scale with your needs — no hidden fees, no per-learner charges.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["No credit card to try", "GDPR-compliant", "WCAG accessibility built-in"].map((s) => (
              <span key={s} className="inline-flex items-center gap-2 rounded-full border border-[#D8E2E8] bg-white/88 px-3.5 py-1.5 text-sm font-medium text-slate-700 backdrop-blur-xl shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3fa8ab]" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto w-[98%] max-w-[1760px] px-5 py-20 sm:px-8">
        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`lp-cinematic-card lp-reveal lp-magnetic relative flex flex-col rounded-[20px] p-7 transition-all duration-300 ${
                plan.highlighted
                  ? "border-[#1F7C80]/45 bg-[linear-gradient(180deg,rgba(240,253,250,0.98),rgba(255,255,255,0.98))] shadow-[0_20px_50px_rgba(31,124,128,0.12),0_18px_40px_rgba(15,23,42,0.10)] ring-1 ring-[#1F7C80]/15 scale-[1.02]"
                  : "border-[#D8E2E8] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:border-[#B8D8D7] hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]"
              }`}
              data-reveal
              data-magnetic
              data-magnetic-strength="16"
            >
              <div className={`absolute inset-x-0 top-0 h-[3px] rounded-t-[20px] bg-gradient-to-r ${plan.accent}`} />

              {plan.highlighted ? (
                <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1F7C80] to-[#3fa8ab] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_rgba(31,124,128,0.28)]">
                  <Sparkles className="h-3 w-3" /> Most popular
                </div>
              ) : (
                <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#D8E2E8] bg-[#F8FAFC] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {plan.name === "Enterprise" ? <Building2 className="h-3 w-3" /> : null}
                  {plan.name}
                </div>
              )}

              <h2 className="text-2xl font-extrabold text-[#0F172A]">{plan.name}</h2>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[44px] font-extrabold tracking-[-0.04em] text-[#0F172A]">
                  {plan.price}
                </span>
                <span className="text-sm font-semibold text-slate-500">{plan.period}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">{plan.description}</p>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <ul className="flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#2A8E92]" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <CTAButton
                to={plan.cta.to}
                variant={plan.highlighted ? "primary" : "secondary"}
                size="lg"
                className="mt-8 w-full"
                showArrow
              >
                {plan.cta.label}
              </CTAButton>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-center text-[28px] font-extrabold tracking-tight text-[#0F172A] sm:text-[34px]">
            What institutional pricing includes
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                "Implementation",
                "Onboarding, institution configuration, programme/course setup guidance, accessibility defaults, and rollout planning.",
              ],
              [
                "Learning infrastructure",
                "Role dashboards, AI teacher-led sessions, lesson generation, materials management, notes, transcripts, and progress evidence.",
              ],
              [
                "Governance",
                "Role-based access, audit-aware workflows, support, data-control planning, usage visibility, and optional enterprise integrations.",
              ],
            ].map(([title, body]) => (
              <div key={title} className="lp-cinematic-card lp-reveal rounded-[16px] border border-[#D8E2E8] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-6 transition-all hover:-translate-y-0.5 hover:border-[#B8D8D7]" data-reveal>
                <div className="mb-3 h-1 w-8 rounded-full bg-gradient-to-r from-[#1F7C80] to-[#3fa8ab]" />
                <h3 className="font-extrabold text-[#0F172A]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center text-[28px] font-extrabold tracking-tight text-[#0F172A] sm:text-[34px]">
            Pricing questions
          </h2>
          <div className="mt-8 space-y-3">
            {PRICING_FAQ.map((item, i) => (
              <div
                key={item.question}
                className="lp-reveal overflow-hidden rounded-[16px] border border-[#D8E2E8] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] transition-all"
                data-reveal
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="text-[15px] font-bold text-[#0F172A]">{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-slate-200 px-6 py-4">
                    <p className="text-sm leading-relaxed text-slate-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="lp-reveal mt-24 overflow-hidden rounded-[28px] border border-[#D8E2E8] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(236,248,248,0.98))] p-10 text-center relative shadow-[0_24px_70px_rgba(15,23,42,0.10)]" data-reveal>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(31,124,128,0.10),transparent_60%)]" aria-hidden />
          <div className="relative">
            <h2 className="text-[28px] font-extrabold tracking-tight text-[#0F172A] sm:text-[36px]">
              Ready to bring AI classrooms to your institution?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] text-slate-600">
              Try the free demo first — no account needed. Then talk to us about a school or enterprise plan.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTAButton to="/demo/classroom" size="lg" showArrow>
                Try Demo Classroom
              </CTAButton>
              <CTAButton to="/institutions/register" variant="secondary" size="lg">
                Register Institution
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
