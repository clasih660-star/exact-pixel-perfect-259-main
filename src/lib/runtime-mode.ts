function readNodeEnv() {
  return typeof process !== "undefined" ? process.env?.NODE_ENV : undefined;
}

function readRuntimeFlag(name: string) {
  const clientEnv =
    typeof import.meta !== "undefined" ? ((import.meta.env as Record<string, string | undefined>)[name] ?? undefined) : undefined;
  const serverEnv = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return clientEnv ?? serverEnv;
}

function isTruthyFlag(value?: string) {
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

export function isDevelopmentRuntime() {
  return Boolean(
    (typeof import.meta !== "undefined" && import.meta.env?.DEV) || readNodeEnv() === "development",
  );
}

export function isProductionRuntime() {
  return Boolean(
    (typeof import.meta !== "undefined" && import.meta.env?.PROD) || readNodeEnv() === "production",
  );
}

/**
 * Demo mode is useful locally, but it must never become the production auth path.
 *
 * Hardening rule:
 * - development: allowed by default for local product exploration
 * - preview/staging/production builds: disabled unless explicitly enabled
 *   via ALLOW_DEMO_MODE / VITE_ALLOW_DEMO_MODE
 */
export function isDemoModeAllowed() {
  const explicitOverride = readRuntimeFlag("ALLOW_DEMO_MODE") ?? readRuntimeFlag("VITE_ALLOW_DEMO_MODE");
  if (explicitOverride !== undefined) {
    return isTruthyFlag(explicitOverride);
  }

  return isDevelopmentRuntime() && !isProductionRuntime();
}