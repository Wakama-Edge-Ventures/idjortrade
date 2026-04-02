export async function verifyKkiapayPayment(
  transactionId: string
): Promise<{
  success: boolean;
  amount?: number;
  status?: string;
}> {
  const res = await fetch(
    "https://api.kkiapay.me/api/v1/transactions/status",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-private-key": process.env.KKIAPAY_PRIVATE_KEY!,
        "x-secret-key": process.env.KKIAPAY_SECRET!,
      },
      body: JSON.stringify({ transactionId }),
    }
  );
  const data = await res.json() as { status?: string; amount?: number };
  return {
    success: data.status === "SUCCESS",
    amount: data.amount,
    status: data.status,
  };
}
