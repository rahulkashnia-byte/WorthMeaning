import type { Metadata } from "next";
import {
  DomainReportPageBody,
  generateReportMetadata,
} from "@/lib/report-page";

type Props = {
  params: Promise<{ domain: string[] }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateReportMetadata("hi", params);
}

export default async function HindiDomainReportPage({ params }: Props) {
  return <DomainReportPageBody locale="hi" params={params} />;
}
