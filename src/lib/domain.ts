/**
 * Canonical root-domain key for reports + SEO pages.
 * google.com/xyz, https://www.google.com, http://Google.com → google.com
 */

export type ReportLocale = "en" | "hi" | "te" | "ta";

export const REPORT_LOCALES: ReportLocale[] = ["en", "hi", "te", "ta"];

export const REPORT_LOCALE_META: Record<
  ReportLocale,
  { label: string; prefix: string; htmlLang: string; ogLocale: string }
> = {
  en: { label: "English", prefix: "", htmlLang: "en", ogLocale: "en_US" },
  hi: { label: "हिन्दी", prefix: "/hi", htmlLang: "hi", ogLocale: "hi_IN" },
  te: { label: "తెలుగు", prefix: "/te", htmlLang: "te", ogLocale: "te_IN" },
  ta: { label: "தமிழ்", prefix: "/ta", htmlLang: "ta", ogLocale: "ta_IN" },
};

export function normalizeRootDomain(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) {
    throw new Error("Enter a website or domain.");
  }

  let candidate = trimmed;

  // If it looks like a full URL without protocol, add one for URL parsing
  if (!/^https?:\/\//i.test(candidate) && candidate.includes("/")) {
    candidate = `https://${candidate}`;
  }

  try {
    if (/^https?:\/\//i.test(candidate)) {
      const url = new URL(candidate);
      candidate = url.hostname;
    } else {
      // Strip path/query if pasted without protocol: example.com/foo?x=1
      candidate = candidate.split("/")[0].split("?")[0].split("#")[0];
    }
  } catch {
    candidate = trimmed.split("/")[0].split("?")[0].split("#")[0];
  }

  candidate = candidate.replace(/^www\./i, "");
  candidate = candidate.replace(/\.$/, "");

  // Basic hostname validation
  if (
    !candidate ||
    candidate.includes(" ") ||
    !candidate.includes(".") ||
    candidate.length > 253
  ) {
    throw new Error("Enter a valid domain like example.com");
  }

  if (!/^[a-z0-9.-]+$/i.test(candidate)) {
    throw new Error("Enter a valid domain like example.com");
  }

  return candidate;
}

export function reportPath(
  domain: string,
  locale: ReportLocale = "en",
): string {
  const root = normalizeRootDomain(domain);
  const prefix = REPORT_LOCALE_META[locale].prefix;
  return `${prefix}/report/${root}`;
}

export function allReportPaths(domain: string): Record<ReportLocale, string> {
  const root = normalizeRootDomain(domain);
  return {
    en: reportPath(root, "en"),
    hi: reportPath(root, "hi"),
    te: reportPath(root, "te"),
    ta: reportPath(root, "ta"),
  };
}

export function isValidRootDomain(input: string): boolean {
  try {
    normalizeRootDomain(input);
    return true;
  } catch {
    return false;
  }
}
