import {
  formatInrExact,
  formatInrIndian,
  formatUsd,
  usdToInr,
} from "@/lib/format";

type Props = {
  low: number;
  mid: number;
  high: number;
  rate: number;
  asOf?: string;
  monthlyRevenueUsd?: number;
};

/** Server-rendered INR worth (Lakh / Crore). */
export function InrWorthStatic({
  low,
  mid,
  high,
  rate,
  asOf,
  monthlyRevenueUsd,
}: Props) {
  const midInr = usdToInr(mid, rate);
  const lowInr = usdToInr(low, rate);
  const highInr = usdToInr(high, rate);

  return (
    <div className="worth-inr">
      <p className="worth-inr-main">{formatInrIndian(midInr)}</p>
      <p className="worth-inr-exact">{formatInrExact(midInr)}</p>
      <p className="worth-range">
        Range {formatInrIndian(lowInr)} – {formatInrIndian(highInr)}
      </p>
      {monthlyRevenueUsd != null ? (
        <p className="worth-inr-rev">
          Est. monthly revenue ≈{" "}
          {formatInrIndian(usdToInr(monthlyRevenueUsd, rate))} (
          {formatUsd(monthlyRevenueUsd)})
        </p>
      ) : null}
      <p className="worth-inr-note">
        INR at ≈ ₹{rate.toFixed(2)} / $1
        {asOf ? ` · rate as of ${new Date(asOf).toLocaleDateString()}` : ""}{" "}
        · shown in Crore / Lakh
      </p>
    </div>
  );
}
