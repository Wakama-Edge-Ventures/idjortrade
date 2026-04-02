import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const trades = await prisma.trade.findMany({
    where: { userId: session.user.id },
    orderBy: { openedAt: "desc" },
    include: { analyse: { select: { signal: true, confidence: true } } },
  });

  return NextResponse.json(trades);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { analyseId, asset, direction, entry, exit, pnlFCFA, notes } = body;

  if (!asset || !direction || !entry) {
    return NextResponse.json({ error: "asset, direction et entry sont requis" }, { status: 400 });
  }

  const trade = await prisma.trade.create({
    data: {
      userId: session.user.id,
      analyseId: analyseId ?? null,
      asset,
      direction,
      entry: parseFloat(entry),
      exit: exit ? parseFloat(exit) : null,
      pnlFCFA: pnlFCFA ? parseInt(pnlFCFA) : null,
      notes: notes ?? null,
      status: exit ? "closed" : "open",
      closedAt: exit ? new Date() : null,
    },
  });

  return NextResponse.json(trade, { status: 201 });
}
