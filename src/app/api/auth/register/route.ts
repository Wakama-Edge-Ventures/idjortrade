export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/emails/verification";

export async function POST(req: NextRequest) {
  console.log('Register POST called');
  console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);

  try {
    const { email, password, prenom } = await req.json();

    // Validate required fields
    if (!email || !password || !prenom) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit faire au moins 8 caractères" }, { status: 400 });
    }

    // Check for existing account
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    // Generate a 6-digit verification code valid for 10 minutes
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user + verification code in one step
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        prenom,
        verifyCode: code,
        verifyExpires: expires,
        profile: { create: {} },
      },
    });

    console.log('User created, sending verification email to:', email);

    // Send verification email — if it fails, delete the user and return 500
    try {
      await sendVerificationEmail(email, prenom, code);
      console.log('Verification email sent successfully');
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      // Rollback: delete the user so they can retry
      await prisma.user.delete({ where: { email } }).catch(() => {});
      return NextResponse.json(
        { error: "Impossible d'envoyer l'email de vérification. Réessaie." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Vérifie ton email",
    });
  } catch (error) {
    console.error('Register error full:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
