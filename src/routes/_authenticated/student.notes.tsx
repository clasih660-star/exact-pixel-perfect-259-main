import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StudentShell } from "@/components/student/StudentShell";
import { FileText, Search, Download, BookOpen, NotebookPen } from "lucide-react";
import { requireStudent } from "@/lib/route-guards";
import { getStudentNotes } from "@/lib/student.functions";

export const Route = createFileRoute("/_authenticated/student/notes")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentNotes,
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function StudentNotes() {
  const fn = useServerFn(getStudentNotes);
  const q = useQuery({ queryKey: ["student-notes"], queryFn: () => fn() });
  const notes = q.data?.notes ?? [];
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      notes.filter(
        (n: any) =>
          (n.title ?? "").toLowerCase().includes(query.toLowerCase()) ||
          (n.courseTitle ?? "").toLowerCase().includes(query.toLowerCase()) ||
          (n.lessonTitle ?? "").toLowerCase().includes(query.toLowerCase()),
      ),
    [notes, query],
  );

  const active = (notes.find((n: any) => n.id === activeId) ?? notes[0] ?? null) as any;

  const noteLines: string[] = Array.isArray(active?.notesJson)
    ? (active.notesJson as any[]).map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
    : [];

  const download = () => {
    if (!active) return;
    const text = [
      `${active.title}`,
      `${active.courseTitle} · ${active.lessonTitle}`,
      ``,
      active.body ?? "",
      noteLines.length ? `\nPoints:\n${noteLines.map((l) => `• ${l}`).join("\n")}` : "",
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
          {q.isLoading ? (
            <p className="text-sm text-[var(--gray-500)]">Loading notes…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-[var(--gray-500)]">
              {notes.length === 0
                ? "No notes yet — they are saved automatically as you learn."
                : "No notes match your search."}
            </p>
          ) : (
            filtered.map((n: any) => (
              <button
                key={n.id}
                onClick={() => setActiveId(n.id)}
                className={`kr-pcard kr-note-card block w-full p-4 text-left ${n.id === active?.id ? "ring-2 ring-[var(--primary)]" : ""}`}
              >
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <FileText className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wide">{n.courseTitle}</span>
                </div>
                <h3 className="mt-1.5 font-semibold text-[var(--gray-900)]">{n.title}</h3>
                <p className="mt-0.5 text-xs text-[var(--gray-400)]">
                  {n.lessonTitle} · {formatDate(n.date)}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="kr-pcard p-6">
          {q.isLoading ? (
            <p className="text-sm text-[var(--gray-500)]">Loading…</p>
          ) : !active ? (
            <div className="py-16 text-center">
              <NotebookPen className="mx-auto mb-3 h-8 w-8 text-[var(--gray-400)]" />
              <p className="text-sm font-semibold text-[var(--gray-900)]">No notes yet</p>
              <p className="mt-1 text-sm text-[var(--gray-500)]">
                Enter a classroom and complete a lesson — your notes will be saved here.
              </p>
              <Link
                to="/student/classrooms"
                className="kr-btn-primary mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              >
                Go to Classrooms
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--primary)]">
                    {active.courseTitle} · {active.lessonTitle}
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

              {active.body && (
                <section className="mt-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-[var(--gray-900)]">
                    <BookOpen className="h-4 w-4 text-[var(--primary)]" /> Summary
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--gray-600)]">
                    {active.body}
                  </p>
                </section>
              )}

              {noteLines.length > 0 && (
                <section className="mt-6">
                  <h4 className="text-sm font-bold text-[var(--gray-900)]">Key points</h4>
                  <ul className="mt-2 space-y-2">
                    {noteLines.map((k, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-[var(--gray-600)]">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--primary)]" />
                        {k}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="mt-6 border-t border-[var(--gray-100)] pt-4">
                <Link
                  to="/student/classrooms"
                  className="kr-btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                >
                  Back to Classrooms
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </StudentShell>
  );
}
