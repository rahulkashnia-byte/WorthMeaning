import { LegalShell, legalMetadata } from "@/components/LegalShell";

export const metadata = legalMetadata(
  "Contact",
  "Contact WorthMeaning — email hello@worthmeaning.com for privacy requests, feedback, partnerships, and press.",
  "/contact",
);

export default function ContactPage() {
  return (
    <LegalShell
      title="Contact"
      kicker="Support"
      lede="We read every message. For fastest help, include the domain or tool URL involved."
    >
      <section>
        <h2>Email</h2>
        <p>
          <a href="mailto:hello@worthmeaning.com">hello@worthmeaning.com</a>
        </p>
      </section>

      <section>
        <h2>What to include</h2>
        <ul>
          <li>The page or tool you used (URL)</li>
          <li>The domain you looked up (if any)</li>
          <li>What you expected vs what happened</li>
          <li>For privacy requests: the data you want reviewed</li>
        </ul>
      </section>

      <section>
        <h2>Response time</h2>
        <p>
          We aim to reply within a few business days. Rank.to outages or rate
          limits are usually temporary — try again before writing.
        </p>
      </section>

      <section>
        <h2>Policies</h2>
        <p>
          <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms</a> ·{" "}
          <a href="/disclaimer">Disclaimer</a>
        </p>
      </section>
    </LegalShell>
  );
}
