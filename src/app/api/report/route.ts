import { NextResponse } from "next/server";
import { allReportPaths, normalizeRootDomain, reportPath } from "@/lib/domain";
import {
  readCachedReport,
  writeCachedReport,
} from "@/lib/report-cache";
import { buildWorthReport, normalizeUrl } from "@/lib/worth-report";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      url?: string;
      refresh?: boolean;
    };
    const url = body.url?.trim();
    if (!url) {
      return NextResponse.json({ error: "Enter a website URL." }, { status: 400 });
    }

    const rootDomain = normalizeRootDomain(url);
    const normalized = normalizeUrl(rootDomain);
    const refresh = Boolean(body.refresh);
    const paths = allReportPaths(rootDomain);

    if (!refresh) {
      const cached = await readCachedReport(rootDomain);
      if (cached) {
        return NextResponse.json({
          ...cached,
          reportPath: reportPath(rootDomain),
          reportPaths: paths,
        });
      }
    }

    const report = await buildWorthReport(normalized);
    const saved = await writeCachedReport(report);
    return NextResponse.json({
      ...saved,
      reportPath: reportPath(rootDomain),
      reportPaths: paths,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not build a worth report.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
