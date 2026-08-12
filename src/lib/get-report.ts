import { normalizeRootDomain } from "@/lib/domain";
import {
  readCachedReport,
  writeCachedReport,
  type CachedWorthReport,
} from "@/lib/report-cache";
import { buildWorthReport } from "@/lib/worth-report";

/**
 * Load saved report for a root domain, or build+save once if missing.
 */
export async function getOrCreateDomainReport(
  domainInput: string,
  options?: { refresh?: boolean },
): Promise<CachedWorthReport> {
  const root = normalizeRootDomain(domainInput);

  if (!options?.refresh) {
    const cached = await readCachedReport(root);
    if (cached) return cached;
  }

  const report = await buildWorthReport(root);
  return writeCachedReport(report);
}
