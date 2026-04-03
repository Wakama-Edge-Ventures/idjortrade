export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.user.count();
    return Response.json({ ok: true, users: count });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
