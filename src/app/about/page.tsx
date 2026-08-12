import { LegalShell, legalMetadata } from "@/components/LegalShell";

export const metadata = legalMetadata(
  "About WorthMeaning",
  "About WorthMeaning — we estimate website worth from live Rank.to data and explain what the number means. Free tools for buyers and publishers.",
  "/about",
);

export default function AboutPage() {
  return (
    <LegalShell
      title="About WorthMeaning"
      kicker="Company"
      lede="WorthMeaning helps people understand what a website might be worth — and what that number actually means."
    >
      <section>
        <h2>Our purpose</h2>
        <p>
          Most “website value” calculators spit out a dollar figure and stop.
          WorthMeaning pairs an estimate with plain-English meaning: assumptions,
          confidence, trend context, and what a careful buyer should verify next.
        </p>
      </section>

      <section>
        <h2>How it works</h2>
        <ol>
          <li>Live global rank from Rank.to (when available)</li>
          <li>Estimated visits via their published traffic model</li>
          <li>Assumed ads/affiliate RPM → revenue</li>
          <li>Worth ≈ annual revenue × a years multiple</li>
          <li>Explanation of what the midpoint does and does not prove</li>
        </ol>
      </section>

      <section>
        <h2>Free tools</h2>
        <p>
          Beyond the main Worth Report, we publish free{" "}
          <a href="/tools">tools</a> for RPM math, live comparisons, domain age,
          page weight, and buyer checklists. Live tools always fetch fresh
          sources — they do not reuse saved report cache.
        </p>
      </section>

      <section>
        <h2>What “worth” means</h2>
        <p>
          Read our dictionary page:{" "}
          <a href="/worth-meaning">Worth meaning</a> — definition, related
          phrases, and how we use the word on this site.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions or press:{" "}
          <a href="mailto:hello@worthmeaning.com">hello@worthmeaning.com</a> ·{" "}
          <a href="/contact">Contact page</a>
        </p>
      </section>
    </LegalShell>
  );
}
