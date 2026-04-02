import { NextRequest, NextResponse } from "next/server";
import { fetchMultipleQuotes, SYMBOLS, type Category } from "@/lib/twelvedata";

export const revalidate = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = (searchParams.get("category") ?? "crypto") as Category;
  const symbolsParam = searchParams.get("symbols");

  const symbols: string[] = symbolsParam
    ? symbolsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [...(SYMBOLS[category] ?? SYMBOLS.crypto)];

  try {
    const quotes = await fetchMultipleQuotes(symbols);
    return NextResponse.json(quotes, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({ error: "Erreur de récupération des données marché" }, { status: 500 });
  }
}
