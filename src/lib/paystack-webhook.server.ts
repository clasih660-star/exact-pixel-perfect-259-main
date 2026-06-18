import { createHmac } from "node:crypto";
import {
  activateInstitutionSubscription,
  upsertPaymentTransaction,
} from "@/lib/paystack-billing.functions";

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normalizeStatus(status: unknown): "success" | "pending" | "failed" | "abandoned" {
  if (typeof status !== "string") return "pending";
  const lower = status.toLowerCase();
  if (lower === "success") return "success";
  if (lower === "failed") return "failed";
  if (lower === "abandoned") return "abandoned";
  return "pending";
}

function normalizeCurrency(input?: string | null): string {
  return (input || "NGN").toUpperCase();
}

function toMinorUnits(amount: number | string | null | undefined): number {
  if (amount === null || amount === undefined) return 0;
  const parsed = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed);
}

function extractPaystackEvent(body: Record<string, unknown>) {
  const event = typeof body?.event === "string" ? body.event : "";
  const data = (body?.data ?? {}) as Record<string, unknown>;
  return { event, data };
}

export async function processPaystackWebhookPayload(rawBody: string): Promise<{
  ok: boolean;
  event: string;
  handled: boolean;
}> {
  const parsed = safeJsonParse<Record<string, unknown>>(rawBody, {});
  const { event, data } = extractPaystackEvent(parsed);
  if (!event) {
    return { ok: true, event, handled: false };
  }

  const reference =
    typeof data.reference === "string" ? data.reference : null;
  const metadata = (data.metadata ?? {}) as Record<string, unknown>;
  const institutionId =
    typeof metadata.institution_id === "string"
      ? metadata.institution_id
      : typeof metadata.institutionId === "string"
        ? metadata.institutionId
        : null;
  const planSlug =
    typeof metadata.plan_slug === "string"
      ? metadata.plan_slug
      : typeof metadata.planSlug === "string"
        ? metadata.planSlug
        : null;

  if (!institutionId || !reference) {
    return { ok: true, event, handled: false };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalizedStatus = normalizeStatus(data.status);
  const amountMinor = toMinorUnits(data.amount);
  const currency = normalizeCurrency(data.currency as string);
  const channel = typeof data.channel === "string" ? data.channel : null;
  const paidAt = typeof data.paid_at === "string" ? data.paid_at : null;
  const providerReference =
    typeof data.id === "number" || typeof data.id === "string"
      ? String(data.id)
      : null;

  await upsertPaymentTransaction(supabaseAdmin, {
    institutionId,
    reference,
    status: normalizedStatus,
    amountMinor,
    currency,
    providerReference,
    channel,
    customerEmail:
      typeof data.customer?.email === "string"
        ? data.customer.email
        : null,
    paidAt,
    rawResponse: data,
  });

  if (normalizedStatus === "success" && planSlug) {
    await activateInstitutionSubscription(supabaseAdmin, {
      institutionId,
      planSlug,
      reference,
      providerReference,
      billingSource: "paystack",
      currentPeriodStart: paidAt,
      currentPeriodEnd: null,
      status: "active",
    });
  }

  return { ok: true, event, handled: true };
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  return expected === signature;
}
