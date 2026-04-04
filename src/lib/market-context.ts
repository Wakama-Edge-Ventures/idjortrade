export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
};

export type MarketContext = {
  symbol: string;
  currentPrice: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  openPrice: number;
  marketSentiment: "bullish" | "bearish" | "neutral";
  supportLevels: number[];
  resistanceLevels: number[];
  recentCandles: Candle[];
};

function toBinanceSymbol(asset: string): string {
  return asset.replace("/", "").toUpperCase();
}

export function isCryptoAsset(asset: string): boolean {
  const upper = asset.toUpperCase();
  return (
    upper.includes("USDT") ||
    upper.includes("BUSD") ||
    upper.endsWith("/BTC") ||
    upper.endsWith("/ETH")
  );
}

export async function fetchAssetContext(
  asset: string
): Promise<MarketContext | null> {
  if (!isCryptoAsset(asset)) return null;

  // Normalize: SOL/USDT → SOLUSDT, but if asset ends in /USD try USDT
  let symbol = toBinanceSymbol(asset);
  if (symbol.endsWith("USD") && !symbol.endsWith("USDT")) {
    symbol = symbol.slice(0, -3) + "USDT";
  }

  try {
    const [tickerRes, depthRes, klinesRes] = await Promise.all([
      fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`,
        { next: { revalidate: 10 } }
      ),
      fetch(
        `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=5`,
        { next: { revalidate: 10 } }
      ),
      fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`,
        { next: { revalidate: 10 } }
      ),
    ]);

    if (!tickerRes.ok) return null;

    const [ticker, depth, klines] = await Promise.all([
      tickerRes.json(),
      depthRes.ok ? depthRes.json() : null,
      klinesRes.ok ? klinesRes.json() : null,
    ]);

    const currentPrice = parseFloat(ticker.lastPrice ?? ticker.price ?? "0");
    const change24h = parseFloat(ticker.priceChangePercent ?? "0");
    const volume24h = parseFloat(ticker.quoteVolume ?? ticker.volume ?? "0");
    const high24h = parseFloat(ticker.highPrice ?? "0");
    const low24h = parseFloat(ticker.lowPrice ?? "0");
    const openPrice = parseFloat(ticker.openPrice ?? "0");

    const marketSentiment: MarketContext["marketSentiment"] =
      change24h > 2 ? "bullish" : change24h < -2 ? "bearish" : "neutral";

    // Support = top 3 bid prices (highest bids)
    const supportLevels: number[] = depth?.bids
      ? (depth.bids as [string, string][])
          .slice(0, 3)
          .map(([price]) => parseFloat(price))
      : [];

    // Resistance = top 3 ask prices (lowest asks)
    const resistanceLevels: number[] = depth?.asks
      ? (depth.asks as [string, string][])
          .slice(0, 3)
          .map(([price]) => parseFloat(price))
      : [];

    // Last 24 candles from klines
    const recentCandles: Candle[] = Array.isArray(klines)
      ? klines.map(
          (k: (string | number)[]) => ({
            timestamp: k[0] as number,
            open: parseFloat(k[1] as string),
            high: parseFloat(k[2] as string),
            low: parseFloat(k[3] as string),
            close: parseFloat(k[4] as string),
            volume: parseFloat(k[5] as string),
          })
        )
      : [];

    return {
      symbol,
      currentPrice,
      change24h,
      volume24h,
      high24h,
      low24h,
      openPrice,
      marketSentiment,
      supportLevels,
      resistanceLevels,
      recentCandles,
    };
  } catch {
    return null;
  }
}
