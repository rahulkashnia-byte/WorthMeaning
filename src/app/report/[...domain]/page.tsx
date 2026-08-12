import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DomainReportView } from "@/components/DomainReportView";
import { SiteFooter } from "@/components/SiteFooter";
import { normalizeRootDomain, reportPath } from "@/lib/domain";
import { getOrCreateDomainReport } from "@/lib/get-report";
import { readCachedReport } from "@/lib/report-cache";

type Props = {
  params: Promise<{ domain: string[] }>;
};

export const dynamic = "force-dynamic";

function rawFromParams(segments: string[]) {
  return decodeURIComponent(segments.join("/"));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

  const title = cached
    ? `${root} website worth: estimated value & meaning | WorthMeaning`
    : `${root} website worth report | WorthMeaning`;
  const description = cached
    ? `Estimated worth of ${root}: about ${cached.estimatedWorth.mid.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} midpoint. Rank.to traffic, revenue potential, and what the number means.`
    : `Check how much ${root} might be worth — Rank.to traffic, estimated revenue, and plain-English meaning.`;

  const shouldIndex = Boolean(cached?.rankTo?.history?.length);

  return {
    title,
    description,
    alternates: { canonical: reportPath(root) },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: reportPath(root),
      type: "article",
    },
  };
}

export default async function DomainReportPage({ params }: Props) {
  const { domain: segments } = await params;
  const raw = rawFromParams(segments);

  let root: string;
  try {
    root = normalizeRootDomain(raw);
  } catch {
    notFound();
  }

  // One canonical URL per root domain
  if (raw.toLowerCase() !== root) {
    permanentRedirect(reportPath(root));
  }

  try {
    const report = await getOrCreateDomainReport(root);
    return (
      <div className="shell">
        <header className="site-header">
          <a className="brand" href="/">
            Worth<span>Meaning</span>
          </a>
          <a className="nav-note" href="/#report">
            New search
          </a>
        </header>
        <main>
          <DomainReportView report={report} />
        </main>
        <SiteFooter />
      </div>
    );
  } catch {
    return (
      <div className="shell">
        <header className="site-header">
          <a className="brand" href="/">
            Worth<span>Meaning</span>
          </a>
          <a className="nav-note" href="/#report">
            Try another domain
          </a>
        </header>
        <main>
          <section className="panel" style={{ marginTop: "2rem" }}>
            <div className="panel-intro">
              <p className="worth-kicker">No Rank.to data</p>
              <h1 className="worth-host">{root}</h1>
              <p>
                We couldn’t build an indexable worth report for this domain yet
                (not ranked on Rank.to, or the lookup failed). Try again later
                or search a different site.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }
}
