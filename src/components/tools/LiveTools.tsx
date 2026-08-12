"use client";

import { useMemo, useState } from "react";
import { formatUsd } from "@/lib/format";
import { offerVerdict, visitsFromRank, worthFromVisits } from "@/lib/tool-math";
import type { LiveDomainSnapshot } from "@/lib/tools-live-types";
import {
  Field,
  ResultGrid,
  SnapshotCard,
  postLive,
} from "@/components/tools/tool-ui";

function useLiveAction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run<T>(body: Record<string, unknown>): Promise<T | null> {
    setPending(true);
    setError(null);
    try {
      return await postLive<T>(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      return null;
    } finally {
      setPending(false);
    }
  }

  return { pending, error, run, setError };
}

export function LiveSiteWorthTool() {
  const [domain, setDomain] = useState("worthofweb.com");
  const [snap, setSnap] = useState<LiveDomainSnapshot | null>(null);
  const { pending, error, run } = useLiveAction();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = await run<LiveDomainSnapshot>({
      action: "snapshot",
      domain,
    });
    if (data) setSnap(data);
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <Field label="Domain">
        <input
          className="worth-input"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
        />
      </Field>
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Fetching live Rank.to…" : "Estimate live worth"}
      </button>
      {error ? <p className="tool-error">{error}</p> : null}
      {snap ? <SnapshotCard snap={snap} /> : null}
    </form>
  );
}

export function OfferCheckTool() {
  const [domain, setDomain] = useState("worthofweb.com");
  const [ask, setAsk] = useState("50000");
  const [snap, setSnap] = useState<LiveDomainSnapshot | null>(null);
  const { pending, error, run } = useLiveAction();

  const verdict = useMemo(() => {
    if (!snap) return null;
    const asking = Number(ask);
    if (!Number.isFinite(asking) || asking <= 0) return null;
    return offerVerdict(asking, snap.economics.worth.mid);
  }, [snap, ask]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = await run<LiveDomainSnapshot>({
      action: "snapshot",
      domain,
    });
    if (data) setSnap(data);
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <div className="tool-form-grid">
        <Field label="Domain">
          <input
            className="worth-input"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </Field>
        <Field label="Seller asking price ($)">
          <input
            className="worth-input"
            type="number"
            min={1}
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
          />
        </Field>
      </div>
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Fetching live data…" : "Check offer vs live worth"}
      </button>
      {error ? <p className="tool-error">{error}</p> : null}
      {snap ? <SnapshotCard snap={snap} /> : null}
      {verdict && verdict.ratio != null ? (
        <ResultGrid
          items={[
            { label: "Ask / mid ratio", value: `${(verdict.ratio * 100).toFixed(0)}%` },
            { label: "Verdict", value: verdict.label },
            { label: "Detail", value: verdict.detail },
          ]}
        />
      ) : null}
    </form>
  );
}

export function RankToVisitsTool() {
  const [mode, setMode] = useState<"domain" | "rank">("domain");
  const [domain, setDomain] = useState("worthofweb.com");
  const [rank, setRank] = useState("100000");
  const [snap, setSnap] = useState<LiveDomainSnapshot | null>(null);
  const { pending, error, run } = useLiveAction();

  const manual = useMemo(() => {
    if (mode !== "rank") return null;
    const r = Number(rank);
    if (!Number.isFinite(r) || r < 1) return null;
    const visits = visitsFromRank(r);
    return { visits, worth: worthFromVisits(visits) };
  }, [mode, rank]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "rank") return;
    const data = await run<LiveDomainSnapshot>({
      action: "snapshot",
      domain,
    });
    if (data) setSnap(data);
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <div className="tool-chips">
        <button
          type="button"
          className={mode === "domain" ? "btn-primary" : "btn-ghost"}
          onClick={() => setMode("domain")}
        >
          Live domain
        </button>
        <button
          type="button"
          className={mode === "rank" ? "btn-primary" : "btn-ghost"}
          onClick={() => setMode("rank")}
        >
          Manual rank
        </button>
      </div>

      {mode === "domain" ? (
        <>
          <Field label="Domain (live Rank.to)">
            <input
              className="worth-input"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </Field>
          <button className="btn-primary" type="submit" disabled={pending}>
            {pending ? "Fetching…" : "Convert live rank → visits"}
          </button>
        </>
      ) : (
        <Field label="Global rank">
          <input
            className="worth-input"
            type="number"
            min={1}
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          />
        </Field>
      )}

      {error ? <p className="tool-error">{error}</p> : null}
      {mode === "domain" && snap ? (
        <ResultGrid
          items={[
            { label: "Live rank", value: `#${snap.rank.toLocaleString()}` },
            {
              label: "Est. monthly visits",
              value: snap.monthlyVisits.toLocaleString(),
            },
            { label: "As of", value: snap.asOf },
            {
              label: "Fetched",
              value: new Date(snap.fetchedAt).toLocaleString(),
            },
          ]}
        />
      ) : null}
      {mode === "rank" && manual ? (
        <ResultGrid
          items={[
            {
              label: "Est. monthly visits",
              value: manual.visits.toLocaleString(),
            },
            {
              label: "Est. worth (mid)",
              value: formatUsd(manual.worth.worth.mid),
            },
          ]}
        />
      ) : null}
    </form>
  );
}

export function TrafficTrendTool() {
  const [domain, setDomain] = useState("worthofweb.com");
  const [snap, setSnap] = useState<LiveDomainSnapshot | null>(null);
  const { pending, error, run } = useLiveAction();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = await run<LiveDomainSnapshot>({
      action: "snapshot",
      domain,
    });
    if (data) setSnap(data);
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <Field label="Domain">
        <input
          className="worth-input"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
      </Field>
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Fetching live history…" : "Load live trend"}
      </button>
      {error ? <p className="tool-error">{error}</p> : null}
      {snap ? (
        <ResultGrid
          items={[
            { label: "Domain", value: snap.domain },
            { label: "Current rank", value: `#${snap.rank.toLocaleString()}` },
            {
              label: "History days",
              value: String(snap.insights.historyDaysReturned),
            },
            { label: "Trajectory", value: snap.insights.trajectoryLabel },
            {
              label: "Momentum",
              value: snap.insights.momentumLabel.replaceAll("_", " "),
            },
            {
              label: "Best rank",
              value: `#${snap.insights.bestRank.toLocaleString()}`,
            },
            {
              label: "Worst rank",
              value: `#${snap.insights.worstRank.toLocaleString()}`,
            },
            {
              label: "Visits Δ %",
              value:
                snap.insights.monthlyVisitsDeltaPct == null
                  ? "n/a"
                  : `${snap.insights.monthlyVisitsDeltaPct}%`,
            },
            {
              label: "7d rank Δ",
              value:
                snap.rankDelta7d == null
                  ? "n/a"
                  : String(snap.rankDelta7d),
            },
            {
              label: "30d rank Δ",
              value:
                snap.rankDelta30d == null
                  ? "n/a"
                  : String(snap.rankDelta30d),
            },
            {
              label: "Fetched",
              value: new Date(snap.fetchedAt).toLocaleString(),
            },
          ]}
        />
      ) : null}
    </form>
  );
}

export function NeighborsTool() {
  const [domain, setDomain] = useState("worthofweb.com");
  const [snap, setSnap] = useState<LiveDomainSnapshot | null>(null);
  const { pending, error, run } = useLiveAction();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = await run<LiveDomainSnapshot>({
      action: "snapshot",
      domain,
    });
    if (data) setSnap(data);
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <Field label="Domain">
        <input
          className="worth-input"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
      </Field>
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Fetching neighbors…" : "Load live neighbors"}
      </button>
      {error ? <p className="tool-error">{error}</p> : null}
      {snap ? (
        <>
          <p className="tool-live-badge">
            Live Rank.to neighbors · {snap.domain} rank #
            {snap.rank.toLocaleString()} · not cached
          </p>
          <div className="tool-neighbor-cols">
            <div>
              <h3>Above</h3>
              <ul>
                {snap.neighbors.above.map((n) => (
                  <li key={n.domain}>
                    {n.domain} · #{n.rank.toLocaleString()}
                  </li>
                ))}
                {!snap.neighbors.above.length ? <li>None returned</li> : null}
              </ul>
            </div>
            <div>
              <h3>Below</h3>
              <ul>
                {snap.neighbors.below.map((n) => (
                  <li key={n.domain}>
                    {n.domain} · #{n.rank.toLocaleString()}
                  </li>
                ))}
                {!snap.neighbors.below.length ? <li>None returned</li> : null}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </form>
  );
}

export function CompareSitesTool() {
  const [a, setA] = useState("worthofweb.com");
  const [b, setB] = useState("example.com");
  const [result, setResult] = useState<{
    a: LiveDomainSnapshot;
    b: LiveDomainSnapshot;
  } | null>(null);
  const { pending, error, run } = useLiveAction();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = await run<{ a: LiveDomainSnapshot; b: LiveDomainSnapshot }>({
      action: "compare",
      domains: [a, b],
    });
    if (data) setResult(data);
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <div className="tool-form-grid">
        <Field label="Site A">
          <input
            className="worth-input"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </Field>
        <Field label="Site B">
          <input
            className="worth-input"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </Field>
      </div>
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Fetching both live…" : "Compare live"}
      </button>
      {error ? <p className="tool-error">{error}</p> : null}
      {result ? (
        <div className="tool-compare">
          <SnapshotCard snap={result.a} />
          <SnapshotCard snap={result.b} />
        </div>
      ) : null}
    </form>
  );
}

export function DomainAgeTool() {
  const [domain, setDomain] = useState("google.com");
  const [data, setData] = useState<{
    domain: string;
    created: string | null;
    updated: string | null;
    expires: string | null;
    registrar: string | null;
    ageDays: number | null;
    ageYears: number | null;
    fetchedAt: string;
  } | null>(null);
  const { pending, error, run } = useLiveAction();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await run<NonNullable<typeof data> & { cached: false }>({
      action: "rdap",
      domain,
    });
    if (res) setData(res);
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <Field label="Domain">
        <input
          className="worth-input"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
      </Field>
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Querying RDAP…" : "Look up live domain age"}
      </button>
      {error ? <p className="tool-error">{error}</p> : null}
      {data ? (
        <ResultGrid
          items={[
            { label: "Domain", value: data.domain },
            { label: "Created", value: data.created || "n/a" },
            {
              label: "Age",
              value:
                data.ageYears == null
                  ? "n/a"
                  : `${data.ageYears} years (${data.ageDays} days)`,
            },
            { label: "Updated", value: data.updated || "n/a" },
            { label: "Expires", value: data.expires || "n/a" },
            { label: "Registrar", value: data.registrar || "n/a" },
            {
              label: "Fetched",
              value: new Date(data.fetchedAt).toLocaleString(),
            },
          ]}
        />
      ) : null}
    </form>
  );
}

export function PageWeightTool() {
  const [url, setUrl] = useState("https://example.com");
  const [data, setData] = useState<{
    url: string;
    status: number;
    contentType: string | null;
    htmlBytes: number;
    transferBytes: number | null;
    redirectTo: string | null;
    fetchedAt: string;
  } | null>(null);
  const { pending, error, run } = useLiveAction();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await run<NonNullable<typeof data> & { cached: false }>({
      action: "page-weight",
      url,
    });
    if (res) setData(res);
  }

  return (
    <form className="tool-form" onSubmit={onSubmit}>
      <Field label="URL">
        <input
          className="worth-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Field>
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Fetching page…" : "Measure live page weight"}
      </button>
      {error ? <p className="tool-error">{error}</p> : null}
      {data ? (
        <ResultGrid
          items={[
            { label: "URL", value: data.url },
            { label: "HTTP status", value: String(data.status) },
            { label: "Content-Type", value: data.contentType || "n/a" },
            {
              label: "Body bytes read",
              value: `${data.htmlBytes.toLocaleString()} B (${(data.htmlBytes / 1024).toFixed(1)} KB)`,
            },
            {
              label: "Content-Length header",
              value:
                data.transferBytes == null
                  ? "n/a"
                  : `${data.transferBytes.toLocaleString()} B`,
            },
            {
              label: "Redirected to",
              value: data.redirectTo || "none",
            },
            {
              label: "Fetched",
              value: new Date(data.fetchedAt).toLocaleString(),
            },
          ]}
        />
      ) : null}
    </form>
  );
}
