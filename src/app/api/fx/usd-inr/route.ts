import { NextResponse } from "next/server";
import { getUsdInrRate } from "@/lib/fx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const fx = await getUsdInrRate();
  return NextResponse.json(fx);
}
