import type { UserRole } from "./types";

export const DEMO_ROLE_STORAGE_KEY = "klassruum_demo_role";
export const DEMO_ACTIVE_STORAGE_KEY = "klassruum_demo_active";
export const DEMO_ROLE_COOKIE = "klassruum_demo_role";
export const DEMO_ACTIVE_COOKIE = "klassruum_demo_active";

export const DEMO_ROLES: UserRole[] = [
  "student",
  "teacher",
  "institution_admin",
  "platform_admin",
  "parent",
];

export function isDemoRole(value: unknown): value is UserRole {
  return typeof value === "string" && DEMO_ROLES.includes(value as UserRole);
}

function readBrowserCookie(name: string) {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

export function getStoredDemoRole(): UserRole {
  if (typeof window === "undefined") return "student";
  const stored = localStorage.getItem(DEMO_ROLE_STORAGE_KEY) ?? readBrowserCookie(DEMO_ROLE_COOKIE);
  return isDemoRole(stored) ? stored : "student";
}

export function isBrowserDemoSessionActive() {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem(DEMO_ACTIVE_STORAGE_KEY) === "1" ||
    readBrowserCookie(DEMO_ACTIVE_COOKIE) === "1"
  );
}

export function setDemoSessionRole(role: UserRole) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_ROLE_STORAGE_KEY, role);
  localStorage.setItem(DEMO_ACTIVE_STORAGE_KEY, "1");
  document.cookie = `${DEMO_ROLE_COOKIE}=${encodeURIComponent(role)}; Path=/; Max-Age=86400; SameSite=Lax`;
  document.cookie = `${DEMO_ACTIVE_COOKIE}=1; Path=/; Max-Age=86400; SameSite=Lax`;
}

export function parseCookieHeader(cookieHeader?: string | null) {
  const cookies = new Map<string, string>();
  if (!cookieHeader) return cookies;

  for (const cookie of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    if (!rawName) continue;
    cookies.set(rawName, decodeURIComponent(rawValue.join("=")));
  }

  return cookies;
}

export function getDemoRoleFromCookie(cookieHeader?: string | null): UserRole {
  const role = parseCookieHeader(cookieHeader).get(DEMO_ROLE_COOKIE);
  return isDemoRole(role) ? role : "student";
}

export function isDemoSessionCookieActive(cookieHeader?: string | null) {
  return parseCookieHeader(cookieHeader).get(DEMO_ACTIVE_COOKIE) === "1";
}
