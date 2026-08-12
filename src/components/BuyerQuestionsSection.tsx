"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const QUESTIONS = [
  {
    id: "worth",
    label: "What’s it worth?",
    hint: "Get a midpoint and range before you negotiate.",
  },
  {
    id: "buy",
    label: "Should I buy it?",
    hint: "See traffic momentum and what the number means.",
  },
  {
    id: "wait",
    label: "Should I wait?",
    hint: "Check if rank is rising or falling before you jump.",
  },
] as const;

type QuestionId = (typeof QUESTIONS)[number]["id"];

export function BuyerQuestionsSection() {
  const router = useRouter();
  const [question, setQuestion] = useState<QuestionId>("buy");
  const [url, setUrl] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const params = new URLSearchParams({
      url: trimmed,
      intent: question,
    });
    router.push(`/buy-check?${params.toString()}`);
  }

  return (
    <section className="panel buyer-panel" id="buy-check">
      <div className="panel-intro">
        <p className="worth-kicker">For buyers</p>
        <h2>Thinking of buying a site?</h2>
        <p>
          Ask the question on your mind. We’ll run a Worth Report aimed at that
          decision — separate from a quick lookup above.
        </p>
      </div>

      <div className="buyer-questions" role="radiogroup" aria-label="Your question">
        {QUESTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="buyer-question"
            data-active={question === item.id}
            aria-pressed={question === item.id}
            onClick={() => setQuestion(item.id)}
          >
            <strong>{item.label}</strong>
            <span>{item.hint}</span>
          </button>
        ))}
      </div>

      <form className="worth-form" onSubmit={onSubmit}>
        <label className="worth-label" htmlFor="buy-url">
          Website you’re considering
        </label>
        <div className="worth-form-row">
          <input
            id="buy-url"
            name="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="example-site.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="worth-input"
            required
          />
          <button className="worth-submit" type="submit" disabled={!url.trim()}>
            Check it
          </button>
        </div>
        <p className="worth-hint">
          Opens a buyer-focused check. Saved reports still apply until you update.
        </p>
      </form>
    </section>
  );
}
