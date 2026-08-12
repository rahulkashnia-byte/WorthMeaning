"use client";

import {
  AdsenseEarningsTool,
  DueDiligenceTool,
  FileSizeTool,
  ImageDimensionsTool,
  OfferHelperTool,
  ProfitMultipleTool,
  RevenueToWorthTool,
  RpmRevenueTool,
  SessionsForRevenueTool,
  TrafficGrowthWorthTool,
  UrlNormalizerTool,
  VisitsToRankTool,
} from "@/components/tools/CalcTools";
import {
  CompareSitesTool,
  DomainAgeTool,
  LiveSiteWorthTool,
  NeighborsTool,
  OfferCheckTool,
  PageWeightTool,
  RankToVisitsTool,
  TrafficTrendTool,
} from "@/components/tools/LiveTools";

export function ToolBody({ slug }: { slug: string }) {
  switch (slug) {
    case "rpm-revenue":
      return <RpmRevenueTool />;
    case "revenue-to-worth":
      return <RevenueToWorthTool />;
    case "profit-multiple":
      return <ProfitMultipleTool />;
    case "adsense-earnings":
      return <AdsenseEarningsTool />;
    case "live-site-worth":
      return <LiveSiteWorthTool />;
    case "offer-check":
      return <OfferCheckTool />;
    case "rank-to-visits":
      return <RankToVisitsTool />;
    case "visits-to-rank":
      return <VisitsToRankTool />;
    case "traffic-growth-worth":
      return <TrafficGrowthWorthTool />;
    case "sessions-for-revenue":
      return <SessionsForRevenueTool />;
    case "traffic-trend":
      return <TrafficTrendTool />;
    case "neighbors":
      return <NeighborsTool />;
    case "compare-sites":
      return <CompareSitesTool />;
    case "domain-age":
      return <DomainAgeTool />;
    case "url-normalizer":
      return <UrlNormalizerTool />;
    case "file-size":
      return <FileSizeTool />;
    case "image-dimensions":
      return <ImageDimensionsTool />;
    case "page-weight":
      return <PageWeightTool />;
    case "due-diligence":
      return <DueDiligenceTool />;
    case "offer-helper":
      return <OfferHelperTool />;
    default:
      return <p className="tool-error">Unknown tool.</p>;
  }
}
