/**
 * accessibility.ts
 *
 * Lightweight, dependency-free accessibility preferences that apply across the
 * whole app via attributes on <html>. Persisted to localStorage so the choice
 * survives reloads. CSS in premium.css reacts to these attributes.
 */

export type TextScale = "default" | "large" | "xlarge";

const STORAGE_KEY = "klassruum_a11y";

export interface AccessibilityPrefs {
  textScale: TextScale;
  highContrast: boolean;
  reducedMotion: boolean;
}

const DEFAULTS: AccessibilityPrefs = {
  textScale: "default",
  highContrast: false,
  reducedMotion: false,
};

export function loadAccessibility(): AccessibilityPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

/** Apply preferences to <html> so global CSS can scale text / adjust contrast. */
export function applyAccessibility(prefs: AccessibilityPrefs): void {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.setAttribute("data-text-scale", prefs.textScale);
  el.toggleAttribute("data-high-contrast", prefs.highContrast);
  el.toggleAttribute("data-reduced-motion", prefs.reducedMotion);
}

export function saveAccessibility(prefs: AccessibilityPrefs): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }
  applyAccessibility(prefs);
}

/** Map a learning mode to sensible default accessibility prefs. */
export function prefsForMode(mode: string): Partial<AccessibilityPrefs> {
  switch (mode) {
    case "low_vision":
      return { textScale: "xlarge", highContrast: true };
    case "dyslexia":
      return { textScale: "large" };
    case "adhd_focus":
      return { reducedMotion: true };
    default:
      return {};
  }
}
