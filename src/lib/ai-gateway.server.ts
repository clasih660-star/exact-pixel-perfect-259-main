import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateObject } from "ai";
import type { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Legacy provider (backward-compatible — autonomous-teaching-engine uses this)
// ─────────────────────────────────────────────────────────────────────────────

export function createAiGatewayProvider(): ((model: string) => any) | null {
  const openaiKey = process.env.OPENAI_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  if (openaiKey) {
    return createOpenAICompatible({
      name: "openai",
      baseURL: "https://api.openai.com/v1",
      headers: { Authorization: `Bearer ${openaiKey}` },
    });
  }

  if (deepseekKey) {
    // Deepseek endpoint compatibility handled via the OpenAI-compatible wrapper
    return createOpenAICompatible({
      name: "deepseek",
      baseURL: "https://api.deepseek.ai/v1",
      headers: { "Deepseek-API-Key": deepseekKey },
    });
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Resilient provider registry — ordered failover across multiple AI providers
// ─────────────────────────────────────────────────────────────────────────────

type ProviderEntry = {
  name: string;
  caller: (model: string) => any;
  /** Map of purpose → model name (e.g. { teacher_answer: "gpt-4o-mini" }). */
  modelMap: Record<string, string>;
  priority: number; // lower = tried first
};

/** Time in ms before we give up on a flaky primary and try the next provider. */
const PER_PROVIDER_TIMEOUT_MS = 12_000;

/**
 * Build the ordered list of available providers from environment variables.
 * Each key that is present creates a provider entry; entries are sorted by
 * priority so the primary is tried first.
 */
function buildProviderChain(): ProviderEntry[] {
  const providers: ProviderEntry[] = [];

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    providers.push({
      name: "openai",
      caller: createOpenAICompatible({
        name: "openai",
        baseURL: "https://api.openai.com/v1",
        headers: { Authorization: `Bearer ${openaiKey}` },
      }),
      modelMap: {
        teacher_answer: "gpt-4o-mini",
        teacher_turn: "gpt-4o-mini",
        lesson_gen: "gpt-4o-mini",
        sentiment: "gpt-4o-mini",
        adaptive_intervention: "gpt-4o-mini",
      },
      priority: 0,
    });
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (deepseekKey) {
    providers.push({
      name: "deepseek",
      caller: createOpenAICompatible({
        name: "deepseek",
        baseURL: "https://api.deepseek.ai/v1",
        headers: { "Deepseek-API-Key": deepseekKey },
      }),
      modelMap: {
        teacher_answer: "deepseek/teacher-1",
        teacher_turn: "deepseek/teacher-1",
        lesson_gen: "deepseek/lesson-gen-1",
        sentiment: "deepseek/teacher-1",
        adaptive_intervention: "deepseek/teacher-1",
      },
      // DeepSeek is secondary to OpenAI if both keys are present, primary
      // otherwise (mirrors the original ternary logic).
      priority: openaiKey ? 1 : 0,
    });
  }

  return providers.sort((a, b) => a.priority - b.priority);
}

export type ResilientModelCaller = {
  /**
   * Call `generateObject` with automatic provider failover.
   * Returns `null` if all providers fail (caller should use its deterministic fallback).
   */
  call: <T extends z.ZodType<any>>(
    schema: T,
    system: string,
    prompt: string,
  ) => Promise<{ object: z.infer<T>; provider: string } | null>;
  /** Which provider would be tried first (useful for logging). */
  primaryProvider: string;
};

/**
 * Create a resilient model caller for a given purpose (e.g. "teacher_answer").
 *
 * The caller walks the provider chain on failure:
 *   Provider A → (error/timeout) → Provider B → (error/timeout) → null
 *
 * The caller returns `null` when all providers fail so the consumer can fall
 * back to its deterministic path — the lesson is never blocked by an AI outage.
 */
export function createResilientModelCaller(
  purpose: string,
): ResilientModelCaller | null {
  const chain = buildProviderChain();
  if (chain.length === 0) return null;

  const primaryProvider = chain[0].name;

  const call: ResilientModelCaller["call"] = async (schema, system, prompt) => {
    let lastError: unknown = null;

    for (const provider of chain) {
      const modelName = provider.modelMap[purpose] ?? provider.modelMap["teacher_answer"] ?? "gpt-4o-mini";
      try {
        const result = await Promise.race([
          generateObject({
            model: provider.caller(modelName),
            schema,
            system,
            prompt,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error(`Provider ${provider.name} timed out`)),
              PER_PROVIDER_TIMEOUT_MS,
            ),
          ),
        ]);
        return { object: result.object as any, provider: provider.name };
      } catch (err) {
        lastError = err;
        // Log the failure but do not throw — try the next provider.
        console.warn(
          `[ai-gateway] Provider "${provider.name}" failed for purpose "${purpose}":`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    // All providers exhausted — signal to the caller that it should use its
    // deterministic fallback.
    console.error(
      `[ai-gateway] All providers failed for purpose "${purpose}". Last error:`,
      lastError instanceof Error ? lastError.message : lastError,
    );
    return null;
  };

  return { call, primaryProvider };
}
