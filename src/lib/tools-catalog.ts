export type ToolCategory =
  | "valuation"
  | "traffic"
  | "domain"
  | "web"
  | "buyer";

export type ToolMeta = {
  slug: string;
  title: string;
  short: string;
  description: string;
  category: ToolCategory;
  /** Uses live Rank.to / RDAP / fetch — never report cache */
  liveData: boolean;
};

export const TOOL_CATEGORIES: { id: ToolCategory; label: string }[] = [
  { id: "valuation", label: "Valuation" },
  { id: "traffic", label: "Traffic & rank" },
  { id: "domain", label: "Domain" },
  { id: "web", label: "Web utilities" },
  { id: "buyer", label: "Buyer helpers" },
];

export const TOOLS: ToolMeta[] = [
  {
    slug: "rpm-revenue",
    title: "Website revenue calculator",
    short: "Visits + RPM → monthly & annual revenue",
    description:
      "Website earning check: estimate ad/affiliate revenue from monthly visits and RPM.",
    category: "valuation",
    liveData: false,
  },
  {
    slug: "revenue-to-worth",
    title: "Revenue → website worth",
    short: "Annual revenue × multiple → worth range",
    description:
      "Convert annual revenue into a website worth range using a years multiple.",
    category: "valuation",
    liveData: false,
  },
  {
    slug: "profit-multiple",
    title: "Profit → valuation explorer",
    short: "Slide multiples against profit",
    description:
      "See how different valuation multiples change what a profitable site might be worth.",
    category: "valuation",
    liveData: false,
  },
  {
    slug: "adsense-earnings",
    title: "Website earning checker",
    short: "Pageviews + RPM → site income estimate",
    description:
      "Free website earning / revenue checker — AdSense-style income from pageviews and RPM.",
    category: "valuation",
    liveData: false,
  },
  {
    slug: "live-site-worth",
    title: "Site worth checker",
    short: "Fresh Rank.to pull → site worth estimate",
    description:
      "Check site worth with live Rank.to data (never cached reports) — traffic value and midpoint.",
    category: "valuation",
    liveData: true,
  },
  {
    slug: "offer-check",
    title: "Offer sanity check",
    short: "Asking price vs live mid worth",
    description:
      "Compare a seller’s ask to a live Rank.to-based midpoint estimate.",
    category: "valuation",
    liveData: true,
  },
  {
    slug: "rank-to-visits",
    title: "Rank → visits",
    short: "Global rank → estimated monthly visits",
    description:
      "Apply the Rank.to traffic model, or look up a domain live and convert its rank.",
    category: "traffic",
    liveData: true,
  },
  {
    slug: "visits-to-rank",
    title: "Visits → rank",
    short: "Monthly visits → implied global rank",
    description:
      "Inverse of the Rank.to visits model — estimate what rank matches a traffic level.",
    category: "traffic",
    liveData: false,
  },
  {
    slug: "traffic-growth-worth",
    title: "Traffic growth → worth",
    short: "Growth % impact on estimated worth",
    description:
      "See how a traffic increase or drop changes estimated website worth.",
    category: "traffic",
    liveData: false,
  },
  {
    slug: "sessions-for-revenue",
    title: "Sessions for $X revenue",
    short: "How much traffic to hit a revenue goal",
    description:
      "Estimate sessions and pageviews needed for a monthly revenue target at a given RPM.",
    category: "traffic",
    liveData: false,
  },
  {
    slug: "traffic-trend",
    title: "Live traffic trend",
    short: "Fresh Rank.to history & trajectory",
    description:
      "Live Rank.to history: trajectory, momentum, visits delta — never from stored reports.",
    category: "traffic",
    liveData: true,
  },
  {
    slug: "neighbors",
    title: "Rank neighbors",
    short: "Sites ranked just above & below",
    description:
      "Live Rank.to neighbors around a domain’s current global rank.",
    category: "traffic",
    liveData: true,
  },
  {
    slug: "compare-sites",
    title: "Compare websites statistics",
    short: "Side-by-side live worth & traffic",
    description:
      "Compare websites statistics live — rank, visits, worth, and trend for two domains.",
    category: "traffic",
    liveData: true,
  },
  {
    slug: "domain-age",
    title: "Domain age (RDAP)",
    short: "Live registry creation date",
    description:
      "Look up domain registration/creation date via live RDAP — not a stored WHOIS dump.",
    category: "domain",
    liveData: true,
  },
  {
    slug: "url-normalizer",
    title: "URL → root domain",
    short: "Strip www, path, protocol",
    description:
      "Normalize any URL to the canonical root domain WorthMeaning uses for reports.",
    category: "domain",
    liveData: false,
  },
  {
    slug: "file-size",
    title: "File size converter",
    short: "B ↔ KB ↔ MB ↔ GB ↔ TB",
    description:
      "Convert file sizes between bytes, KB, MB, GB, and TB — instant, no upload stored.",
    category: "web",
    liveData: false,
  },
  {
    slug: "image-dimensions",
    title: "Image size helper",
    short: "Read dimensions & file size locally",
    description:
      "Drop an image to see width, height, megapixels, and file size. Processed in your browser only.",
    category: "web",
    liveData: false,
  },
  {
    slug: "page-weight",
    title: "Page weight checker",
    short: "Live HTML byte size of a URL",
    description:
      "Fetch a public URL now and measure HTML response size (headers + body sample).",
    category: "web",
    liveData: true,
  },
  {
    slug: "due-diligence",
    title: "Due-diligence checklist",
    short: "Buyer checklist for a domain",
    description:
      "Generate a buying checklist tailored to a domain — use with a live Worth Report.",
    category: "buyer",
    liveData: false,
  },
  {
    slug: "offer-helper",
    title: "Offer number helper",
    short: "Low / mid / high offer band",
    description:
      "Turn a mid valuation into a practical low–mid–high offer range for negotiation.",
    category: "buyer",
    liveData: false,
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory) {
  return TOOLS.filter((t) => t.category === category);
}
