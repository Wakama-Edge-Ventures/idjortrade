export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/emails/welcome";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json() as { email: string; code: string };

    if (!email || !code) {
      return NextResponse.json({ error: "Email et code requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Already verified — return success without re-processing
    if (user.emailVerified) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    if (user.verifyCode !== code) {
      return NextResponse.json({ error: "Code incorrect" }, { status: 400 });
    }

    if (!user.verifyExpires || user.verifyExpires < new Date()) {
      return NextResponse.json({ error: "Code expiré. Demande un nouveau code." }, { status: 400 });
    }

    // Mark email as verified and clear the code
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true, verifyCode: null, verifyExpires: null },
    });

    // Send welcome email fire-and-forget
    sendWelcomeEmail(email, user.prenom).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
