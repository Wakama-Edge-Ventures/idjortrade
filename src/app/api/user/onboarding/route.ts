import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const data = await req.json();

  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: { ...data, onboardingDone: true },
    create: { userId: session.user.id, ...data, onboardingDone: true },
  });

  return NextResponse.json({ success: true });
}
