/** Pure live math helpers for /tools — no stored datasets. */

export const DEFAULT_RPM = 8.5;
export const DEFAULT_MULTIPLE = 2.5;
export const PAGES_PER_VISIT = 3.2;

/** Rank.to published model: monthlyVisits = round(9e10 * rank^-1.05) */
export function visitsFromRank(rank: number): number {
  if (!Number.isFinite(rank) || rank < 1) return 0;
  return Math.round(9e10 * Math.pow(rank, -1.05));
}

/** Inverse of Rank.to visits model. */
export function rankFromVisits(monthlyVisits: number): number {
  if (!Number.isFinite(monthlyVisits) || monthlyVisits <= 0) return 0;
  return Math.max(1, Math.round(Math.pow(9e10 / monthlyVisits, 1 / 1.05)));
}

export function revenueFromVisits(monthlyVisits: number, rpm: number) {
  const monthlyPageviews = monthlyVisits * PAGES_PER_VISIT;
  const monthlyRevenue = (monthlyPageviews / 1000) * rpm;
  return {
    monthlyPageviews: Math.round(monthlyPageviews),
    monthlyRevenue,
    annualRevenue: monthlyRevenue * 12,
    dailyRevenue: monthlyRevenue / 30,
  };
}

export function worthFromRevenue(
  annualRevenue: number,
  multiple = DEFAULT_MULTIPLE,
) {
  const mid = annualRevenue * multiple;
  return {
    low: mid * 0.6,
    mid,
    high: mid * 1.5,
  };
}

export function worthFromVisits(
  monthlyVisits: number,
  rpm = DEFAULT_RPM,
  multiple = DEFAULT_MULTIPLE,
) {
  const rev = revenueFromVisits(monthlyVisits, rpm);
  return { ...rev, worth: worthFromRevenue(rev.annualRevenue, multiple) };
}

export function parseFileSizeToBytes(value: number, unit: string): number {
  const u = unit.toUpperCase();
  const map: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    KiB: 1024,
    MiB: 1024 ** 2,
    GiB: 1024 ** 3,
  };
  return value * (map[u] ?? 1);
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return { B: 0, KB: 0, MB: 0, GB: 0, TB: 0 };
  }
  return {
    B: bytes,
    KB: bytes / 1024,
    MB: bytes / 1024 ** 2,
    GB: bytes / 1024 ** 3,
    TB: bytes / 1024 ** 4,
  };
}

export function sessionsForTargetRevenue(opts: {
  targetMonthlyRevenue: number;
  rpm: number;
  pagesPerVisit?: number;
  bounceRatePct?: number;
}) {
  const ppv = opts.pagesPerVisit ?? PAGES_PER_VISIT;
  const bounce = Math.min(100, Math.max(0, opts.bounceRatePct ?? 0)) / 100;
  // Effective pages per visit after bounce (simple model)
  const effectivePpv = ppv * (1 - bounce * 0.5);
  const pageviewsNeeded = (opts.targetMonthlyRevenue / opts.rpm) * 1000;
  const sessionsNeeded = pageviewsNeeded / Math.max(0.1, effectivePpv);
  return {
    pageviewsNeeded: Math.round(pageviewsNeeded),
    sessionsNeeded: Math.round(sessionsNeeded),
    effectivePpv: Math.round(effectivePpv * 100) / 100,
  };
}

export function growthAdjustedWorth(opts: {
  monthlyVisits: number;
  growthPct: number;
  rpm?: number;
  multiple?: number;
}) {
  const rpm = opts.rpm ?? DEFAULT_RPM;
  const multiple = opts.multiple ?? DEFAULT_MULTIPLE;
  const now = worthFromVisits(opts.monthlyVisits, rpm, multiple);
  const futureVisits = opts.monthlyVisits * (1 + opts.growthPct / 100);
  const later = worthFromVisits(futureVisits, rpm, multiple);
  return {
    now,
    later,
    futureVisits: Math.round(futureVisits),
    worthDelta: later.worth.mid - now.worth.mid,
    worthDeltaPct:
      now.worth.mid > 0
        ? ((later.worth.mid - now.worth.mid) / now.worth.mid) * 100
        : null,
  };
}

export function offerVerdict(asking: number, midWorth: number) {
  if (!midWorth || midWorth <= 0) {
    return { ratio: null as number | null, label: "unknown", detail: "Need a mid worth to compare." };
  }
  const ratio = asking / midWorth;
  if (ratio <= 0.75)
    return {
      ratio,
      label: "below estimate",
      detail: "Ask is meaningfully under the model midpoint — still verify profit.",
    };
  if (ratio <= 1.1)
    return {
      ratio,
      label: "near estimate",
      detail: "Ask is close to the model midpoint — diligence still decides it.",
    };
  if (ratio <= 1.5)
    return {
      ratio,
      label: "above estimate",
      detail: "Ask is above the model — need strong growth or profit proof.",
    };
  return {
    ratio,
    label: "far above estimate",
    detail: "Ask is well above the model — treat as optimistic unless numbers are audited.",
  };
}
