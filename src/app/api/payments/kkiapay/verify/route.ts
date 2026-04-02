export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyKkiapayPayment } from "@/lib/kkiapay";
import { upgradePlan } from "@/lib/subscription";
import type { PlanKey } from "@/lib/plans-config";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { transactionId, planId, period } = await req.json() as {
    transactionId: string;
    planId: PlanKey;
    period: "monthly" | "annual";
  };

  if (!transactionId || !planId) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const result = await verifyKkiapayPayment(transactionId);

  if (!result.success) {
    return NextResponse.json({ success: false, error: "Paiement non confirmé" }, { status: 400 });
  }

  const months = period === "annual" ? 12 : 1;

  await upgradePlan(session.user.id, planId, {
    months,
    paymentMethod: "kkiapay",
    amountFCFA: result.amount,
  });

  return NextResponse.json({ success: true, plan: planId });
}
