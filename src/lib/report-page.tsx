import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DomainReportView } from "@/components/DomainReportView";
import { SiteFooter } from "@/components/SiteFooter";
import {
  REPORT_LOCALE_META,
  REPORT_LOCALES,
  type ReportLocale,
  normalizeRootDomain,
  reportPath,
} from "@/lib/domain";
import { formatInrIndian, usdToInr } from "@/lib/format";
import { getUsdInrRate } from "@/lib/fx";
import { getOrCreateDomainReport } from "@/lib/get-report";
import { REPORT_UI, reportSeoMeta } from "@/lib/report-i18n";
import { readCachedReport } from "@/lib/report-cache";

type Props = {
  params: Promise<{ domain: string[] }>;
};

function rawFromParams(segments: string[]) {
  return decodeURIComponent(segments.join("/"));
}

export async function generateReportMetadata(
  locale: ReportLocale,
  params: Props["params"],
): Promise<Metadata> {
  const { domain: segments } = await params;
  let root: string;
  try {
    root = normalizeRootDomain(rawFromParams(segments));
  } catch {
    return { title: "Report not found | WorthMeaning", robots: { index: false } };
  }

  let cached = await readCachedReport(root);
  if (!cached) {
    try {
      cached = await getOrCreateDomainReport(root);
    } catch {
      cached = null;
    }
  }

  const fx = await getUsdInrRate();
  const midInr = cached
    ? formatInrIndian(usdToInr(cached.estimatedWorth.mid, fx.rate))
    : null;
  const seo = reportSeoMeta(
    locale,
    root,
    cached?.estimatedWorth.mid ?? null,
    midInr,
  );
  const path = reportPath(root, locale);
  const shouldIndex = Boolean(cached?.rankTo?.history?.length);
  const languages: Record<string, string> = {};
  for (const loc of REPORT_LOCALES) {
    languages[loc === "en" ? "en" : loc] = reportPath(root, loc);
  }
  languages["x-default"] = reportPath(root, "en");

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: path,
      languages,
    },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: path,
      type: "article",
      locale: REPORT_LOCALE_META[locale].ogLocale,
    },
  };
}

export async function DomainReportPageBody({
  locale,
  params,
}: {
  locale: ReportLocale;
  params: Props["params"];
}) {
  const { domain: segments } = await params;
  const raw = rawFromParams(segments);
  const ui = REPORT_UI[locale];

  let root: string;
  try {
    root = normalizeRootDomain(raw);
  } catch {
    notFound();
  }

  if (raw.toLowerCase() !== root) {
    permanentRedirect(reportPath(root, locale));
  }

  try {
    const report = await getOrCreateDomainReport(root);
    return (
      <div className="shell" lang={REPORT_LOCALE_META[locale].htmlLang}>
        <header className="site-header">
          <a className="brand" href="/">
            Worth<span>Meaning</span>
          </a>
          <a className="nav-note" href="/#report">
            {ui.newSearch}
          </a>
        </header>
        <main>
          <DomainReportView report={report} locale={locale} />
        </main>
        <SiteFooter />
      </div>
    );
  } catch {
    return (
      <div className="shell" lang={REPORT_LOCALE_META[locale].htmlLang}>
        <header className="site-header">
          <a className="brand" href="/">
            Worth<span>Meaning</span>
          </a>
          <a className="nav-note" href="/#report">
            {ui.newSearch}
          </a>
        </header>
        <main>
          <section className="panel" style={{ marginTop: "2rem" }}>
            <div className="panel-intro">
              <p className="worth-kicker">{ui.noDataTitle}</p>
              <h1 className="worth-host">{root}</h1>
              <p>{ui.noDataBody}</p>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
