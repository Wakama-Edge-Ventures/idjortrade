export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import anthropic from "@/lib/anthropic";
import { buildIdjorSystemPrompt } from "@/lib/prompts/idjor-system";

const QUOTAS: Record<string, number> = {
  FREE: 5,
  BASIC: 30,
  PRO: Infinity,
  TRADER: Infinity,
};

function getLimit(plan: string): number {
  return QUOTAS[plan] ?? 5;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const userId = session.user.id;

  const { messages, userProfile } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
    userProfile?: object | null;
  };

  if (!messages?.length) {
    return NextResponse.json({ error: "Messages manquants" }, { status: 400 });
  }

  // Fetch user + check quota
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { prenom: true, plan: true, idjorMsgToday: true, idjorMsgResetAt: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Reset daily quota if new day
  const now = new Date();
  const resetAt = new Date(user.idjorMsgResetAt);
  const isNewDay = now.toDateString() !== resetAt.toDateString();

  let idjorMsgToday = user.idjorMsgToday;
  if (isNewDay) {
    await prisma.user.update({
      where: { id: userId },
      data: { idjorMsgToday: 0, idjorMsgResetAt: now },
    });
    idjorMsgToday = 0;
  }

  const isPro = user.plan === "PRO" || user.plan === "TRADER";
  const limit = getLimit(user.plan);

  if (!isPro) {
    if (idjorMsgToday >= limit) {
      return NextResponse.json(
        {
          error:
            limit === 5
              ? "Quota journalier atteint (5 messages). Passez à Basic ou Pro pour plus de messages."
              : "Quota journalier atteint (30 messages). Passez à Pro pour Idjor illimité.",
          quotaInfo: { used: idjorMsgToday, limit },
        },
        { status: 429 }
      );
    }

    // Increment counter (fire-and-forget)
    prisma.user.update({
      where: { id: userId },
      data: { idjorMsgToday: { increment: 1 } },
    }).catch(() => {});
  }

  // Fetch profile from DB (overrides client-sent profile)
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  const systemPrompt = buildIdjorSystemPrompt(
    profile ?? (userProfile as Parameters<typeof buildIdjorSystemPrompt>[0]) ?? null,
    { prenom: user.prenom, plan: user.plan }
  );

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system: systemPrompt,
    messages: messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const content = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");

  // Save conversation exchange to DB (fire-and-forget)
  const userMessage = messages[messages.length - 1].content;
  prisma.idjorMessage.createMany({
    data: [
      { userId, role: "user", content: userMessage },
      { userId, role: "assistant", content },
    ],
  }).catch(() => {});

  return NextResponse.json({
    content,
    quotaInfo: isPro
      ? null
      : { used: idjorMsgToday + 1, limit },
  });
}
