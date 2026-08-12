import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { TOOL_CATEGORIES, TOOLS } from "@/lib/tools-catalog";
import { getToolSeo } from "@/lib/tools-seo";

export const metadata: Metadata = {
  title: "Free Website Worth Tools — Calculators & Live Rank.to Lookups | WorthMeaning",
  description:
    "Free website worth tools: live Rank.to calculators, RPM revenue, file size converter, domain age, page weight, offer checks. Fresh data, no signup.",
  alternates: { canonical: "/tools" },
  keywords: [
    "website worth calculator",
    "free website tools",
    "rpm calculator",
    "rank to visits",
    "domain age checker",
    "file size converter",
  ],
  openGraph: {
    title: "Free Website Worth Tools | WorthMeaning",
    description:
      "Valuation, traffic, domain, and buyer tools powered by live data and instant math.",
    url: "/tools",
    type: "website",
    siteName: "WorthMeaning",
  },
  robots: { index: true, follow: true },
};

const indexJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "WorthMeaning Free Tools",
  url: "https://worthmeaning.com/tools",
  description:
    "Free website valuation and web utility tools with live Rank.to lookups and instant calculators.",
  hasPart: TOOLS.map((tool) => ({
    "@type": "WebApplication",
    name: getToolSeo(tool.slug)?.seoTitle || tool.title,
    url: `https://worthmeaning.com/tools/${tool.slug}`,
    description: getToolSeo(tool.slug)?.seoDescription || tool.description,
  })),
};

export default function ToolsIndexPage() {
  return (
    <div className="shell">
      <header className="site-header">
        <a className="brand" href="/">
          Worth<span>Meaning</span>
        </a>
        <a className="nav-note" href="/#report">
          Worth Report →
        </a>
      </header>

      <main className="tool-page">
        <nav className="tool-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Tools</span>
        </nav>

        <header className="tool-hero">
          <p className="worth-kicker">Tools hub</p>
          <h1>Free website worth tools</h1>
          <p className="tool-lede">
            Instant calculators plus live Rank.to / RDAP lookups. Domain tools
            always fetch fresh sources — they never reuse saved Worth Report
            cache. Built for buyers, publishers, and operators who want numbers
            with meaning.
          </p>
        </header>

        {TOOL_CATEGORIES.map((cat) => {
          const items = TOOLS.filter((t) => t.category === cat.id);
          return (
            <section key={cat.id} className="tool-index-section" id={cat.id}>
              <h2>{cat.label}</h2>
              <ul className="tool-index-list">
                {items.map((tool) => {
                  const seo = getToolSeo(tool.slug);
                  return (
                    <li key={tool.slug}>
                      <Link href={`/tools/${tool.slug}`}>
                        <strong>{tool.title}</strong>
                        <span>{seo?.seoDescription || tool.short}</span>
                        {tool.liveData ? (
                          <em className="tool-pill">Live</em>
                        ) : (
                          <em className="tool-pill tool-pill-math">Math</em>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(indexJsonLd) }}
      />
    </div>
  );
}
