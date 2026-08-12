import { LegalShell, legalMetadata } from "@/components/LegalShell";

export const metadata = legalMetadata(
  "Disclaimer",
  "WorthMeaning disclaimer — estimates are not appraisals, financial advice, or guarantees. Verify analytics and profit before buying.",
  "/disclaimer",
);

export default function DisclaimerPage() {
  return (
    <LegalShell
      title="Disclaimer"
      kicker="Legal"
      lede="Last updated: August 12, 2026. Please read before relying on any WorthMeaning number."
    >
      <section>
        <h2>Estimates only</h2>
        <p>
          Worth Reports and tools produce <strong>directional estimates</strong>.
          They are not formal appraisals, audits, broker opinions, tax advice,
          legal advice, or investment recommendations.
        </p>
      </section>

      <section>
        <h2>Model limitations</h2>
        <p>
          Traffic may be inferred from public rank models (including Rank.to’s
          published visits formula). Revenue assumptions (such as RPM and pages
          per visit) and valuation multiples are simplified. Real businesses vary
          by niche, geography, seasonality, costs, and risk.
        </p>
      </section>

      <section>
        <h2>No guarantee of accuracy</h2>
        <p>
          Third-party rank data can be incomplete, delayed, or unavailable.
          Domains without rankings will not produce a full estimate. Page fetches
          and RDAP lookups can fail or return partial fields.
        </p>
      </section>

      <section>
        <h2>Buying and selling websites</h2>
        <p>
          Before paying for a website or domain, verify ownership, Google
          Analytics/Search Console, revenue, expenses, traffic quality, and
          transfer mechanics with primary sources. Use contracts and, where
          appropriate, escrow and professional advisors.
        </p>
      </section>

      <section>
        <h2>External links</h2>
        <p>
          Links to Rank.to or other sites are for convenience. We are not
          responsible for third-party content or policies.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          Email{" "}
          <a href="mailto:hello@worthmeaning.com">hello@worthmeaning.com</a>. Also
          see our <a href="/privacy">Privacy Policy</a> and{" "}
          <a href="/terms">Terms of Service</a>.
        </p>
      </section>
    </LegalShell>
  );
}
