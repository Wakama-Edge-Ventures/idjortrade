export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getMockEvents, parseFcsEvent, type FCSRawEvent } from "@/lib/economic-calendar";

export async function GET() {
  try {
    const res = await fetch(
      `https://fcsapi.com/api-v3/forex/economy_cal` +
        `?access_key=${process.env.FCSAPI_KEY}` +
        `&category=all`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    // FCS API wraps data in { status: true, response: [...] }
    const raw: FCSRawEvent[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.response)
      ? json.response
      : null;

    if (!raw) throw new Error("Unexpected FCS API shape");

    const events = raw.map(parseFcsEvent);
    return Response.json({ events, isOffline: false });
  } catch {
    return Response.json({ events: getMockEvents(), isOffline: true });
  }
}
