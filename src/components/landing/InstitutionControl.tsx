import { Check, ShieldCheck, Lock, Award, Eye } from "lucide-react";

export function InstitutionControl() {
  const controls = [
    "Review lessons before release",
    "Control curriculum sources",
    "Manage users and roles",
    "Monitor classroom sessions",
    "Review progress and support needs",
    "Export transcripts and records",
  ];

  return (
    <section className="py-20 lg:py-28 bg-white" id="institutions">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left: Dashboard Mockup */}
          <div>
            <div className="mockup-window bg-page-background-alt overflow-hidden flex flex-col min-h-[360px]">
              <div className="h-8 border-b border-border bg-page-background-alt flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red" />
                  <span className="w-2 h-2 rounded-full bg-achievement-orange" />
                  <span className="w-2 h-2 rounded-full bg-education-green" />
                  <span className="text-[9px] text-muted ml-2 font-medium">Klassruum Admin</span>
                </div>
              </div>

              <div className="flex-1 p-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Active Classes", value: "24" },
                    { label: "Total Learners", value: "1,240" },
                    { label: "Avg Progress", value: "87%", color: "text-education-green" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-border rounded-lg p-3">
                      <span className="text-[8px] font-semibold text-muted uppercase">{stat.label}</span>
                      <div className={`text-lg font-bold text-heading mt-0.5 ${stat.color || ""}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-border rounded-lg p-4 flex-1">
                  <div className="text-[9px] font-semibold text-muted uppercase tracking-wider mb-2.5">Curriculum Governance</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-border/50">
                      <span className="font-medium text-heading">Lesson 3: Photosynthesis</span>
                      <span className="px-2 py-0.5 bg-soft-yellow text-achievement-orange font-semibold text-[9px] rounded-full">Pending</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-border/50">
                      <span className="font-medium text-heading">Lesson 4: Organic Chemistry</span>
                      <span className="px-2 py-0.5 bg-soft-green text-education-green font-semibold text-[9px] rounded-full">Released</span>
                    </div>
                  </div>
                  <div className="text-[8px] text-muted flex items-center gap-1 mt-3">
                    <ShieldCheck size={10} className="text-education-green" />
                    <span>GDPR & WCAG audit verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Security & operations</p>
            <h2 className="text-[2rem] sm:text-[2.25rem] font-bold text-heading leading-[1.15] tracking-tight mb-5">
              Powerful for learners. Controlled by institutions.
            </h2>
            <p className="text-body leading-relaxed mb-7 text-[15px]">
              Klassruum integrates into high-compliance educational workflows. Keep complete command over what is taught, who has access, and how progress is evaluated.
            </p>

            <ul className="space-y-3 mb-8">
              {controls.map((control) => (
                <li key={control} className="flex items-center gap-3 text-[14px] text-body">
                  <div className="w-5 h-5 rounded-full bg-soft-green flex items-center justify-center text-education-green shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="font-medium">{control}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-5 text-body">
              <div className="flex items-center gap-2 text-[13px] font-medium">
                <Lock size={15} className="text-learning-blue" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-medium">
                <Award size={15} className="text-education-green" />
                <span>WCAG 2.2 Ready</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-medium">
                <Eye size={15} className="text-achievement-orange" />
                <span>Zero Hallucinations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
