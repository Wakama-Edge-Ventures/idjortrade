import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";

export async function canAnalyse(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, analysesToday: true, analysesResetAt: true, planExpiresAt: true },
  });
  if (!user) return false;

  await checkPlanExpiry(userId);

  const now = new Date();
  const resetAt = new Date(user.analysesResetAt);
  const isNewDay = now.toDateString() !== resetAt.toDateString();

  let analysesToday = user.analysesToday;
  if (isNewDay) {
    await prisma.user.update({
      where: { id: userId },
      data: { analysesToday: 0, analysesResetAt: now },
    });
    analysesToday = 0;
  }

  const QUOTAS: Record<string, number> = {
    FREE: 3,
    BASIC: 20,
    PRO: Infinity,
    TRADER: Infinity,
  };

  const quota = QUOTAS[user.plan] ?? 3;
  return analysesToday < quota;
}

export async function upgradePlan(
  userId: string,
  plan: Plan,
  opts: {
    months?: number;
    paymentMethod?: string;
    amountFCFA?: number;
    stripeSubscriptionId?: string;
    cinetpayTransactionId?: string;
    nowpaymentsPaymentId?: string;
  } = {}
): Promise<void> {
  const expiresAt = opts.months
    ? new Date(Date.now() + opts.months * 30 * 24 * 60 * 60 * 1000)
    : null;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { plan, planExpiresAt: expiresAt },
    }),
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        status: "active",
        paymentMethod: opts.paymentMethod,
        amountFCFA: opts.amountFCFA,
        stripeSubscriptionId: opts.stripeSubscriptionId,
        cinetpayTransactionId: opts.cinetpayTransactionId,
        nowpaymentsPaymentId: opts.nowpaymentsPaymentId,
        expiresAt,
      },
      update: {
        plan,
        status: "active",
        paymentMethod: opts.paymentMethod,
        amountFCFA: opts.amountFCFA,
        stripeSubscriptionId: opts.stripeSubscriptionId ?? undefined,
        cinetpayTransactionId: opts.cinetpayTransactionId ?? undefined,
        nowpaymentsPaymentId: opts.nowpaymentsPaymentId ?? undefined,
        expiresAt,
        cancelledAt: null,
        startedAt: new Date(),
      },
    }),
  ]);
}

export async function checkPlanExpiry(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiresAt: true },
  });
  if (!user || user.plan === "FREE" || !user.planExpiresAt) return;

  if (new Date() > user.planExpiresAt) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "FREE", planExpiresAt: null },
    });
    await prisma.subscription.updateMany({
      where: { userId, status: "active" },
      data: { status: "expired" },
    });
  }
}
