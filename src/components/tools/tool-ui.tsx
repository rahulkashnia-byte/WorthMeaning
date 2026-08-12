"use client";

import { formatUsd } from "@/lib/format";
import type { LiveDomainSnapshot } from "@/lib/tools-live-types";
import { InrWorthBlock } from "@/components/InrWorthBlock";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="tool-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function ResultGrid({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="tool-results">
      {items.map((item) => (
        <div key={item.label} className="tool-result">
          <p className="tool-result-label">{item.label}</p>
          <p className="tool-result-value">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function SnapshotCard({ snap }: { snap: LiveDomainSnapshot }) {
  return (
    <div className="tool-snapshot">
      <p className="tool-live-badge">
        Live from Rank.to · fetched {new Date(snap.fetchedAt).toLocaleString()} ·
        not cached
      </p>
      <ResultGrid
        items={[
          { label: "Domain", value: snap.domain },
          { label: "Global rank", value: `#${snap.rank.toLocaleString()}` },
          { label: "As of", value: snap.asOf },
          {
            label: "Est. monthly visits",
            value: snap.monthlyVisits.toLocaleString(),
          },
          {
            label: "Est. monthly revenue",
            value: formatUsd(snap.economics.monthlyRevenue),
          },
          {
            label: "Est. worth (mid)",
            value: formatUsd(snap.economics.worth.mid),
          },
          {
            label: "Worth range",
            value: `${formatUsd(snap.economics.worth.low)} – ${formatUsd(snap.economics.worth.high)}`,
          },
          { label: "Trajectory", value: snap.insights.trajectoryLabel },
          {
            label: "Visits Δ (window)",
            value:
              snap.insights.monthlyVisitsDeltaPct == null
                ? "n/a"
                : `${snap.insights.monthlyVisitsDeltaPct}%`,
          },
        ]}
      />
      <InrWorthBlock
        low={snap.economics.worth.low}
        mid={snap.economics.worth.mid}
        high={snap.economics.worth.high}
        monthlyRevenueUsd={snap.economics.monthlyRevenue}
      />
    </div>
  );
}

export async function postLive<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/tools/live", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}
