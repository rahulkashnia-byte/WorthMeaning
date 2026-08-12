const HOME_FAQS = [
  {
    q: "What does worth mean?",
    a: (
      <>
        Worth means value — in money, usefulness, or importance. We explain the
        full definition on{" "}
        <a href="/worth-meaning">Worth meaning</a>.
      </>
    ),
  },
  {
    q: "How does WorthMeaning estimate website worth?",
    a: "We pull a live global rank from Rank.to, convert it to estimated visits with their published formula, assume ads/affiliate revenue, then apply a multi-year multiple. It’s the same logic family as classic website-value calculators — directional, not audited financials.",
  },
  {
    q: "Do you create a page for every search?",
    a: "Yes — one SEO page per root domain (for example /report/google.com). Paths, www, and http/https all collapse to the same domain so there are no duplicates.",
  },
  {
    q: "Are the traffic numbers exact?",
    a: "No. Rank.to ranks are real lookups; visits are estimated from rank with a power-law model. Treat them as order-of-magnitude, then verify with Google Analytics for diligence.",
  },
  {
    q: "Can I update an old report?",
    a: "Saved reports stay until you press Update. Each domain page shows how old the data is and lets you refresh from Rank.to.",
  },
  {
    q: "Should I buy a site based only on this report?",
    a: "No. Use it to frame the conversation, then demand verified traffic, profit, and ownership documents before paying.",
  },
];

export function HomeFaqSection() {
  return (
    <section className="panel" id="faq">
      <div className="panel-intro">
        <p className="worth-kicker">FAQ</p>
        <h2>Common questions</h2>
        <p>Quick answers about how WorthMeaning works and what the numbers mean.</p>
      </div>
      <div className="faq-list">
        {HOME_FAQS.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
