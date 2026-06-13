import type { LocalVoiceProvider } from "../types";

export type LocalSynthesizeInput = {
  provider: LocalVoiceProvider;
  localVoiceId: string;
  text: string;
  speed: number;
  format?: "mp3" | "wav" | "opus";
};

export type LocalSynthesizeResult = {
  audioBuffer?: ArrayBuffer;
  audioUrl?: string;
  contentType?: string;
  durationMs?: number;
  shouldUseBrowserSpeech?: boolean;
};

export interface TeacherVoiceProvider {
  synthesize(input: LocalSynthesizeInput): Promise<LocalSynthesizeResult>;
}
