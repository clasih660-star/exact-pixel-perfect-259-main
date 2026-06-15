import type { TeacherSpeechType } from "./types";

export function prepareTeacherSpeech(input: {
  text: string;
  speechType: TeacherSpeechType;
  subject?: string | null;
  pauseBetweenSentencesMs?: number;
}) {
  let text = input.text.trim().replace(/\s+/g, " ");

  if (input.subject?.toLowerCase().includes("math")) {
    text = prepareMathSpeech(text);
  }

  text = expandCommonAbbreviations(text);
  text = normalizeNumbers(text);
  text = addTeacherRhythm(text);

  if (input.speechType === "board_reading") {
    text = `On the board, we have:\n\n${text}`;
  }

  if (input.speechType === "clarification") {
    text = `Let me check I understand you correctly.\n\n${text}`;
  }

  if (input.speechType === "encouragement") {
    text = text.replace(/^/, "Good effort. ");
  }

  return text.trim();
}

/**
 * Insert paragraph breaks after sentence-ending punctuation so TTS
 * engines insert natural pauses.
 */
export function addTeacherRhythm(text: string) {
  return text
    .replace(/\. /g, ".\n\n")
    .replace(/\? /g, "?\n\n")
    .replace(/! /g, "!\n\n")
    .replace(/: /g, ":\n\n");
}

/**
 * Convert mathematical notation to spoken form.
 * This runs before rhythm insertion so the full sentence is intact.
 */
export function prepareMathSpeech(text: string) {
  let result = text;

  /* Preserve common multi-character tokens. Order matters — check
     longer patterns first to avoid partial matches. */

  // ax² + bx + c = 0  →  "a x squared, plus b x, plus c, equals zero"
  result = result.replace(
    /ax²\s*\+\s*bx\s*\+\s*c\s*=\s*0/gi,
    "a x squared, plus b x, plus c, equals zero",
  );

  // Greek letters
  result = result.replace(/π/g, " pi ");
  result = result.replace(/θ/g, " theta ");
  result = result.replace(/Δ/g, " delta ");
  result = result.replace(/α/g, " alpha ");
  result = result.replace(/β/g, " beta ");
  result = result.replace(/γ/g, " gamma ");
  result = result.replace(/μ/g, " mu ");
  result = result.replace(/σ/g, " sigma ");
  result = result.replace(/λ/g, " lambda ");
  result = result.replace(/τ/g, " tau ");
  result = result.replace(/φ/g, " phi ");
  result = result.replace(/ω/g, " omega ");

  // Square roots: √x → "square root of x", √(x+y) → "square root of x plus y"
  result = result.replace(/√\(([^)]+)\)/g, "square root of $1");
  result = result.replace(/√([a-zA-Z0-9]+)/g, "square root of $1");

  // Exponents: x²→"x squared", y³→"y cubed", x⁴→"x to the fourth"
  result = result.replace(/([a-zA-Z])²/g, "$1 squared");
  result = result.replace(/([a-zA-Z])³/g, "$1 cubed");
  result = result.replace(/(\d+)²/g, "$1 squared");
  result = result.replace(/(\d+)³/g, "$1 cubed");
  result = result.replace(/([a-zA-Z])⁴/g, "$1 to the fourth");
  result = result.replace(/([a-zA-Z])ⁿ/g, "$1 to the n");

  // Fractions: ½→one half, ⅓→one third, ¼→one quarter, ¾→three quarters
  result = result.replace(/½/g, " one half ");
  result = result.replace(/⅓/g, " one third ");
  result = result.replace(/⅔/g, " two thirds ");
  result = result.replace(/¼/g, " one quarter ");
  result = result.replace(/¾/g, " three quarters ");

  // Common operators
  result = result.replace(/≠/g, " is not equal to ");
  result = result.replace(/≤/g, " is less than or equal to ");
  result = result.replace(/≥/g, " is greater than or equal to ");
  result = result.replace(/≈/g, " is approximately ");
  result = result.replace(/∞/g, " infinity ");
  result = result.replace(/∫/g, " the integral of ");
  result = result.replace(/∑/g, " the sum of ");
  result = result.replace(/∏/g, " the product of ");
  result = result.replace(/∈/g, " is an element of ");
  result = result.replace(/⊂/g, " is a subset of ");
  result = result.replace(/∪/g, " union ");
  result = result.replace(/∩/g, " intersection ");
  result = result.replace(/⇒/g, " implies ");
  result = result.replace(/⇔/g, " if and only if ");
  result = result.replace(/∀/g, " for all ");
  result = result.replace(/∃/g, " there exists ");
  result = result.replace(/→/g, " approaches ");
  result = result.replace(/∠/g, " angle ");
  result = result.replace(/⊥/g, " is perpendicular to ");
  result = result.replace(/∥/g, " is parallel to ");
  result = result.replace(/°/, " degrees ");

  // Simple operators — replace these last to avoid interfering with
  // the longer patterns above.
  result = result.replace(/×/g, " times ");
  result = result.replace(/÷/g, " divided by ");
  result = result.replace(/=/g, " equals ");
  result = result.replace(/\+/g, " plus ");
  result = result.replace(/</g, " is less than ");
  result = result.replace(/>/g, " is greater than ");
  result = result.replace(/±/g, " plus or minus ");
  result = result.replace(/\(/g, " left parenthesis ");
  result = result.replace(/\)/g, " right parenthesis ");
  result = result.replace(/\[/g, " left bracket ");
  result = result.replace(/\]/g, " right bracket ");

  return result;
}

/**
 * Expand common abbreviations that TTS engines mispronounce.
 */
export function expandCommonAbbreviations(text: string) {
  return text
    .replace(/\b(e\.g\.)\b/gi, "for example")
    .replace(/\b(i\.e\.)\b/gi, "that is")
    .replace(/\b(etc\.?)\b/gi, "et cetera")
    .replace(/\b(w\.?\/o)\b/gi, "without")
    .replace(/\b(w\.?\/)\b/gi, "with")
    .replace(/\b(vs\.?)\b/gi, "versus")
    .replace(/\b(c\.?f\.?)\b/gi, "compare")
    .replace(/\b(dept\.?)\b/gi, "department")
    .replace(/\b(info)\b/gi, "information")
    .replace(/\b(admin)\b/gi, "administration");
}

/**
 * Normalize numbers for natural TTS reading.
 * Handle large numbers, currency, percentages.
 */
export function normalizeNumbers(text: string) {
  return (
    text
      // Percentages: 50% → "50 percent"
      .replace(/(\d+)%/g, "$1 percent")
      // Dollars: $50 → "50 dollars"
      .replace(/\$(\d+)/g, "$1 dollars")
      // & → and
      .replace(/&/g, " and ")
  );
}
