import { formatUsd } from "@/lib/format";
import { getUsdInrRate } from "@/lib/fx";
import type { CachedWorthReport } from "@/lib/report-cache";
import { InrWorthStatic } from "@/components/InrWorthStatic";
import { ReportActions } from "@/components/ReportActions";
import { ReportFaqSection } from "@/components/ReportFaqSection";

type Props = {
  report: CachedWorthReport;
};

export async function DomainReportView({ report }: Props) {
  const fx = await getUsdInrRate();
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
    <article className="panel report-page">
      <div className="worth-results-head">
        <div>
          <p className="worth-kicker">Website worth report</p>
          <h1 className="worth-host">{report.hostname}</h1>
          <p className="worth-range" style={{ marginTop: "0.35rem" }}>
            How much is {report.hostname} worth? Estimated midpoint and what
            that number means — in USD and Indian Rupees (Lakh / Crore).
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
        <p className="worth-kicker">Estimated midpoint worth</p>
        <p className="worth-money">{formatUsd(report.estimatedWorth.mid)}</p>
        <p className="worth-range">
          Range {formatUsd(report.estimatedWorth.low)} –{" "}
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
          <p className="worth-kicker">Global rank</p>
          <p className="worth-metric-value">
            #{report.globalRank.toLocaleString()}
          </p>
          <p className="worth-metric-sub">
            {report.rankAsOf}
            {trend ? ` · ${trend}` : ""}
          </p>
        </div>
        <div className="worth-metric">
          <p className="worth-kicker">Monthly visits</p>
          <p className="worth-metric-value">
            {report.estimatedMonthlyVisits.mid.toLocaleString()}
          </p>
          <p className="worth-metric-sub">Rank.to traffic model</p>
        </div>
        <div className="worth-metric">
          <p className="worth-kicker">Est. monthly revenue</p>
          <p className="worth-metric-value">
            {formatUsd(report.monthlyRevenue)}
          </p>
          <p className="worth-metric-sub">
            ${report.assumedRpm} RPM ads/affiliate assumption
          </p>
        </div>
        <div className="worth-metric">
          <p className="worth-kicker">Exit readiness</p>
          <p className="worth-metric-value">{report.readinessScore}/100</p>
          <p className="worth-metric-sub">Public-page transfer signals</p>
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

      <ReportFaqSection report={report} />

      <ReportActions domain={report.hostname} />

      <p className="worth-footnote">
        {report.methodology} Last fetched{" "}
        {new Date(report.cachedAt).toLocaleString()} ({report.dataAgeLabel}).
        Estimates only — not a formal appraisal.
      </p>
    </article>
  );
}
