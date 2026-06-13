export type LocalVoiceProvider = "elevenlabs" | "kokoro" | "piper" | "browser";

export type TeacherSpeechType =
  | "welcome"
  | "board_reading"
  | "explanation"
  | "question"
  | "answer"
  | "clarification"
  | "encouragement"
  | "summary";

export type TeacherVoiceState =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "error"
  | "fallback";

export type AITeacherProfile = {
  id: string;
  institutionId?: string;
  name: string;
  subjectSpecialty?: string;
  imageUrl?: string;
  videoPlaceholderUrl?: string;
  teachingStyle: "step_by_step" | "concept_first" | "practice_heavy" | "visual" | "extra_support" | "challenge";
  defaultPace: "slow" | "normal" | "fast";
  explanationDepth: "basic" | "standard" | "detailed" | "advanced";
  encouragementStyle: "gentle" | "direct" | "high_energy";
  isBuiltin: boolean;
  isActive: boolean;
};

export type TeacherVoiceProfile = {
  id: string;
  teacherProfileId: string;
  provider: LocalVoiceProvider;
  localVoiceId: string;
  displayName: string;
  language: string;
  accent?: string;
  tone: "calm" | "warm" | "energetic" | "academic" | "gentle" | "confident";
  defaultSpeed: number;
  pauseBetweenSentencesMs: number;
  isBuiltin: boolean;
  isDefault: boolean;
  isActive: boolean;
};

export type GenerateTeacherSpeechInput = {
  sessionId: string;
  lessonId: string;
  teachingItemId?: string;
  teacherProfileId: string;
  voiceProfileId: string;
  text: string;
  speechType: TeacherSpeechType;
};

export type GenerateTeacherSpeechResult = {
  provider: LocalVoiceProvider;
  audioUrl?: string;
  captionText: string;
  spokenText: string;
  durationMs?: number;
  fromCache: boolean;
  shouldUseBrowserSpeech: boolean;
};

export const DEFAULT_LOCAL_VOICE_PROVIDER: LocalVoiceProvider = "elevenlabs";
export const LOCAL_VOICE_FALLBACK_ORDER: LocalVoiceProvider[] = ["elevenlabs", "kokoro", "piper", "browser"];
