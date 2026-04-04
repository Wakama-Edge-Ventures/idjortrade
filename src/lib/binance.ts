export type Candle = {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
};

const INTERVAL_MAP: Record<string, string> = {
  "1H": "1h",
  "2H": "2h",
  "4H": "4h",
  "1D": "1d",
  "3D": "3d",
  "1W": "1w",
  "1M": "1M",
  // scalp timeframes
  "1m": "1m",
  "3m": "3m",
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
};

export function toBinanceInterval(timeframe: string): string {
  return INTERVAL_MAP[timeframe] ?? "1h";
}

export function toBinanceSymbol(asset: string): string {
  // "SOL/USDT" → "SOLUSDT", "BTCUSDT" → "BTCUSDT"
  return asset.replace("/", "").toUpperCase();
}

export async function fetchRecentCandles(
  asset: string,
  timeframe: string,
  limit = 10
): Promise<Candle[] | null> {
  try {
    const symbol   = toBinanceSymbol(asset);
    const interval = toBinanceInterval(timeframe);
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;

    const raw: unknown[][] = await res.json();
    return raw.map((k) => ({
      openTime:  Number(k[0]),
      open:      parseFloat(k[1] as string),
      high:      parseFloat(k[2] as string),
      low:       parseFloat(k[3] as string),
      close:     parseFloat(k[4] as string),
      volume:    parseFloat(k[5] as string),
      closeTime: Number(k[6]),
    }));
  } catch {
    return null;
  }
}

export async function fetchCurrentPrice(asset: string): Promise<number | null> {
  try {
    const symbol = toBinanceSymbol(asset);
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const data = await res.json() as { price: string };
    return parseFloat(data.price);
  } catch {
    return null;
  }
}

export function formatCandlesForPrompt(
  candles: Candle[],
  asset: string,
  timeframe: string
): string {
  if (!candles.length) return "";

  const last = candles[candles.length - 1];
  const lastTime = new Date(last.closeTime).toISOString();

  const rows = candles
    .map((c) => {
      const dir = c.close >= c.open ? "▲" : "▼";
      return `  ${dir} O:${c.open} H:${c.high} L:${c.low} C:${c.close} V:${c.volume.toFixed(2)}`;
    })
    .join("\n");

  return `DONNÉES BINANCE TEMPS RÉEL — ${asset} ${timeframe}:
Dernière bougie clôturée: ${lastTime}
Prix actuel Binance: ${last.close}
${candles.length} dernières bougies (de la plus ancienne à la plus récente):
${rows}`;
}
