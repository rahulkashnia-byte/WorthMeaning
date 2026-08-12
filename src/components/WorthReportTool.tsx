"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { reportPath } from "@/lib/domain";
import type { WorthReport } from "@/lib/worth-report";

type CachedReport = WorthReport & {
  cached: boolean;
  cachedAt: string;
  dataAgeLabel: string;
  reportPath?: string;
};

type Props = {
  autofocus?: boolean;
  initialUrl?: string;
};

function ageFromIso(iso: string) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "unknown age";
  const sec = Math.floor(Math.max(0, Date.now() - then) / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  const month = Math.floor(day / 30);
  return `${month} month${month === 1 ? "" : "s"} ago`;
}

export function WorthReportTool({
  autofocus = false,
  initialUrl = "",
}: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<CachedReport | null>(null);
  const [pending, setPending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [ageLabel, setAgeLabel] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const autoRan = useRef(false);

  useEffect(() => {
    if (autofocus) inputRef.current?.focus();
  }, [autofocus]);

  useEffect(() => {
    if (!initialUrl || autoRan.current) return;
    autoRan.current = true;
    void loadReport(false, initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  useEffect(() => {
    if (report) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [report]);

  useEffect(() => {
    if (!report?.cachedAt) {
      setAgeLabel(null);
      return;
    }
    const tick = () => setAgeLabel(ageFromIso(report.cachedAt));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [report?.cachedAt]);

  async function loadReport(refresh: boolean, overrideUrl?: string) {
    const target = (overrideUrl ?? url).trim();
    if (!target) return;

    setError(null);
    if (refresh) setUpdating(true);
    else setPending(true);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target, refresh }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!refresh) setReport(null);
        setError(data.error || "Something went wrong.");
        return;
      }
      setReport(data as CachedReport);
    } catch {
      if (!refresh) setReport(null);
      setError("Could not reach the report API. Is the server running?");
    } finally {
      setPending(false);
      setUpdating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loadReport(false);
  }

  async function onUpdate() {
    await loadReport(true);
  }

  const trend =
    report?.rankDelta7d == null
      ? null
      : report.rankDelta7d > 0
        ? `↑ ${report.rankDelta7d.toLocaleString()} places`
        : report.rankDelta7d < 0
          ? `↓ ${Math.abs(report.rankDelta7d).toLocaleString()} places`
          : "Flat";

  const busy = pending || updating;

  return (
    <div className="worth-tool">
      <form className="worth-form" onSubmit={onSubmit}>
        <label className="worth-label" htmlFor="site-url">
          Website URL
        </label>
        <div className="worth-form-row">
          <input
            ref={inputRef}
            id="site-url"
            name="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="worthofweb.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="worth-input"
            required
          />
          <button
            className="worth-submit"
            type="submit"
            disabled={busy || !url.trim()}
          >
            {pending ? "Loading…" : "Get Worth Report"}
          </button>
        </div>
        <p className="worth-hint">
          Saved reports stay until you press Update. First lookup fetches live
          Rank.to data.
        </p>
      </form>

      {error ? <p className="worth-error">{error}</p> : null}

      {report ? (
        <div className="worth-results" ref={resultsRef}>
          <div className="worth-results-head">
            <div>
              <p className="worth-kicker">Worth Report</p>
              <h2 className="worth-host">{report.hostname}</h2>
            </div>
            <div className="worth-badges">
              <span
                className="worth-badge"
                data-tone={report.cached ? "cached" : "fresh"}
              >
                {report.cached ? "Saved report" : "Just updated"}
              </span>
              <span className="worth-badge">
                Data{" "}
                {ageLabel || report.dataAgeLabel || ageFromIso(report.cachedAt)}
              </span>
              <span className="worth-badge">
                Confidence {report.confidence}/100
              </span>
            </div>
          </div>

          <div className="worth-cache-bar">
            <p>
              {report.cached ? (
                <>
                  Showing saved stats from{" "}
                  <strong>{new Date(report.cachedAt).toLocaleString()}</strong> (
                  {ageLabel || report.dataAgeLabel}). Permanent page:{" "}
                  <Link href={report.reportPath || reportPath(report.hostname)}>
                    {report.reportPath || reportPath(report.hostname)}
                  </Link>
                </>
              ) : (
                <>
                  Fresh pull saved. SEO page created at{" "}
                  <Link href={report.reportPath || reportPath(report.hostname)}>
                    {report.reportPath || reportPath(report.hostname)}
                  </Link>
                  . Searching again reuses these numbers until you update.
                </>
              )}
            </p>
            <button
              type="button"
              className="worth-update"
              onClick={onUpdate}
              disabled={busy}
            >
              {updating ? "Updating…" : "Update"}
            </button>
          </div>

          <div className="worth-hero-number">
            <p className="worth-kicker">Estimated midpoint</p>
            <p className="worth-money">
              {formatUsd(report.estimatedWorth.mid)}
            </p>
            <p className="worth-range">
              Range {formatUsd(report.estimatedWorth.low)} –{" "}
              {formatUsd(report.estimatedWorth.high)}
            </p>
          </div>

          <p className="worth-meaning">{report.meaning}</p>

          {report.rankTo?.insights ? (
            <section className="rankto-panel">
              <div className="rankto-head">
                <div>
                  <p className="worth-kicker">Rank.to capture</p>
                  <h3>Everything we pulled & interpreted</h3>
                </div>
                <span className="worth-badge">
                  {report.rankTo.historyDaysReturned} days history
                </span>
              </div>

              <div className="worth-pipeline">
                <div className="worth-metric">
                  <p className="worth-kicker">Trajectory</p>
                  <p className="worth-metric-value">
                    {report.rankTo.insights.trajectoryLabel}
                  </p>
                  <p className="worth-metric-sub">
                    {report.rankTo.insights.totalChange >= 0 ? "+" : ""}
                    {report.rankTo.insights.totalChange.toLocaleString()} places
                    · {report.rankTo.insights.changePerDay}/day
                  </p>
                </div>
                <div className="worth-metric">
                  <p className="worth-kicker">Momentum</p>
                  <p className="worth-metric-value">
                    {report.rankTo.insights.momentumLabel.replaceAll("_", " ")}
                  </p>
                  <p className="worth-metric-sub">
                    {report.rankTo.insights.momentum == null
                      ? "Need more days"
                      : `${report.rankTo.insights.momentum >= 0 ? "+" : ""}${report.rankTo.insights.momentum} (3d vs prior 3d)`}
                  </p>
                </div>
                <div className="worth-metric">
                  <p className="worth-kicker">Best / worst</p>
                  <p className="worth-metric-value">
                    #{report.rankTo.insights.bestRank.toLocaleString()}
                  </p>
                  <p className="worth-metric-sub">
                    Best {report.rankTo.insights.bestDate} · worst #
                    {report.rankTo.insights.worstRank.toLocaleString()}
                  </p>
                </div>
                <div className="worth-metric">
                  <p className="worth-kicker">Audience band</p>
                  <p className="worth-metric-value">
                    {report.rankTo.insights.audienceBand}
                  </p>
                  <p className="worth-metric-sub">
                    {report.rankTo.insights.audienceLabel}
                  </p>
                </div>
              </div>

              <div className="worth-metrics">
                <div className="worth-metric">
                  <p className="worth-kicker">Visits over window</p>
                  <p className="worth-metric-value">
                    {report.rankTo.insights.monthlyVisitsDeltaPct == null
                      ? `${report.rankTo.insights.monthlyVisitsDelta >= 0 ? "+" : ""}${report.rankTo.insights.monthlyVisitsDelta.toLocaleString()}`
                      : `${report.rankTo.insights.monthlyVisitsDeltaPct >= 0 ? "+" : ""}${report.rankTo.insights.monthlyVisitsDeltaPct}%`}
                  </p>
                  <p className="worth-metric-sub">
                    {report.rankTo.insights.monthlyVisitsStart.toLocaleString()} →{" "}
                    {report.rankTo.insights.monthlyVisitsCurrent.toLocaleString()}
                    /mo
                  </p>
                </div>
                <div className="worth-metric">
                  <p className="worth-kicker">Volatility</p>
                  <p className="worth-metric-value">
                    {report.rankTo.insights.stdDev.toLocaleString()}
                  </p>
                  <p className="worth-metric-sub">
                    Mean #{report.rankTo.insights.meanRank.toLocaleString()} ·{" "}
                    {report.rankTo.insights.fromPeak === 0
                      ? "at peak"
                      : `${report.rankTo.insights.fromPeak.toLocaleString()} off peak`}
                  </p>
                </div>
                <div className="worth-metric">
                  <p className="worth-kicker">7d / 30d delta</p>
                  <p className="worth-metric-value">
                    {report.rankDelta7d == null
                      ? "—"
                      : `${report.rankDelta7d >= 0 ? "+" : ""}${report.rankDelta7d.toLocaleString()}`}
                  </p>
                  <p className="worth-metric-sub">
                    30d:{" "}
                    {report.rankDelta30d == null
                      ? "—"
                      : `${report.rankDelta30d >= 0 ? "+" : ""}${report.rankDelta30d.toLocaleString()}`}
                  </p>
                </div>
              </div>

              {(report.rankTo.neighbors.above.length > 0 ||
                report.rankTo.neighbors.below.length > 0) && (
                <div className="rankto-neighbors">
                  <h4>Rank neighbors</h4>
                  <div className="rankto-neighbor-cols">
                    <div>
                      <p className="worth-kicker">Just above</p>
                      <ul>
                        {report.rankTo.neighbors.above.map((n) => (
                          <li key={n.domain}>
                            <span>#{n.rank.toLocaleString()}</span> {n.domain}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="worth-kicker">Just below</p>
                      <ul>
                        {report.rankTo.neighbors.below.map((n) => (
                          <li key={n.domain}>
                            <span>#{n.rank.toLocaleString()}</span> {n.domain}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <p className="worth-footnote">
                Snapshot {report.rankTo.snapshotDate}
                {report.rankTo.apiTime ? ` · API ${report.rankTo.apiTime}` : ""}.
                Full daily history saved in this report (
                {report.rankTo.historyDaysReturned} points).
              </p>
            </section>
          ) : null}

          <div className="worth-pipeline">
            <div className="worth-metric">
              <p className="worth-kicker">1. Rank.to rank</p>
              <p className="worth-metric-value">
                #{report.globalRank.toLocaleString()}
              </p>
              <p className="worth-metric-sub">
                {report.rankAsOf}
                {trend ? ` · ${trend}` : ""}
              </p>
            </div>
            <div className="worth-metric">
              <p className="worth-kicker">2. Monthly visits</p>
              <p className="worth-metric-value">
                {report.estimatedMonthlyVisits.mid.toLocaleString()}
              </p>
              <p className="worth-metric-sub">
                Rank.to model · {report.dailyVisits.toLocaleString()}/day
              </p>
            </div>
            <div className="worth-metric">
              <p className="worth-kicker">3. Ad revenue</p>
              <p className="worth-metric-value">
                {formatUsd(report.monthlyRevenue)}
              </p>
              <p className="worth-metric-sub">
                ${report.assumedRpm} RPM · {formatUsd(report.annualRevenue)}/yr
              </p>
            </div>
            <div className="worth-metric">
              <p className="worth-kicker">4. Worth</p>
              <p className="worth-metric-value">
                {formatUsd(report.estimatedWorth.mid)}
              </p>
              <p className="worth-metric-sub">
                Annual × {report.revenueYearsMultiple} years
              </p>
            </div>
          </div>

          <div className="worth-split">
            <section>
              <h3>What moved the number</h3>
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
              <h3>What to do next</h3>
              <ol className="worth-steps">
                {report.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </div>

          <p className="worth-footnote">
            {report.methodology} Last fetched{" "}
            {new Date(report.cachedAt).toLocaleString()} (
            {ageLabel || report.dataAgeLabel}).
          </p>
        </div>
      ) : null}
    </div>
  );
}
