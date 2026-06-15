import { useState, useEffect } from "react";
import { Mic, Hand, NotebookPen, FileText, Sparkles, PlayCircle, ShieldCheck, GraduationCap } from "lucide-react";

export function ClassroomMockup({ className }: { className?: string }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={
        "relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0e14] shadow-2xl classroom-mockup-container " +
        (className ?? "")
      }
      role="img"
      aria-label="Preview of the Klassruum AI classroom: an AI teacher panel, a whiteboard with a worked example, learner notes, and a progress bar."
    >
      <div className="lp-noise" aria-hidden />
      
      {/* Top bar */}
      <div className="relative border-b border-white/10 bg-[#121620]/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
            Live AI classroom
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded-full border border-white/10 bg-[#121620] px-2.5 py-1 text-[10px] font-semibold text-white">
              Whiteboard active
            </span>
            <span className="rounded-full border border-white/10 bg-[#121620] px-2.5 py-1 text-[10px] font-semibold text-white">
              Captions on
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#a0a0a0]">
          <span className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#121620] px-2 py-0.5 text-white sm:inline-flex">
            <ShieldCheck className="h-3 w-3 text-[#00FF88]" /> Institution safe
          </span>
          <span className="hidden sm:inline">Mathematics · Form 2</span>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[#00FF88]">
            Quadratic equations
          </span>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-3 p-3 xl:grid-cols-[170px_1fr_200px]">
        {/* Teacher panel */}
        <aside className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-[18px] border border-white/5 bg-[#121620] p-3 shadow-md">
            <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-emerald-500/10 ring-2 ring-[#00FF88]/30 shadow-md text-[#00FF88]">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div className="mt-2 text-center">
              <div className="text-[12px] font-semibold text-white">Ms. Ada</div>
              <div className="text-[10px] text-[#00FF88]">AI Teacher · explaining</div>
            </div>
            {/* speaking waveform */}
            <div className="mt-2 flex items-end justify-center gap-0.5" aria-hidden>
              {[10, 16, 8, 20, 12, 18, 9].map((h, i) => (
                <span
                  key={i}
                  className="lp-eq-bar w-0.5 rounded-full bg-[#00FF88]/80"
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-white/5 bg-[#121620] p-3 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#a0a0a0]">
              Lesson plan
            </div>
            <ul className="mt-2 space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5 text-[#a0a0a0]">
                <span className="text-[#00FF88]">✓</span> Concept
              </li>
              <li className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1 font-medium text-[#00FF88]">
                <span>▶</span> Worked example
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span>○</span> Guided practice
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span>○</span> Summary
              </li>
            </ul>
          </div>
        </aside>

        {/* Whiteboard + intelligence */}
        <div className="flex flex-col gap-3">
          {/* Whiteboard */}
          <div className="relative overflow-hidden rounded-[18px] border border-white/5 bg-[#121620] p-4 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#a0a0a0]">
                Learning whiteboard
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#00FF88]">
                {step < 4 ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF88]" /> Writing…
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Done
                  </>
                )}
              </span>
            </div>
            <div
              className="space-y-2.5 min-h-[120px]"
              style={{ fontFamily: '"Caveat", "Patrick Hand", cursive' }}
            >
              {step >= 1 && (
                <div className="text-[22px] font-bold leading-tight text-[#7DD3FC] flex items-center gap-1">
                  <span>x² + 5x + 6 = 0</span>
                </div>
              )}
              {step >= 2 && (
                <div className="text-[18px] leading-tight text-white flex items-center gap-1">
                  <span>Find two numbers that multiply to 6 and add to 5</span>
                </div>
              )}
              {step >= 3 && (
                <div className="text-[18px] leading-tight text-[#00FF88] flex items-center gap-1">
                  <span>2 × 3 = 6 &nbsp;&nbsp; 2 + 3 = 5</span>
                </div>
              )}
              {step >= 4 && (
                <div className="text-[18px] leading-tight text-[#00FF88] flex items-center gap-1">
                  <span>(x + 2)(x + 3) = 0 → x = −2 or x = −3</span>
                </div>
              )}
            </div>
            {/* written sub-note */}
            <p className="mt-3 border-l-2 border-[#00FF88] pl-3 text-[12px] leading-relaxed text-[#a0a0a0] min-h-[36px]">
              {step === 1 && "We have our quadratic equation set to zero."}
              {step === 2 && "Let's factor by finding numbers that multiply to 6 and add to 5."}
              {step === 3 && "The numbers 2 and 3 satisfy this condition perfectly."}
              {step >= 4 && "Setting each bracket to zero gives the two solutions: x = -2 or x = -3."}
            </p>
          </div>

          {/* Smart notes */}
          <div className="flex items-start gap-2 rounded-[14px] border border-white/5 bg-[#121620] px-3 py-2 shadow-sm">
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00FF88]" aria-hidden />
            <p className="text-[12px] leading-snug text-white">
              <span className="font-semibold text-[#00FF88]">Note:</span> Setting each bracket to
              zero gives the two solutions for x.
            </p>
          </div>

          {/* Question + controls + progress */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[14px] border border-white/5 bg-[#121620] p-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#a0a0a0]">
                <Sparkles className="h-3 w-3 text-[#00FF88]" /> Learner question
              </div>
              <p className="mt-1 text-[12px] text-white">
                “Why did the answer become negative?”
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#00FF88] px-2 py-0.5 text-[10px] font-medium text-black">
                  Answer
                </span>
                <span className="rounded-[6px] bg-[#1a202c] px-2 py-0.5 text-[10px] text-white">
                  Show on board
                </span>
                <span className="rounded-[6px] bg-[#1a202c] px-2 py-0.5 text-[10px] text-white">
                  Simpler
                </span>
              </div>
            </div>
            
            <div className="flex flex-col justify-between rounded-[14px] border border-white/5 bg-[#121620] p-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#a0a0a0]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00FF88] text-black">
                  <PlayCircle className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a202c] text-white">
                  <Mic className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a202c] text-white">
                  <Hand className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a202c] text-white">
                  <NotebookPen className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-[#a0a0a0]">
                  <span>Lesson progress</span>
                  <span className="font-semibold text-white">68%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#1a202c]">
                  <div className="h-full rounded-full bg-[#00FF88]" style={{ width: "68%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden flex-col gap-3 xl:flex">
          <div className="rounded-[18px] border border-white/5 bg-[#121620] p-3 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#a0a0a0]">
              Session intelligence
            </div>
            <div className="mt-3 space-y-2.5">
              {[
                ["Engagement", "High"],
                ["Support mode", "Standard"],
                ["Transcript", "Saved live"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-[12px] bg-[#1a202c] px-3 py-1.5">
                  <span className="text-[11px] text-[#a0a0a0]">{label}</span>
                  <span className="text-[11px] font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[18px] border border-white/5 bg-[#121620] p-3 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#a0a0a0]">
              Learning record
            </div>
            <div className="mt-3 rounded-[14px] border border-white/5 bg-[#1a202c] px-3 py-3">
              <div className="text-[22px] font-bold tracking-tight text-white">12</div>
              <div className="text-[11px] text-[#a0a0a0]">Concepts captured in notes</div>
            </div>
            <div className="mt-3 rounded-[14px] border border-white/5 bg-[#1a202c] px-3 py-3">
              <div className="text-[22px] font-bold tracking-tight text-white">3</div>
              <div className="text-[11px] text-[#a0a0a0]">Learner clarifications handled live</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
