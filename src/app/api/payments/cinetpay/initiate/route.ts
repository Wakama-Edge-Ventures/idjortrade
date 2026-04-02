export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PLANS_CONFIG } from "@/lib/plans-config";
import type { PlanKey } from "@/lib/plans-config";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { plan, annual } = await req.json() as { plan: PlanKey; annual: boolean };

  const planConfig = PLANS_CONFIG[plan];
  if (!planConfig) {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const amountFCFA = annual ? planConfig.annualFCFA : planConfig.monthlyFCFA;
  const transactionId = `CP-${session.user.id.slice(0, 8)}-${Date.now()}`;
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const payload = {
    apikey: process.env.CINETPAY_API_KEY,
    site_id: process.env.CINETPAY_SITE_ID,
    transaction_id: transactionId,
    amount: amountFCFA,
    currency: "XOF",
    description: `IdjorTrade ${planConfig.nameFr} - ${annual ? "12 mois" : "1 mois"}`,
    notify_url: `${baseUrl}/api/payments/cinetpay/notify`,
    return_url: `${baseUrl}/plans/success?provider=cinetpay`,
    channels: "ALL",
    lang: "fr",
    metadata: JSON.stringify({ userId: session.user.id, plan, annual }),
    customer_name: session.user.name ?? "",
    customer_email: session.user.email ?? "",
  };

  const res = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json() as { code: string; message: string; data?: { payment_url: string } };

  if (data.code !== "201") {
    return NextResponse.json(
      { error: data.message ?? "Erreur CinetPay" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.data?.payment_url, transactionId });
}
