import { formatUsd } from "@/lib/format";
import type { WorthReport } from "@/lib/worth-report";

export type FaqItem = {
  question: string;
  answer: string;
};

export function buildReportFaqs(report: WorthReport): FaqItem[] {
  const d = report.hostname;
  const mid = formatUsd(report.estimatedWorth.mid);
  const low = formatUsd(report.estimatedWorth.low);
  const high = formatUsd(report.estimatedWorth.high);
  const visits = report.estimatedMonthlyVisits.mid.toLocaleString();
  const revenue = formatUsd(report.monthlyRevenue);
  const insights = report.rankTo?.insights;

  const faqs: FaqItem[] = [
    {
      question: `How much is ${d} worth?`,
      answer: `WorthMeaning estimates ${d} at about ${mid} (range ${low}–${high}). This uses Rank.to traffic rank, an ads/affiliate revenue assumption, and a ~${report.revenueYearsMultiple}× annual revenue multiple. It is a directional estimate, not a formal appraisal or sale price.`,
    },
    {
      question: `How much traffic does ${d} get?`,
      answer: `Based on Rank.to global rank #${report.globalRank.toLocaleString()} (as of ${report.rankAsOf}), the Rank.to traffic model estimates about ${visits} monthly visits. That figure is model-based (± order of magnitude), not Google Analytics.`,
    },
    {
      question: `How much money can ${d} make?`,
      answer: `Assuming an ads/affiliate model at $${report.assumedRpm} RPM, WorthMeaning estimates about ${revenue}/month in potential revenue (~${formatUsd(report.annualRevenue)}/year). Real earnings depend on niche, monetization, and geography.`,
    },
    {
      question: `What does the ${d} worth number mean?`,
      answer: report.meaning,
    },
    {
      question: `Is ${d}'s traffic going up or down?`,
      answer: insights
        ? `${d} shows a “${insights.trajectoryLabel.toLowerCase()}” trajectory across ${report.rankTo.historyDaysReturned} days of Rank.to history. Best rank in the window: #${insights.bestRank.toLocaleString()} (${insights.bestDate}). Worst: #${insights.worstRank.toLocaleString()} (${insights.worstDate}). Momentum: ${insights.momentumLabel.replaceAll("_", " ")}.`
        : `Rank.to history for ${d} is limited, so trend confidence is lower. Current rank is #${report.globalRank.toLocaleString()}.`,
    },
    {
      question: `Should I buy ${d}?`,
      answer: `Use this report as a starting point only. Check verified analytics and profit, ownership of the domain/content, and how portable revenue is after transfer. Exit readiness on public signals is ${report.readinessScore}/100; confidence in this estimate is ${report.confidence}/100. Never buy on rank models alone.`,
    },
    {
      question: `How is ${d}'s website value calculated?`,
      answer: report.methodology,
    },
    {
      question: `When was the ${d} report last updated?`,
      answer: `This WorthMeaning report was last fetched on ${new Date(report.analyzedAt).toLocaleString()}. Searching the same domain again shows saved stats until someone presses Update for a fresh Rank.to pull.`,
    },
  ];

  return faqs;
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
