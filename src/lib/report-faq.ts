import { formatInrIndian, formatUsd, usdToInr } from "@/lib/format";
import { getUsdInrRate } from "@/lib/fx";
import type { WorthReport } from "@/lib/worth-report";

export type FaqItem = {
  question: string;
  answer: string;
};

export async function buildReportFaqs(report: WorthReport): Promise<FaqItem[]> {
  const fx = await getUsdInrRate();
  const d = report.hostname;
  const mid = formatUsd(report.estimatedWorth.mid);
  const low = formatUsd(report.estimatedWorth.low);
  const high = formatUsd(report.estimatedWorth.high);
  const midInr = formatInrIndian(usdToInr(report.estimatedWorth.mid, fx.rate));
  const lowInr = formatInrIndian(usdToInr(report.estimatedWorth.low, fx.rate));
  const highInr = formatInrIndian(usdToInr(report.estimatedWorth.high, fx.rate));
  const visits = report.estimatedMonthlyVisits.mid.toLocaleString();
  const revenue = formatUsd(report.monthlyRevenue);
  const revenueInr = formatInrIndian(usdToInr(report.monthlyRevenue, fx.rate));
  const insights = report.rankTo?.insights;

  return [
    {
      question: `How much is ${d} worth?`,
      answer: `WorthMeaning estimates ${d} at about ${mid} / ${midInr} (range ${low}–${high}, or ${lowInr}–${highInr}). This uses Rank.to traffic rank, an ads/affiliate revenue assumption, and a ~${report.revenueYearsMultiple}× annual revenue multiple. INR uses a live USD→INR rate (≈ ₹${fx.rate.toFixed(2)}). It is a directional estimate, not a formal appraisal or sale price.`,
    },
    {
      question: `How much is ${d} worth in Indian Rupees?`,
      answer: `At ≈ ₹${fx.rate.toFixed(2)} per USD, the midpoint is about ${midInr} (range ${lowInr}–${highInr}). Values ≥ ₹1 Lakh are shown in Lakh; ≥ ₹1 Crore in Crore.`,
    },
    {
      question: `How much traffic does ${d} get?`,
      answer: `Based on Rank.to global rank #${report.globalRank.toLocaleString()} (as of ${report.rankAsOf}), the Rank.to traffic model estimates about ${visits} monthly visits. That figure is model-based (± order of magnitude), not Google Analytics.`,
    },
    {
      question: `How much money can ${d} make?`,
      answer: `Assuming an ads/affiliate model at $${report.assumedRpm} RPM, WorthMeaning estimates about ${revenue}/month (${revenueInr}) in potential revenue (~${formatUsd(report.annualRevenue)}/year). Real earnings depend on niche, monetization, and geography.`,
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
