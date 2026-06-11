/**
 * ClassroomNotesPanel — the persistent right-hand learning panel.
 *
 * Replaces the old single-purpose "subject visual" rail with a tabbed panel
 * (Notes · Transcript · Progress · Resources) that stays visible beside the
 * whiteboard, matching the Klassruum classroom reference. It reuses the lesson's
 * existing data (learner notes, live transcript, progress, board key points) — no
 * new data sources — and keeps the whiteboard as the dominant surface.
 *
 * Light premium theme (white surface, soft-blue accents, navy text).
 */

import { useState, type ReactNode } from "react";
import type { TranscriptEntry } from "@/lib/types";

type Tab = "notes" | "transcript" | "progress" | "resources";

export function ClassroomNotesPanel({
  learnerNotes,
  keyPoints,
  transcript,
  progress,
  currentSectionLabel,
  resources,
}: {
  learnerNotes: string;
  keyPoints: string[];
  transcript: TranscriptEntry[];
  progress: number;
  currentSectionLabel: string;
  /** Optional subject-specific visual (e.g. the demo math graph) for Resources. */
  resources?: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("notes");
  /** Learner-added notes (kept locally; the lesson notes are read-only). */
  const [myNotes, setMyNotes] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "notes", label: "Notes", icon: <IconNotes /> },
    { id: "transcript", label: "Transcript", icon: <IconTranscript /> },
    { id: "progress", label: "Progress", icon: <IconProgress /> },
    { id: "resources", label: "Resources", icon: <IconResources /> },
  ];

  function addNote() {
    const t = draft.trim();
    if (!t) { setAdding(false); return; }
    setMyNotes((n) => [...n, t]);
    setDraft("");
    setAdding(false);
  }

  function downloadNotes() {
    const blob = new Blob([learnerNotes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Lesson notes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <aside className="vc-notes-panel" aria-label="Learning panel">
      <div className="vc-notes-tabs" role="tablist" aria-label="Learning panel tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`vc-notes-tab ${tab === t.id ? "vc-notes-tab-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className="vc-notes-tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="vc-notes-body lp-scroll">
        {tab === "notes" && (
          <>
            <div className="vc-notes-head">
              <h3 className="vc-notes-title">Lesson Notes</h3>
              <button
                className="vc-notes-action"
                onClick={() => setMyNotes([])}
                disabled={myNotes.length === 0}
              >
                Clear Notes
              </button>
            </div>

            {/* Auto-captured key points — one card each (matches reference) */}
            {keyPoints.map((p, i) => (
              <div key={i} className="vc-keynote-card">
                <p className="vc-keynote-text">{p}</p>
              </div>
            ))}

            {/* Curated lesson summary */}
            <div className="vc-note-card vc-note-card-blue">
              <h4 className="vc-note-card-title">Lesson summary</h4>
              <p className="vc-note-card-body">{learnerNotes}</p>
            </div>

            {/* Learner's own notes */}
            {myNotes.map((n, i) => (
              <div key={`my-${i}`} className="vc-note-card vc-note-card-green">
                <p className="vc-note-card-body">{n}</p>
              </div>
            ))}

            {adding ? (
              <div className="vc-addnote">
                <textarea
                  className="vc-addnote-input"
                  rows={3}
                  placeholder="Write a note for yourself…"
                  value={draft}
                  autoFocus
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote(); }}
                />
                <div className="vc-addnote-actions">
                  <button className="vc-addnote-save" onClick={addNote}>Save</button>
                  <button className="vc-addnote-cancel" onClick={() => { setAdding(false); setDraft(""); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="vc-addnote-btn" onClick={() => setAdding(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Note
              </button>
            )}

            <button className="vc-notes-download" onClick={downloadNotes}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download notes
            </button>
          </>
        )}

        {tab === "transcript" && (
          <div className="vc-notes-transcript">
            {transcript.length === 0 ? (
              <p className="vc-notes-empty">The transcript will fill in as the lesson plays.</p>
            ) : (
              transcript.map((e) => (
                <div key={e.id} className={`vc-tr-row vc-tr-${e.role}`}>
                  <div className="vc-tr-meta">
                    {e.role === "board"
                      ? "📋 Board"
                      : e.role === "student"
                        ? "🙋 You"
                        : e.role === "system"
                          ? "⚙️ System"
                          : "👨🏽‍🏫 Teacher"}
                    <span className="vc-tr-time">{e.timestamp}</span>
                  </div>
                  <div className="vc-tr-text">{e.text}</div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "progress" && (
          <div className="vc-notes-progress">
            <div className="vc-note-card vc-note-card-blue">
              <h4 className="vc-note-card-title">Lesson progress</h4>
              <div className="vc-progress-bigrow">
                <span className="vc-progress-bignum">{progress}%</span>
                <span className="vc-progress-biglabel">complete</span>
              </div>
              <div className="vc-progress-track">
                <div className="vc-progress-trackfill" style={{ width: `${progress}%` }} />
              </div>
              <p className="vc-note-card-body" style={{ marginTop: 10 }}>
                Current section: <strong>{currentSectionLabel}</strong>
              </p>
            </div>
            <p className="vc-notes-empty">
              Your progress is learning activity — not a grade. It saves automatically as you go.
            </p>
          </div>
        )}

        {tab === "resources" && (
          <div className="vc-notes-resources">
            {resources ?? <p className="vc-notes-empty">Resources for this lesson will appear here.</p>}
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Tab icons ────────────────────────────────────────────────────────────────
function IconNotes() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IconTranscript() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <line x1="7" y1="9" x2="17" y2="9" /><line x1="7" y1="13" x2="13" y2="13" />
    </svg>
  );
}
function IconProgress() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" />
    </svg>
  );
}
function IconResources() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
