export type LiveDomainSnapshot = {
  domain: string;
  fetchedAt: string;
  source: "rank.to";
  cached: false;
  rank: number;
  asOf: string;
  monthlyVisits: number;
  rankDelta7d: number | null;
  rankDelta30d: number | null;
  insights: {
    trajectoryLabel: string;
    momentumLabel: string;
    monthlyVisitsDeltaPct: number | null;
    bestRank: number;
    worstRank: number;
    historyDaysReturned: number;
  };
  neighbors: {
    date: string | null;
    above: { domain: string; rank: number }[];
    below: { domain: string; rank: number }[];
  };
  economics: {
    rpm: number;
    multiple: number;
    monthlyRevenue: number;
    annualRevenue: number;
    worth: { low: number; mid: number; high: number };
  };
};
