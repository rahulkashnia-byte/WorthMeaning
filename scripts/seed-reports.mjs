#!/usr/bin/env node
/**
 * Seed Worth Report cache for popular domains via POST /api/report.
 *
 * Usage:
 *   node scripts/seed-reports.mjs
 *   BASE_URL=https://www.worthmeaning.com node scripts/seed-reports.mjs
 */

const BASE_URL = (process.env.BASE_URL || "http://127.0.0.1:3001").replace(
  /\/$/,
  "",
);

const DOMAINS = [
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
];

async function seedOne(domain) {
  const res = await fetch(`${BASE_URL}/api/report`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: domain }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data.reportPath || `/report/${domain}`;
}

async function main() {
  console.log(`Seeding ${DOMAINS.length} reports via ${BASE_URL}…`);
  let ok = 0;
  let fail = 0;
  for (const domain of DOMAINS) {
    try {
      const path = await seedOne(domain);
      console.log(`✓ ${domain} → ${path}`);
      ok += 1;
    } catch (err) {
      console.error(`✗ ${domain}: ${err.message || err}`);
      fail += 1;
    }
  }
  console.log(`Done. ok=${ok} fail=${fail}`);
  if (fail > 0) process.exitCode = 1;
}

main();
