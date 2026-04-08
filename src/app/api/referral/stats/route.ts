export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const referral = await prisma.referral.findFirst({
    where: { userId: session.user.id },
  });

  if (!referral) {
    // Auto-create a referral record with a unique code on first visit
    const code = session.user.id.slice(-8).toUpperCase();
    const newReferral = await prisma.referral.upsert({
      where: { code },
      create: { code, userId: session.user.id },
      update: {},
    });
    return NextResponse.json(newReferral);
  }

  return NextResponse.json(referral);
}
