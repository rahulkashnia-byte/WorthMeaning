import type { ToolCategory } from "@/lib/tools-catalog";

export type ToolFaq = { q: string; a: string };

export type ToolSeo = {
  slug: string;
  /** Search-optimized H1 / title fragment */
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  intro: string;
  howItWorks: string[];
  faqs: ToolFaq[];
  related: string[];
};

const relatedByCategory: Record<ToolCategory, string[]> = {
  valuation: [
    "live-site-worth",
    "rpm-revenue",
    "revenue-to-worth",
    "offer-check",
  ],
  traffic: [
    "rank-to-visits",
    "visits-to-rank",
    "traffic-trend",
    "compare-sites",
  ],
  domain: ["domain-age", "url-normalizer", "live-site-worth"],
  web: ["file-size", "page-weight", "image-dimensions"],
  buyer: ["due-diligence", "offer-helper", "offer-check", "live-site-worth"],
};

function relatedFor(slug: string, category: ToolCategory): string[] {
  return relatedByCategory[category].filter((s) => s !== slug).slice(0, 4);
}

/** Per-tool SEO copy used for metadata, on-page content, and FAQ schema. */
export const TOOL_SEO: Record<string, ToolSeo> = {
  "rpm-revenue": {
    slug: "rpm-revenue",
    seoTitle: "RPM to Revenue Calculator — Free Website Ad Earnings Tool",
    seoDescription:
      "Free RPM to revenue calculator. Convert monthly visits and RPM into estimated monthly and annual website ad revenue. Instant, no signup.",
    keywords: [
      "rpm calculator",
      "rpm to revenue",
      "website revenue calculator",
      "ad revenue estimator",
    ],
    intro:
      "Use this free RPM to revenue calculator to estimate how much a website might earn from ads or affiliates. Enter monthly visits and RPM to get monthly, annual, and daily revenue estimates in seconds.",
    howItWorks: [
      "Enter estimated monthly visits for the site.",
      "Enter RPM (revenue per 1,000 pageviews).",
      "We assume a simple pages-per-visit model and calculate revenue live from your inputs — nothing is stored.",
    ],
    faqs: [
      {
        q: "What is RPM?",
        a: "RPM means revenue per mille — earnings per 1,000 pageviews. It is commonly used for ads and some affiliate models.",
      },
      {
        q: "Is this the same as AdSense RPM?",
        a: "It is the same idea. Your real AdSense RPM varies by niche, country, and season; this tool uses the RPM you enter.",
      },
      {
        q: "Does this use stored website data?",
        a: "No. Results are calculated instantly from the numbers you type. For live traffic-based worth, use Live site worth.",
      },
    ],
    related: relatedFor("rpm-revenue", "valuation"),
  },
  "revenue-to-worth": {
    slug: "revenue-to-worth",
    seoTitle: "Revenue to Website Worth Calculator — Free Valuation Tool",
    seoDescription:
      "Convert annual website revenue into an estimated worth range using a valuation multiple. Free revenue to website value calculator.",
    keywords: [
      "website worth calculator",
      "revenue to valuation",
      "website valuation multiple",
      "site value estimator",
    ],
    intro:
      "Estimate website worth from annual revenue. Multiply yearly earnings by a years multiple to get a low–mid–high value range buyers often use as a starting point.",
    howItWorks: [
      "Enter annual revenue (or profit, if you prefer a profit multiple).",
      "Choose a years multiple (WorthMeaning defaults near 2.5× for ad models).",
      "See low, mid, and high worth estimates update instantly.",
    ],
    faqs: [
      {
        q: "What multiple should I use?",
        a: "Content/ad sites often trade around low-to-mid single-digit revenue or profit multiples. Riskier or declining sites deserve lower multiples.",
      },
      {
        q: "Is revenue the same as profit?",
        a: "No. Many marketplaces price on seller discretionary earnings (profit). Using revenue alone can overstate worth.",
      },
      {
        q: "Is this a formal appraisal?",
        a: "No — it is a directional calculator for education and negotiation framing.",
      },
    ],
    related: relatedFor("revenue-to-worth", "valuation"),
  },
  "profit-multiple": {
    slug: "profit-multiple",
    seoTitle: "Profit Multiple Calculator — Website Valuation Explorer",
    seoDescription:
      "Explore how valuation multiples change website worth from annual profit. Free profit × multiple calculator for site buyers and sellers.",
    keywords: [
      "profit multiple calculator",
      "website profit valuation",
      "sde multiple",
      "business valuation multiple",
    ],
    intro:
      "See how different multiples change what a profitable website might be worth. Adjust annual profit and multiple to explore negotiation ranges.",
    howItWorks: [
      "Enter annual profit (or SDE).",
      "Pick or type a multiple.",
      "Get an implied worth and a simple ±40% band for scenario planning.",
    ],
    faqs: [
      {
        q: "What is an SDE multiple?",
        a: "Seller Discretionary Earnings multiples are common for small online businesses. The multiple reflects growth, risk, and transferability.",
      },
      {
        q: "Why show a range?",
        a: "Buyers and sellers rarely agree on one number. A band helps you plan opening offers and walk-away points.",
      },
    ],
    related: relatedFor("profit-multiple", "valuation"),
  },
  "adsense-earnings": {
    slug: "adsense-earnings",
    seoTitle: "AdSense Earnings Calculator — Estimate Monthly Ad Income",
    seoDescription:
      "Free AdSense earnings calculator. Estimate monthly and annual Google AdSense-style income from pageviews and RPM.",
    keywords: [
      "adsense calculator",
      "adsense earnings calculator",
      "adsense rpm calculator",
      "how much can i make with adsense",
    ],
    intro:
      "Estimate AdSense-style earnings from monthly pageviews and RPM. Useful for publishers planning niches, traffic goals, or comparing monetization scenarios.",
    howItWorks: [
      "Enter monthly pageviews.",
      "Enter your expected RPM.",
      "See estimated monthly, annual, and daily earnings instantly.",
    ],
    faqs: [
      {
        q: "Can this predict exact AdSense payouts?",
        a: "No. AdSense varies by geography, season, and ad quality. Use this for order-of-magnitude planning.",
      },
      {
        q: "Should I use visits or pageviews?",
        a: "AdSense is usually based on pageviews (and impressions). If you only know visits, convert using pages per visit first.",
      },
    ],
    related: relatedFor("adsense-earnings", "valuation"),
  },
  "live-site-worth": {
    slug: "live-site-worth",
    seoTitle: "Live Website Worth Calculator — Fresh Rank.to Estimate",
    seoDescription:
      "Check website worth with live Rank.to traffic data (not cached). Free live website value estimator with visits, revenue, and mid worth.",
    keywords: [
      "website worth calculator",
      "how much is my website worth",
      "live website valuation",
      "website value estimator",
    ],
    intro:
      "Get a live website worth estimate powered by a fresh Rank.to lookup. This tool never reuses WorthMeaning’s saved report cache — every run fetches current ranking data.",
    howItWorks: [
      "Enter a domain.",
      "We fetch live Rank.to rank and history (cache: no-store).",
      "Visits, assumed RPM revenue, and a worth range are calculated from that fresh pull.",
    ],
    faqs: [
      {
        q: "Is this real-time data?",
        a: "Yes for Rank.to: each request hits their API with no-store caching. Rank snapshots still update on Rank.to’s schedule.",
      },
      {
        q: "Why might a domain fail?",
        a: "New, very small, or unranked domains may have no Rank.to history yet.",
      },
      {
        q: "Is the dollar figure a sale price?",
        a: "No. It is a directional model estimate. Always verify analytics and profit before buying.",
      },
    ],
    related: relatedFor("live-site-worth", "valuation"),
  },
  "offer-check": {
    slug: "offer-check",
    seoTitle: "Website Offer Sanity Check — Asking Price vs Live Worth",
    seoDescription:
      "Compare a seller’s asking price to a live Rank.to-based website worth midpoint. Free offer over/under checker for site buyers.",
    keywords: [
      "website asking price check",
      "is this website overpriced",
      "website offer calculator",
      "buy website due diligence",
    ],
    intro:
      "Paste a domain and the seller’s ask. We pull live Rank.to data, estimate a midpoint worth, and tell you if the ask looks below, near, or far above the model.",
    howItWorks: [
      "Enter the domain and asking price.",
      "Fetch a fresh Rank.to snapshot and worth midpoint.",
      "See ask/mid ratio and a plain-English verdict.",
    ],
    faqs: [
      {
        q: "If the ask is below the estimate, should I buy?",
        a: "Not automatically. Cheap asks can mean declining traffic, policy risk, or unverifiable revenue.",
      },
      {
        q: "Does this replace due diligence?",
        a: "No. Use it as a first filter, then verify profit, traffic quality, and transfer risk.",
      },
    ],
    related: relatedFor("offer-check", "valuation"),
  },
  "rank-to-visits": {
    slug: "rank-to-visits",
    seoTitle: "Rank to Visits Calculator — Global Rank → Monthly Traffic",
    seoDescription:
      "Convert global traffic rank to estimated monthly visits using the Rank.to model, or look up a domain live. Free rank to traffic tool.",
    keywords: [
      "rank to visits",
      "alexa rank to traffic",
      "global rank visits calculator",
      "website traffic estimator",
    ],
    intro:
      "Estimate monthly visits from a global rank, or look up a domain’s live Rank.to rank and convert it with the published power-law traffic model.",
    howItWorks: [
      "Choose live domain mode or manual rank mode.",
      "Live mode fetches Rank.to with no-store caching.",
      "Visits are estimated with monthlyVisits ≈ 9×10¹⁰ × rank⁻¹·⁰⁵.",
    ],
    faqs: [
      {
        q: "How accurate is rank-to-visits?",
        a: "It is a model estimate for order-of-magnitude traffic, not Google Analytics.",
      },
      {
        q: "Can I enter rank without a domain?",
        a: "Yes — switch to manual rank mode for pure math conversion.",
      },
    ],
    related: relatedFor("rank-to-visits", "traffic"),
  },
  "visits-to-rank": {
    slug: "visits-to-rank",
    seoTitle: "Visits to Rank Calculator — Traffic → Implied Global Rank",
    seoDescription:
      "Convert monthly website visits into an implied global rank using the inverse Rank.to traffic model. Free visits to rank tool.",
    keywords: [
      "visits to rank",
      "traffic to global rank",
      "website rank estimator",
      "monthly visits rank calculator",
    ],
    intro:
      "Reverse the Rank.to visits model: enter monthly visits and see what global rank that traffic level roughly implies.",
    howItWorks: [
      "Enter monthly visits.",
      "We invert the Rank.to formula to estimate rank.",
      "A check conversion shows visits implied by that rank.",
    ],
    faqs: [
      {
        q: "Will this match Rank.to exactly?",
        a: "It matches the mathematical inverse of their published visits model. Real ranks also depend on how Rank.to observes the web.",
      },
    ],
    related: relatedFor("visits-to-rank", "traffic"),
  },
  "traffic-growth-worth": {
    slug: "traffic-growth-worth",
    seoTitle: "Traffic Growth to Worth Calculator — See Value Change",
    seoDescription:
      "Estimate how a traffic increase or drop changes website worth. Free growth impact calculator for site value planning.",
    keywords: [
      "traffic growth valuation",
      "website worth growth",
      "traffic increase value",
      "site value calculator",
    ],
    intro:
      "Model how website worth changes when traffic grows or shrinks. Useful for goal-setting, SEO planning, and buy-side scenarios.",
    howItWorks: [
      "Enter current monthly visits and a growth (or decline) percentage.",
      "Optionally set RPM.",
      "Compare worth now vs after the traffic change.",
    ],
    faqs: [
      {
        q: "Does growth always raise sale price?",
        a: "Usually it helps, but buyers also care about profit quality, concentration risk, and whether growth is paid or organic.",
      },
    ],
    related: relatedFor("traffic-growth-worth", "traffic"),
  },
  "sessions-for-revenue": {
    slug: "sessions-for-revenue",
    seoTitle: "Sessions Needed for Revenue Goal — Traffic Target Calculator",
    seoDescription:
      "Calculate how many sessions and pageviews you need to hit a monthly revenue goal at a given RPM. Free traffic goal tool.",
    keywords: [
      "sessions for revenue",
      "traffic needed for adsense",
      "pageviews for revenue goal",
      "rpm traffic calculator",
    ],
    intro:
      "Working backward from a revenue goal: see the pageviews and sessions you likely need at your RPM, with a simple bounce-rate adjustment.",
    howItWorks: [
      "Enter target monthly revenue and RPM.",
      "Optionally set bounce rate.",
      "Get pageviews and sessions needed per month.",
    ],
    faqs: [
      {
        q: "Why include bounce rate?",
        a: "Higher bounce can reduce effective pages per visit, so you may need more sessions to hit the same revenue.",
      },
    ],
    related: relatedFor("sessions-for-revenue", "traffic"),
  },
  "traffic-trend": {
    slug: "traffic-trend",
    seoTitle: "Website Traffic Trend Checker — Live Rank.to History",
    seoDescription:
      "Check live website traffic trend with fresh Rank.to history: trajectory, momentum, best/worst rank, and visits change. Not cached.",
    keywords: [
      "website traffic trend",
      "rank history checker",
      "is my traffic declining",
      "website momentum",
    ],
    intro:
      "Pull live Rank.to history for a domain and read trajectory, momentum, and visits change. Always a fresh fetch — never a stored Worth Report.",
    howItWorks: [
      "Enter a domain.",
      "We request up to ~365 days of Rank.to history with no-store.",
      "Insights summarize direction, momentum, and visits delta.",
    ],
    faqs: [
      {
        q: "What does trajectory mean?",
        a: "It summarizes whether rank/traffic looks strongly up, improving, stable, declining, or sharply down across the history window.",
      },
    ],
    related: relatedFor("traffic-trend", "traffic"),
  },
  neighbors: {
    slug: "neighbors",
    seoTitle: "Website Rank Neighbors — Sites Above & Below You",
    seoDescription:
      "See live Rank.to neighbors ranked just above and below a domain. Free competitive traffic-band explorer using fresh data.",
    keywords: [
      "rank neighbors",
      "similar traffic websites",
      "sites with similar rank",
      "competitor traffic band",
    ],
    intro:
      "Discover domains Rank.to places just above and below a site’s current global rank — a live look at a similar traffic band.",
    howItWorks: [
      "Enter a domain.",
      "Fetch live Rank.to rank + neighbors API (no cache).",
      "Review sites listed above and below.",
    ],
    faqs: [
      {
        q: "Are neighbors direct competitors?",
        a: "Not necessarily. They share a similar rank band, which often means similar traffic scale, not the same niche.",
      },
    ],
    related: relatedFor("neighbors", "traffic"),
  },
  "compare-sites": {
    slug: "compare-sites",
    seoTitle: "Compare Two Websites — Live Worth & Traffic Side by Side",
    seoDescription:
      "Compare two domains with live Rank.to data: rank, visits, worth, and trend. Free website comparison tool for buyers.",
    keywords: [
      "compare websites",
      "website worth comparison",
      "compare site traffic",
      "domain comparison tool",
    ],
    intro:
      "Compare two websites side by side using fresh Rank.to pulls for each domain — rank, estimated visits, revenue, worth, and trend signals.",
    howItWorks: [
      "Enter site A and site B.",
      "We fetch both live in parallel (never report cache).",
      "Review snapshots together to see which looks stronger on public signals.",
    ],
    faqs: [
      {
        q: "Can I compare more than two sites?",
        a: "This tool compares two at a time for clarity. Run it again for additional pairs, or use portfolio-style workflows later.",
      },
    ],
    related: relatedFor("compare-sites", "traffic"),
  },
  "domain-age": {
    slug: "domain-age",
    seoTitle: "Domain Age Checker — Live RDAP Creation Date Lookup",
    seoDescription:
      "Check domain age with live RDAP (not a WHOIS dump). See creation date, age in years, registrar, and expiry when available.",
    keywords: [
      "domain age checker",
      "how old is this domain",
      "rdap lookup",
      "domain creation date",
    ],
    intro:
      "Look up a domain’s registration/creation date through live RDAP. Useful for SEO trust checks and buying diligence — not a stored WHOIS database.",
    howItWorks: [
      "Enter a domain.",
      "We query RDAP in real time (no-store).",
      "Show created/updated/expires dates, registrar, and computed age when present.",
    ],
    faqs: [
      {
        q: "Why is RDAP blank for some domains?",
        a: "Some TLDs or privacy setups limit public events. A 404 means RDAP has no usable record for that lookup path.",
      },
      {
        q: "Does older always mean better?",
        a: "Age can help trust, but traffic, links, and penalties matter more for value.",
      },
    ],
    related: relatedFor("domain-age", "domain"),
  },
  "url-normalizer": {
    slug: "url-normalizer",
    seoTitle: "URL to Root Domain Converter — Strip www & Paths",
    seoDescription:
      "Normalize any URL to its canonical root domain (no www, path, or protocol). Free URL cleaner used by WorthMeaning reports.",
    keywords: [
      "url to domain",
      "extract root domain",
      "remove www from url",
      "canonicalize domain",
    ],
    intro:
      "Turn messy URLs into a clean root domain. WorthMeaning uses the same normalization so google.com/path and www.google.com map to one report page.",
    howItWorks: [
      "Paste a URL or host.",
      "We strip protocol, www, path, query, and hash.",
      "Get the canonical root domain and report path.",
    ],
    faqs: [
      {
        q: "Are subdomains kept?",
        a: "Brand subdomains like blog.example.com stay as hostnames; www is stripped. Use root domains for Worth Report SEO pages.",
      },
    ],
    related: relatedFor("url-normalizer", "domain"),
  },
  "file-size": {
    slug: "file-size",
    seoTitle: "File Size Converter — B, KB, MB, GB, TB Calculator",
    seoDescription:
      "Free file size converter between bytes, KB, MB, GB, and TB. Instant binary (1024) conversion — no upload, nothing stored.",
    keywords: [
      "file size converter",
      "mb to kb",
      "gb to mb",
      "bytes to kb",
      "size to kb",
    ],
    intro:
      "Convert file sizes between B, KB, MB, GB, and TB instantly. Uses binary units (1 KB = 1024 B). Nothing is uploaded or saved.",
    howItWorks: [
      "Enter a numeric size.",
      "Choose the unit.",
      "See the equivalent value in every common unit.",
    ],
    faqs: [
      {
        q: "Is this decimal (1000) or binary (1024)?",
        a: "Binary: 1 KB = 1024 bytes, common for file systems and many download UIs.",
      },
      {
        q: "Do you store my numbers?",
        a: "No. Conversion runs in your browser from the values you type.",
      },
    ],
    related: relatedFor("file-size", "web"),
  },
  "image-dimensions": {
    slug: "image-dimensions",
    seoTitle: "Image Size & Dimensions Checker — Width, Height, MB",
    seoDescription:
      "Check image width, height, megapixels, and file size in your browser. Free image dimensions tool — files are not uploaded to our servers.",
    keywords: [
      "image dimensions checker",
      "image size checker",
      "photo dimensions",
      "megapixel calculator",
    ],
    intro:
      "Select an image to see width, height, megapixels, and file size. Processing stays in your browser — we do not upload or store the file.",
    howItWorks: [
      "Choose an image from your device.",
      "Your browser reads dimensions locally.",
      "View pixels, megapixels, and bytes/MB.",
    ],
    faqs: [
      {
        q: "Is my image uploaded?",
        a: "No. The file is read locally with the browser File API and object URLs.",
      },
    ],
    related: relatedFor("image-dimensions", "web"),
  },
  "page-weight": {
    slug: "page-weight",
    seoTitle: "Page Weight Checker — Live HTML Size of Any URL",
    seoDescription:
      "Measure live HTML page weight for any public URL. Free page size checker that fetches the page now (not from a stored crawl).",
    keywords: [
      "page weight checker",
      "html size checker",
      "page size tool",
      "website page bytes",
    ],
    intro:
      "Fetch a public URL right now and measure response body size. Helps spot bloated HTML documents. Uses a live request with safety limits — not a stored crawl database.",
    howItWorks: [
      "Enter a public http(s) URL.",
      "Our server fetches it with no-store caching.",
      "See status, content-type, body bytes, and redirects.",
    ],
    faqs: [
      {
        q: "Does this include images and scripts?",
        a: "It measures the primary HTML (or document) response body, not a full waterfall of every asset.",
      },
      {
        q: "Why are some hosts blocked?",
        a: "Private/local addresses are blocked for safety.",
      },
    ],
    related: relatedFor("page-weight", "web"),
  },
  "due-diligence": {
    slug: "due-diligence",
    seoTitle: "Website Buying Due Diligence Checklist — Free Buyer Guide",
    seoDescription:
      "Generate a practical website buying due-diligence checklist for any domain. Free buyer checklist for traffic, profit, and transfer risk.",
    keywords: [
      "website due diligence checklist",
      "buying a website checklist",
      "website acquisition diligence",
      "buy site checklist",
    ],
    intro:
      "Generate a buyer’s due-diligence checklist tailored to a domain. Pair it with live worth and trend tools before you send an offer.",
    howItWorks: [
      "Enter the domain you are evaluating.",
      "Get a checklist covering traffic proof, profit, transfer, and risk.",
      "Follow links to live WorthMeaning tools for public-signal checks.",
    ],
    faqs: [
      {
        q: "Is this legal advice?",
        a: "No. It is a practical starting checklist. Use professionals for contracts and regulated situations.",
      },
    ],
    related: relatedFor("due-diligence", "buyer"),
  },
  "offer-helper": {
    slug: "offer-helper",
    seoTitle: "Website Offer Calculator — Low, Mid & Walk-Away Prices",
    seoDescription:
      "Turn a mid website valuation into opening offer, strong offer, and walk-away ceiling numbers. Free negotiation offer helper.",
    keywords: [
      "website offer calculator",
      "how much to offer for a website",
      "negotiation offer range",
      "buy website offer",
    ],
    intro:
      "Convert a midpoint valuation into a practical offer band: opening offer, strong offer, anchor, and walk-away ceiling.",
    howItWorks: [
      "Enter your mid valuation.",
      "See suggested low-to-high offer numbers.",
      "Use them as negotiation scaffolding — not hard rules.",
    ],
    faqs: [
      {
        q: "Should I always open at 70% of mid?",
        a: "It depends on competition, seller motivation, and proof quality. Use the band as a plan, then adjust.",
      },
    ],
    related: relatedFor("offer-helper", "buyer"),
  },
};

export function getToolSeo(slug: string): ToolSeo | undefined {
  return TOOL_SEO[slug];
}
