import { normalizeRootDomain } from "@/lib/domain";
import {
  DEFAULT_MULTIPLE,
  DEFAULT_RPM,
  worthFromVisits,
} from "@/lib/tool-math";
import { fetchRankTo } from "@/lib/rank-to";
import type { LiveDomainSnapshot } from "@/lib/tools-live-types";

export type { LiveDomainSnapshot };

/** Always hits Rank.to with cache: "no-store". Never reads WorthMeaning report cache. */
export async function liveDomainSnapshot(
  input: string,
  opts?: { rpm?: number; multiple?: number; days?: number },
): Promise<LiveDomainSnapshot> {
  const domain = normalizeRootDomain(input);
  const rpm = opts?.rpm ?? DEFAULT_RPM;
  const multiple = opts?.multiple ?? DEFAULT_MULTIPLE;
  const result = await fetchRankTo(domain, opts?.days ?? 365);

  if (!result.ok) {
    throw new Error(result.error);
  }

  const econ = worthFromVisits(result.monthlyVisits, rpm, multiple);

  return {
    domain: result.domain,
    fetchedAt: new Date().toISOString(),
    source: "rank.to",
    cached: false,
    rank: result.rank,
    asOf: result.asOf,
    monthlyVisits: result.monthlyVisits,
    rankDelta7d: result.rankDelta7d,
    rankDelta30d: result.rankDelta30d,
    insights: {
      trajectoryLabel: result.insights.trajectoryLabel,
      momentumLabel: result.insights.momentumLabel,
      monthlyVisitsDeltaPct: result.insights.monthlyVisitsDeltaPct,
      bestRank: result.insights.bestRank,
      worstRank: result.insights.worstRank,
      historyDaysReturned: result.historyDaysReturned,
    },
    neighbors: result.neighbors,
    economics: {
      rpm,
      multiple,
      monthlyRevenue: econ.monthlyRevenue,
      annualRevenue: econ.annualRevenue,
      worth: econ.worth,
    },
  };
}

function isPrivateHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h.endsWith(".internal")
  ) {
    return true;
  }
  // Block obvious IPs in private ranges
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
    const [a, b] = h.split(".").map(Number);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  return false;
}

export type RdapAgeResult = {
  domain: string;
  fetchedAt: string;
  cached: false;
  source: "rdap";
  created: string | null;
  updated: string | null;
  expires: string | null;
  registrar: string | null;
  ageDays: number | null;
  ageYears: number | null;
  rawEvents: { action: string; date: string }[];
};

export async function liveDomainAge(input: string): Promise<RdapAgeResult> {
  const domain = normalizeRootDomain(input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(
      `https://rdap.org/domain/${encodeURIComponent(domain)}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/rdap+json, application/json",
          "User-Agent": "WorthMeaning/0.1 (+https://worthmeaning.com)",
        },
        cache: "no-store",
        redirect: "follow",
      },
    );

    if (!res.ok) {
      throw new Error(
        res.status === 404
          ? "RDAP has no record for this domain (or TLD unsupported)."
          : `RDAP returned HTTP ${res.status}`,
      );
    }

    const data = (await res.json()) as {
      events?: { eventAction?: string; eventDate?: string }[];
      entities?: {
        roles?: string[];
        vcardArray?: unknown[];
        publicIds?: { identifier?: string }[];
      }[];
    };

    const events = (data.events || [])
      .filter((e) => e.eventAction && e.eventDate)
      .map((e) => ({
        action: String(e.eventAction),
        date: String(e.eventDate),
      }));

    const find = (...actions: string[]) =>
      events.find((e) =>
        actions.some((a) => e.action.toLowerCase() === a.toLowerCase()),
      )?.date || null;

    const created = find("registration", "registered");
    const updated = find("last changed", "last update of RDAP database");
    const expires = find("expiration", "expire");

    let registrar: string | null = null;
    for (const ent of data.entities || []) {
      if (ent.roles?.includes("registrar")) {
        const vcard = ent.vcardArray;
        if (Array.isArray(vcard) && Array.isArray(vcard[1])) {
          for (const row of vcard[1] as unknown[]) {
            if (
              Array.isArray(row) &&
              row[0] === "fn" &&
              typeof row[3] === "string"
            ) {
              registrar = row[3];
              break;
            }
          }
        }
        if (!registrar && ent.publicIds?.[0]?.identifier) {
          registrar = ent.publicIds[0].identifier;
        }
      }
    }

    let ageDays: number | null = null;
    let ageYears: number | null = null;
    if (created) {
      const t = new Date(created).getTime();
      if (Number.isFinite(t)) {
        ageDays = Math.floor((Date.now() - t) / 86_400_000);
        ageYears = Math.round((ageDays / 365.25) * 10) / 10;
      }
    }

    return {
      domain,
      fetchedAt: new Date().toISOString(),
      cached: false,
      source: "rdap",
      created,
      updated,
      expires,
      registrar,
      ageDays,
      ageYears,
      rawEvents: events,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export type PageWeightResult = {
  url: string;
  fetchedAt: string;
  cached: false;
  status: number;
  contentType: string | null;
  htmlBytes: number;
  transferBytes: number | null;
  redirectTo: string | null;
};

export async function livePageWeight(input: string): Promise<PageWeightResult> {
  let url: URL;
  try {
    url = new URL(input.includes("://") ? input : `https://${input}`);
  } catch {
    throw new Error("Enter a valid http(s) URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are allowed.");
  }
  if (isPrivateHostname(url.hostname)) {
    throw new Error("That host is not allowed.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent": "WorthMeaning/0.1 (+https://worthmeaning.com)",
      },
      cache: "no-store",
      redirect: "follow",
    });

    const buf = await res.arrayBuffer();
    // Cap analysis at 5MB to avoid memory blowups
    const slice = buf.byteLength > 5_000_000 ? buf.slice(0, 5_000_000) : buf;
    const contentLength = res.headers.get("content-length");

    return {
      url: url.toString(),
      fetchedAt: new Date().toISOString(),
      cached: false,
      status: res.status,
      contentType: res.headers.get("content-type"),
      htmlBytes: slice.byteLength,
      transferBytes: contentLength ? Number(contentLength) : null,
      redirectTo: res.url !== url.toString() ? res.url : null,
    };
  } finally {
    clearTimeout(timeout);
  }
}
