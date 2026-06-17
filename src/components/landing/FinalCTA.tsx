import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-page-background-alt" id="final-cta">
      <div className="container-editorial">
        <div className="max-w-4xl mx-auto bg-ink rounded-lg border border-white/10 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.06] border border-white/[0.12] text-[11px] font-bold uppercase tracking-[0.14em] text-white/60 mb-6">
              <CheckCircle2 size={12} className="text-sky-200" /> Start teaching today
            </div>

            <h2 className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold !text-white mb-4 tracking-tight leading-[1.15]">
              Bring structured AI teaching into your institution.
            </h2>

            <p className="text-[15px] text-gray-200 max-w-lg mx-auto leading-relaxed mb-8">
              Set up your smart academic virtual campus. Move beyond passive content to
              classroom-guided delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/demo/classroom"
                className="bg-white text-ink font-bold text-sm px-6 py-2.5 rounded-md hover:bg-white/90 transition-all inline-flex items-center gap-2"
              >
                Enter Demo Classroom <ArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="border border-white/15 bg-white/[0.04] text-white font-bold text-sm px-6 py-2.5 rounded-md hover:bg-white/[0.08] transition-all inline-flex items-center gap-2"
              >
                <MessageSquare size={14} /> Speak with our team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
