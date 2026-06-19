/**
 * InlineEngagementArea
 *
 * The non-disruptive replacement for engagement popups. The AI teacher's checks,
 * clarifications, hints, recaps, and after-answer prompts render HERE — inline,
 * between the whiteboard and the caption bar — instead of trapping the learner in
 * modal overlays.
 *
 * Accessibility:
 *   • role="status" + aria-live="polite" so screen readers announce each prompt
 *     (no modal focus trap).
 *   • Real <button>s with visible focus rings; keyboard-friendly; large hit areas.
 *   • Never relies on colour alone (feedback carries an icon + text).
 *   • Optional inline text reply (no forced voice; no separate modal).
 */

import { useState } from "react";
import type { EngagementPrompt, LearningMode } from "@/lib/types";

/**
 * Accessibility-aware surface selector. Critical actions use a modal; blind /
 * low-vision learners get a screen-reader-announced prompt; everyone else gets a
 * non-disruptive inline surface. (Long typed input may use the right drawer.)
 */
export function chooseInteractionSurface(
  mode: LearningMode,
  intent: string,
):
  | "caption_actions"
  | "inline_under_board"
  | "right_drawer"
  | "bottom_sheet"
  | "screen_reader_prompt"
  | "modal_critical_only" {
  if (intent === "critical_error" || intent === "end_session" || intent === "resume_session") {
    return "modal_critical_only";
  }
  if (mode === "blind" || mode === "low_vision" || mode === "deaf_blind") {
    return "screen_reader_prompt";
  }
  if (mode === "adhd_focus") return "caption_actions";
  if (mode === "motor_support" || mode === "speech_difficulty") return "inline_under_board";
  if (intent === "long_question_input") return "right_drawer";
  return "inline_under_board";
}

const KIND_BADGE: Record<string, { label: string; icon: string }> = {
  checkpoint: { label: "Check-in", icon: "💬" },
  clarification: { label: "Quick clarification", icon: "🤔" },
  hint: { label: "Hint", icon: "💡" },
  after_answer: { label: "Teacher", icon: "👩🏽‍🏫" },
  confidence_check: { label: "How are you feeling?", icon: "📊" },
  recap: { label: "Quick recap", icon: "📋" },
  thinking_pause: { label: "Take a moment", icon: "💭" },
  middle_question: { label: "Your turn", icon: "❓" },
  exit_reflection: { label: "One last reflection", icon: "🪞" },
  idle: { label: "", icon: "" },
};

export function InlineEngagementArea({
  prompt,
  learningMode,
  onAction,
  onTextReply,
}: {
  prompt: EngagementPrompt | null;
  learningMode: LearningMode;
  /** Called with the action id when the learner taps a button. */
  onAction: (actionId: string) => void;
  /** Called when the learner submits a free-text reply (clarification). */
  onTextReply?: (text: string) => void;
}) {
  const [reply, setReply] = useState("");
  if (!prompt || prompt.kind === "idle") return null;

  const badge = KIND_BADGE[prompt.kind] ?? KIND_BADGE.checkpoint;
  // Motor / speech modes get extra-large, stacked buttons.
  const bigButtons = learningMode === "motor_support" || learningMode === "speech_difficulty";

  const submitReply = () => {
    const t = reply.trim();
    if (!t) return;
    setReply("");
    onTextReply?.(t);
  };

  return (
    <section
      className="vc-engagement"
      role="status"
      aria-live="polite"
      aria-label={`Teacher: ${prompt.title}`}
    >
      <div className="vc-engagement-head">
        <span className="vc-engagement-badge">
          <span aria-hidden>{badge.icon}</span> {badge.label}
        </span>
      </div>

      <p className="vc-engagement-title">{prompt.title}</p>

      {prompt.body && <p className="vc-engagement-body">{prompt.body}</p>}
      {prompt.bodyList && prompt.bodyList.length > 0 && (
        <ul className="vc-engagement-list">
          {prompt.bodyList.map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}

      {prompt.feedback && (
        <p className={`vc-engagement-feedback vc-engagement-feedback-${prompt.feedback.tone}`}>
          <span aria-hidden>
            {prompt.feedback.tone === "correct"
              ? "✓ "
              : prompt.feedback.tone === "incorrect"
                ? "✗ "
                : "• "}
          </span>
          {prompt.feedback.text}
        </p>
      )}

      {prompt.actions.length > 0 && (
        <div
          className={`vc-engagement-actions ${bigButtons ? "vc-engagement-actions-stacked" : ""}`}
        >
          {prompt.actions.map((a: { id: string; label: string; primary?: boolean }) => (
            <button
              key={a.id}
              type="button"
              className={`vc-engagement-btn ${a.primary ? "vc-engagement-btn-primary" : ""}`}
              onClick={() => onAction(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {prompt.allowTextReply && (
        <form
          className="vc-engagement-reply"
          onSubmit={(e) => {
            e.preventDefault();
            submitReply();
          }}
        >
          <input
            className="vc-engagement-input"
            placeholder="Type your answer…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            aria-label="Type your reply to the teacher"
          />
          <button
            type="submit"
            className="vc-engagement-btn vc-engagement-btn-primary"
            disabled={!reply.trim()}
          >
            Send
          </button>
        </form>
      )}
    </section>
  );
}
