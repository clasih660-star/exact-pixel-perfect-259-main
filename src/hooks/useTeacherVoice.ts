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
  text: string;
  speechType: TeacherSpeechType;
  voiceEnabled?: boolean;
  speed?: number;
  onCaption?: (caption: string) => void;
  onSpokenText?: (spokenText: string) => void;
};

export function useTeacherVoice() {
  const generateSpeech = useServerFn(generateTeacherSpeechServer);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [state, setState] = useState<TeacherVoiceState>("idle");

  const speakWithBrowser = useCallback((text: string, speed = 0.92) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setState("error");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setState("playing");
    utterance.onpause = () => setState("paused");
    utterance.onend = () => setState("ended");
    utterance.onerror = () => setState("error");

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
        input.onCaption?.(input.text);

        if (input.voiceEnabled === false) {
          setState("ended");
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
          speakWithBrowser(data.spokenText || data.captionText, input.speed ?? 0.92);
          return;
        }

        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;
        audio.onplay = () => setState("playing");
        audio.onpause = () => setState("paused");
        audio.onended = () => setState("ended");
        audio.onerror = () => {
          setState("fallback");
          speakWithBrowser(data.spokenText || data.captionText, input.speed ?? 0.92);
        };

        await audio.play();
      } catch (error) {
        console.warn("[TeacherVoice] Falling back to browser speech.", error);
        setState("fallback");
        speakWithBrowser(input.text, input.speed ?? 0.92);
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
