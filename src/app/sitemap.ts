import type { MetadataRoute } from "next";
import { REPORT_LOCALES, reportPath } from "@/lib/domain";
import { listCachedDomains, readCachedReport } from "@/lib/report-cache";
import { TOOLS } from "@/lib/tools-catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domains = await listCachedDomains();
  const entries: MetadataRoute.Sitemap = [
    {
      url: "https://worthmeaning.com/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://worthmeaning.com/worth-meaning",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://worthmeaning.com/tools",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://worthmeaning.com/buy-check",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://worthmeaning.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://worthmeaning.com/contact",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://worthmeaning.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://worthmeaning.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://worthmeaning.com/disclaimer",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://worthmeaning.com/hi/website-ki-kimat",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://worthmeaning.com/te/website-viluva",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://worthmeaning.com/ta/website-vilai",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  for (const tool of TOOLS) {
    entries.push({
      url: `https://worthmeaning.com/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const domain of domains) {
    const report = await readCachedReport(domain);
    if (!report?.rankTo?.history?.length) continue;
    for (const locale of REPORT_LOCALES) {
      entries.push({
        url: `https://worthmeaning.com${reportPath(domain, locale)}`,
        lastModified: new Date(report.analyzedAt),
        changeFrequency: "weekly",
        priority: locale === "en" ? 0.7 : 0.65,
      });
    }
  }

  return entries;
}
