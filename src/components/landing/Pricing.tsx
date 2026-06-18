import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type PricingHref = "/demo/classroom" | "/institutions/register" | "/contact";

export function Pricing() {
  const plans = [
    {
      name: "Explore Klassruum",
      price: "$0",
      period: "free demo",
      description: "Use a prepared classroom to see the teaching flow before setup.",
      badge: "Start here",
      features: [
        "Pre-loaded classroom lesson",
        "Live teaching flow with board work",
        "Captions, transcript, and notes",
        "Accessibility controls to inspect",
      ],
      cta: { label: "Open demo classroom", to: "/demo/classroom" as PricingHref },
      featured: false,
    },
    {
      name: "Deploy Klassruum",
      price: "Custom",
      period: "contract terms",
      description: "Launch a governed learning environment for your institution.",
      badge: "Institutional Plan",
      features: [
        "Custom domain & branding",
        "Course and lesson generation",
        "Review gates before release",
        "Admin governance dashboard",
        "Analytics and compliance logs",
        "Priority support & onboarding",
      ],
      cta: { label: "Plan deployment", to: "/institutions/register" as PricingHref },
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "institution / year",
      description: "For multi-site organizations with advanced integration needs.",
      badge: "Global Scale",
      features: [
        "Everything in Deploy Klassruum",
        "SSO and advanced security",
        "API and custom integrations",
        "Dedicated account manager",
        "SLA and compliance support",
        "Custom data retention",
      ],
      cta: { label: "Contact us", to: "/contact" as PricingHref },
      featured: false,
    },
  ];

  return (
    <section className="border-t border-slate-200 bg-white py-20 lg:py-24" id="pricing">
      <div className="container-editorial">
        <div className="mx-auto mb-12 grid max-w-5xl gap-6 border-b border-slate-200 pb-8 text-left md:grid-cols-[0.75fr_1fr] md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1F7C80]">
              Pricing
            </p>
            <h2 className="font-headings text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-[#0f172a] sm:text-[2.75rem] md:text-[3.25rem]">
              Simple ways to get started
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-slate-600 md:ml-auto">
            Start with a working classroom, then move into a deployment plan matched to your
            materials, review process, learner access needs, and reporting requirements.
          </p>
        </div>

        <div className="mx-auto mb-5 flex max-w-5xl items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          <span>Choose a starting point</span>
          <span className="hidden text-[#1F7C80] sm:inline">Institution setup available</span>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex min-h-full flex-col bg-white p-6 transition-colors md:p-7 ${
                plan.featured ? "relative bg-[#07111f] text-white" : "hover:bg-slate-50"
              }`}
            >
              <div className="mb-7 flex items-start justify-between gap-4">
                <span
                  className={`inline-flex border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    plan.featured
                      ? "border-cyan-200/20 bg-cyan-200/10 text-cyan-100"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {plan.badge}
                </span>
                {plan.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">
                    Recommended
                  </span>
                )}
              </div>

              <div>
                <h3
                  className={`font-sans text-xl font-extrabold ${
                    plan.featured ? "!text-white" : "text-slate-950"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className={`font-sans text-4xl font-extrabold tracking-tight ${
                      plan.featured ? "!text-white" : "text-slate-950"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      plan.featured ? "text-white/55" : "text-slate-500"
                    }`}
                  >
                    / {plan.period}
                  </span>
                </div>
                <p
                  className={`mt-4 min-h-[72px] text-sm leading-6 ${
                    plan.featured ? "!text-white/72" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className={`my-7 h-px ${plan.featured ? "bg-white/12" : "bg-slate-200"}`} />

              <ul className="grid flex-1 gap-3">
                {plan.features.map((inc) => (
                  <li
                    key={inc}
                    className={`flex items-start gap-2.5 text-sm leading-6 ${
                      plan.featured ? "text-white/78" : "text-slate-700"
                    }`}
                  >
                    <CheckCircle2
                      size={15}
                      className={`mt-0.5 shrink-0 ${
                        plan.featured ? "text-cyan-200" : "text-[#1F7C80]"
                      }`}
                    />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.cta.to}
                className={`mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 px-4 text-sm font-bold transition-colors ${
                  plan.featured
                    ? "bg-white !text-[#07111f] hover:bg-cyan-50"
                    : "border border-slate-300 bg-white !text-slate-950 hover:border-slate-400 hover:bg-slate-100"
                }`}
              >
                <span>{plan.cta.label}</span>
                <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-6 grid max-w-5xl gap-3 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600 md:grid-cols-3">
          <p>
            <strong className="font-bold text-slate-950">No guesswork:</strong> demo first, deploy
            after fit is clear.
          </p>
          <p>
            <strong className="font-bold text-slate-950">No hidden classroom layer:</strong> voice,
            board, captions, notes, and transcripts are core.
          </p>
          <p>
            <strong className="font-bold text-slate-950">No one-size-fits-all rollout:</strong>{" "}
            institutional pricing follows scope.
          </p>
        </div>
      </div>
    </section>
  );
}
