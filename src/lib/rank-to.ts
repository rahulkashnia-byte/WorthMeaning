export type RankPoint = {
  date: string;
  rank: number;
  /** Rank.to traffic model applied to that day's rank */
  monthlyVisits: number;
};

export type RankNeighbor = {
  domain: string;
  rank: number;
};

export type RankToInsights = {
  /** First rank in the fetched window */
  firstRank: number;
  firstDate: string;
  /** Latest rank */
  currentRank: number;
  currentDate: string;
  bestRank: number;
  bestDate: string;
  worstRank: number;
  worstDate: string;
  /** Positions gained over window (positive = improved) */
  totalChange: number;
  changePerDay: number;
  /** |totalChange|/firstRank * 100 */
  velocityPct: number;
  meanRank: number;
  stdDev: number;
  /** Distance below peak: current - best (0 = at peak) */
  fromPeak: number;
  /** Recent 3-day avg vs prior 3-day avg (positive = improving) */
  momentum: number | null;
  trajectory:
    | "strong_up"
    | "improving"
    | "stable"
    | "declining"
    | "sharp_decline";
  trajectoryLabel: string;
  momentumLabel:
    | "accelerating_up"
    | "positive"
    | "neutral"
    | "slowing"
    | "decelerating"
    | "unknown";
  audienceBand: "mega" | "large" | "mid" | "growing" | "niche";
  audienceLabel: string;
  /** Visits at start vs end of window */
  monthlyVisitsStart: number;
  monthlyVisitsCurrent: number;
  monthlyVisitsDelta: number;
  monthlyVisitsDeltaPct: number | null;
};

export type RankToResult =
  | {
      ok: true;
      domain: string;
      /** Snapshot date from Rank.to response */
      snapshotDate: string;
      /** Server timing string from Rank.to, if present */
      apiTime: string | null;
      historyDaysRequested: number;
      historyDaysReturned: number;
      rank: number;
      asOf: string;
      history: RankPoint[];
      monthlyVisits: number;
      rankDelta7d: number | null;
      rankDelta30d: number | null;
      insights: RankToInsights;
      neighbors: {
        date: string | null;
        above: RankNeighbor[];
        below: RankNeighbor[];
      };
      /** Raw ranks map as returned by Rank.to (date → rank) */
      rawRanks: Record<string, number>;
    }
  | {
      ok: false;
      error: string;
    };

type RankToResponse = {
  date?: string;
  ranks?: Record<string, number> | unknown[];
  time?: string;
  error?: string;
};

type NeighborsResponse = {
  date?: string;
  current?: { domain: string; rank: number };
  above?: { domain: string; rank: number }[];
  below?: { domain: string; rank: number }[];
  time?: string;
};

/**
 * Rank.to's published traffic model (from their site JS):
 *   monthlyVisits = round(9e10 * rank ^ -1.05)
 */
export function estimateMonthlyVisitsFromRank(rank: number): number {
  if (!Number.isFinite(rank) || rank < 1) return 0;
  return Math.round(9e10 * Math.pow(rank, -1.05));
}

function buildInsights(history: RankPoint[]): RankToInsights {
  const ranks = history.map((h) => h.rank);
  const n = ranks.length;
  const current = ranks[n - 1];
  const first = ranks[0];
  const best = Math.min(...ranks);
  const worst = Math.max(...ranks);
  const bestIdx = ranks.indexOf(best);
  const worstIdx = ranks.indexOf(worst);
  const totalChange = first - current; // + = improved
  const changePerDay = n > 1 ? totalChange / (n - 1) : 0;
  const velocityPct = first > 0 ? Math.abs((totalChange / first) * 100) : 0;
  const meanRank = ranks.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(
    ranks.reduce((s, r) => s + (r - meanRank) ** 2, 0) / n,
  );

  let momentum: number | null = null;
  if (n >= 6) {
    const recent = ranks.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const prior = ranks.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    momentum = prior - recent;
  }

  const fromPeak = current - best;

  let trajectory: RankToInsights["trajectory"] = "stable";
  let trajectoryLabel = "Relatively stable";
  if (totalChange > 500) {
    trajectory = "strong_up";
    trajectoryLabel = "Strong upward trend";
  } else if (totalChange > 100) {
    trajectory = "improving";
    trajectoryLabel = "Improving";
  } else if (totalChange < -500) {
    trajectory = "sharp_decline";
    trajectoryLabel = "Sharp decline";
  } else if (totalChange < -100) {
    trajectory = "declining";
    trajectoryLabel = "Declining";
  }

  let momentumLabel: RankToInsights["momentumLabel"] = "unknown";
  if (momentum != null) {
    if (momentum > 500) momentumLabel = "accelerating_up";
    else if (momentum > 50) momentumLabel = "positive";
    else if (momentum > -50) momentumLabel = "neutral";
    else if (momentum > -500) momentumLabel = "slowing";
    else momentumLabel = "decelerating";
  }

  const visits = estimateMonthlyVisitsFromRank(current);
  let audienceBand: RankToInsights["audienceBand"] = "niche";
  let audienceLabel = "Early-stage or niche audience";
  if (visits >= 1e9) {
    audienceBand = "mega";
    audienceLabel = "One of the world’s most visited properties";
  } else if (visits >= 1e6) {
    audienceBand = "large";
    audienceLabel = "Well-established destination with broad reach";
  } else if (visits >= 100_000) {
    audienceBand = "mid";
    audienceLabel = "Solid mid-tier traffic, visible in its niche";
  } else if (visits >= 10_000) {
    audienceBand = "growing";
    audienceLabel = "Growing site — meaningful but still niche";
  }

  const monthlyVisitsStart = history[0].monthlyVisits;
  const monthlyVisitsCurrent = history[n - 1].monthlyVisits;
  const monthlyVisitsDelta = monthlyVisitsCurrent - monthlyVisitsStart;
  const monthlyVisitsDeltaPct =
    monthlyVisitsStart > 0
      ? (monthlyVisitsDelta / monthlyVisitsStart) * 100
      : null;

  return {
    firstRank: first,
    firstDate: history[0].date,
    currentRank: current,
    currentDate: history[n - 1].date,
    bestRank: best,
    bestDate: history[bestIdx].date,
    worstRank: worst,
    worstDate: history[worstIdx].date,
    totalChange: Math.round(totalChange),
    changePerDay: Math.round(changePerDay * 10) / 10,
    velocityPct: Math.round(velocityPct * 10) / 10,
    meanRank: Math.round(meanRank),
    stdDev: Math.round(stdDev),
    fromPeak,
    momentum: momentum == null ? null : Math.round(momentum),
    trajectory,
    trajectoryLabel,
    momentumLabel,
    audienceBand,
    audienceLabel,
    monthlyVisitsStart,
    monthlyVisitsCurrent,
    monthlyVisitsDelta,
    monthlyVisitsDeltaPct:
      monthlyVisitsDeltaPct == null
        ? null
        : Math.round(monthlyVisitsDeltaPct * 10) / 10,
  };
}

async function fetchNeighbors(domain: string): Promise<{
  date: string | null;
  above: RankNeighbor[];
  below: RankNeighbor[];
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(
      `https://rank.to/api/?neighbors=${encodeURIComponent(domain)}&count=5`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "WorthMeaning/0.1 (+https://worthmeaning.com)",
        },
        cache: "no-store",
      },
    );
    clearTimeout(timeout);
    if (!res.ok) return { date: null, above: [], below: [] };
    const data = (await res.json()) as NeighborsResponse;
    return {
      date: data.date || null,
      above: (data.above || []).map((n) => ({
        domain: n.domain,
        rank: Number(n.rank),
      })),
      below: (data.below || []).map((n) => ({
        domain: n.domain,
        rank: Number(n.rank),
      })),
    };
  } catch {
    return { date: null, above: [], below: [] };
  }
}

/**
 * Free public Rank.to API — no key required.
 * Captures full history (up to 365 days) + neighbors + derived insights.
 */
export async function fetchRankTo(
  domain: string,
  days = 365,
): Promise<RankToResult> {
  const cleaned = domain.replace(/^www\./i, "").trim().toLowerCase();
  if (!cleaned) {
    return { ok: false, error: "Missing domain" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const [rankRes, neighbors] = await Promise.all([
      fetch(
        `https://rank.to/api/?d=${encodeURIComponent(cleaned)}&n=${days}`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "User-Agent": "WorthMeaning/0.1 (+https://worthmeaning.com)",
          },
          cache: "no-store",
        },
      ),
      fetchNeighbors(cleaned),
    ]);
    clearTimeout(timeout);

    if (rankRes.status === 429) {
      return {
        ok: false,
        error: "Rank.to rate limit hit — try again in a moment.",
      };
    }

    if (!rankRes.ok) {
      return { ok: false, error: `Rank.to returned HTTP ${rankRes.status}` };
    }

    const data = (await rankRes.json()) as RankToResponse;
    const ranks = data.ranks;
    if (!ranks || Array.isArray(ranks) || typeof ranks !== "object") {
      return {
        ok: false,
        error:
          "No Rank.to ranking data for this domain yet (new, low-traffic, or not indexed).",
      };
    }

    const rawRanks: Record<string, number> = {};
    for (const [date, rank] of Object.entries(ranks)) {
      const n = Number(rank);
      if (Number.isFinite(n) && n > 0) rawRanks[date] = Math.round(n);
    }

    const history: RankPoint[] = Object.entries(rawRanks)
      .map(([date, rank]) => ({
        date,
        rank,
        monthlyVisits: estimateMonthlyVisitsFromRank(rank),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!history.length) {
      return {
        ok: false,
        error:
          "No Rank.to ranking data for this domain yet (new, low-traffic, or not indexed).",
      };
    }

    const latest = history[history.length - 1];
    const weekAgo =
      history.length >= 8 ? history[history.length - 8] : history[0];
    const monthAgo =
      history.length >= 31 ? history[history.length - 31] : history[0];

    const rankDelta7d =
      history.length >= 2 ? weekAgo.rank - latest.rank : null;
    const rankDelta30d =
      history.length >= 2 ? monthAgo.rank - latest.rank : null;

    return {
      ok: true,
      domain: cleaned,
      snapshotDate: data.date || latest.date,
      apiTime: data.time || null,
      historyDaysRequested: days,
      historyDaysReturned: history.length,
      rank: latest.rank,
      asOf: latest.date,
      history,
      monthlyVisits: latest.monthlyVisits,
      rankDelta7d,
      rankDelta30d,
      insights: buildInsights(history),
      neighbors,
      rawRanks,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Could not reach Rank.to",
    };
  }
}
