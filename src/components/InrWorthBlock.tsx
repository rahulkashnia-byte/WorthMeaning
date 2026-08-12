"use client";

import { useEffect, useState } from "react";
import { FALLBACK_USD_INR } from "@/lib/format";
import { InrWorthStatic } from "@/components/InrWorthStatic";

type Props = {
  low: number;
  mid: number;
  high: number;
  monthlyRevenueUsd?: number;
};

export function InrWorthBlock({
  low,
  mid,
  high,
  monthlyRevenueUsd,
}: Props) {
  const [rate, setRate] = useState(FALLBACK_USD_INR);
  const [asOf, setAsOf] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/fx/usd-inr", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { rate?: number; asOf?: string }) => {
        if (cancelled) return;
        if (typeof data.rate === "number" && data.rate > 0) {
          setRate(data.rate);
          setAsOf(data.asOf);
        }
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <InrWorthStatic
      low={low}
      mid={mid}
      high={high}
      rate={rate}
      asOf={asOf}
      monthlyRevenueUsd={monthlyRevenueUsd}
    />
  );
}
