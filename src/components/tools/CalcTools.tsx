"use client";

import { useMemo, useState } from "react";
import { normalizeRootDomain } from "@/lib/domain";
import { formatUsd } from "@/lib/format";
import {
  DEFAULT_MULTIPLE,
  DEFAULT_RPM,
  formatBytes,
  growthAdjustedWorth,
  offerVerdict,
  parseFileSizeToBytes,
  revenueFromVisits,
  rankFromVisits,
  sessionsForTargetRevenue,
  visitsFromRank,
  worthFromRevenue,
} from "@/lib/tool-math";
import { Field, ResultGrid } from "@/components/tools/tool-ui";

export function RpmRevenueTool() {
  const [visits, setVisits] = useState("100000");
  const [rpm, setRpm] = useState(String(DEFAULT_RPM));
  const result = useMemo(() => {
    const v = Number(visits);
    const r = Number(rpm);
    if (!Number.isFinite(v) || !Number.isFinite(r) || v < 0 || r < 0) return null;
    return revenueFromVisits(v, r);
  }, [visits, rpm]);

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <div className="tool-form-grid">
        <Field label="Monthly visits">
          <input
            className="worth-input"
            type="number"
            min={0}
            value={visits}
            onChange={(e) => setVisits(e.target.value)}
          />
        </Field>
        <Field label="RPM ($ / 1000 pageviews)">
          <input
            className="worth-input"
            type="number"
            min={0}
            step="0.1"
            value={rpm}
            onChange={(e) => setRpm(e.target.value)}
          />
        </Field>
      </div>
      {result ? (
        <ResultGrid
          items={[
            {
              label: "Monthly pageviews (est.)",
              value: result.monthlyPageviews.toLocaleString(),
            },
            { label: "Monthly revenue", value: formatUsd(result.monthlyRevenue) },
            { label: "Annual revenue", value: formatUsd(result.annualRevenue) },
            { label: "Daily revenue", value: formatUsd(result.dailyRevenue) },
          ]}
        />
      ) : null}
    </form>
  );
}

export function RevenueToWorthTool() {
  const [annual, setAnnual] = useState("120000");
  const [multiple, setMultiple] = useState(String(DEFAULT_MULTIPLE));
  const result = useMemo(() => {
    const a = Number(annual);
    const m = Number(multiple);
    if (!Number.isFinite(a) || !Number.isFinite(m) || a < 0 || m <= 0) return null;
    return worthFromRevenue(a, m);
  }, [annual, multiple]);

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <div className="tool-form-grid">
        <Field label="Annual revenue ($)">
          <input
            className="worth-input"
            type="number"
            min={0}
            value={annual}
            onChange={(e) => setAnnual(e.target.value)}
          />
        </Field>
        <Field label="Years multiple">
          <input
            className="worth-input"
            type="number"
            min={0.1}
            step="0.1"
            value={multiple}
            onChange={(e) => setMultiple(e.target.value)}
          />
        </Field>
      </div>
      {result ? (
        <ResultGrid
          items={[
            { label: "Low", value: formatUsd(result.low) },
            { label: "Mid", value: formatUsd(result.mid) },
            { label: "High", value: formatUsd(result.high) },
          ]}
        />
      ) : null}
    </form>
  );
}

export function ProfitMultipleTool() {
  const [profit, setProfit] = useState("80000");
  const [multiple, setMultiple] = useState("3");
  const mid = useMemo(() => {
    const p = Number(profit);
    const m = Number(multiple);
    if (!Number.isFinite(p) || !Number.isFinite(m) || p < 0 || m <= 0) return null;
    return p * m;
  }, [profit, multiple]);

  const presets = [1.5, 2, 2.5, 3, 4, 5];

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <div className="tool-form-grid">
        <Field label="Annual profit ($)">
          <input
            className="worth-input"
            type="number"
            min={0}
            value={profit}
            onChange={(e) => setProfit(e.target.value)}
          />
        </Field>
        <Field label="Multiple">
          <input
            className="worth-input"
            type="number"
            min={0.1}
            step="0.1"
            value={multiple}
            onChange={(e) => setMultiple(e.target.value)}
          />
        </Field>
      </div>
      <div className="tool-chips">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            className="btn-ghost"
            onClick={() => setMultiple(String(p))}
          >
            {p}×
          </button>
        ))}
      </div>
      {mid != null ? (
        <ResultGrid
          items={[
            { label: "Implied worth", value: formatUsd(mid) },
            {
              label: "Range (±40%)",
              value: `${formatUsd(mid * 0.6)} – ${formatUsd(mid * 1.4)}`,
            },
          ]}
        />
      ) : null}
    </form>
  );
}

export function AdsenseEarningsTool() {
  const [pageviews, setPageviews] = useState("500000");
  const [rpm, setRpm] = useState("4");
  const monthly = useMemo(() => {
    const pv = Number(pageviews);
    const r = Number(rpm);
    if (!Number.isFinite(pv) || !Number.isFinite(r) || pv < 0 || r < 0) return null;
    return (pv / 1000) * r;
  }, [pageviews, rpm]);

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <div className="tool-form-grid">
        <Field label="Monthly pageviews">
          <input
            className="worth-input"
            type="number"
            min={0}
            value={pageviews}
            onChange={(e) => setPageviews(e.target.value)}
          />
        </Field>
        <Field label="RPM ($)">
          <input
            className="worth-input"
            type="number"
            min={0}
            step="0.1"
            value={rpm}
            onChange={(e) => setRpm(e.target.value)}
          />
        </Field>
      </div>
      {monthly != null ? (
        <ResultGrid
          items={[
            { label: "Est. monthly earnings", value: formatUsd(monthly) },
            { label: "Est. annual earnings", value: formatUsd(monthly * 12) },
            { label: "Est. daily earnings", value: formatUsd(monthly / 30) },
          ]}
        />
      ) : null}
    </form>
  );
}

export function VisitsToRankTool() {
  const [visits, setVisits] = useState("100000");
  const rank = useMemo(() => {
    const v = Number(visits);
    if (!Number.isFinite(v) || v <= 0) return null;
    return rankFromVisits(v);
  }, [visits]);

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <Field label="Monthly visits">
        <input
          className="worth-input"
          type="number"
          min={1}
          value={visits}
          onChange={(e) => setVisits(e.target.value)}
        />
      </Field>
      {rank != null ? (
        <ResultGrid
          items={[
            { label: "Implied global rank", value: `#${rank.toLocaleString()}` },
            {
              label: "Check (visits from that rank)",
              value: visitsFromRank(rank).toLocaleString(),
            },
          ]}
        />
      ) : null}
    </form>
  );
}

export function TrafficGrowthWorthTool() {
  const [visits, setVisits] = useState("100000");
  const [growth, setGrowth] = useState("20");
  const [rpm, setRpm] = useState(String(DEFAULT_RPM));
  const result = useMemo(() => {
    const v = Number(visits);
    const g = Number(growth);
    const r = Number(rpm);
    if (![v, g, r].every(Number.isFinite) || v < 0) return null;
    return growthAdjustedWorth({ monthlyVisits: v, growthPct: g, rpm: r });
  }, [visits, growth, rpm]);

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <div className="tool-form-grid">
        <Field label="Current monthly visits">
          <input
            className="worth-input"
            type="number"
            min={0}
            value={visits}
            onChange={(e) => setVisits(e.target.value)}
          />
        </Field>
        <Field label="Traffic change (%)">
          <input
            className="worth-input"
            type="number"
            value={growth}
            onChange={(e) => setGrowth(e.target.value)}
          />
        </Field>
        <Field label="RPM ($)">
          <input
            className="worth-input"
            type="number"
            min={0}
            step="0.1"
            value={rpm}
            onChange={(e) => setRpm(e.target.value)}
          />
        </Field>
      </div>
      {result ? (
        <ResultGrid
          items={[
            { label: "Worth now (mid)", value: formatUsd(result.now.worth.mid) },
            {
              label: "Worth after change",
              value: formatUsd(result.later.worth.mid),
            },
            {
              label: "Future visits",
              value: result.futureVisits.toLocaleString(),
            },
            {
              label: "Worth Δ",
              value: `${formatUsd(result.worthDelta)}${
                result.worthDeltaPct == null
                  ? ""
                  : ` (${result.worthDeltaPct.toFixed(1)}%)`
              }`,
            },
          ]}
        />
      ) : null}
    </form>
  );
}

export function SessionsForRevenueTool() {
  const [target, setTarget] = useState("5000");
  const [rpm, setRpm] = useState(String(DEFAULT_RPM));
  const [bounce, setBounce] = useState("40");
  const result = useMemo(() => {
    const t = Number(target);
    const r = Number(rpm);
    const b = Number(bounce);
    if (![t, r, b].every(Number.isFinite) || t < 0 || r <= 0) return null;
    return sessionsForTargetRevenue({
      targetMonthlyRevenue: t,
      rpm: r,
      bounceRatePct: b,
    });
  }, [target, rpm, bounce]);

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <div className="tool-form-grid">
        <Field label="Target monthly revenue ($)">
          <input
            className="worth-input"
            type="number"
            min={0}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </Field>
        <Field label="RPM ($)">
          <input
            className="worth-input"
            type="number"
            min={0.1}
            step="0.1"
            value={rpm}
            onChange={(e) => setRpm(e.target.value)}
          />
        </Field>
        <Field label="Bounce rate (%)">
          <input
            className="worth-input"
            type="number"
            min={0}
            max={100}
            value={bounce}
            onChange={(e) => setBounce(e.target.value)}
          />
        </Field>
      </div>
      {result ? (
        <ResultGrid
          items={[
            {
              label: "Pageviews needed / mo",
              value: result.pageviewsNeeded.toLocaleString(),
            },
            {
              label: "Sessions needed / mo",
              value: result.sessionsNeeded.toLocaleString(),
            },
            {
              label: "Effective pages / visit",
              value: String(result.effectivePpv),
            },
          ]}
        />
      ) : null}
    </form>
  );
}

export function FileSizeTool() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState("MB");
  const sizes = useMemo(() => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return null;
    return formatBytes(parseFileSizeToBytes(n, unit));
  }, [value, unit]);

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <div className="tool-form-grid">
        <Field label="Size">
          <input
            className="worth-input"
            type="number"
            min={0}
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
        <Field label="Unit">
          <select
            className="worth-input"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            {["B", "KB", "MB", "GB", "TB"].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {sizes ? (
        <ResultGrid
          items={[
            { label: "Bytes", value: sizes.B.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
            { label: "KB", value: sizes.KB.toLocaleString(undefined, { maximumFractionDigits: 4 }) },
            { label: "MB", value: sizes.MB.toLocaleString(undefined, { maximumFractionDigits: 6 }) },
            { label: "GB", value: sizes.GB.toLocaleString(undefined, { maximumFractionDigits: 8 }) },
            { label: "TB", value: sizes.TB.toLocaleString(undefined, { maximumFractionDigits: 10 }) },
          ]}
        />
      ) : null}
    </form>
  );
}

export function UrlNormalizerTool() {
  const [input, setInput] = useState("https://www.example.com/path?x=1");
  const [error, setError] = useState<string | null>(null);
  const [root, setRoot] = useState<string | null>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    try {
      setRoot(normalizeRootDomain(input));
      setError(null);
    } catch (err) {
      setRoot(null);
      setError(err instanceof Error ? err.message : "Invalid URL");
    }
  }

  return (
    <form className="tool-form" onSubmit={run}>
      <Field label="URL or domain">
        <input
          className="worth-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </Field>
      <button className="btn-primary" type="submit">
        Normalize
      </button>
      {error ? <p className="tool-error">{error}</p> : null}
      {root ? (
        <ResultGrid
          items={[
            { label: "Root domain", value: root },
            { label: "Report path", value: `/report/${root}` },
          ]}
        />
      ) : null}
    </form>
  );
}

export function ImageDimensionsTool() {
  const [info, setInfo] = useState<{
    name: string;
    width: number;
    height: number;
    bytes: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      setInfo(null);
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setInfo({
        name: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
        bytes: file.size,
      });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError("Could not read that image.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  const mb = info ? info.bytes / (1024 * 1024) : 0;

  return (
    <div className="tool-form">
      <Field label="Image (stays in your browser — not uploaded)">
        <input
          className="worth-input"
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
      </Field>
      {error ? <p className="tool-error">{error}</p> : null}
      {info ? (
        <ResultGrid
          items={[
            { label: "File", value: info.name },
            { label: "Width", value: `${info.width}px` },
            { label: "Height", value: `${info.height}px` },
            {
              label: "Megapixels",
              value: ((info.width * info.height) / 1_000_000).toFixed(2),
            },
            {
              label: "File size",
              value: `${info.bytes.toLocaleString()} B (${mb.toFixed(3)} MB)`,
            },
          ]}
        />
      ) : null}
    </div>
  );
}

export function DueDiligenceTool() {
  const [domain, setDomain] = useState("example.com");
  const [root, setRoot] = useState("example.com");

  function run(e: React.FormEvent) {
    e.preventDefault();
    try {
      setRoot(normalizeRootDomain(domain));
    } catch {
      setRoot(domain.trim() || "this site");
    }
  }

  const items = [
    `Verify Google Analytics / Search Console ownership for ${root}`,
    "Confirm trailing-12-month revenue and profit with bank or Stripe/PayPal exports",
    "Check traffic quality: organic vs paid, top countries, brand dependency",
    "Confirm domain, hosting, email, and social accounts transfer cleanly",
    "Review content originality, copyright, and affiliate disclosure risk",
    "Ask for churn, refund, chargeback, and ad-policy history",
    "Get a non-compete and transition period in writing",
    `Run a live WorthMeaning check: /tools/live-site-worth and /report/${root}`,
  ];

  return (
    <form className="tool-form" onSubmit={run}>
      <Field label="Domain">
        <input
          className="worth-input"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
      </Field>
      <button className="btn-primary" type="submit">
        Generate checklist
      </button>
      <ol className="tool-checklist">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </form>
  );
}

export function OfferHelperTool() {
  const [mid, setMid] = useState("50000");
  const band = useMemo(() => {
    const m = Number(mid);
    if (!Number.isFinite(m) || m <= 0) return null;
    return {
      low: m * 0.7,
      mid: m,
      stretch: m * 0.9,
      high: m * 1.15,
    };
  }, [mid]);

  return (
    <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
      <Field label="Mid valuation ($)">
        <input
          className="worth-input"
          type="number"
          min={1}
          value={mid}
          onChange={(e) => setMid(e.target.value)}
        />
      </Field>
      {band ? (
        <ResultGrid
          items={[
            { label: "Opening offer (low)", value: formatUsd(band.low) },
            { label: "Strong offer", value: formatUsd(band.stretch) },
            { label: "Anchor (mid)", value: formatUsd(band.mid) },
            { label: "Walk-away ceiling", value: formatUsd(band.high) },
          ]}
        />
      ) : null}
      {band ? (
        <p className="tool-note">
          Verdict helper: ask{" "}
          {formatUsd(band.mid * 1.4)} vs mid →{" "}
          {offerVerdict(band.mid * 1.4, band.mid).label}.
        </p>
      ) : null}
    </form>
  );
}
