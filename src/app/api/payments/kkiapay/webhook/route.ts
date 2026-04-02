export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { upgradePlan } from "@/lib/subscription";
import type { PlanKey } from "@/lib/plans-config";

export async function POST(req: Request) {
  const secret = req.headers.get("x-kkiapay-secret");
  if (!secret || secret !== process.env.KKIAPAY_SECRET) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  const body = await req.json() as {
    transactionId: string;
    status: string;
    amount: number;
    metadata?: string;
  };

  if (body.status !== "SUCCESS") {
    return NextResponse.json({ received: true });
  }

  let meta: { userId: string; planId: PlanKey; period: "monthly" | "annual" };
  try {
    meta = JSON.parse(body.metadata ?? "{}");
  } catch {
    return NextResponse.json({ error: "Metadata invalide" }, { status: 400 });
  }

  if (!meta.userId || !meta.planId) {
    return NextResponse.json({ error: "Metadata incomplète" }, { status: 400 });
  }

  const months = meta.period === "annual" ? 12 : 1;

  await upgradePlan(meta.userId, meta.planId, {
    months,
    paymentMethod: "kkiapay",
    amountFCFA: body.amount,
  });

  return NextResponse.json({ received: true });
}
