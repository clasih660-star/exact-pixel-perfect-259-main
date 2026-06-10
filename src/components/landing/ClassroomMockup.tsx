/**
 * ClassroomMockup — a faithful, lightweight preview of the real Klassruum
 * classroom (not a generic dashboard). Shows the three product pillars:
 *   • AI teacher panel (left)
 *   • Learning whiteboard with marker-written lesson content (centre)
 *   • Lesson intelligence: captions, learner questions, notes/transcript,
 *     and a live progress bar.
 *
 * Pure presentational markup — no timers or heavy animation — so it is cheap to
 * render on the marketing page while still reading as the actual product.
 */

import { Mic, Hand, Captions, NotebookPen, FileText } from "lucide-react";

export function ClassroomMockup({ className }: { className?: string }) {
  return (
    <div
      className={
        "overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-[#0F172A] shadow-[0_12px_32px_rgba(15,23,42,0.10)] " +
        (className ?? "")
      }
      role="img"
      aria-label="Preview of the Klassruum AI classroom: an AI teacher panel, a whiteboard with a worked example, live captions, and a learner progress bar."
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
          <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
          Live AI classroom
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden sm:inline">Mathematics · Form 2</span>
          <span className="rounded-[6px] bg-white/10 px-2 py-0.5">Quadratic equations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-[150px_1fr]">
        {/* Teacher panel */}
        <aside className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB]/20 ring-2 ring-[#2563EB]/40">
              <span className="text-2xl">👩🏽‍🏫</span>
            </div>
            <div className="mt-2 text-center">
              <div className="text-[12px] font-semibold text-white">Ms. Ada</div>
              <div className="text-[10px] text-[#60a5fa]">AI Teacher · explaining</div>
            </div>
            {/* speaking waveform */}
            <div className="mt-2 flex items-end justify-center gap-0.5" aria-hidden>
              {[10, 16, 8, 20, 12, 18, 9].map((h, i) => (
                <span key={i} className="w-0.5 rounded-full bg-[#60a5fa]/80" style={{ height: h }} />
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Lesson plan</div>
            <ul className="mt-2 space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-400"><span>✓</span> Concept</li>
              <li className="flex items-center gap-1.5 font-medium text-white"><span className="text-[#60a5fa]">▶</span> Worked example</li>
              <li className="flex items-center gap-1.5 text-slate-500"><span>○</span> Guided practice</li>
              <li className="flex items-center gap-1.5 text-slate-500"><span>○</span> Summary</li>
            </ul>
          </div>
        </aside>

        {/* Whiteboard + intelligence */}
        <div className="flex flex-col gap-3">
          {/* Whiteboard */}
          <div className="rounded-[16px] border border-[#cbd5e1] bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">Learning whiteboard</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#2563EB]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2563EB]" /> Writing…
              </span>
            </div>
            <div className="space-y-2.5" style={{ fontFamily: '"Caveat", "Patrick Hand", cursive' }}>
              <div className="text-[22px] font-bold leading-tight text-[#1d4ed8]">x² + 5x + 6 = 0</div>
              <div className="text-[18px] leading-tight text-[#1f2937]">Find two numbers that multiply to 6 and add to 5</div>
              <div className="text-[18px] leading-tight text-[#1e40af]">2 × 3 = 6 &nbsp;&nbsp; 2 + 3 = 5</div>
              <div className="text-[18px] leading-tight text-[#15803d]">(x + 2)(x + 3) = 0 → x = −2 or x = −3</div>
            </div>
            {/* written sub-note (what the teacher says, typed) */}
            <p className="mt-3 border-l-2 border-[#bfdbfe] pl-3 text-[12px] leading-relaxed text-[#475569]">
              We rewrite the quadratic as two brackets. Setting each bracket to zero gives the two solutions.
            </p>
          </div>

          {/* Captions */}
          <div className="flex items-start gap-2 rounded-[12px] bg-[#0b1220] px-3 py-2">
            <Captions className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#60a5fa]" aria-hidden />
            <p className="text-[12px] leading-snug text-slate-200">
              <span className="font-semibold text-white">Teacher:</span> Notice both numbers must satisfy the two
              conditions at once.
            </p>
          </div>

          {/* Question + controls + progress */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[12px] border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Learner question</div>
              <p className="mt-1 text-[12px] text-slate-200">“Why did the answer become negative?”</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-[6px] bg-[#2563EB] px-2 py-1 text-[10px] font-medium text-white">Answer</span>
                <span className="rounded-[6px] bg-white/10 px-2 py-1 text-[10px] text-slate-200">Show on board</span>
                <span className="rounded-[6px] bg-white/10 px-2 py-1 text-[10px] text-slate-200">Simpler</span>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-[12px] border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10"><Mic className="h-3.5 w-3.5" aria-hidden /></span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10"><Hand className="h-3.5 w-3.5" aria-hidden /></span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10"><NotebookPen className="h-3.5 w-3.5" aria-hidden /></span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10"><FileText className="h-3.5 w-3.5" aria-hidden /></span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Lesson progress</span><span className="font-semibold text-white">68%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#2563EB]" style={{ width: "68%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
