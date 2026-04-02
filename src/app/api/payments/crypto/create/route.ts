export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PLANS_CONFIG } from "@/lib/plans-config";
import type { PlanKey } from "@/lib/plans-config";

// XOF → USD conversion (approximate — in production, fetch live rate)
const XOF_TO_USD = 1 / 655.96;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { plan, annual, currency } = await req.json() as {
    plan: PlanKey;
    annual: boolean;
    currency: "USDT" | "BTC" | "SOL";
  };

  const planConfig = PLANS_CONFIG[plan];
  if (!planConfig) {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const amountFCFA = annual ? planConfig.annualFCFA : planConfig.monthlyFCFA;
  const amountUSD = (amountFCFA * XOF_TO_USD).toFixed(2);
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const payload = {
    price_amount: amountUSD,
    price_currency: "USD",
    pay_currency: currency,
    order_id: `NP-${session.user.id.slice(0, 8)}-${Date.now()}`,
    order_description: `IdjorTrade ${planConfig.nameFr} - ${annual ? "12 mois" : "1 mois"}`,
    ipn_callback_url: `${baseUrl}/api/payments/crypto/notify`,
    success_url: `${baseUrl}/plans/success?provider=crypto`,
    cancel_url: `${baseUrl}/plans`,
    case: "success",
  };

  const res = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      is_fixed_rate: false,
      is_fee_paid_by_user: false,
    }),
  });

  const data = await res.json() as {
    id?: string;
    invoice_url?: string;
    error?: string;
    message?: string;
  };

  if (!data.invoice_url) {
    return NextResponse.json(
      { error: data.message ?? data.error ?? "Erreur NOWPayments" },
      { status: 500 }
    );
  }

  // Store metadata in order_id prefix so IPN can retrieve it
  // In production, store in a pending_payments table
  return NextResponse.json({
    url: data.invoice_url,
    paymentId: data.id,
    meta: { userId: session.user.id, plan, annual, amountFCFA },
  });
}
