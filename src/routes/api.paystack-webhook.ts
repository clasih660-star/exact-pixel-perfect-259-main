import { createFileRoute } from "@tanstack/react-router";
import {
  processPaystackWebhookPayload,
  verifyPaystackWebhookSignature,
} from "@/lib/paystack-webhook.server";

export const Route = createFileRoute("/api/paystack-webhook")({
  server: {
    handlers: {
      GET: () =>
        new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "POST" },
        }),
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature = request.headers.get("x-paystack-signature");

        if (!verifyPaystackWebhookSignature(rawBody, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const result = await processPaystackWebhookPayload(rawBody);
        return Response.json(result, { status: 200 });
      },
    },
  },
});
