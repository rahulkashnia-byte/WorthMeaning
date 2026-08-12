import { LegalShell, legalMetadata } from "@/components/LegalShell";

export const metadata = legalMetadata(
  "Terms of Service",
  "Terms of Service for WorthMeaning — acceptable use, estimates disclaimer, intellectual property, and liability limits.",
  "/terms",
);

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      kicker="Legal"
      lede="Last updated: August 12, 2026. By using worthmeaning.com you agree to these Terms."
    >
      <section>
        <h2>Agreement</h2>
        <p>
          These Terms govern access to WorthMeaning websites, tools, APIs, and
          content. If you do not agree, do not use the service. Contact:{" "}
          <a href="mailto:hello@worthmeaning.com">hello@worthmeaning.com</a>.
        </p>
      </section>

      <section>
        <h2>What WorthMeaning provides</h2>
        <p>
          WorthMeaning offers educational website-worth estimates, calculators,
          and related articles. Estimates may use third-party ranking data (such
          as Rank.to), models, and assumptions. Results are informational — not
          appraisals, investment advice, or guarantees of sale price.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not abuse, overload, or scrape the service in ways that harm availability</li>
          <li>Do not attempt unauthorized access to systems or other users’ data</li>
          <li>Do not use tools to probe private/internal networks or illegal targets</li>
          <li>Do not misrepresent WorthMeaning estimates as certified valuations</li>
        </ul>
      </section>

      <section>
        <h2>Accounts and submissions</h2>
        <p>
          You are responsible for domains/URLs and numbers you submit. Do not
          submit unlawful content. Public report pages may be created for domains
          users look up.
        </p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          WorthMeaning branding, site design, and original content are owned by
          us or licensed to us. You may not copy the product wholesale. Rank.to
          and other third-party names are property of their owners.
        </p>
      </section>

      <section>
        <h2>Third-party services</h2>
        <p>
          Live features depend on third parties (Rank.to, RDAP registries, remote
          websites you ask us to measure). Their availability and accuracy are
          outside our control.
        </p>
      </section>

      <section>
        <h2>Disclaimer of warranties</h2>
        <p>
          The service is provided “as is” and “as available” without warranties
          of any kind, express or implied, including accuracy, merchantability,
          fitness for a particular purpose, or non-infringement.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, WorthMeaning and its operators
          are not liable for indirect, incidental, special, consequential, or
          punitive damages, or for lost profits, data, or business opportunities,
          arising from use of the service or reliance on estimates.
        </p>
      </section>

      <section>
        <h2>Indemnity</h2>
        <p>
          You agree to indemnify and hold harmless WorthMeaning from claims
          arising out of your misuse of the service or violation of these Terms.
        </p>
      </section>

      <section>
        <h2>Changes and termination</h2>
        <p>
          We may modify or discontinue features at any time. We may update these
          Terms by posting a new version with a revised date. We may suspend
          access for abuse or legal risk.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>
          These Terms are governed by applicable laws of the jurisdiction where
          the operator is established, without regard to conflict-of-law rules.
          Courts there shall have exclusive jurisdiction, except where consumer
          protections require otherwise.
        </p>
      </section>
    </LegalShell>
  );
}
