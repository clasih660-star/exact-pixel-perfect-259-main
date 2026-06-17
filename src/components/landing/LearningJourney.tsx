import { Upload, Sparkles, GraduationCap, FileText, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload materials",
    description: "Upload textbook PDFs, lecture slides, or documents. Klassruum ingests and structure-maps your approved materials.",
    icon: Upload,
    bgColor: "bg-slate-50",
    renderMockup: () => (
      <div className="w-full h-full flex flex-col justify-center p-4 bg-slate-50/70 border border-border/40 select-none">
        <div className="bg-white border border-border rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-bold text-xs shrink-0">PDF</div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-bold text-heading truncate">Chemistry_Syllabus.pdf</div>
            <div className="text-[10px] text-muted flex items-center gap-1.5 mt-0.5">
              <span>2.4 MB</span>
              <span className="text-education-green font-bold flex items-center gap-0.5"><CheckCircle2 size={10} /> Uploaded</span>
            </div>
          </div>
        </div>
        <div className="bg-white border border-border rounded-xl p-3 shadow-sm flex items-center gap-3 mt-2 opacity-60 scale-95 origin-top">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs shrink-0">PPTX</div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-bold text-heading truncate">Lecture_Slides.pptx</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Generate lesson",
    description: "Klassruum generates structured lesson plans with definitions, whiteboard drawings, and checkpoints — ready for review.",
    icon: Sparkles,
    bgColor: "bg-indigo-50/30",
    renderMockup: () => (
      <div className="w-full h-full flex flex-col justify-center p-4 bg-indigo-50/20 border border-border/40 select-none">
        <div className="bg-white border border-border rounded-xl p-3.5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1"><Sparkles size={9} /> AI Lesson Plan</span>
            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">Approved</span>
          </div>
          <div className="space-y-1.5 text-left">
            <div className="text-xs text-heading font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> 1. Atomic Structures</div>
            <div className="text-xs text-heading/60 pl-3.5 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-indigo-300" /> 2. Electron Orbitals</div>
            <div className="text-xs text-heading/40 pl-3.5 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-indigo-200" /> 3. Molecular Bonding</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "AI teacher delivers",
    description: "A virtual teacher speaks, writes on the board, asks checkpoint questions, and responds to learners in real time.",
    icon: GraduationCap,
    bgColor: "bg-emerald-50/30",
    renderMockup: () => (
      <div className="w-full h-full flex flex-col justify-center p-4 bg-emerald-50/20 border border-border/40 select-none">
        <div className="bg-white border border-border rounded-xl p-3 shadow-sm flex flex-col h-[130px] justify-between">
          <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-800">AI</div>
              <span className="text-[10px] font-bold text-heading">Dr. Arthur</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="my-auto py-1.5 text-center">
            <div className="text-[12px] font-bold text-emerald-800 leading-tight" style={{ fontFamily: "Patrick Hand, cursive" }}>C + O₂ → CO₂ + Energy</div>
            <div className="text-[8px] text-muted mt-0.5">Drawing Board...</div>
          </div>
          <div className="bg-slate-50 rounded p-1.5 text-[8px] text-heading/85 text-left border border-slate-100 truncate">
            "We observe that covalent bonds..."
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Evidence of learning",
    description: "Session transcripts, completion rates, and learning evidence are compiled automatically for every learner.",
    icon: FileText,
    bgColor: "bg-amber-50/30",
    renderMockup: () => (
      <div className="w-full h-full flex flex-col justify-center p-4 bg-amber-50/20 border border-border/40 select-none">
        <div className="bg-white border border-border rounded-xl p-3 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-muted uppercase">Active Progress</span>
            <span className="text-[11px] font-extrabold text-amber-600">94%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: "94%" }} />
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-left pt-1">
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
              <div className="text-[7px] text-muted">Time Spent</div>
              <div className="text-[10px] font-extrabold text-heading">45m</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
              <div className="text-[7px] text-muted">Notes Saved</div>
              <div className="text-[10px] font-extrabold text-heading">12 Items</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function LearningJourney() {
  return (
    <section className="py-24 bg-page-background border-b border-border/40 text-left" id="how-it-works">
      <div className="container-editorial">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-xs font-bold text-learning-blue uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-heading leading-tight">
            From curriculum to classroom
          </h2>
          <p className="text-body mt-4 leading-relaxed text-base max-w-xl mx-auto">
            Four stages to turn raw teaching materials into a fully interactive digital campus.
          </p>
        </div>

        {/* 4-column card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div key={step.number} className="solutions-panel group flex h-full flex-col overflow-hidden">
                <div className="relative border-b border-border/70 bg-gradient-to-b from-white to-page-background-alt p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted shadow-sm">
                      <span className="text-learning-blue">{step.number}</span>
                      Stage
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                      <StepIcon size={18} />
                    </div>
                  </div>
                  <div className={`relative aspect-[4/3] ${step.bgColor} overflow-hidden rounded-xl border border-border/70`}>
                    {step.renderMockup()}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 text-left">
                  <h3 className="mb-2 text-[15px] font-semibold leading-tight text-heading">{step.title}</h3>
                  <p className="flex-1 text-[13px] leading-6 text-body">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
