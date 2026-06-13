import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StudentShell } from "@/components/student/StudentShell";
import { Type, Contrast, Sparkles, Captions, Volume2, Keyboard, Eye } from "lucide-react";
import {
  type AccessibilityPrefs,
  type TextScale,
  loadAccessibility,
  saveAccessibility,
} from "@/lib/accessibility";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/access")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentAccess,
});

const SCALES: { value: TextScale; label: string; sample: string }[] = [
  { value: "default", label: "Default", sample: "Aa" },
  { value: "large", label: "Large", sample: "Aa" },
  { value: "xlarge", label: "Extra large", sample: "Aa" },
];

function StudentAccess() {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(() => loadAccessibility());
  // Toggle states for lesson-facing supports (persisted alongside prefs).
  const [captions, setCaptions] = useState(true);
  const [voice, setVoice] = useState(true);
  const [keyboard, setKeyboard] = useState(true);

  useEffect(() => {
    saveAccessibility(prefs);
  }, [prefs]);

  const set = (patch: Partial<AccessibilityPrefs>) => setPrefs((p) => ({ ...p, ...patch }));

  return (
    <StudentShell title="Learning Access">
      <div className="mx-auto max-w-4xl space-y-6">
        <p className="text-[var(--gray-600)]">
          Adjust how Klassruum looks and reads for you. Changes apply across the whole app instantly —
          no exams or grades, just comfortable learning.
        </p>

        {/* Text size — low vision */}
        <section className="kr-pcard p-6">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold text-[var(--gray-900)]">Text size</h2>
          </div>
          <p className="mt-1 text-sm text-[var(--gray-500)]">
            Larger text across every page. Recommended for low-vision learners.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {SCALES.map((s) => (
              <button
                key={s.value}
                onClick={() => set({ textScale: s.value })}
                className={`flex flex-col items-center gap-2 border p-4 transition ${
                  prefs.textScale === s.value
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--gray-200)] hover:border-[var(--primary)]/40"
                }`}
              >
                <span
                  className="font-extrabold text-[var(--gray-900)]"
                  style={{ fontSize: s.value === "default" ? 20 : s.value === "large" ? 28 : 36 }}
                >
                  {s.sample}
                </span>
                <span className="text-sm font-semibold text-[var(--gray-700)]">{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Vision + motion toggles */}
        <section className="kr-pcard p-6">
          <h2 className="text-lg font-bold text-[var(--gray-900)]">Vision &amp; motion</h2>
          <div className="mt-4 space-y-3">
            <ToggleRow
              icon={Contrast}
              label="High contrast"
              desc="Stronger colors and darker text for readability."
              on={prefs.highContrast}
              onToggle={() => set({ highContrast: !prefs.highContrast })}
            />
            <ToggleRow
              icon={Sparkles}
              label="Reduce motion"
              desc="Minimize animations and movement."
              on={prefs.reducedMotion}
              onToggle={() => set({ reducedMotion: !prefs.reducedMotion })}
            />
          </div>
        </section>

        {/* Lesson supports */}
        <section className="kr-pcard p-6">
          <h2 className="text-lg font-bold text-[var(--gray-900)]">In-lesson support</h2>
          <div className="mt-4 space-y-3">
            <ToggleRow icon={Captions} label="Captions" desc="Show everything the teacher says as text." on={captions} onToggle={() => setCaptions((v) => !v)} />
            <ToggleRow icon={Volume2} label="Teacher voice" desc="Hear the teacher read and explain aloud." on={voice} onToggle={() => setVoice((v) => !v)} />
            <ToggleRow icon={Keyboard} label="Keyboard shortcuts" desc="Navigate the classroom without a mouse." on={keyboard} onToggle={() => setKeyboard((v) => !v)} />
          </div>
        </section>

        <div className="flex items-center gap-2 bg-[var(--primary-light)] p-4 text-sm text-[var(--primary)]">
          <Eye className="h-4 w-4" />
          <span className="font-semibold">Tip: choosing "Low Vision" mode inside a classroom also turns on extra-large text automatically.</span>
        </div>
      </div>
    </StudentShell>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  on,
  onToggle,
}: {
  icon: typeof Type;
  label: string;
  desc: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between border border-[var(--gray-200)] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-[var(--primary-light)] text-[var(--primary)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-[var(--gray-900)]">{label}</p>
          <p className="text-xs text-[var(--gray-500)]">{desc}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${on ? "bg-[var(--primary)]" : "bg-[var(--gray-300)]"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
