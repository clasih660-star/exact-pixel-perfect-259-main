import type { LocalVoiceProvider } from "../types";
import type { TeacherVoiceProvider } from "./provider";
import { BrowserTeacherVoiceProvider } from "./browser-provider";
import { ElevenLabsTeacherVoiceProvider } from "./elevenlabs-provider";
import { LocalHttpTeacherVoiceProvider } from "./local-http-provider";

export function getTeacherVoiceProvider(provider: LocalVoiceProvider): TeacherVoiceProvider {
  switch (provider) {
    case "elevenlabs": {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error("ELEVENLABS_API_KEY is not configured");
      }
      return new ElevenLabsTeacherVoiceProvider(
        apiKey,
        process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2",
      );
    }

    case "browser":
      return new BrowserTeacherVoiceProvider();

    case "kokoro":
    case "piper": {
      const baseUrl =
        provider === "kokoro"
          ? process.env.LOCAL_KOKORO_TTS_URL
          : process.env.LOCAL_PIPER_TTS_URL;

      if (!baseUrl) {
        throw new Error(`Missing local TTS URL for provider: ${provider}`);
      }

      return new LocalHttpTeacherVoiceProvider(baseUrl, process.env.LOCAL_TTS_SECRET ?? "");
    }

    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown provider: ${_exhaustive}`);
    }
  }
}
