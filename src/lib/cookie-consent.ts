export type CookieConsentPreferences = {
  essential: true;
  preferences: boolean;
  analytics: boolean;
};

export type CookieConsentStatus = "accepted_all" | "essential_only" | "customized";

export type CookieConsentRecord = {
  status: CookieConsentStatus;
  preferences: CookieConsentPreferences;
  updatedAt: string;
};

export const COOKIE_CONSENT_STORAGE_KEY = "klassruum_cookie_consent";
export const COOKIE_SETTINGS_EVENT = "klassruum:open-cookie-settings";

export const DEFAULT_COOKIE_PREFERENCES: CookieConsentPreferences = {
  essential: true,
  preferences: true,
  analytics: false,
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function createConsentRecord(
  status: CookieConsentStatus,
  preferences: Partial<Omit<CookieConsentPreferences, "essential">> = {},
): CookieConsentRecord {
  return {
    status,
    preferences: {
      essential: true,
      preferences: preferences.preferences ?? DEFAULT_COOKIE_PREFERENCES.preferences,
      analytics: preferences.analytics ?? DEFAULT_COOKIE_PREFERENCES.analytics,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function readCookieConsent(): CookieConsentRecord | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CookieConsentRecord>;
    if (!parsed || typeof parsed !== "object" || !parsed.preferences) return null;

    return {
      status: (parsed.status as CookieConsentStatus) ?? "customized",
      preferences: {
        essential: true,
        preferences: Boolean(parsed.preferences.preferences),
        analytics: Boolean(parsed.preferences.analytics),
      },
      updatedAt:
        typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(record: CookieConsentRecord) {
  if (!isBrowser()) return;
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
}

export function openCookieSettings() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}