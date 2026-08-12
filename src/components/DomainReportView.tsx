import { formatUsd } from "@/lib/format";
import { getUsdInrRate } from "@/lib/fx";
import type { ReportLocale } from "@/lib/domain";
import { REPORT_UI } from "@/lib/report-i18n";
import type { CachedWorthReport } from "@/lib/report-cache";
import { InrWorthStatic } from "@/components/InrWorthStatic";
import { ReportActions } from "@/components/ReportActions";
import { ReportFaqSection } from "@/components/ReportFaqSection";

type Props = {
  report: CachedWorthReport;
  locale?: ReportLocale;
};

export async function DomainReportView({ report, locale = "en" }: Props) {
  const fx = await getUsdInrRate();
  const ui = REPORT_UI[locale];
  const insights = report.rankTo?.insights;
  const trend =
    report.rankDelta7d == null
      ? null
      : report.rankDelta7d > 0
        ? `↑ ${report.rankDelta7d.toLocaleString()} places (7d)`
        : report.rankDelta7d < 0
          ? `↓ ${Math.abs(report.rankDelta7d).toLocaleString()} places (7d)`
          : "Flat (7d)";

  return (
    <article className="panel report-page" lang={locale === "en" ? "en" : locale}>
      <div className="worth-results-head">
        <div>
          <p className="worth-kicker">{ui.kicker}</p>
          <h1 className="worth-host">{report.hostname}</h1>
          <p className="worth-range" style={{ marginTop: "0.35rem" }}>
            {ui.heroBlurb(report.hostname)}
          </p>
        </div>
        <div className="worth-badges">
          <span className="worth-badge">Rank.to</span>
          <span className="worth-badge">
            Data {report.dataAgeLabel}
          </span>
          <span className="worth-badge">
            Confidence {report.confidence}/100
          </span>
        </div>
      </div>

      <div className="worth-hero-number">
        <p className="worth-kicker">{ui.midpointLabel}</p>
        <p className="worth-money">{formatUsd(report.estimatedWorth.mid)}</p>
        <p className="worth-range">
          {ui.rangeLabel} {formatUsd(report.estimatedWorth.low)} –{" "}
          {formatUsd(report.estimatedWorth.high)}
        </p>
        <InrWorthStatic
          low={report.estimatedWorth.low}
          mid={report.estimatedWorth.mid}
          high={report.estimatedWorth.high}
          monthlyRevenueUsd={report.monthlyRevenue}
          rate={fx.rate}
          asOf={fx.asOf}
        />
      </div>

      <p className="worth-meaning">{report.meaning}</p>

      <div className="worth-pipeline">
        <div className="worth-metric">
          <p className="worth-kicker">{ui.globalRank}</p>
          <p className="worth-metric-value">
            #{report.globalRank.toLocaleString()}
          </p>
          <p className="worth-metric-sub">
            {report.rankAsOf}
            {trend ? ` · ${trend}` : ""}
          </p>
        </div>
        <div className="worth-metric">
          <p className="worth-kicker">{ui.monthlyVisits}</p>
          <p className="worth-metric-value">
            {report.estimatedMonthlyVisits.mid.toLocaleString()}
          </p>
          <p className="worth-metric-sub">{ui.trafficModel}</p>
        </div>
        <div className="worth-metric">
          <p className="worth-kicker">{ui.monthlyRevenue}</p>
          <p className="worth-metric-value">
            {formatUsd(report.monthlyRevenue)}
          </p>
          <p className="worth-metric-sub">
            {ui.rpmSub(report.assumedRpm)}
          </p>
        </div>
        <div className="worth-metric">
          <p className="worth-kicker">{ui.exitReadiness}</p>
          <p className="worth-metric-value">{report.readinessScore}/100</p>
          <p className="worth-metric-sub">{ui.transferSignals}</p>
        </div>
      </div>

      {insights ? (
        <section className="rankto-panel">
          <div className="rankto-head">
            <div>
              <p className="worth-kicker">Rank.to history</p>
              <h2
                style={{
                  margin: "0.2rem 0 0",
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontSize: "1.35rem",
                }}
              >
                {insights.trajectoryLabel}
              </h2>
            </div>
            <span className="worth-badge">
              {report.rankTo.historyDaysReturned} days captured
            </span>
          </div>
          <div className="worth-metrics">
            <div className="worth-metric">
              <p className="worth-kicker">Best rank</p>
              <p className="worth-metric-value">
                #{insights.bestRank.toLocaleString()}
              </p>
              <p className="worth-metric-sub">{insights.bestDate}</p>
            </div>
            <div className="worth-metric">
              <p className="worth-kicker">Worst rank</p>
              <p className="worth-metric-value">
                #{insights.worstRank.toLocaleString()}
              </p>
              <p className="worth-metric-sub">{insights.worstDate}</p>
            </div>
            <div className="worth-metric">
              <p className="worth-kicker">Audience</p>
              <p className="worth-metric-value">{insights.audienceBand}</p>
              <p className="worth-metric-sub">{insights.audienceLabel}</p>
            </div>
          </div>
        </section>
      ) : null}

      <div className="worth-split" style={{ marginTop: "1.2rem" }}>
        <section>
          <h2
            style={{
              margin: "0 0 0.7rem",
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.2rem",
            }}
          >
            What moved the number
          </h2>
          <ul className="worth-signals">
            {report.signals.map((signal) => (
              <li key={signal.label} data-tone={signal.tone}>
                <strong>{signal.label}</strong>
                <span>{signal.detail}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2
            style={{
              margin: "0 0 0.7rem",
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.2rem",
            }}
          >
            What to do next
          </h2>
          <ol className="worth-steps">
            {report.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      <ReportFaqSection report={report} locale={locale} />

      <ReportActions domain={report.hostname} locale={locale} />

      <p className="worth-footnote">
        {report.methodology} Last fetched{" "}
        {new Date(report.cachedAt).toLocaleString()} ({report.dataAgeLabel}).
        Estimates only — not a formal appraisal.
      </p>
    </article>
  );
}
