import type { LocalSynthesizeInput, LocalSynthesizeResult, TeacherVoiceProvider } from "./provider";

export class BrowserTeacherVoiceProvider implements TeacherVoiceProvider {
  async synthesize(input: LocalSynthesizeInput): Promise<LocalSynthesizeResult> {
    return {
      shouldUseBrowserSpeech: true,
      audioUrl: undefined,
      durationMs: estimateDurationMs(input.text, input.speed),
    };
  }
}

function estimateDurationMs(text: string, speed: number) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 155 * Math.max(0.5, speed);
  return Math.round((words / wordsPerMinute) * 60_000);
}
