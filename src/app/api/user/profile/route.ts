export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user) return NextResponse.json({}, { status: 404 });

  // Omit sensitive fields before returning
  const { password, verifyCode, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();

  // Separate User-level fields from UserProfile fields
  const { prenom, phoneNumber, ...profileFields } = body as {
    prenom?: string;
    phoneNumber?: string;
  } & Record<string, unknown>;

  // Update User-level fields if provided
  if (prenom || phoneNumber !== undefined) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(prenom ? { prenom } : {}),
        ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      },
    });
  }

  // Upsert UserProfile with remaining fields (including langue, devise, modeAnalyse, risqueDefaut, notifPush, resumeEmail, alerteMarche)
  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: profileFields,
    create: { userId: session.user.id, ...profileFields },
  });

  return NextResponse.json({ success: true });
}
