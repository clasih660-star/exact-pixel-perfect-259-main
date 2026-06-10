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

  const TABS: { id: Tab; label: string }[] = [
    { id: "notes", label: "Notes" },
    { id: "transcript", label: "Transcript" },
    { id: "progress", label: "Progress" },
    { id: "resources", label: "Resources" },
  ];

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
            {t.label}
          </button>
        ))}
      </div>

      <div className="vc-notes-body lp-scroll">
        {tab === "notes" && (
          <>
            <div className="vc-notes-head">
              <h3 className="vc-notes-title">Lesson notes</h3>
              <button className="vc-notes-action" onClick={downloadNotes}>
                Download
              </button>
            </div>

            {keyPoints.length > 0 && (
              <div className="vc-note-card vc-note-card-yellow">
                <h4 className="vc-note-card-title">Key points</h4>
                <ul className="vc-note-card-list">
                  {keyPoints.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="vc-note-card vc-note-card-blue">
              <h4 className="vc-note-card-title">Lesson notes</h4>
              <p className="vc-note-card-body">{learnerNotes}</p>
            </div>
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
