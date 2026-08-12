"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { reportPath } from "@/lib/domain";

type Props = {
  domain: string;
};

export function ReportActions({ domain }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const path = reportPath(domain);

  async function onUpdate() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: domain, refresh: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not update report.");
    } finally {
      setPending(false);
    }
  }

  async function onCopy() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="worth-cache-bar" style={{ marginTop: "1.2rem" }}>
      <p>
        Permanent page for this domain: <Link href={path}>{path}</Link>
        {error ? (
          <>
            <br />
            <span className="worth-error">{error}</span>
          </>
        ) : null}
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className="worth-update"
          onClick={onCopy}
        >
          Copy link
        </button>
        <button
          type="button"
          className="worth-update"
          onClick={onUpdate}
          disabled={pending}
        >
          {pending ? "Updating…" : "Update"}
        </button>
      </div>
    </div>
  );
}
