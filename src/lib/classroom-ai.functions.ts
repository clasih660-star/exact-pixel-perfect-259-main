/**
 * classroom-ai.functions.ts
 *
 * The AI teacher's "brain" for answering learner questions DURING a live lesson.
 *
 * A real tutor does not blindly answer every question. They:
 *   1. Judge whether the question is clear, unclear, or off-topic.
 *   2. If UNCLEAR  → ask ONE clarifying question (with quick-pick options).
 *   3. If OFF-TOPIC → gently steer back, offer a short answer or to continue.
 *   4. If CLEAR    → answer in 74–150 words using ONLY the lesson/course context,
 *                    adapt the style to the learner's academic level, decide if it
 *                    should also be shown on the board, whether to save it to notes,
 *                    and suggest a natural follow-up.
 *
 * Returns a structured `TeacherAnswer` (see types.ts). Stays backward-compatible:
 * the flat `answer` / `wordCount` / `source` fields are still present so existing
 * callers keep working.
 *
 * Uses the Lovable AI gateway (structured `generateObject`). Falls back to a
 * deterministic, context-aware response when the gateway is unavailable, so the
 * class is never blocked.
 */

import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import type { AcademicLevel, TeacherAnswer } from "./types";

const ACADEMIC_LEVELS = ["elementary", "secondary", "college", "tertiary", "adult"] as const;

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
  academicLevel: z.enum(ACADEMIC_LEVELS).optional(),
  /** A prior clarifying question the teacher asked, if this is a follow-up turn. */
  priorClarification: z.string().optional(),
});

const InputSchema = z.object({
  context: ContextSchema,
  question: z.string().min(1).max(1000),
});

/** Structured output schema the model must satisfy. */
const TeacherAnswerSchema = z.object({
  clarity: z.enum(["clear", "unclear", "off_topic"]),
  clarificationQuestion: z.string().optional(),
  clarificationOptions: z.array(z.string()).max(4).optional(),
  answer: z.string().optional(),
  shouldShowOnBoard: z.boolean(),
  boardItems: z.array(z.object({ type: z.string(), text: z.string() })).max(6).optional(),
  saveToNotes: z.boolean(),
  suggestedFollowUp: z.string(),
});

/** Backward-compatible result shape: structured TeacherAnswer + flat fields. */
export type AnswerLearnerQuestionResult = TeacherAnswer & {
  /** Flat answer string (empty when clarity !== "clear"). Back-compat. */
  answer: string;
  wordCount: number;
};

const MIN_WORDS = 74;
const MAX_WORDS = 150;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function clampWords(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= MAX_WORDS) return text.trim();
  const truncated = words.slice(0, MAX_WORDS).join(" ");
  const lastStop = Math.max(truncated.lastIndexOf("."), truncated.lastIndexOf("!"), truncated.lastIndexOf("?"));
  return lastStop > truncated.length * 0.6 ? truncated.slice(0, lastStop + 1) : truncated + "…";
}

/** Teaching-style guidance injected into the prompt for each academic level. */
function levelStyle(level: AcademicLevel | undefined): string {
  switch (level) {
    case "elementary":
      return "Learner is an ELEMENTARY/PRIMARY child. Use very simple words and short sentences. Go slowly, one idea at a time. Be warm and encouraging ('Great effort!'). Use a concrete everyday example. Avoid jargon entirely.";
    case "secondary":
      return "Learner is a SECONDARY/HIGH-SCHOOL student. Explain step by step with a worked example. Name the one common mistake to avoid. Keep it clear and exam-aware but not intimidating.";
    case "college":
      return "Learner is a COLLEGE/VOCATIONAL student. Use correct technical vocabulary, give an applied example, and explain the reasoning. Less hand-holding.";
    case "tertiary":
      return "Learner is a UNIVERSITY/TERTIARY student. Give deeper reasoning, precise terminology, and the 'why it is valid'. Reference where the concept applies. Minimal repetition.";
    case "adult":
      return "Learner is an ADULT/PROFESSIONAL. Be efficient and practical. Lead with the shortest reliable method and a real-world application. Offer an optional deeper dive.";
    default:
      return "Learner is at school level. Explain clearly, step by step, with a short example and a supportive tone.";
  }
}

function buildSystemPrompt(ctx: z.infer<typeof ContextSchema>): string {
  return `You are the AI teacher inside Klassruum, answering a learner's question DURING a live lesson. You behave like a real, caring tutor — not a search engine.

CONTEXT (the ONLY source of truth — answer from this):
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
${ctx.priorClarification ? `- You already asked the learner to clarify: "${ctx.priorClarification}". Treat their message as the clarification and answer directly now.` : ""}
- Learning mode: ${ctx.learningMode ?? "standard"}

TEACHING STYLE:
${levelStyle(ctx.academicLevel)}

DECIDE clarity:
- "unclear": the question is too short/vague, has an ambiguous reference ("this", "why this?", "I don't get it"), or could mean several parts of the lesson. Do NOT guess. Set clarity="unclear" and provide ONE short clarificationQuestion plus 2–4 clarificationOptions naming the likely parts of the CURRENT board/section. Leave answer empty.
- "off_topic": the question is unrelated to this lesson or needs future content. Set clarity="off_topic", briefly acknowledge in 'answer' (2–3 sentences), and steer back with suggestedFollowUp.
- "clear": answer it.

WHEN CLEAR — fill 'answer' with plain spoken prose (NO markdown/lists/headings), 74–150 words, warm and supportive, using ONLY the lesson context. Then:
- shouldShowOnBoard: true only if a tiny worked line/diagram would genuinely help; if so add 1–3 boardItems (type like "calculation"/"equation"/"bullet").
- saveToNotes: true if the answer contains a reusable idea, rule, or correction worth revising later.
- suggestedFollowUp: one short offer, e.g. "Want me to show this on the board?" or "Shall I give another example?".

The 'answer' will be READ ALOUD by the teacher and shown as CAPTIONS, so keep it speakable.`;
}

/** Heuristic clarity check used by the deterministic fallback. */
function looksUnclear(question: string): boolean {
  const q = question.trim().toLowerCase();
  if (wordCount(q) <= 3) return true;
  const vague = [
    "i don't get it", "i dont get it", "why this", "what", "huh", "this?",
    "i'm lost", "im lost", "explain", "i don't understand", "i dont understand",
    "confused", "?", "this one",
  ];
  return vague.some((v) => q === v || q === v + "?" || (q.length <= 14 && q.includes(v)));
}

function fallbackTeacherAnswer(
  ctx: z.infer<typeof ContextSchema>,
  question: string,
): TeacherAnswer {
  // Unclear (and not already a clarification round) → ask to clarify.
  if (looksUnclear(question) && !ctx.priorClarification) {
    const section = ctx.currentSection ?? "this step";
    return {
      clarity: "unclear",
      clarificationQuestion: `I want to answer clearly. Which part of ${section} do you mean?`,
      clarificationOptions: ["Finding the numbers", "Writing the brackets", "Getting the final values", "Type my question"],
      shouldShowOnBoard: false,
      saveToNotes: false,
      suggestedFollowUp: "Pick the part that's confusing and I'll explain just that.",
      source: "fallback",
    };
  }

  const board = ctx.currentBoardItem ? `Looking at the board where we have "${ctx.currentBoardItem}", ` : "";
  const explain = ctx.teacherExplanation
    ? ctx.teacherExplanation
    : `let's connect your question back to what we are doing in "${ctx.lessonTitle}".`;
  let out = `Good question. ${board}${explain} Remember the key idea of this section: ${
    ctx.currentSection ?? "the current step"
  } builds directly on what we just covered. Take it one step at a time, and check each part against the example on the board. If it still feels unclear, raise your hand and we can work through another example together. You are doing well by asking — that is exactly how strong learners think.`;
  if (wordCount(out) < MIN_WORDS) {
    out += ` In short, focus on what the question is really asking, relate it to "${question.slice(0, 80)}", and move carefully through each line we wrote on the board before drawing your conclusion.`;
  }
  out = clampWords(out);
  return {
    clarity: "clear",
    answer: out,
    shouldShowOnBoard: false,
    saveToNotes: true,
    suggestedFollowUp: "Does that help, or should I show another example?",
    source: "fallback",
  };
}

/** Normalise a structured TeacherAnswer into the back-compat result shape. */
function toResult(a: TeacherAnswer): AnswerLearnerQuestionResult {
  const flat = a.clarity === "clear" ? (a.answer ?? "") : (a.clarificationQuestion ?? a.answer ?? "");
  return { ...a, answer: flat, wordCount: wordCount(flat) };
}

export const answerLearnerQuestion = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AnswerLearnerQuestionResult> => {
    const key = process.env.LOVABLE_API_KEY;

    if (!key) {
      return toResult(fallbackTeacherAnswer(data.context, data.question));
    }

    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { object } = await generateObject({
        model: gateway("google/gemini-3-flash-preview"),
        schema: TeacherAnswerSchema,
        system: buildSystemPrompt(data.context),
        prompt: `The learner asks: "${data.question}"\n\nReturn the structured teacher response now. If clear, the 'answer' must be ${MIN_WORDS}–${MAX_WORDS} words of plain spoken prose.`,
      });

      // Clamp an over-long answer and enforce the back-compat shape.
      const normalised: TeacherAnswer = {
        clarity: object.clarity,
        clarificationQuestion: object.clarificationQuestion,
        clarificationOptions: object.clarificationOptions,
        answer: object.answer ? clampWords(object.answer) : undefined,
        shouldShowOnBoard: object.shouldShowOnBoard,
        boardItems: object.boardItems,
        saveToNotes: object.saveToNotes,
        suggestedFollowUp: object.suggestedFollowUp,
        source: "ai",
      };
      return toResult(normalised);
    } catch {
      return toResult(fallbackTeacherAnswer(data.context, data.question));
    }
  });
