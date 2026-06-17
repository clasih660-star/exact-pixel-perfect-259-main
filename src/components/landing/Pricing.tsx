import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type PricingHref = "/demo/classroom" | "/institutions/register" | "/contact";

export function Pricing() {
  const plans = [
    {
      name: "Explore Klassruum",
      price: "$0",
      period: "free demo",
      description: "Experience the live AI tutor in an open digital classroom.",
      badge: "Instant Access",
      badgeColor: "bg-white text-slate-700 border-slate-200",
      features: [
        "Pre-loaded demo classroom",
        "Experience the live AI tutor",
        "Interact with whiteboard solving",
        "Test accessibility selectors",
        "View note & transcript creation",
      ],
      cta: { label: "Start Free Demo", to: "/demo/classroom" as PricingHref },
      featured: false,
    },
    {
      name: "Deploy Klassruum",
      price: "Custom",
      period: "contract terms",
      description: "Deploy a dedicated, secure learning portal for your institution.",
      badge: "Institutional Plan",
      badgeColor: "bg-[#0f172a] text-white border-[#0f172a]",
      features: [
        "Custom domain & branding",
        "Unlimited course curriculum",
        "All cohort student sizes",
        "Review before release gates",
        "Admin governance dashboard",
        "Analytics & compliance logs",
        "Priority support & onboarding",
        "Data export & APIs",
      ],
      cta: { label: "Deploy Your Campus", to: "/institutions/register" as PricingHref },
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "institution / year",
      description: "For universities, training providers, and large organizations.",
      badge: "Global Scale",
      badgeColor: "bg-white text-slate-700 border-slate-200",
      features: [
        "Everything in Deploy",
        "SSO & advanced security",
        "API & custom integrations",
        "Dedicated account manager",
        "SLA & compliance guarantees",
        "Custom data retention",
        "Priority feature requests",
        "White-label options",
      ],
      cta: { label: "Contact Sales", to: "/contact" as PricingHref },
      featured: false,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-100" id="pricing">
      <div className="container-editorial">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-[11px] font-bold text-[#10233f] uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-[2.2rem] sm:text-[2.75rem] md:text-[3.25rem] font-bold text-[#0f172a] leading-[1.12] tracking-tight font-headings">
            Simple ways to get started
          </h2>
          <p className="text-[#64748b] mt-4 text-base leading-relaxed max-w-xl mx-auto font-sans">
            Start by testing the classroom engine, then configure a custom layout for your
            institution.
          </p>
        </div>

        {/* 3-tier grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-lg flex flex-col bg-white border transition-all duration-300 ${
                plan.featured
                  ? "border-[#0f172a] shadow-xl shadow-slate-950/10 ring-1 ring-[#0f172a]/10 relative scale-[1.01]"
                  : "border-slate-100 hover:-translate-y-1 hover:shadow-md hover:border-slate-200"
              }`}
            >
              {/* Badge */}
              <div
                className={`inline-flex self-start px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${plan.badgeColor} mb-6`}
              >
                {plan.badge}
              </div>

              <div>
                <h3 className="text-xl font-bold text-heading font-sans">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#0f172a] tracking-tight font-sans">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">/ {plan.period}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mt-3 min-h-[48px]">
                  {plan.description}
                </p>
              </div>

              <div className="my-6 h-px bg-slate-100" />

              <ul className="space-y-3 flex-1">
                {plan.features.map((inc) => (
                  <li key={inc} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="text-[#10233f] shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.cta.to}
                className={`w-full justify-center mt-8 text-sm py-3 rounded-md font-bold flex items-center gap-1.5 transition-all ${
                  plan.featured
                    ? "bg-[#07111f] text-white hover:bg-[#10233f] shadow-md shadow-slate-950/15"
                    : "bg-slate-50 text-[#0f172a] hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {plan.cta.label} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
