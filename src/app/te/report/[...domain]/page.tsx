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
  return generateReportMetadata("te", params);
}

export default async function TeluguDomainReportPage({ params }: Props) {
  return <DomainReportPageBody locale="te" params={params} />;
}
