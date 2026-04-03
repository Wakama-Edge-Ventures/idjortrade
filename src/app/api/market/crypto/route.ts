export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { fetchCryptoMarkets } from "@/lib/coingecko";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = Math.min(parseInt(searchParams.get("per_page") ?? "50", 10), 100);

  try {
    const coins = await fetchCryptoMarkets(page, perPage);
    return NextResponse.json(coins, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch crypto data" }, { status: 500 });
  }
}
