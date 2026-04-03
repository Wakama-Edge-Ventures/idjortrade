import { getCached, setCached } from "./market-cache";

const BASE_URL = "https://api.twelvedata.com";
const API_KEY = process.env.TWELVEDATA_API_KEY;

export type Quote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
  is_market_open: boolean;
};

// ─── Mock data (fallback when API key is absent) ────────────────────────────
const MOCK_QUOTES: Record<string, Quote> = {
  "BTC/USD":   { symbol: "BTC/USD",   name: "Bitcoin",        price: 83250,    change: 1245.5,  percent_change: 1.52,  high: 84100,    low: 82000,    volume: 28_500_000_000, timestamp: Date.now(), is_market_open: true },
  "ETH/USD":   { symbol: "ETH/USD",   name: "Ethereum",       price: 3240,     change: 185.2,   percent_change: 6.06,  high: 3310,     low: 3150,     volume: 14_200_000_000, timestamp: Date.now(), is_market_open: true },
  "SOL/USD":   { symbol: "SOL/USD",   name: "Solana",         price: 185.40,   change: 20.5,    percent_change: 12.42, high: 190,      low: 165,      volume: 3_800_000_000,  timestamp: Date.now(), is_market_open: true },
  "BNB/USD":   { symbol: "BNB/USD",   name: "BNB",            price: 598.70,   change: -12.3,   percent_change: -2.01, high: 615,      low: 592,      volume: 1_200_000_000,  timestamp: Date.now(), is_market_open: true },
  "XRP/USD":   { symbol: "XRP/USD",   name: "XRP",            price: 0.5842,   change: 0.021,   percent_change: 3.73,  high: 0.60,     low: 0.565,    volume: 2_100_000_000,  timestamp: Date.now(), is_market_open: true },
  "ADA/USD":   { symbol: "ADA/USD",   name: "Cardano",        price: 0.342,    change: -0.015,  percent_change: -4.20, high: 0.365,    low: 0.335,    volume: 480_000_000,    timestamp: Date.now(), is_market_open: true },
  "AVAX/USD":  { symbol: "AVAX/USD",  name: "Avalanche",      price: 38.15,    change: 1.85,    percent_change: 5.10,  high: 39.5,     low: 36.2,     volume: 650_000_000,    timestamp: Date.now(), is_market_open: true },
  "MATIC/USD": { symbol: "MATIC/USD", name: "Polygon",        price: 0.7820,   change: -0.042,  percent_change: -5.10, high: 0.835,    low: 0.775,    volume: 420_000_000,    timestamp: Date.now(), is_market_open: true },
  "EUR/USD":   { symbol: "EUR/USD",   name: "Euro / US Dollar", price: 1.0842, change: 0.0015,  percent_change: 0.14,  high: 1.0860,   low: 1.0810,   volume: 0,              timestamp: Date.now(), is_market_open: false },
  "GBP/USD":   { symbol: "GBP/USD",   name: "British Pound",  price: 1.2634,   change: -0.0032, percent_change: -0.25, high: 1.2680,   low: 1.2600,   volume: 0,              timestamp: Date.now(), is_market_open: false },
  "USD/JPY":   { symbol: "USD/JPY",   name: "US Dollar / Yen", price: 151.42,  change: 0.38,    percent_change: 0.25,  high: 151.80,   low: 150.90,   volume: 0,              timestamp: Date.now(), is_market_open: false },
  "AUD/USD":   { symbol: "AUD/USD",   name: "Australian Dollar", price: 0.6521, change: -0.0018, percent_change: -0.28, high: 0.6555,  low: 0.6500,   volume: 0,              timestamp: Date.now(), is_market_open: false },
  "USD/CAD":   { symbol: "USD/CAD",   name: "US Dollar / CAD", price: 1.3658,  change: 0.0045,  percent_change: 0.33,  high: 1.3680,   low: 1.3620,   volume: 0,              timestamp: Date.now(), is_market_open: false },
  "EUR/GBP":   { symbol: "EUR/GBP",   name: "Euro / GBP",     price: 0.8583,   change: 0.0012,  percent_change: 0.14,  high: 0.8600,   low: 0.8560,   volume: 0,              timestamp: Date.now(), is_market_open: false },
  "AAPL":      { symbol: "AAPL",      name: "Apple Inc.",      price: 218.35,   change: 3.42,    percent_change: 1.59,  high: 220.10,   low: 215.80,   volume: 54_200_000,     timestamp: Date.now(), is_market_open: false },
  "MSFT":      { symbol: "MSFT",      name: "Microsoft",       price: 415.80,   change: -5.20,   percent_change: -1.24, high: 422.00,   low: 413.50,   volume: 21_800_000,     timestamp: Date.now(), is_market_open: false },
  "GOOGL":     { symbol: "GOOGL",     name: "Alphabet",        price: 178.42,   change: 2.85,    percent_change: 1.63,  high: 179.80,   low: 175.60,   volume: 18_500_000,     timestamp: Date.now(), is_market_open: false },
  "AMZN":      { symbol: "AMZN",      name: "Amazon",          price: 198.75,   change: 1.20,    percent_change: 0.61,  high: 200.50,   low: 196.80,   volume: 32_400_000,     timestamp: Date.now(), is_market_open: false },
  "TSLA":      { symbol: "TSLA",      name: "Tesla",           price: 175.40,   change: -8.60,   percent_change: -4.67, high: 185.00,   low: 174.20,   volume: 98_600_000,     timestamp: Date.now(), is_market_open: false },
  "NVDA":      { symbol: "NVDA",      name: "NVIDIA",          price: 875.20,   change: 22.40,   percent_change: 2.63,  high: 882.50,   low: 860.00,   volume: 43_200_000,     timestamp: Date.now(), is_market_open: false },
  "XAU/USD":   { symbol: "XAU/USD",   name: "Or / USD",        price: 2315.50,  change: 18.40,   percent_change: 0.80,  high: 2325.00,  low: 2298.00,  volume: 0,              timestamp: Date.now(), is_market_open: false },
  "XAG/USD":   { symbol: "XAG/USD",   name: "Argent / USD",    price: 27.42,    change: 0.35,    percent_change: 1.29,  high: 27.80,    low: 27.10,    volume: 0,              timestamp: Date.now(), is_market_open: false },
  "USOIL":     { symbol: "USOIL",     name: "Pétrole Brut WTI", price: 82.15,   change: -1.25,   percent_change: -1.50, high: 83.80,    low: 81.50,    volume: 0,              timestamp: Date.now(), is_market_open: false },
  "COPPER":    { symbol: "COPPER",    name: "Cuivre",           price: 4.25,    change: 0.08,    percent_change: 1.92,  high: 4.30,     low: 4.18,     volume: 0,              timestamp: Date.now(), is_market_open: false },
  "NATGAS":    { symbol: "NATGAS",    name: "Gaz Naturel",      price: 2.18,    change: -0.05,   percent_change: -2.24, high: 2.26,     low: 2.15,     volume: 0,              timestamp: Date.now(), is_market_open: false },
};

// ─── Parse raw API response into Quote ──────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseQuote(raw: any, symbol: string): Quote | null {
  if (!raw || raw.status === "error" || raw.code) return null;
  return {
    symbol,
    name: raw.name ?? symbol,
    price: parseFloat(raw.close ?? raw.price ?? "0"),
    change: parseFloat(raw.change ?? "0"),
    percent_change: parseFloat(raw.percent_change ?? "0"),
    high: parseFloat(raw.high ?? "0"),
    low: parseFloat(raw.low ?? "0"),
    volume: parseInt(raw.volume ?? "0", 10),
    timestamp: raw.timestamp ? raw.timestamp * 1000 : Date.now(),
    is_market_open: raw.is_market_open ?? true,
  };
}

// ─── fetchQuote ──────────────────────────────────────────────────────────────
export async function fetchQuote(symbol: string): Promise<Quote | null> {
  if (!API_KEY) return MOCK_QUOTES[symbol] ?? null;

  const cacheKey = `quote:${symbol}`;
  const cached = getCached<Quote>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 15 } });
    const raw = await res.json();
    const quote = parseQuote(raw, symbol);
    if (quote) setCached(cacheKey, quote);
    return quote ?? MOCK_QUOTES[symbol] ?? null;
  } catch {
    return MOCK_QUOTES[symbol] ?? null;
  }
}

// ─── fetchMultipleQuotes ─────────────────────────────────────────────────────
export async function fetchMultipleQuotes(
  symbols: string[]
): Promise<Record<string, Quote>> {
  if (!API_KEY) {
    return Object.fromEntries(
      symbols.flatMap((s) => (MOCK_QUOTES[s] ? [[s, MOCK_QUOTES[s]]] : []))
    );
  }

  const cacheKey = `quotes:${symbols.sort().join(",")}`;
  const cached = getCached<Record<string, Quote>>(cacheKey);
  if (cached) return cached;

  try {
    const symbolList = symbols.join(",");
    const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(symbolList)}&apikey=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    const raw = await res.json();

    const result: Record<string, Quote> = {};

    if (symbols.length === 1) {
      // Single symbol returns object directly
      const q = parseQuote(raw, symbols[0]);
      if (q) result[symbols[0]] = q;
    } else {
      // Multiple symbols returns keyed object
      for (const symbol of symbols) {
        const q = parseQuote(raw[symbol], symbol);
        if (q) result[symbol] = q;
        else if (MOCK_QUOTES[symbol]) result[symbol] = MOCK_QUOTES[symbol];
      }
    }

    setCached(cacheKey, result);
    return result;
  } catch {
    return Object.fromEntries(
      symbols.flatMap((s) => (MOCK_QUOTES[s] ? [[s, MOCK_QUOTES[s]]] : []))
    );
  }
}

// ─── fetchForexRate ──────────────────────────────────────────────────────────
export async function fetchForexRate(
  from: string,
  to: string
): Promise<number | null> {
  const symbol = `${from}/${to}`;
  if (!API_KEY) return MOCK_QUOTES[symbol]?.price ?? null;

  const cacheKey = `forex:${symbol}`;
  const cached = getCached<number>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${BASE_URL}/exchange_rate?symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
    const res = await fetch(url);
    const raw = await res.json();
    if (raw.status === "error" || !raw.rate) return null;
    const rate = parseFloat(raw.rate);
    setCached(cacheKey, rate);
    return rate;
  } catch {
    return null;
  }
}

// ─── Symbol groups ───────────────────────────────────────────────────────────
export const SYMBOLS = {
  crypto:     ["BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD", "XRP/USD", "ADA/USD", "AVAX/USD", "MATIC/USD"],
  forex:      ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "EUR/GBP"],
  actions:    ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"],
  matieres:   ["XAU/USD", "XAG/USD", "USOIL", "COPPER", "NATGAS"],
} as const;

export type Category = keyof typeof SYMBOLS;
