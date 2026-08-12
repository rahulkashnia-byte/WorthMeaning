import { BuyerQuestionsSection } from "@/components/BuyerQuestionsSection";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { SiteFooter } from "@/components/SiteFooter";
import { WorthReportTool } from "@/components/WorthReportTool";

export default function Home() {
  return (
    <div className="shell">
      <header className="site-header">
        <a className="brand" href="/">
          Worth<span>Meaning</span>
        </a>
        <p className="nav-note">worthmeaning.com</p>
      </header>

      <main>
        <section className="hero hero-with-tool" id="report">
          <h1 className="hero-brand">
            Worth<em>Meaning</em>
          </h1>
          <p className="hero-copy">
            Live Rank.to ranking in, clear midpoint and meaning out — so you
            know what a site might be worth and why.
          </p>
          <div className="hero-actions">
            <a className="btn-ghost" href="/tools">
              Free tools
            </a>
            <a className="btn-ghost" href="/hi/website-ki-kimat">
              हिन्दी
            </a>
            <a className="btn-ghost" href="/te/website-viluva">
              తెలుగు
            </a>
            <a className="btn-ghost" href="/ta/website-vilai">
              தமிழ்
            </a>
          </div>

          <div className="hero-tool">
            <p className="worth-kicker">Worth Report</p>
            <p className="hero-tool-blurb">
              Paste any domain — we save English + हिन्दी + తెలుగు + தமிழ் SEO
              pages (USD and ₹ Lakh/Crore).
            </p>
            <WorthReportTool autofocus />
          </div>
        </section>

        <BuyerQuestionsSection />

        <HomeFaqSection />

        <section className="panel" id="how">
          <div className="panel-intro">
            <p className="worth-kicker">Method</p>
            <h2>Real Rank.to data + clear math</h2>
            <p>
              1) Live global rank from{" "}
              <a href="https://rank.to/" target="_blank" rel="noreferrer">
                Rank.to
              </a>{" "}
              · 2) Monthly visits via their published model{" "}
              <code>9×10¹⁰ × rank⁻¹·⁰⁵</code> · 3) Assumed ads/affiliate RPM ·
              4) Revenue · 5) Worth ≈ annual × 2.5 years. If Rank.to has no
              ranking for a domain, we say so — we don’t invent a fake rank.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
