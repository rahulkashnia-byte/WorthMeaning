import { NextResponse } from "next/server";
import {
  liveDomainAge,
  liveDomainSnapshot,
  livePageWeight,
} from "@/lib/tools-live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live tools API — never reads or writes WorthMeaning report cache.
 * Rank.to / RDAP / page fetch always use cache: "no-store".
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: string;
      domain?: string;
      domains?: string[];
      url?: string;
      rpm?: number;
      multiple?: number;
    };

    const action = body.action?.trim();
    if (!action) {
      return NextResponse.json({ error: "Missing action." }, { status: 400 });
    }

    switch (action) {
      case "snapshot": {
        if (!body.domain) {
          return NextResponse.json({ error: "Enter a domain." }, { status: 400 });
        }
        const snapshot = await liveDomainSnapshot(body.domain, {
          rpm: body.rpm,
          multiple: body.multiple,
        });
        return NextResponse.json(snapshot);
      }
      case "compare": {
        const list = (body.domains || []).filter(Boolean).slice(0, 2);
        if (list.length !== 2) {
          return NextResponse.json(
            { error: "Enter exactly two domains." },
            { status: 400 },
          );
        }
        const [a, b] = await Promise.all([
          liveDomainSnapshot(list[0], { rpm: body.rpm, multiple: body.multiple }),
          liveDomainSnapshot(list[1], { rpm: body.rpm, multiple: body.multiple }),
        ]);
        return NextResponse.json({ a, b, fetchedAt: new Date().toISOString(), cached: false });
      }
      case "rdap": {
        if (!body.domain) {
          return NextResponse.json({ error: "Enter a domain." }, { status: 400 });
        }
        const age = await liveDomainAge(body.domain);
        return NextResponse.json(age);
      }
      case "page-weight": {
        if (!body.url) {
          return NextResponse.json({ error: "Enter a URL." }, { status: 400 });
        }
        const weight = await livePageWeight(body.url);
        return NextResponse.json(weight);
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Live tool request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
