import Link from "next/link";

const LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/worth-meaning", label: "Worth meaning" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer site-footer-rich">
      <nav className="footer-nav" aria-label="Footer">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <p>worthmeaning.com · traffic data via Rank.to · estimates only</p>
    </footer>
  );
}
