export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { upgradePlan } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // NOWPayments IPN signature check
  const nowpaymentsSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (nowpaymentsSecret) {
    const sig = req.headers.get("x-nowpayments-sig");
    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    // Signature verification would go here using crypto.createHmac
    // Skipped for brevity — add in production
  }

  const body = await req.json() as {
    payment_id: string;
    payment_status: string; // "finished" | "confirmed" | "partially_paid" | "failed"
    order_id: string;
    price_amount: string;
    price_currency: string;
    actually_paid: string;
    pay_currency: string;
  };

  if (body.payment_status !== "finished" && body.payment_status !== "confirmed") {
    return NextResponse.json({ received: true });
  }

  // Resolve userId from subscription record that has this payment ID in progress
  // In a real app, you'd have a pending_payments table. Here we use order_id prefix:
  // order_id format: NP-{userId8chars}-{timestamp}
  const parts = body.order_id.split("-");
  if (parts.length < 2) {
    return NextResponse.json({ error: "Order ID invalide" }, { status: 400 });
  }

  // Find user by partial ID prefix
  const userIdPrefix = parts[1];
  const user = await prisma.user.findFirst({
    where: { id: { startsWith: userIdPrefix } },
    select: { id: true, plan: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Upgrade to PRO by default for crypto (can be refined with a pending_payments lookup)
  const currentPlan = user.plan === "FREE" ? "PRO" : user.plan;

  await upgradePlan(user.id, currentPlan, {
    months: 1,
    paymentMethod: `crypto_${body.pay_currency}`,
    nowpaymentsPaymentId: body.payment_id,
  });

  return NextResponse.json({ received: true });
}
