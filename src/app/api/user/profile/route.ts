import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile ?? {});
}

export async function PUT(req: NextRequest) {
  console.log("PUT /api/user/profile called");

  const session = await auth();
  console.log("session:", session?.user?.id);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  console.log("body:", body);

  // Separate User-level fields from UserProfile fields
  const { prenom, ...profileFields } = body as { prenom?: string } & Record<string, unknown>;

  // Update User.prenom if provided
  if (prenom) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { prenom },
    });
  }

  // Upsert UserProfile with remaining fields
  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: profileFields,
    create: { userId: session.user.id, ...profileFields },
  });

  return NextResponse.json({ success: true });
}
