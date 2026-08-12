import { LegalShell, legalMetadata } from "@/components/LegalShell";

export const metadata = legalMetadata(
  "Privacy Policy",
  "Privacy Policy for WorthMeaning — what data we process, how tool requests work, cookies, and your choices.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      kicker="Legal"
      lede="Last updated: August 12, 2026. This policy explains how worthmeaning.com (“WorthMeaning”, “we”) handles information."
    >
      <section>
        <h2>Who we are</h2>
        <p>
          WorthMeaning provides website worth estimates, educational calculators,
          and related content at{" "}
          <a href="https://worthmeaning.com">worthmeaning.com</a>. Contact:{" "}
          <a href="mailto:hello@worthmeaning.com">hello@worthmeaning.com</a>.
        </p>
      </section>

      <section>
        <h2>Information we process</h2>
        <ul>
          <li>
            <strong>Tool inputs you submit</strong> — domains, URLs, and numbers
            you enter to run calculators or live lookups. Live lookups are sent
            to our servers so we can query Rank.to, RDAP, or fetch a public page.
          </li>
          <li>
            <strong>Worth Reports</strong> — when you generate a report, we may
            store the result on our server (filesystem cache) to power the
            public <code>/report/&#123;domain&#125;</code> page until refreshed.
          </li>
          <li>
            <strong>Technical logs</strong> — standard server/request logs may
            include IP address, user agent, timestamps, and requested paths for
            security and reliability.
          </li>
          <li>
            <strong>Local browser processing</strong> — some tools (for example
            image dimensions and pure math converters) run in your browser and do
            not upload files to us.
          </li>
        </ul>
      </section>

      <section>
        <h2>Third-party services</h2>
        <p>
          Live traffic tools query{" "}
          <a href="https://rank.to/" rel="noreferrer" target="_blank">
            Rank.to
          </a>
          . Domain age uses public RDAP. Page-weight fetches the URL you provide.
          Those services receive the domain/URL needed to answer the request and
          operate under their own terms and policies.
        </p>
        <p>
          If we add analytics or advertising later (for example Google Analytics
          or ad networks), this policy will be updated to name them and describe
          cookies/identifiers they use.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          We may use essential cookies or local storage required to operate the
          site. We do not sell personal information. If non-essential analytics
          or advertising cookies are introduced, we will disclose them here and
          provide choices where required by law.
        </p>
      </section>

      <section>
        <h2>How we use information</h2>
        <ul>
          <li>To provide Worth Reports and free tools</li>
          <li>To create public report pages for domains users look up</li>
          <li>To maintain security, prevent abuse, and debug outages</li>
          <li>To improve product quality and documentation</li>
        </ul>
      </section>

      <section>
        <h2>Retention</h2>
        <p>
          Cached reports may remain until overwritten by an update or removed
          during maintenance. Server logs are kept only as long as needed for
          operations and security. Browser-only tool data stays on your device.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can stop using the site at any time. For privacy requests related
          to stored report data or logs, email{" "}
          <a href="mailto:hello@worthmeaning.com">hello@worthmeaning.com</a> with
          the domain or details involved. We may need to verify the request.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          WorthMeaning is not directed at children under 13 (or the equivalent
          minimum age in your region). We do not knowingly collect personal
          information from children.
        </p>
      </section>

      <section>
        <h2>International visitors</h2>
        <p>
          The service may be hosted or processed in countries different from
          yours. By using WorthMeaning you understand information may be
          transferred to where we (and processors we use) operate.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          We may update this Privacy Policy. The “Last updated” date at the top
          will change when we do. Continued use after updates means you accept
          the revised policy.
        </p>
      </section>
    </LegalShell>
  );
}
