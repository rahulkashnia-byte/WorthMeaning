export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Used when live FX fetch fails. */
export const FALLBACK_USD_INR = 83.5;

/** Exact INR with Indian digit grouping (e.g. ₹12,34,567). */
export function formatInrExact(inr: number) {
  if (!Number.isFinite(inr)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(inr));
}

/**
 * Indian shorthand: Crore / Lakh / exact rupees.
 * 1 Lakh = ₹1,00,000 · 1 Crore = ₹1,00,00,000
 */
export function formatInrIndian(inr: number): string {
  if (!Number.isFinite(inr) || inr <= 0) return "₹0";

  const abs = Math.abs(inr);
  const sign = inr < 0 ? "-" : "";

  if (abs >= 1_00_00_000) {
    const cr = abs / 1_00_00_000;
    const digits = cr >= 100 ? 1 : 2;
    return `${sign}₹${cr.toFixed(digits)} Cr`;
  }

  if (abs >= 1_00_000) {
    const lakh = abs / 1_00_000;
    const digits = lakh >= 100 ? 1 : 2;
    return `${sign}₹${lakh.toFixed(digits)} Lakh`;
  }

  return `${sign}${formatInrExact(abs)}`;
}

export function usdToInr(usd: number, rate = FALLBACK_USD_INR) {
  return usd * rate;
}

export function formatUsdWithInr(
  usd: number,
  rate = FALLBACK_USD_INR,
): { usd: string; inrShort: string; inrExact: string } {
  const inr = usdToInr(usd, rate);
  return {
    usd: formatUsd(usd),
    inrShort: formatInrIndian(inr),
    inrExact: formatInrExact(inr),
  };
}
