function readNodeEnv() {
  return typeof process !== "undefined" ? process.env?.NODE_ENV : undefined;
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
 */
export function isDemoModeAllowed() {
  return !isProductionRuntime();
}