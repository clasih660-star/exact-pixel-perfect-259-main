/**
 * classroom-adaptive-interjection.ts
 *
 * AI-powered adaptive interjection generator. When the confusion tracker
 * detects that a learner is struggling, this function can generate a richer,
 * more targeted intervention than the deterministic templates.
 *
 * Usage: call async from the classroom when an intervention is triggered.
 * The deterministic template is shown immediately; if this function returns
 * before the template finishes, its result can replace/augment the text.
 *
 * Graceful: if no AI provider is available, returns null and the template
 * text from classroom-confusion-tracker.ts is used instead.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createResilientModelCaller } from "./ai-gateway.server";
import type { ConfusionState, ConfusionSignalType } from "./classroom-confusion-tracker";

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────

const InputSchema = z.object({
  confusionState: z.object({
    confusionScore: z.number(),
    confusedSections: z.array(z.string()),
    interventionType: z.enum(["recap", "thinking_pause", "encouragement", "none"]),
    dominantSignal: z.enum([
      "quick_action_confused",
      "repeated_question",
      "long_idle",
      "multiple_hints",
      "practice_wrong",
      "raise_hand",
      "sentiment_frustrated",
    ]).nullable(),
  }),
  context: z.object({
    lessonTitle: z.string(),
    currentSection: z.string(),
    currentBoardItem: z.string().optional(),
    teacherExplanation: z.string().optional(),
    academicLevel: z.string().optional(),
  }),
});

const InterventionSchema = z.object({
  spokenText: z.string().max(300),
  boardItem: z
    .object({ type: z.string(), text: z.string() })
    .optional(),
  strategy: z.enum([
    "recap",
    "simplify",
    "example",
    "encourage",
    "pause_and_ask",
  ]),
});

// ─────────────────────────────────────────────────────────────────────────────
// Server function
// ─────────────────────────────────────────────────────────────────────────────

export const generateAdaptiveIntervention = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const caller = createResilientModelCaller("adaptive_intervention");
    if (!caller) return null;

    try {
      const result = await caller.call(
        InterventionSchema,
        `You are an empathetic AI teacher in a live classroom. A confusion-detection system has flagged that the learner may be struggling. Generate a short, spoken intervention to help them.

RULES:
- Maximum 3 sentences, warm and supportive.
- Do NOT say "the system detected" or reference any AI/mechanism.
- Speak directly to the learner as a caring teacher.
- Address the specific confusion pattern (see context).
- Offer a concrete next step (re-explain, simpler example, short recap).`,
        `LESSON: "${data.context.lessonTitle}"
SECTION: ${data.context.currentSection}
CURRENT BOARD: ${data.context.currentBoardItem ?? "—"}
TEACHER'S EXPLANATION: ${data.context.teacherExplanation ?? "—"}
ACADEMIC LEVEL: ${data.context.academicLevel ?? "secondary"}

CONFUSION DATA:
- Score: ${data.confusionState.confusionScore.toFixed(2)}
- Dominant signal: ${data.confusionState.dominantSignal ?? "mixed"}
- Confused sections: ${data.confusionState.confusedSections.join(", ") || "current section"}
- Requested intervention type: ${data.confusionState.interventionType}

Generate the intervention now.`,
      );

      if (!result) return null;
      return {
        spokenText: result.object.spokenText,
        boardItem: result.object.boardItem,
        strategy: result.object.strategy,
        provider: result.provider,
      };
    } catch {
      return null;
    }
  });
