export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { groq } from "@/lib/groq";
import { buildIdjorSystemPrompt } from "@/lib/prompts/idjor-system";

const QUOTAS: Record<string, number> = {
  FREE:    3,
  STARTER: 20,
  BASIC:   50,
  PRO:     Infinity,
  TRADER:  Infinity,
};

function getLimit(plan: string): number {
  return QUOTAS[plan] ?? 3;
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
    await prisma.user.update({ where: { id: userId }, data: { idjorMsgToday: 0, idjorMsgResetAt: now } });
    idjorMsgToday = 0;
  }

  const plan = (user.plan ?? "FREE") as string;
  const isUnlimited = plan === "PRO" || plan === "TRADER";
  const limit = getLimit(plan);

  if (!isUnlimited && idjorMsgToday >= limit) {
    const upgradeMsg =
      plan === "FREE"
        ? "Quota journalier atteint (3 messages). Passez à Starter (2 900 FCFA/mois) pour 20 messages/jour."
        : plan === "STARTER"
        ? "Quota journalier atteint (20 messages). Passez à Basic pour 50 messages/jour."
        : `Quota journalier atteint (${limit} messages). Passez à Pro pour Idjor illimité.`;

    return NextResponse.json(
      { error: upgradeMsg, quotaInfo: { used: idjorMsgToday, limit } },
      { status: 429 }
    );
  }

  if (!isUnlimited) {
    prisma.user.update({ where: { id: userId }, data: { idjorMsgToday: { increment: 1 } } }).catch(() => {});
  }

  const profile = await prisma.userProfile.findUnique({ where: { userId } });

  const systemPrompt = buildIdjorSystemPrompt(
    profile ?? (userProfile as Parameters<typeof buildIdjorSystemPrompt>[0]) ?? null,
    { prenom: user.prenom, plan }
  );

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content ?? "";

  // Save conversation (fire-and-forget)
  const userMessage = messages[messages.length - 1].content;
  prisma.idjorMessage.createMany({
    data: [
      { userId, role: "user", content: userMessage },
      { userId, role: "assistant", content },
    ],
  }).catch(() => {});

  return NextResponse.json({
    content,
    quotaInfo: isUnlimited ? null : { used: idjorMsgToday + 1, limit },
  });
}
