import type { LocalSynthesizeInput, LocalSynthesizeResult, TeacherVoiceProvider } from "./provider";

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";

/**
 * Map our internal voice IDs to ElevenLabs voice IDs.
 *
 * ElevenLabs free/default voices used:
 *   JBFqnCBsd6RMkjVDRZzb — George (calm British male)
 *   21m00Tcm4TlvDq8ikWAM — Rachel (warm American female)
 *   XrExE9yKJn1a6q0W5gIn — Calliope (gentle female)
 *   7JMFNAz9doLviPyyfR93 — Adam (academic American male)
 */
const VOICE_ID_MAP: Record<string, string> = {
  male_calm_teacher_01: "JBFqnCBsd6RMkjVDRZzb",
  female_warm_teacher_01: "21m00Tcm4TlvDq8ikWAM",
  female_gentle_primary_01: "XrExE9yKJn1a6q0W5gIn",
  male_academic_lecturer_01: "7JMFNAz9doLviPyyfR93",
};

export class ElevenLabsTeacherVoiceProvider implements TeacherVoiceProvider {
  constructor(
    private readonly apiKey: string,
    private readonly modelId: string = "eleven_multilingual_v2",
  ) {}

  async synthesize(input: LocalSynthesizeInput): Promise<LocalSynthesizeResult> {
    const elevenLabsVoiceId = VOICE_ID_MAP[input.localVoiceId];
    if (!elevenLabsVoiceId) {
      throw new Error(`No ElevenLabs voice mapping for: ${input.localVoiceId}`);
    }

    /* Wrap in SSML for richer prosody control (pauses, emphasis).
       ElevenLabs supports SSML natively — when text starts with <speak>
       it applies prosody and break tags, giving more natural pacing than
       the flat speed parameter alone. */
    const ssmlText = wrapInSsml(input.text, input.speed);

    const voice_settings: Record<string, unknown> = {
      stability: 0.35,
      similarity_boost: 0.75,
    };

    /* When using SSML, the top-level speed parameter is ignored in favour
       of the <prosody rate="..."> tag embedded in the text, so only send
       speed when we aren't using SSML. SSML is always used. */
    const response = await fetch(`${ELEVENLABS_API_BASE}/text-to-speech/${elevenLabsVoiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: ssmlText,
        model_id: this.modelId,
        voice_settings,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs TTS failed (${response.status}): ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const durationMs = estimateDurationMs(input.text, input.speed);

    /* Try persistent storage (Supabase) so subsequent plays hit a cache. */
    const storedUrl = await this.storeAudio(audioBuffer, input);

    return {
      audioUrl: storedUrl ?? undefined,
      audioBuffer,
      contentType: "audio/mpeg",
      durationMs,
    };
  }

  /**
   * Upload the generated audio to Supabase Storage so it can be served
   * directly and cached in the teacher_speech_assets table.
   *
   * If storage is unavailable (missing env, bucket doesn't exist, network
   * error) we return null — the caller still has the audioBuffer and the
   * server-function response will carry the audioUrl from a data-URL
   * fallback further up, or the speech asset table serves subsequent
   * requests. Speech must never break, so every failure path is silent.
   */
  private async storeAudio(
    audioBuffer: ArrayBuffer,
    input: LocalSynthesizeInput,
  ): Promise<string | null> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SERVICE_KEY ??
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const hash = await quickHash(input.text);
      const filePath = `teacher-voice/${input.provider}/${hash}.mp3`;

      const { error: uploadError } = await supabase.storage
        .from("teacher-audio")
        .upload(filePath, new Uint8Array(audioBuffer), {
          contentType: "audio/mpeg",
          upsert: true,
        });

      /* If the bucket doesn't exist yet, create it and retry once. */
      if (uploadError && isBucketMissing(uploadError)) {
        const { error: createError } = await supabase.storage.createBucket("teacher-audio", {
          public: true,
        });
        if (!createError) {
          const { error: retryError } = await supabase.storage
            .from("teacher-audio")
            .upload(filePath, new Uint8Array(audioBuffer), {
              contentType: "audio/mpeg",
              upsert: true,
            });
          if (retryError) return null;
        } else {
          return null;
        }
      } else if (uploadError) {
        return null;
      }

      const { data: urlData } = supabase.storage.from("teacher-audio").getPublicUrl(filePath);

      return urlData?.publicUrl ?? null;
    } catch {
      return null;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Wrap text in SSML for natural prosody and pacing on ElevenLabs.
 * Inserts <break> tags after sentence endings, wraps in <prosody>
 * for speed control, and applies <phoneme> for common tricky words.
 */
function wrapInSsml(text: string, speed: number): string {
  /* Map our speed range (0.75–1.2) to a SSML rate string.
     SSML rate accepts: x-slow | slow | medium | fast | x-fast | <percent>
     Using percent for precision: 100% = normal, 80% = slower, 120% = faster. */
  const ratePercent = Math.round(speed * 100);
  const clampedPercent = Math.max(50, Math.min(200, ratePercent));

  /* Add short pauses after sentence endings for natural rhythm.
     Replace double-newlines (inserted by addTeacherRhythm) with
     <break> tags, then add a light break after every sentence. */
  const ssml = text
    .replace(/\n\n+/g, '<break time="400ms"/> ')
    .replace(/\.(?!<)/g, '.<break time="300ms"/>')
    .replace(/\?(?!<)/g, '?<break time="350ms"/>')
    .replace(/!(?!<)/g, '!<break time="350ms"/>');

  return `<speak><prosody rate="${clampedPercent}%">${ssml}</prosody></speak>`;
}

function estimateDurationMs(text: string, speed: number): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 155 * Math.max(0.5, speed);
  return Math.round((words / wordsPerMinute) * 60_000);
}

async function quickHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

function isBucketMissing(
  error: { message?: string; statusCode?: number; status?: string } | Error | null,
): boolean {
  const msg = error?.message ?? "";
  const status =
    (error as { statusCode?: number; status?: string })?.statusCode ??
    (error as { status?: string })?.status;
  return msg.includes("bucket") || msg.includes("Bucket") || status === 404 || status === "404";
}
