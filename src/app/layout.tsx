import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://worthmeaning.com"),
  title: {
    default:
      "WorthMeaning — Site Worth Checker, Website Earning Report & Free Tools",
    template: "%s",
  },
  description:
    "Check site worth and website earnings with live Rank.to data — clear midpoint, ₹ Lakh/Crore, and free calculators. Know what the number means.",
  keywords: [
    "site worth",
    "website worth",
    "website earning checker",
    "website revenue checker",
    "worth meaning",
    "website worth calculator",
  ],
  openGraph: {
    siteName: "WorthMeaning",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
