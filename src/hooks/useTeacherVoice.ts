import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { TeacherSpeechType, TeacherVoiceState } from "@/lib/voice/types";
import { generateTeacherSpeechServer } from "@/lib/voice/teacher-voice.functions";

type SpeakInput = {
  sessionId: string;
  lessonId: string;
  teachingItemId?: string;
  teacherProfileId?: string;
  voiceProfileId?: string;
  voiceGender?: "female" | "male";
  text: string;
  speechType: TeacherSpeechType;
  voiceEnabled?: boolean;
  speed?: number;
  onCaption?: (caption: string) => void;
  onSpokenText?: (spokenText: string) => void;
  /** Called when the speech audio/stream finishes playing. */
  onEnd?: () => void;
};

function pickBrowserVoiceByGender(gender: "female" | "male"): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !window.speechSynthesis) return undefined;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;

  const femaleHints = [
    "female",
    "woman",
    "samantha",
    "victoria",
    "zira",
    "susan",
    "karen",
    "moira",
    "tessa",
    "fiona",
    "serena",
    "aria",
    "jenny",
    "rachel",
    "calliope",
  ];
  const maleHints = [
    "male",
    "man",
    "david",
    "daniel",
    "alex",
    "fred",
    "george",
    "mark",
    "guy",
    "rishi",
    "thomas",
    "oliver",
    "adam",
  ];
  const preferredHints = gender === "female" ? femaleHints : maleHints;
  const oppositeHints = gender === "female" ? maleHints : femaleHints;

  const englishVoices = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("en"));
  const pool = englishVoices.length ? englishVoices : voices;

  return (
    pool.find((voice) => preferredHints.some((hint) => voice.name.toLowerCase().includes(hint))) ??
    pool.find((voice) => !oppositeHints.some((hint) => voice.name.toLowerCase().includes(hint))) ??
    pool[0]
  );
}

export function useTeacherVoice() {
  const generateSpeech = useServerFn(generateTeacherSpeechServer);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [state, setState] = useState<TeacherVoiceState>("idle");
  /** Holds the onEnd callback from the most recent speak() call. */
  const onEndRef = useRef<(() => void) | undefined>(undefined);

  const speakWithBrowser = useCallback((text: string, speed = 0.92, gender?: "female" | "male") => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setState("error");
      onEndRef.current?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = gender === "female" ? 1.14 : gender === "male" ? 0.86 : 1;
    utterance.volume = 1;
    if (gender) {
      const voice = pickBrowserVoiceByGender(gender);
      if (voice) utterance.voice = voice;
    }
    utterance.onstart = () => setState("playing");
    utterance.onpause = () => setState("paused");
    utterance.onend = () => {
      setState("ended");
      onEndRef.current?.();
    };
    utterance.onerror = () => {
      setState("error");
      onEndRef.current?.();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }

    utteranceRef.current = null;
    setState("idle");
  }, []);

  const speak = useCallback(
    async (input: SpeakInput) => {
      try {
        stop();
        onEndRef.current = input.onEnd;
        input.onCaption?.(input.text);

        if (input.voiceEnabled === false) {
          setState("ended");
          input.onEnd?.();
          return;
        }

        setState("loading");
        const data = await generateSpeech({
          data: {
            sessionId: input.sessionId,
            lessonId: input.lessonId,
            teachingItemId: input.teachingItemId,
            teacherProfileId: input.teacherProfileId ?? "mr_klass",
            voiceProfileId: input.voiceProfileId ?? "mr_klass_voice",
            text: input.text,
            speechType: input.speechType,
          },
        });
        input.onCaption?.(data.captionText);
        input.onSpokenText?.(data.spokenText);

        if (data.shouldUseBrowserSpeech || !data.audioUrl) {
          setState("fallback");
          speakWithBrowser(
            data.spokenText || data.captionText,
            input.speed ?? 0.92,
            input.voiceGender,
          );
          return;
        }

        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;
        audio.onplay = () => setState("playing");
        audio.onpause = () => setState("paused");
        audio.onended = () => {
          setState("ended");
          input.onEnd?.();
        };
        audio.onerror = () => {
          setState("fallback");
          speakWithBrowser(
            data.spokenText || data.captionText,
            input.speed ?? 0.92,
            input.voiceGender,
          );
        };

        await audio.play();
      } catch (error) {
        console.warn("[TeacherVoice] Falling back to browser speech.", error);
        setState("fallback");
        speakWithBrowser(input.text, input.speed ?? 0.92, input.voiceGender);
      }
    },
    [generateSpeech, speakWithBrowser, stop],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    if (typeof window !== "undefined") window.speechSynthesis?.pause();
    setState("paused");
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) void audioRef.current.play();
    if (typeof window !== "undefined") window.speechSynthesis?.resume();
    setState("playing");
  }, []);

  return {
    state,
    speak,
    pause,
    resume,
    stop,
    isSpeaking: state === "playing",
    isThinking: state === "loading",
    isPaused: state === "paused",
  };
}
