let currentUtterance: SpeechSynthesisUtterance | null = null;
let isPaused = false;

// ── Global narration controls (driven by the classroom Settings panel) ────────
/** When muted, the teacher's narration is suppressed (captions still show). */
let narrationMuted = false;
/** Global speaking-rate multiplier (0.5–2). 1 = normal. */
let globalRate = 1;

// ── Eagerly preload voices on module load (Safari needs this) ─────────────────
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  // Trigger voice loading — Safari loads them asynchronously.
  window.speechSynthesis.getVoices();
  // Also listen for the voiceschanged event so they're ready when needed.
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    window.speechSynthesis.getVoices();
  });
}

/** Turn the teacher's spoken narration on/off globally. */
export function setNarrationMuted(muted: boolean): void {
  narrationMuted = muted;
  if (muted && typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/** Set the global narration rate (clamped 0.5–2). Applies to new utterances. */
export function setGlobalRate(rate: number): void {
  globalRate = Math.max(0.5, Math.min(2, rate));
}

export function speakText(text: string, rate = 1): void {
  if (typeof window === "undefined") return;
  if (narrationMuted) return;

  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate * globalRate;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

/** Heuristically pick a system voice matching the requested gender. */
function pickVoiceByGender(gender: "female" | "male"): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
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
  ];
  const hints = gender === "female" ? femaleHints : maleHints;
  const opposite = gender === "female" ? maleHints : femaleHints;

  const enVoices = voices.filter((v: any) => v.lang?.toLowerCase().startsWith("en"));
  const pool = enVoices.length ? enVoices : voices;

  // Prefer an explicit gender-name match, then avoid the opposite gender.
  return (
    pool.find((v: any) => hints.some((h: any) => v.name.toLowerCase().includes(h))) ??
    pool.find((v: any) => !opposite.some((h: any) => v.name.toLowerCase().includes(h))) ??
    pool[0]
  );
}

export function speak(
  text: string,
  onEnd?: () => void,
  onError?: () => void,
  gender?: "female" | "male",
): void {
  if (typeof window === "undefined") return;
  if (narrationMuted) {
    onEnd?.();
    return;
  }
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported in this browser.");
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = globalRate;
  utterance.volume = 1;

  if (gender) {
    const voice = pickVoiceByGender(gender);
    if (voice) utterance.voice = voice;
    // Nudge pitch to reinforce the perceived gender on generic voices.
    utterance.pitch = gender === "female" ? 1.15 : 0.85;
  } else {
    utterance.pitch = 1;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }
  if (onError) {
    utterance.onerror = onError;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  isPaused = false;
}

export function speakWithVoice(
  text: string,
  voiceURI: string,
  onEnd?: () => void,
  onError?: () => void,
): void {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported in this browser.");
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find((voice) => voice.voiceURI === voiceURI);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }
  if (onError) {
    utterance.onerror = onError;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  isPaused = false;
}

export function stopSpeech(): void {
  if (typeof window === "undefined") return;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    isPaused = false;
  }
}

export function pauseSpeech(): void {
  if (typeof window === "undefined") return;
  if ("speechSynthesis" in window && !isPaused) {
    window.speechSynthesis.pause();
    isPaused = true;
  }
}

export function resumeSpeech(): void {
  if (typeof window === "undefined") return;
  if ("speechSynthesis" in window && isPaused) {
    window.speechSynthesis.resume();
    isPaused = false;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined") return false;
  if ("speechSynthesis" in window) {
    return window.speechSynthesis.speaking && !isPaused;
  }
  return false;
}

export function isPausedState(): boolean {
  return isPaused;
}

export function setSpeechRate(rate: number): void {
  if (currentUtterance) {
    currentUtterance.rate = Math.max(0.5, Math.min(2, rate));
  }
}

export function setSpeechPitch(pitch: number): void {
  if (currentUtterance) {
    currentUtterance.pitch = Math.max(0.5, Math.min(2, pitch));
  }
}

export function setSpeechVolume(volume: number): void {
  if (currentUtterance) {
    currentUtterance.volume = Math.max(0, Math.min(1, volume));
  }
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  if ("speechSynthesis" in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
}

export function getEnglishVoices(): SpeechSynthesisVoice[] {
  return getAvailableVoices().filter((voice) => voice.lang.startsWith("en"));
}

export function createRecognizer(): any {
  if (typeof window === "undefined") return null;
  const SpeechRecognition =
    (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  return new SpeechRecognition();
}

export function startListening(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError?: (error: string) => void,
  onEnd?: () => void,
): any {
  const recognizer = createRecognizer();
  if (!recognizer) {
    onError?.("Voice input isn't supported in this browser.");
    return null;
  }

  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.lang = "en-US";

  recognizer.onresult = (event: any) => {
    const results = event.results;
    const transcript = results[results.length - 1][0].transcript;
    const isFinal = results[results.length - 1].isFinal;
    onResult(transcript, isFinal);
  };

  recognizer.onerror = (event: any) => {
    onError?.(event.error);
  };

  recognizer.onend = () => {
    onEnd?.();
  };

  try {
    recognizer.start();
  } catch (error) {
    onError?.("Failed to start voice recognition.");
    return null;
  }

  return recognizer;
}

export function stopListening(recognizer: any): void {
  if (recognizer) {
    try {
      recognizer.stop();
    } catch (error) {
      console.warn("Failed to stop voice recognition:", error);
    }
  }
}

export function speakWithAccessibility(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
    onEnd?: () => void;
    onError?: () => void;
  } = {},
): void {
  const { rate = 1, pitch = 1, volume = 1, voice, onEnd, onError } = options;

  if (voice) {
    speakWithVoice(text, voice, onEnd, onError);
  } else {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.5, Math.min(2, rate));
    utterance.pitch = Math.max(0.5, Math.min(2, pitch));
    utterance.volume = Math.max(0, Math.min(1, volume));

    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    isPaused = false;
  }
}

export function preloadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };

    // Fallback timeout in case voiceschanged doesn't fire
    setTimeout(() => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    }, 1000);
  });
}

export function getBestEnglishVoice(): SpeechSynthesisVoice | null {
  const englishVoices = getEnglishVoices();
  if (englishVoices.length === 0) return null;

  // Prefer Google US English if available
  const googleVoice = englishVoices.find((voice) => voice.name.includes("Google US English"));
  if (googleVoice) return googleVoice;

  // Prefer Microsoft voices if available
  const microsoftVoice = englishVoices.find(
    (voice) => voice.name.includes("Microsoft") && voice.name.includes("English"),
  );
  if (microsoftVoice) return microsoftVoice;

  // Return first English voice as fallback
  return englishVoices[0];
}

// Accessibility helpers
export function announceForScreenReader(message: string): void {
  if (typeof document === "undefined") return;

  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.setAttribute("class", "sr-only");
  announcement.style.position = "absolute";
  announcement.style.left = "-10000px";
  announcement.style.width = "1px";
  announcement.style.height = "1px";
  announcement.style.overflow = "hidden";

  document.body.appendChild(announcement);
  announcement.textContent = message;

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function speakKeypress(key: string): void {
  speakText(key, 1.2);
}

export function speakError(message: string): void {
  speakWithAccessibility(message, {
    rate: 0.9,
    pitch: 0.8,
    volume: 1,
  });
}

export function speakSuccess(message: string): void {
  speakWithAccessibility(message, {
    rate: 1.1,
    pitch: 1.1,
    volume: 1,
  });
}
