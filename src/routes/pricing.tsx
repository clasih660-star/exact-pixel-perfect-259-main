import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/brand/Logo";
import { CTAButton } from "@/components/landing/primitives";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Klassruum AI Virtual Classrooms" },
      {
        name: "description",
        content:
          "Simple, transparent pricing for Klassruum. Start with a free demo classroom. Institutional plans scale with your needs — no hidden fees, no per-learner charges.",
      },
      { name: "keywords", content: "Klassruum pricing, AI classroom pricing, virtual classroom cost, school AI platform pricing" },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Pricing — Klassruum AI Virtual Classrooms" },
      { property: "og:description", content: "Start free, scale with your institution. No hidden fees." },
      { property: "og:url", content: `${SITE_URL}/pricing` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/pricing` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Klassruum Pricing",
          url: `${SITE_URL}/pricing`,
          description: "Simple, transparent pricing for Klassruum AI virtual classrooms.",
        }),
      },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "to try",
    description: "Explore the demo classroom and see how Klassruum works — no setup required.",
    features: ["Full demo classroom", "AI teacher-led lesson", "Captions & transcript", "Accessibility modes", "No account required"],
    cta: { label: "Try Demo Classroom", to: "/demo/classroom" },
    highlighted: false,
  },
  {
    name: "School",
    price: "Custom",
    period: "per institution / year",
    description: "For primary and secondary schools ready to deploy AI classrooms across classes.",
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
    description: "For universities, training providers, and large organizations with custom needs.",
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
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-[#475569]">
            <Link to="/features" className="hidden hover:text-[#1A5256] sm:inline">Features</Link>
            <Link to="/demo/classroom" className="hidden hover:text-[#1A5256] sm:inline">Demo</Link>
            <Link to="/auth" className="rounded-lg bg-[#1F7C80] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#1A5256]">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="mx-auto max-w-[1200px] px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1A5256]">
            Pricing
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#475569]">
            Start with a free demo. Institutional plans scale with your needs — no hidden fees, no per-learner charges.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={
                "flex flex-col rounded-[20px] border p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] " +
                (plan.highlighted
                  ? "border-[#1F7C80] bg-white ring-2 ring-[#1F7C80]/10"
                  : "border-[#E2E8F0] bg-white")
              }
            >
              {plan.highlighted && (
                <span className="mb-3 inline-flex w-fit rounded-[999px] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1A5256]">
                  Most popular
                </span>
              )}
              <h2 className="text-[18px] font-bold text-[#0F172A]">{plan.name}</h2>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[36px] font-bold tracking-tight text-[#0F172A]">{plan.price}</span>
                <span className="text-sm text-[#64748B]">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">{plan.description}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#0F172A]">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <CTAButton
                to={plan.cta.to}
                variant={plan.highlighted ? "primary" : "secondary"}
                size="lg"
                className="mt-6 w-full"
              >
                {plan.cta.label}
              </CTAButton>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A]">Pricing questions</h2>
          <div className="mt-8 space-y-6">
            {[
              { q: "Is there a free plan?", a: "Yes. The Starter plan lets you explore the full demo classroom with no account required. It includes an AI teacher-led lesson, captions, transcripts, and accessibility modes." },
              { q: "How are institutional plans priced?", a: "School and Enterprise plans are priced per institution per year, based on your needs. There are no per-learner charges — unlimited teachers and learners are included." },
              { q: "Can I try before I commit?", a: "Absolutely. The demo classroom is always free. For institutional plans, contact us for a guided walkthrough and pilot programme." },
              { q: "Do you offer discounts for NGOs?", a: "Yes. We offer mission-aligned pricing for non-profit organizations and humanitarian programmes. Contact us to discuss your needs." },
            ].map((item) => (
              <div key={item.q}>
                <h3 className="text-[16px] font-semibold text-[#0F172A]">{item.q}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
