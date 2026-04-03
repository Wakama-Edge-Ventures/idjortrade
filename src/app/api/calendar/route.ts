export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { mockEvents } from "@/lib/economic-calendar";

const countryFlags: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  CHF: "🇨🇭",
  NZD: "🇳🇿",
};

export async function GET() {
  try {
    const res = await fetch(
      "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Fetch failed");

    const raw = await res.json() as Array<{
      date: string;
      time: string;
      country: string;
      title: string;
      impact: string;
      forecast: string;
      previous: string;
    }>;

    const mapped = raw.map((e, i) => ({
      id: String(i),
      date: e.date?.slice(0, 10) ?? "",
      time: e.time ?? "00:00",
      country: e.country ?? "",
      flag: countryFlags[e.country] ?? "🌐",
      event: e.title ?? "",
      impact: (
        e.impact?.toLowerCase() === "high"
          ? "high"
          : e.impact?.toLowerCase() === "medium"
          ? "medium"
          : "low"
      ) as "low" | "medium" | "high",
      forecast: e.forecast || null,
      previous: e.previous || null,
      actual: null,
    }));

    return Response.json(mapped);
  } catch {
    return Response.json(mockEvents);
  }
}
