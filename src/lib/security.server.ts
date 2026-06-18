import process from "node:process";

import { isProductionRuntime } from "./runtime-mode";
import { SecurityConfigurationError } from "./security-errors";

function toOrigin(value?: string | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function assertProductionSecurityConfiguration() {
  if (!isProductionRuntime()) return;

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY;

  const isMissing = !supabaseUrl || !supabaseKey;
  const isPlaceholder =
    supabaseUrl?.includes("demo.supabase") ||
    supabaseKey?.includes("demo_key") ||
    supabaseKey?.includes("placeholder");

  if (isMissing || isPlaceholder) {
    throw new SecurityConfigurationError(
      "Supabase authentication is not securely configured for production.",
    );
  }
}

export function buildContentSecurityPolicy() {
  const connectSources = new Set<string>(["'self'", "https:", "wss:"]);
  const supabaseOrigin = toOrigin(
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? null,
  );
  const publicAppOrigin = toOrigin(
    process.env.APP_URL ?? process.env.PUBLIC_APP_URL ?? process.env.VITE_APP_URL ?? null,
  );

  if (supabaseOrigin) connectSources.add(supabaseOrigin);
  if (publicAppOrigin) connectSources.add(publicAppOrigin);

  if (!isProductionRuntime()) {
    connectSources.add("http://localhost:*");
    connectSources.add("ws://localhost:*");
    connectSources.add("http://127.0.0.1:*");
    connectSources.add("ws://127.0.0.1:*");
  }

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "form-action 'self'",
    "manifest-src 'self'",
    // TanStack Start injects inline bootstrap data/scripts required for SSR hydration.
    "script-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `connect-src ${[...connectSources].join(" ")}`,
    "media-src 'self' data: blob: https:",
    "worker-src 'self' blob:",
  ];

  if (isProductionRuntime()) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export function applySecurityHeaders(response: Response) {
  const headers = new Headers(response.headers);

  headers.set("Content-Security-Policy", buildContentSecurityPolicy());
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("Origin-Agent-Cluster", "?1");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
