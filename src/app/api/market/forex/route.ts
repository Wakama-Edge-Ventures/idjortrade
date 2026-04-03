export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { fetchForexRates } from "@/lib/coingecko";

export async function GET() {
  try {
    const rates = await fetchForexRates();
    return NextResponse.json(rates, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch forex data" }, { status: 500 });
  }
}
