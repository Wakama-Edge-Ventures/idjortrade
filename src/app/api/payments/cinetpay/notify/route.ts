export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { upgradePlan } from "@/lib/subscription";

export async function POST(req: Request) {
  const body = await req.json() as {
    cpm_trans_id: string;
    cpm_site_id: string;
    cpm_amount: string;
    cpm_currency: string;
    payment_method: string;
    cpm_result: string; // "00" = success
    cpm_trans_status: string; // "ACCEPTED"
    cpm_custom: string; // JSON metadata
  };

  if (body.cpm_result !== "00" || body.cpm_trans_status !== "ACCEPTED") {
    return NextResponse.json({ received: true });
  }

  let meta: { userId: string; plan: "BASIC" | "PRO" | "TRADER"; annual: boolean };
  try {
    meta = JSON.parse(body.cpm_custom);
  } catch {
    return NextResponse.json({ error: "Metadata invalide" }, { status: 400 });
  }

  await upgradePlan(meta.userId, meta.plan, {
    months: meta.annual ? 12 : 1,
    paymentMethod: `cinetpay_${body.payment_method}`,
    amountFCFA: parseInt(body.cpm_amount, 10),
    cinetpayTransactionId: body.cpm_trans_id,
  });

  return NextResponse.json({ received: true });
}
