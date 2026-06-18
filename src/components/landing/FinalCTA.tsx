import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, CheckCircle2, MessageSquare } from "lucide-react";

const ctaChecks = [
  "Lesson generation from approved materials",
  "Accessible classroom delivery",
  "Institution-level reporting",
];

export function FinalCTA() {
  return (
    <section
      className="border-y border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] py-16 lg:py-20"
      id="final-cta"
    >
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl text-left">
            <p className="mb-4 inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <CalendarClock size={13} className="text-[#1F7C80]" />
              Implementation-ready
            </p>

            <h2 className="font-headings text-[2rem] font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-[2.6rem] lg:text-[3.25rem]">
              Bring structured AI teaching into your institution
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Start with a live classroom demo, then map your materials, roles, accessibility
              requirements, and reporting needs into a deployment plan.
            </p>
          </div>

          <div className="border-l border-slate-200 pl-0 lg:pl-8">
            <div className="mb-6 grid gap-3">
              {ctaChecks.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm font-medium text-slate-700"
                >
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#1F7C80]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/demo/classroom"
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-[#12393c]"
              >
                Open live classroom
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                <MessageSquare size={15} />
                Talk to the team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
