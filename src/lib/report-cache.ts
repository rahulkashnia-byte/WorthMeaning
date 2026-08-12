import { promises as fs } from "fs";
import path from "path";
import { normalizeRootDomain } from "@/lib/domain";
import type { WorthReport } from "@/lib/worth-report";

const CACHE_DIR = path.join(process.cwd(), ".data", "reports");

export type CachedWorthReport = WorthReport & {
  cached: boolean;
  cachedAt: string;
  dataAgeMs: number;
  dataAgeLabel: string;
};

function cachePathForDomain(domain: string) {
  const root = normalizeRootDomain(domain);
  const safe = root.replace(/[^a-z0-9.-]/gi, "_");
  return { root, file: path.join(CACHE_DIR, `${safe}.json`) };
}

export function formatDataAge(fromIso: string, now = Date.now()): string {
  const then = new Date(fromIso).getTime();
  if (!Number.isFinite(then)) return "unknown age";
  const ms = Math.max(0, now - then);
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  const month = Math.floor(day / 30);
  return `${month} month${month === 1 ? "" : "s"} ago`;
}

function withCacheMeta(
  report: WorthReport,
  cached: boolean,
): CachedWorthReport {
  const cachedAt = report.analyzedAt;
  const dataAgeMs = Math.max(0, Date.now() - new Date(cachedAt).getTime());
  return {
    ...report,
    cached,
    cachedAt,
    dataAgeMs,
    dataAgeLabel: formatDataAge(cachedAt),
  };
}

async function ensureCacheDir() {
  await fs.mkdir(/*turbopackIgnore: true*/ CACHE_DIR, { recursive: true });
}

export async function readCachedReport(
  hostname: string,
): Promise<CachedWorthReport | null> {
  try {
    const { file } = cachePathForDomain(hostname);
    const raw = await fs.readFile(/*turbopackIgnore: true*/ file, "utf8");
    const report = JSON.parse(raw) as WorthReport;
    if (!report?.hostname || !report?.analyzedAt) return null;
    if (!report.rankTo?.history?.length || !report.rankTo?.insights) {
      return null;
    }
    return withCacheMeta(report, true);
  } catch {
    return null;
  }
}

export async function writeCachedReport(
  report: WorthReport,
): Promise<CachedWorthReport> {
  await ensureCacheDir();
  const root = normalizeRootDomain(report.hostname);
  const normalized: WorthReport = { ...report, hostname: root };
  const { file } = cachePathForDomain(root);
  await fs.writeFile(/*turbopackIgnore: true*/ file, JSON.stringify(normalized, null, 2), "utf8");
  return withCacheMeta(normalized, false);
}

export async function listCachedDomains(): Promise<string[]> {
  try {
    const files = await fs.readdir(/*turbopackIgnore: true*/ CACHE_DIR);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/i, ""))
      .sort();
  } catch {
    return [];
  }
}
