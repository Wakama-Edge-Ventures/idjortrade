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

// ─── CoinGecko IDs for crypto pairs ─────────────────────────────────────────
const COINGECKO_IDS: Record<string, string> = {
  "BTC/USD":   "bitcoin",    "BTC/USDT":  "bitcoin",
  "ETH/USD":   "ethereum",   "ETH/USDT":  "ethereum",
  "SOL/USD":   "solana",     "SOL/USDT":  "solana",
  "BNB/USD":   "binancecoin","BNB/USDT":  "binancecoin",
  "XRP/USD":   "ripple",     "XRP/USDT":  "ripple",
  "ADA/USD":   "cardano",    "ADA/USDT":  "cardano",
  "AVAX/USD":  "avalanche-2","AVAX/USDT": "avalanche-2",
  "MATIC/USD": "matic-network","MATIC/USDT":"matic-network",
  "DOGE/USD":  "dogecoin",   "DOGE/USDT": "dogecoin",
  "DOT/USD":   "polkadot",   "DOT/USDT":  "polkadot",
  "LINK/USD":  "chainlink",  "LINK/USDT": "chainlink",
  "TRX/USD":   "tron",       "TRX/USDT":  "tron",
  "LTC/USD":   "litecoin",   "LTC/USDT":  "litecoin",
  "BCH/USD":   "bitcoin-cash","BCH/USDT": "bitcoin-cash",
};

const COINGECKO_NAMES: Record<string, string> = {
  "bitcoin": "Bitcoin", "ethereum": "Ethereum", "solana": "Solana",
  "binancecoin": "BNB", "ripple": "XRP", "cardano": "Cardano",
  "avalanche-2": "Avalanche", "matic-network": "Polygon", "dogecoin": "Dogecoin",
  "polkadot": "Polkadot", "chainlink": "Chainlink", "tron": "TRON",
  "litecoin": "Litecoin", "bitcoin-cash": "Bitcoin Cash",
};

// ─── Mock data (fallback when APIs are unavailable) ──────────────────────────
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

// ─── CoinGecko fetch for cryptos (no API key needed) ────────────────────────
async function fetchFromCoingecko(geckoId: string, symbol: string): Promise<Quote | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price` +
      `?ids=${geckoId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const d = data[geckoId];
    if (!d?.usd) return null;
    return {
      symbol,
      name: COINGECKO_NAMES[geckoId] ?? geckoId,
      price: d.usd,
      change: 0,
      percent_change: d.usd_24h_change ?? 0,
      high: d.usd,
      low: d.usd,
      volume: d.usd_24h_vol ?? 0,
      timestamp: Date.now(),
      is_market_open: true,
    };
  } catch {
    return null;
  }
}

// ─── Parse raw Twelvedata response into Quote ────────────────────────────────
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
  const upperSymbol = symbol.toUpperCase();
  const cacheKey = `quote:${upperSymbol}`;
  const cached = getCached<Quote>(cacheKey);
  if (cached) return cached;

  // Cryptos → CoinGecko (no API key needed, always fresh)
  const geckoId = COINGECKO_IDS[upperSymbol];
  if (geckoId) {
    const quote = await fetchFromCoingecko(geckoId, upperSymbol);
    if (quote) {
      setCached(cacheKey, quote);
      return quote;
    }
    // CoinGecko failed, return mock
    return MOCK_QUOTES[upperSymbol] ?? MOCK_QUOTES[upperSymbol.replace("/USDT", "/USD")] ?? null;
  }

  // Forex / stocks → Twelvedata
  if (!API_KEY) return MOCK_QUOTES[upperSymbol] ?? null;

  try {
    const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(upperSymbol)}&apikey=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 15 } });
    const raw = await res.json();
    const quote = parseQuote(raw, upperSymbol);
    if (quote) setCached(cacheKey, quote);
    return quote ?? MOCK_QUOTES[upperSymbol] ?? null;
  } catch {
    return MOCK_QUOTES[upperSymbol] ?? null;
  }
}

// ─── fetchMultipleQuotes ─────────────────────────────────────────────────────
export async function fetchMultipleQuotes(
  symbols: string[]
): Promise<Record<string, Quote>> {
  const result: Record<string, Quote> = {};

  // Split into crypto vs non-crypto
  const cryptoSymbols = symbols.filter(s => COINGECKO_IDS[s.toUpperCase()]);
  const otherSymbols = symbols.filter(s => !COINGECKO_IDS[s.toUpperCase()]);

  // Batch fetch cryptos from CoinGecko
  if (cryptoSymbols.length > 0) {
    const geckoIds = [...new Set(cryptoSymbols.map(s => COINGECKO_IDS[s.toUpperCase()]))];
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price` +
        `?ids=${geckoIds.join(",")}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
        { next: { revalidate: 30 } }
      );
      if (res.ok) {
        const data = await res.json();
        for (const sym of cryptoSymbols) {
          const geckoId = COINGECKO_IDS[sym.toUpperCase()];
          const d = data[geckoId];
          if (d?.usd) {
            result[sym] = {
              symbol: sym,
              name: COINGECKO_NAMES[geckoId] ?? geckoId,
              price: d.usd,
              change: 0,
              percent_change: d.usd_24h_change ?? 0,
              high: d.usd,
              low: d.usd,
              volume: d.usd_24h_vol ?? 0,
              timestamp: Date.now(),
              is_market_open: true,
            };
          } else if (MOCK_QUOTES[sym]) {
            result[sym] = MOCK_QUOTES[sym];
          }
        }
      }
    } catch {
      for (const sym of cryptoSymbols) {
        if (MOCK_QUOTES[sym]) result[sym] = MOCK_QUOTES[sym];
      }
    }
  }

  // Fetch non-cryptos from Twelvedata
  if (otherSymbols.length > 0) {
    if (!API_KEY) {
      for (const s of otherSymbols) {
        if (MOCK_QUOTES[s]) result[s] = MOCK_QUOTES[s];
      }
    } else {
      const cacheKey = `quotes:${otherSymbols.sort().join(",")}`;
      const cached = getCached<Record<string, Quote>>(cacheKey);
      if (cached) {
        Object.assign(result, cached);
      } else {
        try {
          const symbolList = otherSymbols.join(",");
          const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(symbolList)}&apikey=${API_KEY}`;
          const res = await fetch(url, { next: { revalidate: 30 } });
          const raw = await res.json();
          const partial: Record<string, Quote> = {};
          if (otherSymbols.length === 1) {
            const q = parseQuote(raw, otherSymbols[0]);
            if (q) partial[otherSymbols[0]] = q;
          } else {
            for (const symbol of otherSymbols) {
              const q = parseQuote(raw[symbol], symbol);
              if (q) partial[symbol] = q;
              else if (MOCK_QUOTES[symbol]) partial[symbol] = MOCK_QUOTES[symbol];
            }
          }
          setCached(cacheKey, partial);
          Object.assign(result, partial);
        } catch {
          for (const s of otherSymbols) {
            if (MOCK_QUOTES[s]) result[s] = MOCK_QUOTES[s];
          }
        }
      }
    }
  }

  return result;
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
