import type { LocalSynthesizeInput, LocalSynthesizeResult, TeacherVoiceProvider } from "./provider";

export class LocalHttpTeacherVoiceProvider implements TeacherVoiceProvider {
  constructor(
    private readonly baseUrl: string,
    private readonly internalSecret: string,
  ) {}

  async synthesize(input: LocalSynthesizeInput): Promise<LocalSynthesizeResult> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/synthesize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": this.internalSecret,
      },
      body: JSON.stringify({
        provider: input.provider,
        voice: input.localVoiceId,
        text: input.text,
        speed: input.speed,
        format: input.format ?? "mp3",
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Local TTS failed: ${message}`);
    }

    const data = await response.json();

    return {
      audioUrl: data.audioUrl,
      durationMs: data.durationMs ?? undefined,
      contentType: data.contentType ?? "audio/mpeg",
    };
  }
}
