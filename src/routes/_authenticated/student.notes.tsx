import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StudentShell } from "@/components/student/StudentShell";
import { FileText, Search, Download, BookOpen, Calculator, AlertTriangle } from "lucide-react";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/notes")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentNotes,
});

type Note = {
  id: string;
  title: string;
  course: string;
  lesson: string;
  date: string;
  objective: string;
  keyIdeas: string[];
  calculations: { expr: string; explain: string }[];
  commonMistake?: string;
};

// Demo notes — in production these are generated from teacher explanations
// during each lesson and stored in session_notes / lesson notes.
const NOTES: Note[] = [
  {
    id: "n1",
    title: "Solving Quadratics by Factoring",
    course: "Mathematics Form 2",
    lesson: "Quadratic Equations",
    date: "Jun 9, 2026",
    objective: "Solve a simple quadratic equation by rewriting it into two brackets.",
    keyIdeas: [
      "A quadratic equation has x² as its highest power.",
      "Find two numbers that multiply to the constant term.",
      "The same two numbers must add to the middle coefficient.",
      "Set each bracket to zero to find the solutions.",
    ],
    calculations: [
      {
        expr: "2 × 3 = 6",
        explain: "Confirms the multiplication condition — 2 and 3 multiply to the constant term 6.",
      },
      {
        expr: "2 + 3 = 5",
        explain:
          "Confirms the addition condition — the same numbers add to the middle coefficient 5.",
      },
    ],
    commonMistake: "Do not choose 1 and 6. They multiply to 6, but add to 7, not 5.",
  },
  {
    id: "n2",
    title: "Chemical Reactions: Balancing Equations",
    course: "KCSE Chemistry Revision",
    lesson: "Chemical Reactions",
    date: "Jun 6, 2026",
    objective: "Balance simple chemical equations by conserving atoms on both sides.",
    keyIdeas: [
      "Atoms are never created or destroyed in a reaction.",
      "Balance one element at a time.",
      "Only change coefficients, never subscripts.",
    ],
    calculations: [
      {
        expr: "2H₂ + O₂ → 2H₂O",
        explain:
          "Two hydrogen molecules react with one oxygen molecule to form two water molecules.",
      },
    ],
    commonMistake:
      "Changing a subscript changes the substance itself — adjust coefficients instead.",
  },
];

function StudentNotes() {
  const [activeId, setActiveId] = useState(NOTES[0].id);
  const [query, setQuery] = useState("");
  const filtered = NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.course.toLowerCase().includes(query.toLowerCase()),
  );
  const active = NOTES.find((n) => n.id === activeId) ?? NOTES[0];

  const download = () => {
    const text = [
      `Lesson: ${active.title}`,
      `Course: ${active.course}`,
      ``,
      `Objective:\n${active.objective}`,
      ``,
      `Key ideas:`,
      ...active.keyIdeas.map((k) => `• ${k}`),
      ``,
      `Calculations:`,
      ...active.calculations.map((c) => `${c.expr}\n  ${c.explain}`),
      active.commonMistake ? `\nCommon mistake:\n${active.commonMistake}` : "",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.title} - Notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <StudentShell title="Notes">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.7fr]">
        {/* List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              className="w-full rounded-xl border border-[var(--gray-200)] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          {filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`kr-pcard kr-note-card block w-full p-4 text-left ${n.id === activeId ? "ring-2 ring-[var(--primary)]" : ""}`}
            >
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <FileText className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wide">{n.course}</span>
              </div>
              <h3 className="mt-1.5 font-semibold text-[var(--gray-900)]">{n.title}</h3>
              <p className="mt-0.5 text-xs text-[var(--gray-400)]">{n.date}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-[var(--gray-500)]">No notes match your search.</p>
          )}
        </div>

        {/* Detail */}
        <div className="kr-pcard p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--primary)]">
                {active.course} · {active.lesson}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--gray-900)]">
                {active.title}
              </h2>
            </div>
            <button
              onClick={download}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--gray-200)] px-3 py-2 text-xs font-semibold text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>

          <section className="mt-6">
            <h4 className="flex items-center gap-2 text-sm font-bold text-[var(--gray-900)]">
              <BookOpen className="h-4 w-4 text-[var(--primary)]" /> Objective
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--gray-600)]">
              {active.objective}
            </p>
          </section>

          <section className="mt-6">
            <h4 className="text-sm font-bold text-[var(--gray-900)]">Key ideas</h4>
            <ul className="mt-2 space-y-2">
              {active.keyIdeas.map((k, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-[var(--gray-600)]">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--primary)]" />
                  {k}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h4 className="flex items-center gap-2 text-sm font-bold text-[var(--gray-900)]">
              <Calculator className="h-4 w-4 text-[var(--primary)]" /> Calculations explained
            </h4>
            <div className="mt-2 space-y-3">
              {active.calculations.map((c, i) => (
                <div key={i} className="rounded-xl bg-[var(--gray-50)] p-4">
                  <p className="font-mono text-base font-bold text-[var(--gray-900)]">{c.expr}</p>
                  <p className="mt-1 text-sm text-[var(--gray-600)]">{c.explain}</p>
                </div>
              ))}
            </div>
          </section>

          {active.commonMistake && (
            <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-amber-700">
                <AlertTriangle className="h-4 w-4" /> Common mistake
              </h4>
              <p className="mt-1.5 text-sm text-amber-800">{active.commonMistake}</p>
            </section>
          )}

          <div className="mt-6 border-t border-[var(--gray-100)] pt-4">
            <Link
              to="/demo/ai-video"
              className="kr-btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
            >
              Replay this lesson
            </Link>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
