import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type PricingHref = "/demo/classroom" | "/institutions/register" | "/contact";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Explore a prepared AI classroom and experience the flow before any setup.",
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
      name: "Essential",
      price: "$149",
      period: "institution / month",
      description: "Launch a smaller AI classroom deployment with core teaching, billing, and learner workflows.",
      badge: "Essential",
      annualNote: "Save 15% annually",
      features: [
        "Institution workspace and billing",
        "Invite teachers by email",
        "Assign teachers to courses",
        "AI classroom lessons and live sessions",
        "Learner notes, transcripts, and progress",
        "Monthly subscription flow",
      ],
      cta: { label: "Start essential plan", to: "/institutions/register" as PricingHref },
      featured: false,
    },
    {
      name: "Growth",
      price: "$349",
      period: "institution / month",
      description: "Scale across programmes with stronger reporting, coordination, and rollout support.",
      badge: "Most popular",
      annualNote: "Save 20% annually",
      features: [
        "Everything in Essential",
        "Expanded teacher and programme support",
        "Advanced progress tracking and reporting",
        "Multi-course rollout workflows",
        "Priority onboarding guidance",
        "Faster support coverage",
      ],
      cta: { label: "Start growth plan", to: "/institutions/register" as PricingHref },
      featured: true,
    },
    {
      name: "Custom",
      price: "Custom",
      period: "annual agreement",
      description: "For large institutions needing governance, integrations, and tailored implementation.",
      badge: "Custom",
      features: [
        "Everything in Growth",
        "SSO and advanced security",
        "API and custom integrations",
        "Dedicated account manager",
        "SLA and compliance support",
        "Custom data retention and procurement support",
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
            Start with a working classroom, then rent institution-ready virtual classrooms monthly
            with teacher hiring, course assignment, billing, lessons, and reporting in one place.
          </p>
        </div>

        <div className="mx-auto mb-5 flex max-w-5xl items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          <span>Choose a starting point</span>
          <span className="hidden text-[#1F7C80] sm:inline">Monthly, annual savings, or custom scale</span>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`pricing-track-card interactive-surface flex min-h-full flex-col overflow-hidden p-6 md:p-7 ${
                plan.featured
                  ? "relative border-[#07111f] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.featured && <div className="absolute inset-x-0 top-0 h-1.5 bg-[#07111f]" />}

              <div className="mb-7 flex items-start justify-between gap-4">
                <span
                  className={`inline-flex border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    plan.featured
                      ? "border-[#07111f] bg-[#07111f] text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  {plan.badge}
                </span>
                {plan.featured && (
                  <span className="border border-[#1F7C80]/25 bg-[#E8F5F5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A5256]">
                    Recommended
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-sans text-xl font-extrabold text-slate-950">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-sans text-4xl font-extrabold tracking-tight text-slate-950">
                    {plan.price}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    / {plan.period}
                  </span>
                </div>
                <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>
                {"annualNote" in plan && plan.annualNote ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#1F7C80]">
                    {plan.annualNote}
                  </p>
                ) : null}
              </div>

              <div className="my-7 h-px bg-slate-200" />

              <ul className="grid flex-1 gap-3">
                {plan.features.map((inc) => (
                  <li
                    key={inc}
                    className="flex items-start gap-2.5 text-sm leading-6 text-slate-700"
                  >
                    <CheckCircle2
                      size={15}
                      className={`mt-0.5 shrink-0 ${plan.featured ? "text-[#07111f]" : "text-[#1F7C80]"}`}
                    />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.cta.to}
                className={`mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 px-4 text-sm font-bold transition-colors ${
                  plan.featured
                    ? "border border-[#07111f] bg-[#07111f] !text-white hover:bg-[#10233f]"
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
            <strong className="font-bold text-slate-950">Annual savings:</strong> paid plans include
            built-in yearly discount options for longer commitments.
          </p>
          <p>
            <strong className="font-bold text-slate-950">Teacher-ready:</strong> invite teachers,
            assign courses, and run AI, human, or hybrid classrooms.
          </p>
        </div>
      </div>
    </section>
  );
}
