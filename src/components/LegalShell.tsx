import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";

type Props = {
  title: string;
  kicker?: string;
  lede?: string;
  children: ReactNode;
};

export function LegalShell({ title, kicker = "WorthMeaning", lede, children }: Props) {
  return (
    <div className="shell">
      <header className="site-header">
        <a className="brand" href="/">
          Worth<span>Meaning</span>
        </a>
        <a className="nav-note" href="/tools">
          Tools →
        </a>
      </header>

      <main className="legal-page">
        <header className="legal-hero">
          <p className="worth-kicker">{kicker}</p>
          <h1>{title}</h1>
          {lede ? <p className="legal-lede">{lede}</p> : null}
        </header>
        <article className="legal-body">{children}</article>
      </main>

      <SiteFooter />
    </div>
  );
}

export function legalMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: `${title} | WorthMeaning`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | WorthMeaning`,
      description,
      url: path,
      type: "website",
      siteName: "WorthMeaning",
    },
    robots: { index: true, follow: true },
  };
}
