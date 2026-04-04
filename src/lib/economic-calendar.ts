export type EconomicEvent = {
  id: string;
  date: string;   // YYYY-MM-DD (UTC)
  time: string;   // HH:MM (UTC = heure Abidjan)
  country: string;
  flag: string;
  event: string;
  impact: 'low' | 'medium' | 'high';
  forecast: string | null;
  previous: string | null;
  actual: string | null;
};

// Raw shape returned by Forex Factory JSON
export type FFRawEvent = {
  title: string;
  country: string;
  date: string;       // ISO datetime with offset, ex: "2026-04-07T08:30:00-04:00"
  impact: string;
  forecast: string;
  previous: string;
  actual?: string;
};

// Raw shape returned by FCS API
export type FCSRawEvent = {
  id: string;
  date: string;    // "YYYY-MM-DD"
  time: string;    // "HH:MM" UTC
  country: string;
  currency: string; // "USD", "EUR", etc.
  name: string;
  impact: string;  // "low" | "medium" | "high"
  forecast: string | null;
  previous: string | null;
  actual: string | null;
};

export const countryFlags: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CAD: '🇨🇦',
  AUD: '🇦🇺',
  CHF: '🇨🇭',
  NZD: '🇳🇿',
};

/** Convert a FCS API raw event to our EconomicEvent */
export function parseFcsEvent(e: FCSRawEvent): EconomicEvent {
  const impact =
    e.impact?.toLowerCase() === 'high'
      ? 'high'
      : e.impact?.toLowerCase() === 'medium'
      ? 'medium'
      : 'low';

  return {
    id: e.id,
    date: e.date,
    time: e.time,
    country: e.currency ?? e.country ?? '',
    flag: countryFlags[e.currency] ?? '🌐',
    event: e.name ?? '',
    impact: impact as 'low' | 'medium' | 'high',
    forecast: e.forecast || null,
    previous: e.previous || null,
    actual: e.actual || null,
  };
}

/** Convert a FF raw event to our EconomicEvent, with time in UTC (= heure Abidjan) */
export function parseFfEvent(e: FFRawEvent, index: number): EconomicEvent {
  // FF dates are ISO with US Eastern offset. Convert to UTC for Abidjan display.
  const d = new Date(e.date);
  const dateUtc = d.toISOString().slice(0, 10);       // "2026-04-07"
  const timeUtc = d.toISOString().slice(11, 16);       // "12:30"

  const impact =
    e.impact?.toLowerCase() === 'high'
      ? 'high'
      : e.impact?.toLowerCase() === 'medium'
      ? 'medium'
      : 'low';

  return {
    id: String(index),
    date: dateUtc,
    time: timeUtc,
    country: e.country ?? '',
    flag: countryFlags[e.country] ?? '🌐',
    event: e.title ?? '',
    impact: impact as 'low' | 'medium' | 'high',
    forecast: e.forecast || null,
    previous: e.previous || null,
    actual: e.actual || null,
  };
}

// Fallback mock — dates dynamiques centrées sur la semaine courante
function getWeekDates(): string[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function getMockEvents(): EconomicEvent[] {
  const [mon, tue, wed, thu, fri] = getWeekDates();
  return [
    { id: '1', date: mon, time: '14:30', country: 'USD', flag: '🇺🇸', event: 'ISM Manufacturing PMI', impact: 'medium', forecast: '49.5', previous: '50.3', actual: null },
    { id: '2', date: tue, time: '08:55', country: 'EUR', flag: '🇩🇪', event: 'German Unemployment Change', impact: 'medium', forecast: '-5K', previous: '-2K', actual: null },
    { id: '3', date: tue, time: '14:00', country: 'USD', flag: '🇺🇸', event: 'JOLTS Job Openings', impact: 'medium', forecast: '7.70M', previous: '7.74M', actual: null },
    { id: '4', date: wed, time: '12:15', country: 'USD', flag: '🇺🇸', event: 'ADP Non-Farm Employment', impact: 'medium', forecast: '120K', previous: '77K', actual: null },
    { id: '5', date: wed, time: '14:30', country: 'USD', flag: '🇺🇸', event: 'ISM Services PMI', impact: 'medium', forecast: '53.0', previous: '53.5', actual: null },
    { id: '6', date: thu, time: '11:45', country: 'EUR', flag: '🇪🇺', event: 'ECB Interest Rate Decision', impact: 'high', forecast: '2.40%', previous: '2.65%', actual: null },
    { id: '7', date: thu, time: '12:30', country: 'EUR', flag: '🇪🇺', event: 'ECB Press Conference', impact: 'high', forecast: null, previous: null, actual: null },
    { id: '8', date: thu, time: '12:30', country: 'USD', flag: '🇺🇸', event: 'Unemployment Claims', impact: 'medium', forecast: '225K', previous: '224K', actual: null },
    { id: '9', date: fri, time: '12:30', country: 'USD', flag: '🇺🇸', event: 'Non-Farm Payrolls', impact: 'high', forecast: '140K', previous: '151K', actual: null },
    { id: '10', date: fri, time: '12:30', country: 'USD', flag: '🇺🇸', event: 'Unemployment Rate', impact: 'high', forecast: '4.1%', previous: '4.1%', actual: null },
    { id: '11', date: fri, time: '12:30', country: 'CAD', flag: '🇨🇦', event: 'Canada Employment Change', impact: 'high', forecast: '12.0K', previous: '1.1K', actual: null },
  ];
}
