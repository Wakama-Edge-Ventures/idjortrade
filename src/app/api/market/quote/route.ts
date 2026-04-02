import { NextRequest, NextResponse } from "next/server";
import { fetchQuote } from "@/lib/twelvedata";

export const revalidate = 15;

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "symbol requis" }, { status: 400 });
  }

  try {
    const quote = await fetchQuote(symbol);
    if (!quote) {
      return NextResponse.json({ error: `Symbole ${symbol} introuvable` }, { status: 404 });
    }
    return NextResponse.json(quote, {
      headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" },
    });
  } catch {
    return NextResponse.json({ error: "Erreur de récupération de la quote" }, { status: 500 });
  }
}
