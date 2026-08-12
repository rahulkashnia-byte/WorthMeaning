"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { WorthReportTool } from "@/components/WorthReportTool";

const INTENT_COPY: Record<
  string,
  { title: string; blurb: string }
> = {
  worth: {
    title: "What’s it worth?",
    blurb:
      "Use the midpoint and range as a negotiation anchor — then verify real profit before you offer.",
  },
  buy: {
    title: "Should I buy it?",
    blurb:
      "Look at rank, traffic estimate, and readiness. If money isn’t proven, treat the dollar figure as a starting point only.",
  },
  wait: {
    title: "Should I wait?",
    blurb:
      "Watch the rank trend on the report. Rising traffic can mean a higher ask later; falling traffic can mean leverage — or a dying asset.",
  },
};

function BuyCheckInner() {
  const params = useSearchParams();
  const intent = params.get("intent") || "buy";
  const url = params.get("url") || "";
  const copy = INTENT_COPY[intent] || INTENT_COPY.buy;
  const [ready, setReady] = useState(false);

  const initialUrl = useMemo(() => url, [url]);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="shell">
      <header className="site-header">
        <a className="brand" href="/">
          Worth<span>Meaning</span>
        </a>
        <a className="nav-note" href="/#buy-check">
          ← Back
        </a>
      </header>

      <main>
        <section className="panel" style={{ marginTop: "2rem" }}>
          <div className="panel-intro">
            <p className="worth-kicker">Buyer check</p>
            <h2>{copy.title}</h2>
            <p>{copy.blurb}</p>
          </div>
          {ready ? (
            <WorthReportTool autofocus initialUrl={initialUrl} />
          ) : (
            <p className="worth-hint">Loading…</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function BuyCheckPage() {
  return (
    <Suspense fallback={<div className="shell"><p className="worth-hint">Loading…</p></div>}>
      <BuyCheckInner />
    </Suspense>
  );
}
