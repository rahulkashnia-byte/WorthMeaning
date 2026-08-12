import { normalizeRootDomain } from "@/lib/domain";
import {
  fetchRankTo,
  type RankNeighbor,
  type RankPoint,
  type RankToInsights,
} from "@/lib/rank-to";

/**
 * Production Worth Report engine (Worth-of-Web style), powered by Rank.to:
 *   Rank.to global rank (+ full history, neighbors, insights)
 *     → Rank.to monthly visits model (9e10 * rank^-1.05)
 *     → assumed ads/affiliate RPM
 *     → daily / monthly / annual revenue
 *     → worth ≈ annual revenue × years multiple
 *
 * No synthetic rank fallback — if Rank.to has no data, we return an error.
 */

export type Signal = {
  label: string;
  tone: "positive" | "neutral" | "caution";
  detail: string;
};

export type WorthReport = {
  url: string;
  hostname: string;
  fetched: boolean;
  title: string | null;
  description: string | null;
  globalRank: number;
  rankSource: "rank.to";
  rankAsOf: string;
  rankDelta7d: number | null;
  rankDelta30d: number | null;
  /** Full Rank.to capture — history, insights, neighbors, raw ranks */
  rankTo: {
    snapshotDate: string;
    apiTime: string | null;
    historyDaysRequested: number;
    historyDaysReturned: number;
    history: RankPoint[];
    insights: RankToInsights;
    neighbors: {
      date: string | null;
      above: RankNeighbor[];
      below: RankNeighbor[];
    };
    rawRanks: Record<string, number>;
  };
  dailyVisits: number;
  dailyPageviews: number;
  pagesPerVisit: number;
  assumedRpm: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  revenueYearsMultiple: number;
  estimatedWorth: { low: number; mid: number; high: number };
  estimatedMonthlyVisits: { low: number; mid: number; high: number };
  estimatedMonthlyRevenue: { low: number; mid: number; high: number };
  confidence: number;
  readinessScore: number;
  meaning: string;
  summary: string;
  methodology: string;
  signals: Signal[];
  nextSteps: string[];
  analyzedAt: string;
};

type PageSignals = {
  title: string | null;
  description: string | null;
  wordCount: number;
  headingCount: number;
  hasViewport: boolean;
  hasCanonical: boolean;
  hasOpenGraph: boolean;
  hasJsonLd: boolean;
  hasAnalytics: boolean;
  monetizationHints: string[];
  techHints: string[];
  statusOk: boolean;
  blockedByProtection: boolean;
};

const PREMIUM_TLDS = new Set(["com", "io", "ai", "co", "app", "dev"]);
const WEAK_TLDS = new Set(["tk", "ml", "ga", "cf", "gq", "xyz", "online", "site"]);

const DEFAULT_RPM = 8.5;
const PAGES_PER_VISIT = 3.2;
const REVENUE_YEARS_MULTIPLE = 2.5;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function normalizeUrl(input: string): string {
  const root = normalizeRootDomain(input);
  return `https://${root}/`;
}

function extractMeta(html: string, name: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
      "i",
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function looksLikeChallengePage(title: string | null, html: string) {
  const t = (title || "").toLowerCase();
  const lower = html.toLowerCase();
  return (
    t.includes("just a moment") ||
    t.includes("attention required") ||
    t.includes("access denied") ||
    lower.includes("cf-browser-verification") ||
    lower.includes("checking your browser") ||
    lower.includes("cdn-cgi/challenge")
  );
}

function analyzeHtml(html: string): Omit<
  PageSignals,
  "statusOk" | "blockedByProtection"
> {
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
  if (looksLikeChallengePage(title, html)) {
    return {
      title,
      description: null,
      wordCount: 0,
      headingCount: 0,
      hasViewport: false,
      hasCanonical: false,
      hasOpenGraph: false,
      hasJsonLd: false,
      hasAnalytics: false,
      monetizationHints: [],
      techHints: [],
    };
  }

  const description =
    extractMeta(html, "description") ?? extractMeta(html, "og:description");
  const textish = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = textish ? textish.split(" ").length : 0;
  const headingCount = (html.match(/<h[1-3]\b/gi) || []).length;
  const lower = html.toLowerCase();

  const monetizationHints: string[] = [];
  if (/adsense|googlesyndication|ezoic|mediavine|adthrive|raptive/.test(lower)) {
    monetizationHints.push("Display ads detected");
  }
  if (/stripe\.com|lemonsqueezy|paddle\.com|shopify|woocommerce|gumroad/.test(lower)) {
    monetizationHints.push("Commerce / payments signals");
  }
  if (/affiliate|amzn\.to|amazon\.com\/[dp]|impact\.com|shareasale/.test(lower)) {
    monetizationHints.push("Affiliate-style links");
  }
  if (/pricing|subscribe|membership|pro plan|billing/.test(lower)) {
    monetizationHints.push("Subscription / pricing language");
  }

  const techHints: string[] = [];
  if (/next\/static|_next\//.test(lower)) techHints.push("Modern JS framework");
  if (/wp-content|wordpress/.test(lower)) techHints.push("WordPress");
  if (/cdn\.shopify|myshopify/.test(lower)) techHints.push("Shopify");
  if (/webflow|framer\.com|squarespace/.test(lower)) techHints.push("Site builder");

  return {
    title,
    description,
    wordCount,
    headingCount,
    hasViewport: /name=["']viewport["']/i.test(html),
    hasCanonical: /rel=["']canonical["']/i.test(html),
    hasOpenGraph: /property=["']og:/i.test(html),
    hasJsonLd: /application\/ld\+json/i.test(html),
    hasAnalytics:
      /googletagmanager|google-analytics|gtag\(|plausible|mixpanel|segment\.com|hotjar/.test(
        lower,
      ),
    monetizationHints,
    techHints,
  };
}

async function fetchPage(url: string): Promise<PageSignals> {
  const empty: PageSignals = {
    title: null,
    description: null,
    wordCount: 0,
    headingCount: 0,
    hasViewport: false,
    hasCanonical: false,
    hasOpenGraph: false,
    hasJsonLd: false,
    hasAnalytics: false,
    monetizationHints: [],
    techHints: [],
    statusOk: false,
    blockedByProtection: false,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; WorthMeaningBot/0.1; +https://worthmeaning.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });
    clearTimeout(timeout);
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("xml")) {
      return { ...empty, statusOk: res.ok };
    }
    const html = (await res.text()).slice(0, 400_000);
    const rawTitle =
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
    if (looksLikeChallengePage(rawTitle, html)) {
      return { ...empty, blockedByProtection: true };
    }
    return {
      ...analyzeHtml(html),
      statusOk: res.ok,
      blockedByProtection: false,
    };
  } catch {
    return empty;
  }
}

function domainScore(hostname: string) {
  const host = hostname.replace(/^www\./, "");
  const parts = host.split(".");
  const tld = parts.at(-1) || "";
  const name = parts.slice(0, -1).join(".") || host;
  const len = name.length;
  let score = 55;

  if (PREMIUM_TLDS.has(tld)) score += 12;
  if (WEAK_TLDS.has(tld)) score -= 18;
  if (len <= 8) score += 10;
  else if (len <= 12) score += 6;
  else if (len >= 20) score -= 8;
  if (name.includes("-")) score -= 6;
  if (/\d/.test(name)) score -= 4;

  return { host, name, tld, score: clamp(score, 15, 95) };
}

function formatMoney(n: number) {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `$${v >= 10 ? Math.round(v) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `$${v >= 10 ? Math.round(v) : v.toFixed(1)}k`;
  }
  return `$${Math.round(n)}`;
}

export async function buildWorthReport(rawUrl: string): Promise<WorthReport> {
  const url = normalizeUrl(rawUrl);
  const hostname = normalizeRootDomain(rawUrl);
  const domain = domainScore(hostname);

  const [page, rankTo] = await Promise.all([
    fetchPage(url),
    fetchRankTo(hostname, 365),
  ]);

  if (!rankTo.ok) {
    throw new Error(rankTo.error);
  }

  const fetched = page.statusOk || Boolean(page.title) || page.wordCount > 40;
  const globalRank = rankTo.rank;
  const monthlyVisits = rankTo.monthlyVisits;
  const dailyVisits = Math.max(1, Math.round(monthlyVisits / 30));
  const pagesPerVisit = PAGES_PER_VISIT;
  const dailyPageviews = Math.round(dailyVisits * pagesPerVisit);
  const insights = rankTo.insights;

  let assumedRpm = DEFAULT_RPM;
  if (page.monetizationHints.some((h) => h.includes("Subscription"))) {
    assumedRpm = 28;
  } else if (page.monetizationHints.some((h) => h.includes("Commerce"))) {
    assumedRpm = 22;
  } else if (page.monetizationHints.some((h) => h.includes("Affiliate"))) {
    assumedRpm = 14;
  } else if (page.monetizationHints.some((h) => h.includes("Display"))) {
    assumedRpm = 11;
  }

  const dailyRevenue = (dailyPageviews / 1000) * assumedRpm;
  const monthlyRevenue = dailyRevenue * 30;
  const annualRevenue = monthlyRevenue * 12;
  const revenueYearsMultiple = REVENUE_YEARS_MULTIPLE;
  const midWorth = Math.max(250, Math.round(annualRevenue * revenueYearsMultiple));
  const lowWorth = Math.round(midWorth * 0.55);
  const highWorth = Math.round(midWorth * 1.85);

  let readiness = 35 + Math.round(domain.score * 0.25);
  if (page.hasViewport) readiness += 4;
  if (page.hasCanonical) readiness += 5;
  if (page.hasOpenGraph) readiness += 5;
  if (page.hasJsonLd) readiness += 4;
  if (page.hasAnalytics) readiness += 8;
  if (page.headingCount >= 3) readiness += 4;
  if (page.wordCount > 300) readiness += 6;
  if (page.monetizationHints.length) readiness += 10;
  if (!fetched) readiness -= 12;
  readiness = clamp(readiness, 12, 92);

  let confidence = 58;
  confidence += Math.min(10, page.monetizationHints.length * 4);
  confidence += page.hasAnalytics ? 4 : 0;
  confidence += fetched ? 4 : 0;
  confidence += rankTo.historyDaysReturned >= 30 ? 4 : 0;
  confidence += rankTo.historyDaysReturned >= 180 ? 2 : 0;
  confidence = clamp(confidence, 40, 82);

  const delta = rankTo.rankDelta7d;
  const deltaText =
    delta == null
      ? "Not enough history for a 7-day trend."
      : delta > 0
        ? `Improved ${delta.toLocaleString()} places over ~7 days.`
        : delta < 0
          ? `Dropped ${Math.abs(delta).toLocaleString()} places over ~7 days.`
          : "Flat over ~7 days.";

  const delta30 = rankTo.rankDelta30d;
  const delta30Text =
    delta30 == null
      ? null
      : delta30 > 0
        ? `+${delta30.toLocaleString()} places / ~30d`
        : delta30 < 0
          ? `${delta30.toLocaleString()} places / ~30d`
          : "Flat / ~30d";

  const visitDeltaText =
    insights.monthlyVisitsDeltaPct == null
      ? `${insights.monthlyVisitsDelta >= 0 ? "+" : ""}${insights.monthlyVisitsDelta.toLocaleString()} visits vs start of window`
      : `${insights.monthlyVisitsDeltaPct >= 0 ? "+" : ""}${insights.monthlyVisitsDeltaPct}% estimated visits over ${rankTo.historyDaysReturned} days`;

  const signals: Signal[] = [
    {
      label: "Rank.to global rank",
      tone: "positive",
      detail: `#${globalRank.toLocaleString()} as of ${rankTo.asOf} (snapshot ${rankTo.snapshotDate}). ${deltaText}${delta30Text ? ` · ${delta30Text}` : ""}`,
    },
    {
      label: "Rank history captured",
      tone: rankTo.historyDaysReturned >= 30 ? "positive" : "neutral",
      detail: `${rankTo.historyDaysReturned} daily ranks stored (requested ${rankTo.historyDaysRequested}). Best #${insights.bestRank.toLocaleString()} (${insights.bestDate}) · worst #${insights.worstRank.toLocaleString()} (${insights.worstDate}).`,
    },
    {
      label: "Trajectory",
      tone:
        insights.trajectory === "strong_up" || insights.trajectory === "improving"
          ? "positive"
          : insights.trajectory === "declining" ||
              insights.trajectory === "sharp_decline"
            ? "caution"
            : "neutral",
      detail: `${insights.trajectoryLabel}. Net ${insights.totalChange >= 0 ? "+" : ""}${insights.totalChange.toLocaleString()} places · ~${insights.changePerDay}/day · ${insights.velocityPct}% move vs start.`,
    },
    {
      label: "Momentum",
      tone:
        insights.momentumLabel === "accelerating_up" ||
        insights.momentumLabel === "positive"
          ? "positive"
          : insights.momentumLabel === "slowing" ||
              insights.momentumLabel === "decelerating"
            ? "caution"
            : "neutral",
      detail:
        insights.momentum == null
          ? "Need ≥6 days to compute 3-day momentum."
          : `${insights.momentumLabel.replaceAll("_", " ")} (${insights.momentum >= 0 ? "+" : ""}${insights.momentum} positions, last 3 days vs prior 3).`,
    },
    {
      label: "Rank.to traffic model",
      tone: "neutral",
      detail: `~${monthlyVisits.toLocaleString()} monthly visits (${insights.audienceLabel}). ${visitDeltaText}. Formula: 9×10¹⁰ × rank⁻¹·⁰⁵.`,
    },
    {
      label: "Volatility",
      tone: insights.stdDev > insights.meanRank * 0.05 ? "caution" : "neutral",
      detail: `Mean rank #${insights.meanRank.toLocaleString()} · stddev ${insights.stdDev.toLocaleString()} · ${insights.fromPeak === 0 ? "currently at period peak" : `${insights.fromPeak.toLocaleString()} places off peak`}.`,
    },
    {
      label: "Neighbors",
      tone: rankTo.neighbors.above.length || rankTo.neighbors.below.length ? "neutral" : "caution",
      detail:
        rankTo.neighbors.above.length || rankTo.neighbors.below.length
          ? `Above: ${rankTo.neighbors.above.map((n) => n.domain).join(", ") || "—"}. Below: ${rankTo.neighbors.below.map((n) => n.domain).join(", ") || "—"}.`
          : "No neighbor data returned.",
    },
    {
      label: "Revenue model",
      tone: page.monetizationHints.length ? "positive" : "caution",
      detail: page.monetizationHints.length
        ? `Assumed ads/affiliate RPM $${assumedRpm}. Signals: ${page.monetizationHints.join(" · ")}`
        : `Assumed ads/affiliate RPM $${assumedRpm} (Worth-of-Web style potential revenue).`,
    },
    {
      label: "Domain quality",
      tone: domain.score >= 70 ? "positive" : domain.score >= 50 ? "neutral" : "caution",
      detail: `${domain.name}.${domain.tld} scores ${domain.score}/100 on length, TLD, and brand cleanliness.`,
    },
    {
      label: "Page access",
      tone: fetched ? "positive" : "caution",
      detail: fetched
        ? "Live HTML fetched for monetization / readiness signals."
        : page.blockedByProtection
          ? "Bot protection blocked HTML fetch — valuation still uses Rank.to traffic."
          : "Could not fetch HTML — valuation still uses Rank.to traffic.",
    },
  ];

  if (page.title) {
    signals.push({
      label: "Positioning",
      tone: "neutral",
      detail: `Title: “${page.title.slice(0, 90)}${page.title.length > 90 ? "…" : ""}”`,
    });
  }

  const nextSteps = [
    "Rank.to traffic is model-based (± order of magnitude) — verify with GA for diligence.",
    "For a sale price, replace assumed RPM with real monthly profit × market multiple.",
    page.monetizationHints.length
      ? "Document how portable revenue is after transfer."
      : "If this site is not ad-based, enter real revenue instead of the RPM assumption.",
    insights.trajectory === "strong_up" || insights.trajectory === "improving"
      ? "Rising rank can support a firmer ask — still verify revenue before paying up."
      : "Compare with sold comps in the same niche before negotiating.",
  ];

  const meaning = `${hostname} is Rank.to #${globalRank.toLocaleString()} (${rankTo.asOf}) with ${rankTo.historyDaysReturned} days of history captured — ${insights.trajectoryLabel.toLowerCase()}, ${insights.audienceLabel.toLowerCase()}. Their model maps to ~${monthlyVisits.toLocaleString()} monthly visits. Assuming ads/affiliate monetization at $${assumedRpm} RPM, potential revenue is about ${formatMoney(annualRevenue)}/yr and midpoint worth near ${formatMoney(midWorth)}.`;

  const methodology =
    "Rank.to full history (up to 365d) + neighbors → visits via 9e10 × rank^-1.05 → assumed ads/affiliate RPM → revenue → worth ≈ annual × 2.5 years.";

  const summary = `${hostname}: Rank.to #${globalRank.toLocaleString()} · ${insights.trajectoryLabel} · ~${monthlyVisits.toLocaleString()} visits/mo · ${formatMoney(monthlyRevenue)}/mo potential · midpoint ${formatMoney(midWorth)}.`;

  return {
    url,
    hostname,
    fetched,
    title: page.title,
    description: page.description,
    globalRank,
    rankSource: "rank.to" as const,
    rankAsOf: rankTo.asOf,
    rankDelta7d: rankTo.rankDelta7d,
    rankDelta30d: rankTo.rankDelta30d,
    rankTo: {
      snapshotDate: rankTo.snapshotDate,
      apiTime: rankTo.apiTime,
      historyDaysRequested: rankTo.historyDaysRequested,
      historyDaysReturned: rankTo.historyDaysReturned,
      history: rankTo.history,
      insights: rankTo.insights,
      neighbors: rankTo.neighbors,
      rawRanks: rankTo.rawRanks,
    },
    dailyVisits,
    dailyPageviews,
    pagesPerVisit,
    assumedRpm,
    dailyRevenue: Math.round(dailyRevenue * 100) / 100,
    monthlyRevenue: Math.round(monthlyRevenue),
    annualRevenue: Math.round(annualRevenue),
    revenueYearsMultiple,
    estimatedWorth: { low: lowWorth, mid: midWorth, high: highWorth },
    estimatedMonthlyVisits: {
      low: Math.round(monthlyVisits * 0.55),
      mid: monthlyVisits,
      high: Math.round(monthlyVisits * 1.85),
    },
    estimatedMonthlyRevenue: {
      low: Math.round(monthlyRevenue * 0.55),
      mid: Math.round(monthlyRevenue),
      high: Math.round(monthlyRevenue * 1.85),
    },
    confidence,
    readinessScore: readiness,
    meaning,
    summary,
    methodology,
    signals,
    nextSteps,
    analyzedAt: new Date().toISOString(),
  };
}
