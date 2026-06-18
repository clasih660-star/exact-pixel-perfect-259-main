/**
 * sentiment-analysis.ts
 *
 * Dual-mode learner sentiment analyzer for the live classroom.
 *
 * 1. Keyword-based (synchronous, zero-latency, always available):
 *    Fast pattern matching that detects frustration, confusion, anxiety,
 *    engagement, and positive signals in the learner's text.
 *
 * 2. AI-powered (async, when a provider is available):
 *    Richer analysis via the resilient model caller. Falls back gracefully.
 *
 * The keyword analyser mirrors the pattern already proven in
 * autonomous-teaching-engine.ts but with expanded coverage.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createResilientModelCaller } from "./ai-gateway.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertActorHasAnyRole } from "@/lib/server-authorization";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SentimentTone =
  | "positive"
  | "neutral"
  | "confused"
  | "frustrated"
  | "anxious"
  | "engaged";

export type SentimentResult = {
  /** Dominant emotional tone detected in the text. */
  tone: SentimentTone;
  /** How confident the analysis is (0–1). Keyword mode is typically 0.5–0.8. */
  confidence: number;
  /** Frustration severity (0 = not frustrated, 1 = very frustrated). */
  frustrationScore: number;
  /** The specific keywords/phrases that triggered the detection. */
  keywords: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Keyword patterns
// ─────────────────────────────────────────────────────────────────────────────

const PATTERNS: {
  tone: SentimentTone;
  keywords: string[];
  weight: number;
}[] = [
  // Frustration (highest priority — these signal the learner may disengage)
  {
    tone: "frustrated",
    keywords: [
      "frustrated",
      "annoyed",
      "angry",
      "this is stupid",
      "waste of time",
      "can't do this",
      "impossible",
      "giving up",
      "i hate",
      "too hard",
      "no point",
      "doesn't make sense",
      "makes no sense",
      "this is wrong",
      "i don't get why",
      "this is confusing",
      "so confusing",
      "i'm stuck",
      "what is going on",
      "lost",
      "completely lost",
    ],
    weight: 0.8,
  },
  // Confusion
  {
    tone: "confused",
    keywords: [
      "confused",
      "don't understand",
      "dont understand",
      "i don't get it",
      "i dont get it",
      "what",
      "huh",
      "unclear",
      "i'm lost",
      "im lost",
      "explain",
      "i don't understand",
      "i dont understand",
      "not sure",
      "??",
      "what does",
      "how come",
      "why is",
      "i don't see",
    ],
    weight: 0.5,
  },
  // Anxiety
  {
    tone: "anxious",
    keywords: [
      "nervous",
      "worried",
      "scared",
      "anxious",
      "what if i fail",
      "i'm afraid",
      "not confident",
      "i feel dumb",
      "everyone else",
      "behind",
      "falling behind",
    ],
    weight: 0.6,
  },
  // Engagement (positive interaction signals)
  {
    tone: "engaged",
    keywords: [
      "interesting",
      "got it",
      "cool",
      "i see",
      "makes sense now",
      "thanks",
      "tell me more",
      "what about",
      "can you show",
      "another example",
      "go deeper",
      "what if",
    ],
    weight: 0.4,
  },
  // Positive (clear understanding)
  {
    tone: "positive",
    keywords: [
      "easy",
      "clear",
      "great",
      "awesome",
      "perfect",
      "understood",
      "i get it",
      "that helps",
      "now i understand",
      "makes sense",
      "crystal clear",
      "simple",
      "straightforward",
    ],
    weight: 0.3,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Keyword-based analyser (synchronous, always available)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fast, synchronous sentiment analysis using keyword matching.
 * Returns the dominant tone, a confidence score, and a frustration score.
 * Zero latency — safe to call in the hot path of the teaching loop.
 */
export function analyzeSentimentKeywords(text: string): SentimentResult {
  const lower = text.trim().toLowerCase();

  // Short text heuristic — very short inputs are ambiguous
  const words = lower.split(/\s+/).filter(Boolean);
  if (words.length <= 1 && lower.length <= 3) {
    return { tone: "neutral", confidence: 0.3, frustrationScore: 0, keywords: [] };
  }

  // Score each tone category
  const matches: { tone: SentimentTone; score: number; keywords: string[] }[] = [];

  for (const pattern of PATTERNS) {
    const matched: string[] = [];
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) {
        matched.push(kw);
      }
    }
    if (matched.length > 0) {
      matches.push({
        tone: pattern.tone,
        score: pattern.weight * Math.min(matched.length, 3),
        keywords: matched,
      });
    }
  }

  if (matches.length === 0) {
    return { tone: "neutral", confidence: 0.5, frustrationScore: 0, keywords: [] };
  }

  // Sort by score descending — the highest-scoring category wins
  matches.sort((a, b) => b.score - a.score);
  const best = matches[0];

  // Compute frustration score: direct mapping from negative tones
  let frustrationScore = 0;
  if (best.tone === "frustrated") frustrationScore = Math.min(1, best.score);
  else if (best.tone === "anxious") frustrationScore = Math.min(0.7, best.score * 0.7);
  else if (best.tone === "confused") frustrationScore = Math.min(0.5, best.score * 0.5);

  return {
    tone: best.tone,
    confidence: Math.min(0.9, 0.4 + best.score * 0.3),
    frustrationScore,
    keywords: best.keywords,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AI-powered analyser (async, when provider available)
// ─────────────────────────────────────────────────────────────────────────────

const SentimentAISchema = z.object({
  tone: z.enum(["positive", "neutral", "confused", "frustrated", "anxious", "engaged"]),
  confidence: z.number().min(0).max(1),
  frustrationScore: z.number().min(0).max(1),
  reasoning: z.string().max(200),
});

/**
 * AI-powered sentiment analysis. Uses the resilient provider chain.
 * Falls back to keyword analysis when no provider is available or on error.
 */
export const analyzeSentimentAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      text: z.string().min(1).max(2000),
      /** Optional lesson context for more accurate analysis. */
      context: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ data, context }: any) => {
    await assertActorHasAnyRole(context, [
      "platform_admin",
      "institution_admin",
      "owner",
      "teacher",
      "student",
      "parent",
    ]);

    const fallback = analyzeSentimentKeywords(data.text);

    const caller = createResilientModelCaller("sentiment");
    if (!caller) return fallback;

    try {
      const result = await caller.call(
        SentimentAISchema,
        `You are a learner sentiment analyser for an AI classroom. Given the learner's message, determine their emotional state. Consider the lesson context if provided.

Tone guide:
- "frustrated": anger, giving up, feeling incapable
- "confused": genuine misunderstanding, needing clarity
- "anxious": nervousness about performance or falling behind
- "engaged": actively curious, wanting more depth
- "positive": confident, understanding, appreciative
- "neutral": none of the above

Return the dominant tone, confidence (0-1), frustration score (0-1), and brief reasoning.`,
        `Learner message: "${data.text}"
${data.context ? `Lesson context: ${data.context}` : ""}

Analyse the sentiment now.`,
      );

      if (!result) return fallback;

      return {
        tone: result.object.tone,
        confidence: result.object.confidence,
        frustrationScore: result.object.frustrationScore,
        keywords: fallback.keywords,
      } satisfies SentimentResult;
    } catch {
      return fallback;
    }
  });
