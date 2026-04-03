export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  sparkline_in_7d: { price: number[] };
};

const MOCK_COINS: CoinMarket[] = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png", current_price: 83250, market_cap: 1_630_000_000_000, market_cap_rank: 1, total_volume: 28_500_000_000, price_change_percentage_1h_in_currency: 0.12, price_change_percentage_24h_in_currency: 1.52, price_change_percentage_7d_in_currency: -3.21, sparkline_in_7d: { price: [85000,84500,83000,82000,81500,82500,83250] } },
  { id: "ethereum", symbol: "eth", name: "Ethereum", image: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png", current_price: 3240, market_cap: 390_000_000_000, market_cap_rank: 2, total_volume: 14_200_000_000, price_change_percentage_1h_in_currency: 0.35, price_change_percentage_24h_in_currency: 6.06, price_change_percentage_7d_in_currency: 4.12, sparkline_in_7d: { price: [3100,3050,3150,3200,3180,3210,3240] } },
  { id: "solana", symbol: "sol", name: "Solana", image: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png", current_price: 185.4, market_cap: 87_000_000_000, market_cap_rank: 5, total_volume: 3_800_000_000, price_change_percentage_1h_in_currency: -0.22, price_change_percentage_24h_in_currency: 12.42, price_change_percentage_7d_in_currency: 8.5, sparkline_in_7d: { price: [170,165,168,175,180,182,185] } },
  { id: "binancecoin", symbol: "bnb", name: "BNB", image: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png", current_price: 598.7, market_cap: 88_000_000_000, market_cap_rank: 4, total_volume: 1_200_000_000, price_change_percentage_1h_in_currency: 0.08, price_change_percentage_24h_in_currency: -2.01, price_change_percentage_7d_in_currency: -1.5, sparkline_in_7d: { price: [610,608,605,600,598,597,599] } },
  { id: "ripple", symbol: "xrp", name: "XRP", image: "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png", current_price: 0.5842, market_cap: 32_000_000_000, market_cap_rank: 6, total_volume: 2_100_000_000, price_change_percentage_1h_in_currency: 0.41, price_change_percentage_24h_in_currency: 3.73, price_change_percentage_7d_in_currency: 5.2, sparkline_in_7d: { price: [0.55,0.56,0.57,0.565,0.575,0.580,0.584] } },
  { id: "cardano", symbol: "ada", name: "Cardano", image: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png", current_price: 0.342, market_cap: 12_000_000_000, market_cap_rank: 10, total_volume: 480_000_000, price_change_percentage_1h_in_currency: -0.15, price_change_percentage_24h_in_currency: -4.2, price_change_percentage_7d_in_currency: -6.1, sparkline_in_7d: { price: [0.365,0.360,0.355,0.350,0.345,0.342,0.342] } },
  { id: "avalanche-2", symbol: "avax", name: "Avalanche", image: "https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png", current_price: 38.15, market_cap: 15_800_000_000, market_cap_rank: 9, total_volume: 650_000_000, price_change_percentage_1h_in_currency: 0.55, price_change_percentage_24h_in_currency: 5.10, price_change_percentage_7d_in_currency: 3.8, sparkline_in_7d: { price: [36,36.5,37,37.5,38,38.1,38.15] } },
  { id: "matic-network", symbol: "matic", name: "Polygon", image: "https://coin-images.coingecko.com/coins/images/4713/large/matic-token-icon.png", current_price: 0.782, market_cap: 7_800_000_000, market_cap_rank: 14, total_volume: 420_000_000, price_change_percentage_1h_in_currency: -0.3, price_change_percentage_24h_in_currency: -5.1, price_change_percentage_7d_in_currency: -8.2, sparkline_in_7d: { price: [0.85,0.83,0.82,0.81,0.80,0.785,0.782] } },
  { id: "dogecoin", symbol: "doge", name: "Dogecoin", image: "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png", current_price: 0.1432, market_cap: 20_800_000_000, market_cap_rank: 8, total_volume: 1_800_000_000, price_change_percentage_1h_in_currency: 0.2, price_change_percentage_24h_in_currency: 2.3, price_change_percentage_7d_in_currency: -1.2, sparkline_in_7d: { price: [0.145,0.143,0.141,0.142,0.143,0.1435,0.1432] } },
  { id: "polkadot", symbol: "dot", name: "Polkadot", image: "https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png", current_price: 7.82, market_cap: 11_200_000_000, market_cap_rank: 12, total_volume: 380_000_000, price_change_percentage_1h_in_currency: -0.1, price_change_percentage_24h_in_currency: 1.8, price_change_percentage_7d_in_currency: 2.5, sparkline_in_7d: { price: [7.5,7.6,7.7,7.75,7.8,7.82,7.82] } },
];

export async function fetchCryptoMarkets(page = 1, perPage = 50): Promise<CoinMarket[]> {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    return data as CoinMarket[];
  } catch {
    // Return mock data on any failure (rate limit, network, etc.)
    return MOCK_COINS;
  }
}

export type ForexRate = {
  pair: string;
  label: string;
  rate: number;
  change24h: number | null;
};

const FOREX_PAIRS = [
  { pair: "EUR/USD", label: "Euro / Dollar US", base: "EUR", quote: "USD" },
  { pair: "GBP/USD", label: "Livre Sterling / Dollar US", base: "GBP", quote: "USD" },
  { pair: "USD/JPY", label: "Dollar US / Yen Japonais", base: "USD", quote: "JPY" },
  { pair: "AUD/USD", label: "Dollar Australien / Dollar US", base: "AUD", quote: "USD" },
  { pair: "USD/CAD", label: "Dollar US / Dollar Canadien", base: "USD", quote: "CAD" },
  { pair: "USD/CHF", label: "Dollar US / Franc Suisse", base: "USD", quote: "CHF" },
  { pair: "USD/XOF", label: "Dollar US / Franc CFA (UEMOA)", base: "USD", quote: "XOF" },
  { pair: "USD/NGN", label: "Dollar US / Naira Nigérian", base: "USD", quote: "NGN" },
  { pair: "USD/GHS", label: "Dollar US / Cedi Ghanéen", base: "USD", quote: "GHS" },
  { pair: "USD/MAD", label: "Dollar US / Dirham Marocain", base: "USD", quote: "MAD" },
  { pair: "EUR/XOF", label: "Euro / Franc CFA (UEMOA)", base: "EUR", quote: "XOF" },
  { pair: "USD/ZAR", label: "Dollar US / Rand Sud-Africain", base: "USD", quote: "ZAR" },
];

const MOCK_FOREX: ForexRate[] = [
  { pair: "EUR/USD", label: "Euro / Dollar US", rate: 1.0842, change24h: 0.14 },
  { pair: "GBP/USD", label: "Livre Sterling / Dollar US", rate: 1.2634, change24h: -0.25 },
  { pair: "USD/JPY", label: "Dollar US / Yen Japonais", rate: 151.42, change24h: 0.25 },
  { pair: "AUD/USD", label: "Dollar Australien / Dollar US", rate: 0.6521, change24h: -0.28 },
  { pair: "USD/CAD", label: "Dollar US / Dollar Canadien", rate: 1.3658, change24h: 0.33 },
  { pair: "USD/CHF", label: "Dollar US / Franc Suisse", rate: 0.9012, change24h: -0.12 },
  { pair: "USD/XOF", label: "Dollar US / Franc CFA (UEMOA)", rate: 615.5, change24h: 0.05 },
  { pair: "USD/NGN", label: "Dollar US / Naira Nigérian", rate: 1580.0, change24h: 0.8 },
  { pair: "USD/GHS", label: "Dollar US / Cedi Ghanéen", rate: 15.42, change24h: -0.3 },
  { pair: "USD/MAD", label: "Dollar US / Dirham Marocain", rate: 10.02, change24h: 0.1 },
  { pair: "EUR/XOF", label: "Euro / Franc CFA (UEMOA)", rate: 655.957, change24h: 0.0 },
  { pair: "USD/ZAR", label: "Dollar US / Rand Sud-Africain", rate: 18.65, change24h: -0.5 },
];

export async function fetchForexRates(): Promise<ForexRate[]> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`ER-API HTTP ${res.status}`);
    const data = await res.json();
    if (data.result !== "success" || !data.rates) throw new Error("Bad response");

    const rates = data.rates as Record<string, number>;

    return FOREX_PAIRS.map(({ pair, label, base, quote }) => {
      let rate: number;
      if (base === "USD") {
        rate = rates[quote] ?? 0;
      } else {
        // Convert: e.g. EUR/USD = 1 / (USD/EUR) = rates["USD"] / rates[base]
        const usdBase = rates[base];
        const usdQuote = quote === "USD" ? 1 : rates[quote] ?? 1;
        rate = usdBase ? usdQuote / usdBase : 0;
      }
      return { pair, label, rate, change24h: null };
    });
  } catch {
    return MOCK_FOREX;
  }
}
