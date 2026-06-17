import { BookOpen, Layout, MessageSquare, ShieldCheck, Volume2 } from "lucide-react";

export function ClassroomExperience() {
  const capabilities = [
    {
      title: "Explains concepts",
      description: "Delivers syllabus-based content with natural language explanations and interactive definitions.",
      icon: BookOpen,
      color: "text-sky-400",
    },
    {
      title: "Writes on the board",
      description: "Illustrates complex diagrams, notes down key principles, and works through equations on the whiteboard.",
      icon: Layout,
      color: "text-emerald-400",
    },
    {
      title: "Responds to learners",
      description: "Handles questions asked via voice or text in real time, drawing explanations strictly from curriculum docs.",
      icon: MessageSquare,
      color: "text-amber-400",
    },
    {
      title: "Records the lesson",
      description: "Compiles full lesson summaries, transcripts, review checkpoints, and student engagement data automatically.",
      icon: ShieldCheck,
      color: "text-white/60",
    },
  ];

  return (
    <section className="live-classroom-section py-20 lg:py-28 relative overflow-hidden" id="classroom">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid-dot-pattern" />

      <div className="container-editorial relative z-10">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Live classroom engine</p>
          <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold !text-white leading-[1.1] tracking-tight">
            This is not content delivery. It is teaching.
          </h2>
          <p className="text-gray-300 mt-4 text-[1.05rem] leading-relaxed max-w-xl mx-auto">
            Stop presenting passive video lectures. Klassruum replicates a real, active classroom where lessons are dynamically spoken, drawn, and adapted.
          </p>
        </div>

        {/* Mockup */}
        <div className="w-full max-w-5xl mx-auto mb-14">
          <div className="mockup-window relative w-full h-[350px] md:h-[440px] bg-ink border border-white/[0.06] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="h-9 border-b border-white/[0.06] bg-navy-light flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red" />
                <span className="w-2.5 h-2.5 rounded-full bg-achievement-orange" />
                <span className="w-2.5 h-2.5 rounded-full bg-education-green" />
                <span className="text-[10px] text-white/30 ml-2 font-medium">Session: Form 3 Chemistry (Atomic Structures)</span>
              </div>
              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Active</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden text-left">
              {/* Sidebar */}
              <div className="w-1/4 bg-ink p-3 hidden sm:flex flex-col gap-2 border-r border-white/[0.04]">
                <div className="text-[8px] font-semibold text-white/30 uppercase tracking-wider">Outline</div>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-white/30">1. Introduction</div>
                  <div className="text-[10px] text-white font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-learning-blue" /> 2. Electron Shells
                  </div>
                  <div className="text-[10px] text-white/20">3. Molecular Bonds</div>
                </div>
              </div>

              {/* Whiteboard */}
              <div className="flex-1 p-5 bg-ink flex flex-col justify-between relative">
                <div className="text-[8px] font-semibold text-white/20 uppercase tracking-wider">Board Canvas</div>

                <div className="my-auto max-w-sm mx-auto text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-dashed border-white/20 flex items-center justify-center relative mb-3 animate-spin" style={{ animationDuration: "12s" }}>
                    <div className="w-3 h-3 rounded-full bg-achievement-orange absolute top-1" />
                    <div className="w-3 h-3 rounded-full bg-achievement-orange absolute bottom-1" />
                    <div className="w-7 h-7 rounded-full bg-learning-blue/20 border border-learning-blue/30 flex items-center justify-center font-semibold text-[8px] text-white">Nucleus</div>
                  </div>
                  <div className="text-base font-medium text-white" style={{ fontFamily: "Patrick Hand, cursive" }}>
                    Carbon Atom: 6 Protons, 6 Neutrons, 6 Electrons
                  </div>
                </div>

                <div className="border-t border-white/[0.04] pt-2 flex justify-between items-center text-[9px] text-white/30">
                  <span>Topic Progress</span>
                  <div className="w-1/2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "70%" }} />
                  </div>
                  <span>70%</span>
                </div>
              </div>

              {/* Tutor */}
              <div className="w-1/4 bg-ink p-3 flex flex-col gap-2 border-l border-white/[0.04]">
                <div className="rounded-lg border border-white/[0.04] bg-navy-light p-2 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/[0.06] border border-white/[0.06] mb-1.5">
                    <img src="/images/teachers/man.png" alt="Tutor" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
                  </div>
                  <div className="font-semibold text-[10px] text-white">Dr. Arthur</div>
                  <div className="text-[7px] text-emerald-400 uppercase font-medium">AI Lecturer</div>
                </div>

                <div className="bg-navy-light border border-white/[0.04] rounded-lg p-2 flex-1 hidden md:flex flex-col justify-between">
                  <span className="text-[8px] font-semibold text-white/30 uppercase">Checkpoint</span>
                  <p className="text-[9px] text-white/60 leading-normal mt-1">"Correct! Carbon has 4 valence electrons."</p>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="border-t border-white/[0.04] bg-navy-light p-2.5 flex items-start gap-2 shrink-0">
              <Volume2 className="text-emerald-400 shrink-0 mt-0.5" size={13} />
              <div className="text-left">
                <span className="text-[7px] text-emerald-400 font-semibold uppercase tracking-wider block">Spoken audio feed</span>
                <p className="text-[10px] text-white/60 mt-0.5 leading-relaxed">"Notice how the outer shell holds four electrons, making it tetravalent."</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {capabilities.map((cap, index) => {
            const CapIcon = cap.icon;
            return (
              <div key={cap.title} className="live-classroom-capability p-5 md:p-6">
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] ${cap.color} shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}>
                      <CapIcon size={18} />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mb-2 text-[15px] font-semibold leading-tight !text-white">{cap.title}</h3>
                  <p className="mb-5 flex-1 text-[13px] leading-6 text-slate-300">{cap.description}</p>

                  <div className="rounded-2xl border border-white/[0.08] bg-black/10 px-3 py-2.5 text-[11px] font-medium text-white/55">
                    Active classroom behavior
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
