import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolBody } from "@/components/tools/ToolBody";
import { ToolShell } from "@/components/tools/ToolShell";
import { TOOLS, getTool } from "@/lib/tools-catalog";
import { getToolSeo } from "@/lib/tools-seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: "Tool not found | WorthMeaning", robots: { index: false } };

  const seo = getToolSeo(tool.slug);
  const title = seo?.seoTitle
    ? `${seo.seoTitle} | WorthMeaning`
    : `${tool.title} | WorthMeaning Tools`;
  const description = seo?.seoDescription || tool.description;

  return {
    title,
    description,
    keywords: seo?.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title,
      description,
      url: `/tools/${tool.slug}`,
      type: "website",
      siteName: "WorthMeaning",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <ToolShell tool={tool}>
      <ToolBody slug={tool.slug} />
    </ToolShell>
  );
}
