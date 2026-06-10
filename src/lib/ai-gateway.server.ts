import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

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
