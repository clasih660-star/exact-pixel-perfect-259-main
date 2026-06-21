/**
 * Shared course-pricing helpers. USD is the canonical course currency.
 * Keep all price formatting in one place so cards, catalogs, and the pricing
 * page never drift.
 */

export function formatUsd(priceUsd: number): string {
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(priceUsd) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(priceUsd);
}

/**
 * Prefer an explicit pricing label from the DB (e.g. "$15 one-time"), otherwise
 * derive one from the numeric price.
 */
export function formatCoursePrice(
  priceUsd: number | null | undefined,
  pricingLabel?: string | null,
): string {
  if (pricingLabel && pricingLabel.trim()) return pricingLabel.trim();
  return formatUsd(priceUsd ?? 0);
}

export function isFreeCourse(priceUsd: number | null | undefined): boolean {
  return !priceUsd || priceUsd <= 0;
}
