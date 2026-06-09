/**
 * classroom-ai.functions.ts
 *
 * Context-aware answering of learner questions during a classroom session.
 *
 * The AI teacher answers using the CURRENT lesson and course context (board item,
 * explanation, notes, prior questions, material context). Answers are constrained
 * to 74–150 words, in a clear teacher tone, so they read well as captions and
 * can be spoken aloud.
 *
 * Mirrors the server-function + Lovable AI gateway pattern in teacher.functions.ts.
 */

import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ContextSchema = z.object({
  institution: z.string().optional(),
  programme: z.string().optional(),
  course: z.string().optional(),
  lessonTitle: z.string(),
  currentSection: z.string().optional(),
  currentBoardItem: z.string().optional(),
  teacherExplanation: z.string().optional(),
  learnerNotes: z.string().optional(),
  previousQuestions: z.array(z.string()).max(10).optional(),
  materialContext: z.string().max(6000).optional(),
  imageDescriptions: z.array(z.string()).max(10).optional(),
  learningMode: z.string().optional(),
  learnerLevel: z.string().optional(),
});

const InputSchema = z.object({
  context: ContextSchema,
  question: z.string().min(1).max(1000),
});

export type AnswerLearnerQuestionResult = {
  answer: string;
  wordCount: number;
  source: "ai" | "fallback";
};

const MIN_WORDS = 74;
const MAX_WORDS = 150;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Trim an over-long answer to MAX_WORDS without cutting mid-sentence where possible. */
function clampWords(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= MAX_WORDS) return text.trim();
  const truncated = words.slice(0, MAX_WORDS).join(" ");
  const lastStop = Math.max(truncated.lastIndexOf("."), truncated.lastIndexOf("!"), truncated.lastIndexOf("?"));
  return lastStop > truncated.length * 0.6 ? truncated.slice(0, lastStop + 1) : truncated + "…";
}

function buildSystemPrompt(ctx: z.infer<typeof ContextSchema>): string {
  return `You are the AI teacher in a Klassruum classroom. You are answering a learner's question DURING a live lesson.

CONTEXT (the source of truth — answer only from this):
- Institution: ${ctx.institution ?? "—"}
- Programme: ${ctx.programme ?? "—"}
- Course: ${ctx.course ?? "—"}
- Lesson: ${ctx.lessonTitle}
- Current section: ${ctx.currentSection ?? "—"}
- Current board item: ${ctx.currentBoardItem ?? "—"}
- Teacher's current explanation: ${ctx.teacherExplanation ?? "—"}
- Learner notes so far: ${ctx.learnerNotes ?? "—"}
${ctx.imageDescriptions?.length ? `- Images on the board: ${ctx.imageDescriptions.join("; ")}` : ""}
${ctx.previousQuestions?.length ? `- Earlier questions: ${ctx.previousQuestions.join(" | ")}` : ""}
${ctx.materialContext ? `- Course material excerpt:\n${ctx.materialContext}` : ""}
- Learner level: ${ctx.learnerLevel ?? "school level"}
- Learning mode: ${ctx.learningMode ?? "standard"}

ANSWER RULES (strict):
- Answer the learner's question using ONLY the provided course and lesson context.
- If the question refers to the board, explain using the current board item.
- Length MUST be between ${MIN_WORDS} and ${MAX_WORDS} words. This is critical.
- Use a clear, warm, supportive teacher tone suitable for the learner level.
- Do NOT introduce unrelated content. Do NOT use markdown, headings, or lists — plain spoken prose only.
- Be encouraging. It is fine to restate the key idea simply.`;
}

/** A deterministic, context-based fallback when the AI gateway is unavailable. */
function fallbackAnswer(ctx: z.infer<typeof ContextSchema>, question: string): string {
  const board = ctx.currentBoardItem ? `Looking at the board where we have "${ctx.currentBoardItem}", ` : "";
  const explain = ctx.teacherExplanation
    ? ctx.teacherExplanation
    : `let's connect your question back to what we are doing in "${ctx.lessonTitle}".`;
  const base = `Good question. ${board}${explain} Remember the key idea of this section: ${
    ctx.currentSection ?? "the current step"
  } builds directly on what we just covered. Take it one step at a time, and check each part against the example on the board. If it still feels unclear, raise your hand and we can work through another example together. You are doing well by asking — that is exactly how strong learners think.`;
  // Ensure we sit inside the word window.
  let out = base;
  if (wordCount(out) < MIN_WORDS) {
    out += ` In short, focus on what the question is really asking, relate it to "${question.slice(0, 80)}", and move carefully through each line we wrote on the board before drawing your conclusion.`;
  }
  return clampWords(out);
}

export const answerLearnerQuestion = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AnswerLearnerQuestionResult> => {
    const key = process.env.LOVABLE_API_KEY;

    // No key configured → graceful, context-aware fallback (never blocks the class).
    if (!key) {
      const answer = fallbackAnswer(data.context, data.question);
      return { answer, wordCount: wordCount(answer), source: "fallback" };
    }

    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: buildSystemPrompt(data.context),
        prompt: `The learner asks: "${data.question}"\n\nAnswer now in ${MIN_WORDS}–${MAX_WORDS} words, plain spoken prose.`,
      });

      const answer = clampWords(text);
      return { answer, wordCount: wordCount(answer), source: "ai" };
    } catch {
      const answer = fallbackAnswer(data.context, data.question);
      return { answer, wordCount: wordCount(answer), source: "fallback" };
    }
  });
