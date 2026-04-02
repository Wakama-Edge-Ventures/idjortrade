import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const plan = session.user.plan;

  // History depth by plan
  let createdAfter: Date | undefined;
  if (plan === "FREE") {
    // FREE: max 3 per day, show last 10
  } else if (plan === "BASIC") {
    createdAfter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  }
  // PRO + TRADER: no restriction

  const where = {
    userId: session.user.id,
    ...(createdAfter ? { createdAt: { gte: createdAfter } } : {}),
  };

  const [analyses, total] = await Promise.all([
    prisma.analyse.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.analyse.count({ where }),
  ]);

  return NextResponse.json({ analyses, total, limit, offset });
}
