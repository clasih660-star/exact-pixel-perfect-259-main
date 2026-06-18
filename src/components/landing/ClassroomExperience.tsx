import {
  Activity,
  BookOpenCheck,
  BrainCircuit,
  ClipboardCheck,
  FileText,
  Gauge,
  MessageCircleQuestion,
  Mic2,
  PenTool,
  Radio,
  Volume2,
} from "lucide-react";

const teachingBehaviors = [
  {
    title: "Explain",
    description: "Turns approved material into a spoken explanation with examples and definitions.",
    icon: Mic2,
  },
  {
    title: "Demonstrate",
    description: "Builds the idea on a board, step by step, instead of dropping a finished slide.",
    icon: PenTool,
  },
  {
    title: "Question",
    description: "Checks understanding while the lesson is happening and adapts the next move.",
    icon: MessageCircleQuestion,
  },
  {
    title: "Record",
    description: "Leaves transcripts, checkpoints, and progress signals for teachers and admins.",
    icon: ClipboardCheck,
  },
];

const lessonSignals = [
  { label: "Teaching pace", value: "Adaptive", icon: Gauge },
  { label: "Questions handled", value: "18 live", icon: MessageCircleQuestion },
  { label: "Evidence saved", value: "Transcript + board", icon: FileText },
];

const boardSteps = ["Recall prior idea", "Work example", "Ask checkpoint", "Adjust explanation"];

export function ClassroomExperience() {
  return (
    <section className="live-classroom-section relative overflow-hidden py-20 lg:py-28" id="classroom">
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] grid-dot-pattern" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="container-editorial relative z-10">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="max-w-2xl text-left">
            <p className="mb-4 inline-flex items-center gap-2 border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100">
              <Radio size={12} className="text-cyan-200" />
              Live classroom engine
            </p>
            <h2 className="font-headings text-[2.35rem] font-extrabold leading-[1.05] tracking-tight !text-white sm:text-[3rem] lg:text-[3.5rem]">
              This is not content delivery. It is teaching.
            </h2>
          </div>

          <p className="max-w-xl text-base font-medium leading-8 !text-slate-200 lg:ml-auto">
            Klassruum behaves like a teacher in the room: it explains, writes, listens for confusion,
            checks understanding, and leaves a reliable record of what happened.
          </p>
        </div>

        <div className="live-classroom-console overflow-hidden border border-white/10 bg-[#08111f] shadow-[0_28px_80px_rgba(2,6,23,0.42)]">
          <div className="grid min-h-[560px] lg:grid-cols-[240px_minmax(0,1fr)_280px]">
            <aside className="hidden border-r border-white/10 bg-white/[0.035] p-5 lg:block">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden border border-white/10 bg-white/10">
                  <img
                    src="/images/teachers/man.png"
                    alt="AI teacher"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      (event.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold !text-white">Dr. Arthur</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Teaching live</p>
                </div>
              </div>

              <div className="space-y-3">
                {boardSteps.map((step, index) => (
                  <div
                    key={step}
                    className={`border px-3 py-3 ${
                      index === 1
                        ? "border-cyan-300/35 bg-cyan-300/10 text-white"
                        : "border-white/8 bg-white/[0.035] text-white/56"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-60">
                      Step {index + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </aside>

            <div className="flex min-w-0 flex-col border-b border-white/10 lg:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.045] px-5 py-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                    Form 3 Chemistry
                  </p>
                  <p className="mt-1 text-base font-bold !text-white">Atomic structure: electron shells</p>
                </div>
                <div className="inline-flex items-center gap-2 border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                  Active lesson
                </div>
              </div>

              <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_190px] md:p-6">
                <div className="live-classroom-board relative min-h-[330px] border border-white/10 bg-[#f8fbff] p-5 text-slate-950">
                  <div className="absolute inset-0 opacity-70 notebook-pattern" />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Board work
                      </p>
                      <p className="text-[11px] font-bold text-cyan-700">writing now</p>
                    </div>

                    <div className="live-classroom-board-grid grid flex-1 gap-6 md:grid-cols-[minmax(132px,0.68fr)_minmax(0,1fr)] md:items-center lg:grid-cols-1 lg:items-start xl:grid-cols-[minmax(132px,0.68fr)_minmax(0,1fr)] xl:items-center">
                      <div className="live-classroom-board-atom mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center">
                        <div className="relative h-[clamp(132px,16vw,180px)] w-[clamp(132px,16vw,180px)]">
                          <div className="absolute inset-6 rounded-full border-2 border-dashed border-cyan-500/55" />
                          <div className="absolute inset-0 rounded-full border border-slate-300" />
                          <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-slate-950 text-[11px] font-extrabold text-white">
                            C
                          </div>
                          <span className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full bg-amber-500 shadow-[0_0_0_6px_rgba(245,158,11,0.16)]" />
                          <span className="absolute bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-amber-500 shadow-[0_0_0_6px_rgba(245,158,11,0.16)]" />
                          <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-blue-600 shadow-[0_0_0_6px_rgba(37,99,235,0.14)]" />
                          <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-blue-600 shadow-[0_0_0_6px_rgba(37,99,235,0.14)]" />
                        </div>
                      </div>

                      <div className="live-classroom-board-copy min-w-0">
                        <p className="max-w-[18ch] text-wrap break-words font-[Patrick_Hand,cursive] text-[clamp(1.5rem,2.6vw,2.15rem)] font-bold leading-[1.1] text-slate-950">
                          Carbon has 4 valence electrons.
                        </p>
                        <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                          <p>First we place six electrons into shells: two inside, four outside.</p>
                          <p>The outer shell is why carbon can form four covalent bonds.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:block md:space-y-3">
                  <div className="border border-white/10 bg-white/[0.045] p-4">
                    <BrainCircuit className="mb-4 text-cyan-200" size={20} />
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                      Adaptation
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/78">
                      Two learners confused shell capacity with valency. Re-teaching with a board example.
                    </p>
                  </div>
                  <div className="border border-white/10 bg-white/[0.045] p-4">
                    <BookOpenCheck className="mb-4 text-emerald-200" size={20} />
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                      Grounding
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/78">
                      Answering from approved chemistry syllabus and uploaded class notes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">Spoken teaching</p>
                    <p className="mt-1 text-sm leading-6 text-white/72">
                      "Notice that carbon is not just memorized as element six. We use its outer shell to
                      predict how it bonds."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-white/[0.035] p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                  Live evidence
                </p>
                <Activity size={16} className="text-emerald-200" />
              </div>

              <div className="space-y-3">
                {lessonSignals.map((signal) => {
                  const SignalIcon = signal.icon;
                  return (
                    <div key={signal.label} className="border border-white/10 bg-[#0c1728] p-4">
                      <SignalIcon size={16} className="mb-3 text-cyan-200" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/42">
                        {signal.label}
                      </p>
                      <p className="mt-1 text-lg font-extrabold !text-white">{signal.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border border-amber-300/20 bg-amber-300/10 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-100">
                  Checkpoint
                </p>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Why can carbon form four bonds?
                </p>
                <div className="mt-4 h-2 overflow-hidden bg-white/10">
                  <div className="h-full w-[72%] bg-amber-300" />
                </div>
                <p className="mt-2 text-[11px] font-semibold text-white/48">72% answered correctly</p>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teachingBehaviors.map((behavior) => {
            const BehaviorIcon = behavior.icon;
            return (
              <div key={behavior.title} className="live-classroom-capability p-5">
                <BehaviorIcon size={18} className="mb-4 text-cyan-200" />
                <h3 className="text-base font-bold leading-tight !text-white">{behavior.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{behavior.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
