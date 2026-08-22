/** Popular domains to pre-build Worth Report pages for SEO / discovery. */
export const SEED_REPORT_DOMAINS = [
  "google.com",
  "youtube.com",
  "facebook.com",
  "instagram.com",
  "wikipedia.org",
  "amazon.com",
  "reddit.com",
  "github.com",
  "netflix.com",
  "flipkart.com",
  "indiatimes.com",
  "123telugu.com",
  "worthofweb.com",
] as const;

export type SeedReportDomain = (typeof SEED_REPORT_DOMAINS)[number];
