import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Worth Meaning: What Does Worth Mean? | WorthMeaning",
  description:
    "Worth meaning explained — the definition of worth, net worth, “worth it,” and website worth. How WorthMeaning turns a dollar estimate into plain English.",
  alternates: { canonical: "/worth-meaning" },
  keywords: [
    "worth meaning",
    "what does worth mean",
    "definition of worth",
    "net worth meaning",
    "website worth meaning",
    "worthmeaning",
  ],
  openGraph: {
    title: "Worth Meaning: What Does Worth Mean?",
    description:
      "Clear definition of worth — money value, usefulness, and what a website-worth number actually means.",
    url: "/worth-meaning",
    type: "article",
    siteName: "WorthMeaning",
  },
  twitter: {
    card: "summary_large_image",
    title: "Worth Meaning: What Does Worth Mean?",
    description:
      "Definition of worth, related phrases, and how WorthMeaning explains website value.",
  },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    id: "definition",
    kicker: "Definition",
    title: "What does worth mean?",
    body: [
      "Worth is the value of something — usually in money, but also in usefulness, importance, or respect. When people ask “what is the worth of X?”, they want a clear sense of how much that thing matters or what someone might pay for it.",
      "In everyday English, worth can be a noun (“the company’s worth”) or an adjective (“the trip was worth it”). Both point to the same idea: measured value.",
    ],
  },
  {
    id: "money",
    kicker: "Money sense",
    title: "Worth as financial value",
    body: [
      "In business and finance, worth usually means monetary value: how much an asset, company, or website might sell for, or what its cash-generating power implies.",
      "That number is almost always an estimate. Markets, buyers, timing, and risk change the price. A published “worth” figure is a framing tool — not a guaranteed sale price.",
    ],
  },
  {
    id: "phrases",
    kicker: "Related phrases",
    title: "Common ways people use “worth”",
    body: [
      "Net worth — assets minus liabilities; often used for a person’s or company’s financial position.",
      "Worth it — whether the benefit justifies the cost, time, or risk.",
      "Self-worth — how valuable someone feels as a person (emotional, not financial).",
      "Website worth — an estimate of what a domain or online business might be valued at based on traffic, revenue potential, and multiples.",
    ],
  },
  {
    id: "website",
    kicker: "On this site",
    title: "What “worth” means on WorthMeaning",
    body: [
      "WorthMeaning estimates website worth from live Rank.to traffic rank, a visits model, assumed ads/affiliate revenue, and a multi-year multiple. The midpoint and range show a directional dollar figure.",
      "The “meaning” half is the plain-English part: what that number assumes, how confident it is, and what a buyer should still verify. Worth without meaning is just a guess with a currency symbol.",
    ],
  },
];

const PAGE_FAQS = [
  {
    q: "What is the simple meaning of worth?",
    a: "Worth means value — how much something is worth in money, usefulness, or importance.",
  },
  {
    q: "Is worth the same as price?",
    a: "Not exactly. Price is what someone asks or pays. Worth is an estimate of value. They meet when a buyer and seller agree, but they can differ a lot.",
  },
  {
    q: "What does website worth mean?",
    a: "Website worth is an estimated value for a domain or online business, often based on traffic, revenue potential, and a valuation multiple. On WorthMeaning it is directional, not a formal appraisal.",
  },
  {
    q: "What does WorthMeaning mean?",
    a: "WorthMeaning is a tool that estimates what a website might be worth and explains what that number means — assumptions, confidence, and next steps for buyers.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://worthmeaning.com/worth-meaning",
      url: "https://worthmeaning.com/worth-meaning",
      name: "Worth Meaning: What Does Worth Mean?",
      description:
        "Worth meaning explained — definition of worth, net worth, worth it, and website worth.",
      isPartOf: { "@id": "https://worthmeaning.com/#website" },
      about: { "@id": "https://worthmeaning.com/worth-meaning#term" },
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://worthmeaning.com/worth-meaning#term",
      name: "worth",
      description:
        "The value of something in money, usefulness, importance, or respect. In finance, often an estimated monetary value of an asset or business.",
      inDefinedTermSet: "https://worthmeaning.com/worth-meaning",
    },
    {
      "@type": "FAQPage",
      mainEntity: PAGE_FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ],
};

export default function WorthMeaningPage() {
  return (
    <div className="shell">
      <header className="site-header">
        <a className="brand" href="/">
          Worth<span>Meaning</span>
        </a>
        <a className="nav-note" href="/#report">
          Get Worth Report →
        </a>
      </header>

      <main className="define-page">
        <article>
          <header className="define-hero">
            <p className="worth-kicker">Dictionary · SEO</p>
            <h1>
              Worth <em>meaning</em>
            </h1>
            <p className="define-lede">
              Worth means value — in money, usefulness, or importance. Here’s
              the plain definition, related phrases, and how website worth works
              on WorthMeaning.
            </p>
          </header>

          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="define-section"
            >
              <p className="worth-kicker">{section.kicker}</p>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section className="define-section" id="faq">
            <p className="worth-kicker">FAQ</p>
            <h2>Questions about the meaning of worth</h2>
            <div className="faq-list">
              {PAGE_FAQS.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="define-cta define-section">
            <p className="worth-kicker">Next</p>
            <h2>See what a website might be worth</h2>
            <p>
              Paste a domain and get a midpoint estimate plus the meaning behind
              the number.
            </p>
            <a className="btn-primary" href="/#report">
              Get Worth Report
            </a>
          </section>
        </article>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
