export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getMockEvents, parseFcsEvent, type FCSRawEvent } from "@/lib/economic-calendar";

export async function GET() {
  console.log('FCSAPI_KEY present:', !!process.env.FCSAPI_KEY);
  console.log('FCSAPI_KEY value:', process.env.FCSAPI_KEY?.slice(0, 8) + '...');

  const url =
    `https://fcsapi.com/api-v3/forex/economy_cal` +
    `?access_key=${process.env.FCSAPI_KEY}` +
    `&category=all`;
  console.log('Fetching URL:', url);

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    console.log('FCS API status:', res.status);

    const text = await res.text();
    console.log('FCS API response preview:', text.slice(0, 200));

    const json = JSON.parse(text);

    // FCS API wraps data in { status: true, response: [...] }
    const raw: FCSRawEvent[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.response)
      ? json.response
      : null;

    if (!raw) throw new Error("Unexpected FCS API shape");

    const events = raw.map(parseFcsEvent);
    return Response.json({ events, isOffline: false });
  } catch (error) {
    console.error('FCS API error:', error);
    return Response.json({ events: getMockEvents(), isOffline: true });
  }
}
