import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { getTool } from "@/lib/tools-catalog";
import type { ToolMeta } from "@/lib/tools-catalog";
import { getToolSeo } from "@/lib/tools-seo";

type Props = {
  tool: ToolMeta;
  children: ReactNode;
};

export function ToolShell({ tool, children }: Props) {
  const seo = getToolSeo(tool.slug);
  const related =
    seo?.related
      .map((slug) => getTool(slug))
      .filter((t): t is ToolMeta => Boolean(t)) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://worthmeaning.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: "https://worthmeaning.com/tools",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.title,
            item: `https://worthmeaning.com/tools/${tool.slug}`,
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: seo?.seoTitle || tool.title,
        url: `https://worthmeaning.com/tools/${tool.slug}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: seo?.seoDescription || tool.description,
        provider: {
          "@type": "Organization",
          name: "WorthMeaning",
          url: "https://worthmeaning.com",
        },
      },
      ...(seo?.faqs?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: seo.faqs.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="shell">
      <header className="site-header">
        <a className="brand" href="/">
          Worth<span>Meaning</span>
        </a>
        <a className="nav-note" href="/tools">
          ← All tools
        </a>
      </header>

      <main className="tool-page">
        <nav className="tool-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/tools">Tools</Link>
          <span>/</span>
          <span>{tool.title}</span>
        </nav>

        <header className="tool-hero">
          <p className="worth-kicker">
            Tools
            {tool.liveData ? " · Live data" : " · Instant math"}
          </p>
          <h1>{seo?.seoTitle?.split("—")[0]?.trim() || tool.title}</h1>
          <p className="tool-lede">{seo?.intro || tool.description}</p>
          {tool.liveData ? (
            <p className="tool-live-badge">
              Always fetches fresh sources — never uses saved Worth Report cache.
            </p>
          ) : null}
        </header>

        <section className="tool-panel" aria-label="Tool">
          {children}
        </section>

        {seo?.howItWorks?.length ? (
          <section className="tool-seo-block" id="how-it-works">
            <p className="worth-kicker">How it works</p>
            <h2>How to use this tool</h2>
            <ol>
              {seo.howItWorks.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        ) : null}

        {seo?.faqs?.length ? (
          <section className="tool-seo-block" id="faq">
            <p className="worth-kicker">FAQ</p>
            <h2>Questions about {tool.title}</h2>
            <div className="faq-list">
              {seo.faqs.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section className="tool-seo-block" id="related">
            <p className="worth-kicker">Related</p>
            <h2>Related tools</h2>
            <ul className="tool-related-list">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/tools/${item.slug}`}>
                    <strong>{item.title}</strong>
                    <span>{item.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="tool-cta-line">
          Want the full story?{" "}
          <Link href="/#report">Get a Worth Report</Link>
          {" · "}
          <Link href="/worth-meaning">Worth meaning</Link>
          {" · "}
          <Link href="/disclaimer">Disclaimer</Link>
        </p>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
