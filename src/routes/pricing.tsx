import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, ArrowRight, Sparkles, Building2, ChevronDown, BookOpen } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/brand/Logo";
import { CTAButton } from "@/components/landing/primitives";
import { createSeoHead, faqSchema, webPageSchema } from "@/lib/seo";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPurchasableCourses } from "@/lib/course-billing.functions";
import { formatCoursePrice } from "@/lib/course-pricing";

function CourseCatalogSection() {
  const fn = useServerFn(getPurchasableCourses);
  const q = useQuery({ queryKey: ["purchasable-courses"], queryFn: () => fn() });
  const courses = q.data?.courses ?? [];
  if (q.isLoading || courses.length === 0) return null;

  return (
    <div className="mt-24">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted">
          <BookOpen className="h-3.5 w-3.5" /> Individual courses
        </div>
        <h2 className="mt-6 text-[28px] font-extrabold tracking-tight text-heading sm:text-[34px]">
          Buy a course in USD
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-body">
          Self-paced, AI teacher-led courses you can enroll in directly. One-time payment, full access.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div
            key={c.id}
            className="flex flex-col rounded-lg border border-slate-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {c.sourceType === "kingpin" ? "KingPin" : "Course"}
              </span>
              <span className="text-lg font-extrabold text-heading">
                {formatCoursePrice(c.priceUsd, c.pricingLabel)}
              </span>
            </div>
            <h3 className="text-base font-bold text-heading">{c.title}</h3>
            {c.institutionName && <p className="mt-0.5 text-xs text-muted">{c.institutionName}</p>}
            {c.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-body">{c.description}</p>
            )}
            <CTAButton
              to={`/courses/${c.slug}`}
              variant="secondary"
              size="md"
              className="mt-6 w-full justify-center"
              showArrow
            >
              View course
            </CTAButton>
          </div>
        ))}
      </div>
    </div>
  );
}

const DESCRIPTION =
  "Simple, transparent Klassruum pricing for AI virtual classrooms. Start with a free demo and scale to institution plans.";

const PRICING_FAQ = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes. The Starter plan lets you explore the full demo classroom with no account required. It includes an AI teacher-led lesson, captions, transcripts, and accessibility modes.",
  },
  {
    question: "How are institutional plans priced?",
    answer:
      "School and Enterprise plans are priced per institution per year, based on implementation needs, usage, support level, and governance requirements.",
  },
  {
    question: "Are there per-learner charges?",
    answer:
      "Klassruum is designed for institutional scale. Plans can include unlimited teachers and learners.",
  },
  {
    question: "Do you offer discounts for NGOs?",
    answer:
      "Yes. We offer mission-aligned pricing for non-profit organizations. Contact us to discuss your deployment context.",
  },
  {
    question: "Can I try before I commit?",
    answer:
      "Absolutely. The demo classroom is always free. For institutional plans, contact us for a guided walkthrough.",
  },
];

export const Route = createFileRoute("/pricing")({
  head: () =>
    createSeoHead({
      title: "Pricing — AI Virtual Classroom Plans | Klassruum",
      description: DESCRIPTION,
      path: "/pricing",
      keywords: "Klassruum pricing, AI classroom pricing, virtual classroom platform cost",
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
    <div className="pricing-page-shell min-h-screen bg-white text-heading">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center">
            <Logo size={30} />
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-md px-4 py-2 text-sm font-medium text-body transition-all hover:text-heading sm:inline-flex"
            >
              Home
            </Link>
            <Link
              to="/demo/classroom"
              className="hidden rounded-md px-4 py-2 text-sm font-medium text-body transition-all hover:text-heading sm:inline-flex"
            >
              Demo
            </Link>
            <Link
              to="/auth"
              className="rounded-md px-4 py-2 text-sm font-medium text-body transition-all hover:text-heading"
            >
              Sign in
            </Link>
            <Link
              to="/institutions/register"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#07111f] bg-[#07111f] px-5 py-2 text-sm font-bold !text-white shadow-sm transition-all hover:bg-[#10233f]"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-page-background-alt pb-24 pt-24">
        <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted">
            <Sparkles className="h-3.5 w-3.5" /> Pricing Plans
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-3xl font-extrabold tracking-tight text-heading sm:text-4xl lg:text-[2.75rem]">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-body">
            Start with a free demo. Institutional plans scale with your needs — no hidden fees, no
            per-learner charges.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["No credit card to try", "GDPR-compliant", "WCAG accessibility built-in"].map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3.5 py-1.5 text-sm font-medium text-body"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-education-green" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-lg border p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "border-[#0f172a] bg-white shadow-xl shadow-slate-950/10 ring-1 ring-[#0f172a]/10 scale-[1.01]"
                  : "border-slate-100 bg-white hover:-translate-y-1 hover:shadow-md hover:border-slate-200"
              }`}
            >
              {plan.highlighted ? (
                <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-[#0f172a] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  <Sparkles className="h-3 w-3" /> Most popular
                </div>
              ) : (
                <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {plan.name === "Enterprise" ? <Building2 className="h-3 w-3" /> : null}
                  {plan.name}
                </div>
              )}

              <h2 className="text-xl font-bold text-heading">{plan.name}</h2>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-heading">
                  {plan.price}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ {plan.period}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">{plan.description}</p>

              <div className="my-6 h-px bg-slate-100" />

              <ul className="flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#10233f]" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <CTAButton
                to={plan.cta.to}
                variant={plan.highlighted ? "primary" : "secondary"}
                size="lg"
                className="mt-8 w-full justify-center"
                showArrow
              >
                {plan.cta.label}
              </CTAButton>
            </div>
          ))}
        </div>

        <CourseCatalogSection />

        {/* What's included */}
        <div className="mt-24">
          <h2 className="text-center text-[28px] font-extrabold tracking-tight text-heading sm:text-[34px]">
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
              <div
                key={title}
                className="rounded-lg border border-border bg-white p-6 transition-all hover:shadow-md"
              >
                <h3 className="font-extrabold text-heading">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-body">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center text-[28px] font-extrabold tracking-tight text-heading sm:text-[34px]">
            Pricing questions
          </h2>
          <div className="mt-8 space-y-3">
            {PRICING_FAQ.map((item, i) => (
              <div
                key={item.question}
                className="overflow-hidden rounded-lg border border-border bg-white transition-all"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="text-[15px] font-bold text-heading">{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-border px-6 py-4">
                    <p className="text-sm leading-relaxed text-body">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 overflow-hidden rounded-lg border border-border bg-page-background-alt p-10 text-center">
          <h2 className="text-[28px] font-extrabold tracking-tight text-heading sm:text-[36px]">
            Ready to bring AI classrooms to your institution?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-body">
            Try the free demo first — no account needed. Then talk to us about a school or
            enterprise plan.
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
      </section>

      <Footer />
    </div>
  );
}
