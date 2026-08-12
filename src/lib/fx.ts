/**
 * Live USD→INR for Indian rupee displays (lakhs / crores).
 * Uses open.er-api.com daily rates with a short in-memory cache.
 * Falls back to a conservative rate if the network call fails.
 */

import { FALLBACK_USD_INR } from "@/lib/format";

export { FALLBACK_USD_INR };

type FxCache = {
  rate: number;
  asOf: string;
  source: string;
  fetchedAt: number;
};

let memoryCache: FxCache | null = null;
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export type UsdInrRate = {
  rate: number;
  asOf: string;
  source: string;
  cached: boolean;
};

export async function getUsdInrRate(): Promise<UsdInrRate> {
  if (memoryCache && Date.now() - memoryCache.fetchedAt < TTL_MS) {
    return {
      rate: memoryCache.rate,
      asOf: memoryCache.asOf,
      source: memoryCache.source,
      cached: true,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`FX HTTP ${res.status}`);
    const data = (await res.json()) as {
      result?: string;
      rates?: { INR?: number };
      time_last_update_utc?: string;
    };

    const rate = Number(data.rates?.INR);
    if (!Number.isFinite(rate) || rate < 1) {
      throw new Error("INR rate missing");
    }

    memoryCache = {
      rate,
      asOf: data.time_last_update_utc || new Date().toISOString(),
      source: "open.er-api.com",
      fetchedAt: Date.now(),
    };

    return {
      rate: memoryCache.rate,
      asOf: memoryCache.asOf,
      source: memoryCache.source,
      cached: false,
    };
  } catch {
    return {
      rate: FALLBACK_USD_INR,
      asOf: new Date().toISOString(),
      source: "fallback",
      cached: false,
    };
  }
}
