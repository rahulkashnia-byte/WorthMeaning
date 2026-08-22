import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { WorthReportTool } from "@/components/WorthReportTool";
import type { LocalePageConfig } from "@/lib/locale-pages";

export function localeMetadata(page: LocalePageConfig): Metadata {
  const url = `/${page.path}`;
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: url,
      languages: {
        hi: "/hi/website-ki-kimat",
        te: "/te/website-viluva",
        ta: "/ta/website-vilai",
        en: "/",
        "x-default": "/",
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "website",
      siteName: "WorthMeaning",
      locale:
        page.lang === "hi"
          ? "hi_IN"
          : page.lang === "te"
            ? "te_IN"
            : "ta_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: { index: true, follow: true },
  };
}

export function LocaleWorthPage({ page }: { page: LocalePageConfig }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://worthmeaning.com/${page.path}`,
        url: `https://worthmeaning.com/${page.path}`,
        name: page.h1,
        description: page.description,
        inLanguage: page.htmlLang,
        isPartOf: { "@id": "https://worthmeaning.com/#website" },
      },
      {
        "@type": "WebApplication",
        name: page.h1,
        url: `https://worthmeaning.com/${page.path}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        inLanguage: page.htmlLang,
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        description: page.description,
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
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
            name: page.localeLabel,
            item: `https://worthmeaning.com/${page.path}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="shell" lang={page.htmlLang}>
      <header className="site-header">
        <a className="brand" href="/">
          Worth<span>Meaning</span>
        </a>
        <div className="locale-switch">
          {page.otherLocales.map((loc) => (
            <Link key={loc.href} href={loc.href}>
              {loc.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="locale-page">
        <nav className="tool-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{page.localeLabel}</span>
        </nav>

        <header className="locale-hero">
          <p className="worth-kicker">{page.kicker}</p>
          <h1>{page.h1}</h1>
          <p className="locale-lede">{page.lede}</p>
          <p className="locale-inr-note">{page.inrNote}</p>
        </header>

        <section className="panel" id="check">
          <div className="panel-intro">
            <p className="worth-kicker">Worth Report</p>
            <h2>{page.toolHeading}</h2>
            <p>{page.toolBlurb}</p>
          </div>
          <WorthReportTool autofocus />
        </section>

        <section className="locale-section" id="how">
          <p className="worth-kicker">Method</p>
          <h2>{page.howHeading}</h2>
          <ol>
            {page.howSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="locale-section" id="meaning">
          <p className="worth-kicker">Meaning</p>
          <h2>{page.whyHeading}</h2>
          {page.whyBody.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </section>

        <section className="locale-section" id="faq">
          <p className="worth-kicker">FAQ</p>
          <h2>FAQ</h2>
          <div className="faq-list">
            {page.faqs.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="tool-cta-line">
          <Link href="/tools/live-site-worth">Site worth checker</Link>
          {" · "}
          <Link href="/tools/adsense-earnings">Website earning checker</Link>
          {" · "}
          <Link href="/tools">All tools</Link>
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
