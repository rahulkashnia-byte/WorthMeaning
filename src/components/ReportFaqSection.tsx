import { buildReportFaqs, faqJsonLd } from "@/lib/report-faq";
import type { WorthReport } from "@/lib/worth-report";

type Props = {
  report: WorthReport;
};

export function ReportFaqSection({ report }: Props) {
  const faqs = buildReportFaqs(report);
  const jsonLd = faqJsonLd(faqs);

  return (
    <section className="faq-section" id="questions">
      <div className="faq-intro">
        <p className="worth-kicker">Questions people ask</p>
        <h2>About {report.hostname}</h2>
        <p>
          Straight answers from this report — worth, traffic, revenue, trend, and
          whether buying makes sense.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
