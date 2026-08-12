import { buildReportFaqs, faqJsonLd } from "@/lib/report-faq";
import type { ReportLocale } from "@/lib/domain";
import { getUsdInrRate } from "@/lib/fx";
import { buildLocaleFaqs, REPORT_UI } from "@/lib/report-i18n";
import type { WorthReport } from "@/lib/worth-report";

type Props = {
  report: WorthReport;
  locale?: ReportLocale;
};

export async function ReportFaqSection({ report, locale = "en" }: Props) {
  const ui = REPORT_UI[locale];
  const fx = await getUsdInrRate();
  const faqs =
    locale === "en"
      ? await buildReportFaqs(report)
      : [
          ...buildLocaleFaqs(report, locale, fx.rate),
          {
            question:
              locale === "hi"
                ? `${report.hostname} की कीमत कैसे निकाली जाती है?`
                : locale === "te"
                  ? `${report.hostname} విలువ ఎలా లెక్క?`
                  : `${report.hostname} மதிப்பு எப்படி கணக்கிடப்படுகிறது?`,
            answer: report.methodology,
          },
        ];
  const jsonLd = faqJsonLd(faqs);

  return (
    <section className="faq-section" id="questions">
      <div className="faq-intro">
        <p className="worth-kicker">{ui.faqKicker}</p>
        <h2>{ui.faqTitle(report.hostname)}</h2>
        <p>{ui.faqIntro}</p>
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
