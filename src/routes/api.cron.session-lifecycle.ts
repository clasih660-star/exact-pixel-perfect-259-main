import { createFileRoute } from "@tanstack/react-router";
import { tickSessionLifecycle } from "@/lib/session-lifecycle.functions";

/**
 * Cron endpoint for session lifecycle management.
 *
 * Called every ~60 seconds by an external scheduler (Vercel Cron, GitHub
 * Actions, etc.) to:
 *  - Flip scheduled sessions to "live" at their start time
 *  - Auto-complete stale live sessions
 *  - Send "going live" notifications to enrolled participants
 *
 * Auth: Bearer token matching CRON_SECRET env var (falls back to a shared
 * secret). Server functions also use Supabase auth for safety.
 */
export const Route = createFileRoute("/api/cron/session-lifecycle")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Verify the shared secret (bearer token or x-cron-secret header).
        const authHeader = request.headers.get("authorization") ?? "";
        const headerSecret = request.headers.get("x-cron-secret") ?? "";
        const expectedSecret = process.env.CRON_SECRET ?? process.env.VITE_CRON_SECRET ?? "klassruum-cron-dev";

        const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
        if (bearer !== expectedSecret && headerSecret !== expectedSecret) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          // Call the server function with an unauthenticated service context.
          // The function uses a service-role Supabase client internally when
          // available; in demo mode it no-ops.
          const result = await tickSessionLifecycle({ data: { cron_secret: expectedSecret } } as any);
          return new Response(JSON.stringify({ ok: true, ...result, timestamp: new Date().toISOString() }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error: any) {
          console.error("[cron/session-lifecycle]", error);
          return new Response(JSON.stringify({ error: error.message ?? "Internal error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
      POST: async ({ request }) => {
        // Same logic as GET but allows POST for schedulers that prefer it.
        const authHeader = request.headers.get("authorization") ?? "";
        const headerSecret = request.headers.get("x-cron-secret") ?? "";
        const expectedSecret = process.env.CRON_SECRET ?? process.env.VITE_CRON_SECRET ?? "klassruum-cron-dev";

        const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
        if (bearer !== expectedSecret && headerSecret !== expectedSecret) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const result = await tickSessionLifecycle({ data: { cron_secret: expectedSecret } } as any);
          return new Response(JSON.stringify({ ok: true, ...result, timestamp: new Date().toISOString() }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error: any) {
          console.error("[cron/session-lifecycle]", error);
          return new Response(JSON.stringify({ error: error.message ?? "Internal error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});