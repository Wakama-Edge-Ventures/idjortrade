export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { fetchAssetContext } from "@/lib/market-context";

export async function GET(req: NextRequest) {
  const asset = req.nextUrl.searchParams.get("asset");
  if (!asset) {
    return NextResponse.json({ error: "asset requis" }, { status: 400 });
  }

  try {
    const ctx = await fetchAssetContext(asset);
    if (!ctx) {
      return NextResponse.json(
        { error: "Données non disponibles pour cet asset" },
        { status: 404 }
      );
    }
    return NextResponse.json(ctx, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération du contexte marché" },
      { status: 500 }
    );
  }
}
