import { NextResponse } from "next/server";
import { fetchMultipleQuotes, SYMBOLS } from "@/lib/twelvedata";

export const revalidate = 60;

export async function GET() {
  try {
    const quotes = await fetchMultipleQuotes([...SYMBOLS.crypto]);
    const list = Object.values(quotes);

    const sorted = [...list].sort((a, b) => b.percent_change - a.percent_change);
    const gainers = sorted.slice(0, 5);
    const losers = sorted.slice(-5).reverse();

    return NextResponse.json({ gainers, losers }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ gainers: [], losers: [] }, { status: 500 });
  }
}
