export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade || trade.userId !== session.user.id) {
    return NextResponse.json({ error: "Trade introuvable" }, { status: 404 });
  }

  const updated = await prisma.trade.update({
    where: { id },
    data: {
      ...body,
      status: body.exit ? "closed" : trade.status,
      closedAt: body.exit ? new Date() : trade.closedAt,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;

  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade || trade.userId !== session.user.id) {
    return NextResponse.json({ error: "Trade introuvable" }, { status: 404 });
  }

  await prisma.trade.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
