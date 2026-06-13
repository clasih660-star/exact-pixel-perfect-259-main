import { createHash } from "node:crypto";
import type {
  GenerateTeacherSpeechInput,
  GenerateTeacherSpeechResult,
  LocalVoiceProvider,
} from "./types";
import {
  DEFAULT_LOCAL_VOICE_PROVIDER,
  LOCAL_VOICE_FALLBACK_ORDER,
} from "./types";
import { KLASSRUUM_LOCAL_TEACHERS } from "./builtin-teachers";
import { prepareTeacherSpeech } from "./prepare-teacher-speech";
import { speechTypeSettings } from "./speech-settings";
import { getTeacherVoiceProvider } from "./providers/get-provider";

const warnedUnavailableProviders = new Set<LocalVoiceProvider>();

type VoiceSupabaseClient = {
  from: (table: string) => any;
};

type DbTeacher = {
  id: string;
  subject_specialty?: string | null;
};

type DbVoice = {
  id: string;
  teacher_profile_id: string;
  provider: LocalVoiceProvider;
  local_voice_id: string;
  default_speed?: number | null;
  pause_between_sentences_ms?: number | null;
};

type SpeechAsset = {
  provider: LocalVoiceProvider;
  audio_url?: string | null;
  caption_text: string;
  spoken_text: string;
  duration_ms?: number | null;
};

export async function generateTeacherSpeech(
  input: GenerateTeacherSpeechInput,
  options: { supabase?: VoiceSupabaseClient } = {},
): Promise<GenerateTeacherSpeechResult> {
  const teacher = await getTeacherProfile(input.teacherProfileId, options.supabase);
  const voice = await getTeacherVoiceProfile(input.voiceProfileId, options.supabase);
  const speechSettings = speechTypeSettings[input.speechType];
  const speed = clamp(Number(voice.default_speed ?? 0.95) + speechSettings.speedOffset, 0.75, 1.2);

  const spokenText = prepareTeacherSpeech({
    text: input.text,
    speechType: input.speechType,
    subject: teacher.subject_specialty,
    pauseBetweenSentencesMs: voice.pause_between_sentences_ms ?? undefined,
  });

  const providers = orderedProviders(voice.provider);

  for (const providerName of providers) {
    const textHash = createSpeechHash({
      provider: providerName,
      localVoiceId: voice.local_voice_id,
      text: spokenText,
      speed,
    });

    const cached = await findSpeechAssetByHash(textHash, options.supabase);
    if (cached) {
      return {
        provider: cached.provider,
        audioUrl: cached.audio_url ?? undefined,
        captionText: cached.caption_text,
        spokenText: cached.spoken_text,
        durationMs: cached.duration_ms ?? undefined,
        fromCache: true,
        shouldUseBrowserSpeech: cached.provider === "browser" || !cached.audio_url,
      };
    }

    try {
      const provider = getTeacherVoiceProvider(providerName);
      const result = await provider.synthesize({
        provider: providerName,
        localVoiceId: voice.local_voice_id,
        text: spokenText,
        speed,
        format: "mp3",
      });

      await saveTeacherSpeechAsset(
        {
          session_id: input.sessionId,
          lesson_id: input.lessonId,
          teaching_item_id: input.teachingItemId ?? null,
          teacher_profile_id: input.teacherProfileId,
          voice_profile_id: input.voiceProfileId,
          speech_type: input.speechType,
          text_hash: textHash,
          caption_text: input.text,
          spoken_text: spokenText,
          audio_url: result.audioUrl ?? null,
          duration_ms: result.durationMs ?? null,
          provider: providerName,
          local_voice_id: voice.local_voice_id,
          from_cache: false,
        },
        options.supabase,
      );

      return {
        provider: providerName,
        audioUrl: result.audioUrl,
        captionText: input.text,
        spokenText,
        durationMs: result.durationMs,
        fromCache: false,
        shouldUseBrowserSpeech: result.shouldUseBrowserSpeech ?? (providerName === "browser" || !result.audioUrl),
      };
    } catch (error) {
      if (providerName === "browser") {
        return browserFallback(input.text, spokenText, voice.local_voice_id);
      }
      if (!warnedUnavailableProviders.has(providerName)) {
        console.warn(`[TeacherVoice] ${providerName} unavailable, trying next provider.`, error);
        warnedUnavailableProviders.add(providerName);
      }
    }
  }

  return browserFallback(input.text, spokenText, voice.local_voice_id);
}

function orderedProviders(preferred: LocalVoiceProvider): LocalVoiceProvider[] {
  /* Build a provider priority list using only configured providers, while
     always keeping the browser voice as a final graceful fallback. */
  const seen = new Set<LocalVoiceProvider>();
  const order: LocalVoiceProvider[] = [];

  for (const p of [preferred, ...LOCAL_VOICE_FALLBACK_ORDER]) {
    if (!seen.has(p) && providerIsConfigured(p)) {
      order.push(p);
      seen.add(p);
    }
  }

  if (!seen.has("browser")) {
    order.push("browser");
  }

  return order;
}

function providerIsConfigured(provider: LocalVoiceProvider): boolean {
  switch (provider) {
    case "browser":
      return true;
    case "elevenlabs":
      return !!process.env.ELEVENLABS_API_KEY;
    case "kokoro":
      return !!process.env.LOCAL_KOKORO_TTS_URL;
    case "piper":
      return !!process.env.LOCAL_PIPER_TTS_URL;
    default:
      return false;
  }
}

function browserFallback(captionText: string, spokenText: string, _localVoiceId: string): GenerateTeacherSpeechResult {
  return {
    provider: "browser",
    captionText,
    spokenText,
    durationMs: estimateDurationMs(spokenText, 0.92),
    fromCache: false,
    shouldUseBrowserSpeech: true,
  };
}

function createSpeechHash(input: {
  provider: string;
  localVoiceId: string;
  text: string;
  speed: number;
}) {
  return createHash("sha256")
    .update(`${input.provider}:${input.localVoiceId}:${input.speed}:${input.text}`)
    .digest("hex");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function estimateDurationMs(text: string, speed: number) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 155 * Math.max(0.5, speed);
  return Math.round((words / wordsPerMinute) * 60_000);
}

async function getTeacherProfile(teacherProfileId: string, supabase?: VoiceSupabaseClient): Promise<DbTeacher> {
  if (supabase && isUuid(teacherProfileId)) {
    try {
      const { data, error } = await supabase
        .from("ai_teacher_profiles")
        .select("id, subject_specialty")
        .eq("id", teacherProfileId)
        .single();
      if (!error && data) return data;
    } catch {
      /* fall through to built-in */
    }
  }

  const builtin = KLASSRUUM_LOCAL_TEACHERS.find((teacher) => teacher.id === teacherProfileId) ?? KLASSRUUM_LOCAL_TEACHERS[0];
  return { id: builtin.id, subject_specialty: builtin.subjectSpecialty };
}

async function getTeacherVoiceProfile(voiceProfileId: string, supabase?: VoiceSupabaseClient): Promise<DbVoice> {
  if (supabase && isUuid(voiceProfileId)) {
    try {
      const { data, error } = await supabase
        .from("teacher_voice_profiles")
        .select("id, teacher_profile_id, provider, local_voice_id, default_speed, pause_between_sentences_ms")
        .eq("id", voiceProfileId)
        .single();
      if (!error && data) return data;
    } catch {
      /* fall through to built-in */
    }
  }

  const builtin =
    KLASSRUUM_LOCAL_TEACHERS.find((teacher) => `${teacher.id}_voice` === voiceProfileId || teacher.id === voiceProfileId) ??
    KLASSRUUM_LOCAL_TEACHERS[0];
  return {
    id: `${builtin.id}_voice`,
    teacher_profile_id: builtin.id,
    provider: builtin.voice.provider as LocalVoiceProvider,
    local_voice_id: builtin.voice.localVoiceId,
    default_speed: builtin.voice.defaultSpeed,
    pause_between_sentences_ms: builtin.voice.pauseBetweenSentencesMs,
  };
}

async function findSpeechAssetByHash(textHash: string, supabase?: VoiceSupabaseClient): Promise<SpeechAsset | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("teacher_speech_assets")
      .select("provider, audio_url, caption_text, spoken_text, duration_ms")
      .eq("text_hash", textHash)
      .maybeSingle();
    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

async function saveTeacherSpeechAsset(payload: Record<string, unknown>, supabase?: VoiceSupabaseClient): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("teacher_speech_assets").insert(payload);
  } catch {
    /* Cache writes are best effort; speech must not break the lesson. */
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export const DEFAULT_TEACHER_PROFILE_ID = "mr_klass";
export const DEFAULT_TEACHER_VOICE_PROFILE_ID = "mr_klass_voice";
export const DEFAULT_TEACHER_VOICE_PROVIDER = DEFAULT_LOCAL_VOICE_PROVIDER;
