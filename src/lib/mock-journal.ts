export type TradeEntry = {
  id: string;
  date: string;
  asset: string;
  direction: 'BUY' | 'SELL';
  entry: number;
  exit: number | null;
  pnlFCFA: number | null;
  rRealized: number | null;
  source: 'IA' | 'Manuel';
  status: 'closed' | 'open';
};

export const mockTrades: TradeEntry[] = [
  { id: '1', date: '01/04/26 18:32', asset: 'SOL/USDT', direction: 'BUY', entry: 183.20, exit: 191.80, pnlFCFA: 42000, rRealized: 2.3, source: 'IA', status: 'closed' },
  { id: '2', date: '31/03/26 11:05', asset: 'BTC/USDT', direction: 'SELL', entry: 82450, exit: 83100, pnlFCFA: -12500, rRealized: -0.7, source: 'Manuel', status: 'closed' },
  { id: '3', date: '30/03/26 18:15', asset: 'EUR/USD', direction: 'BUY', entry: 1.0823, exit: 1.0867, pnlFCFA: 18750, rRealized: 1.5, source: 'IA', status: 'closed' },
  { id: '4', date: '29/03/26 09:00', asset: 'ETH/USDT', direction: 'BUY', entry: 3240, exit: null, pnlFCFA: null, rRealized: null, source: 'IA', status: 'open' },
  { id: '5', date: '28/03/26 14:20', asset: 'SOL/USDT', direction: 'SELL', entry: 188.40, exit: 186.20, pnlFCFA: 9800, rRealized: 0.8, source: 'Manuel', status: 'closed' },
  { id: '6', date: '27/03/26 10:00', asset: 'BTC/USDT', direction: 'BUY', entry: 81200, exit: 83100, pnlFCFA: 28000, rRealized: 1.9, source: 'IA', status: 'closed' },
  { id: '7', date: '26/03/26 16:45', asset: 'ADA/USDT', direction: 'SELL', entry: 0.358, exit: 0.341, pnlFCFA: -8200, rRealized: -0.6, source: 'Manuel', status: 'closed' },
];

export const journalStats = {
  totalTrades: 47,
  winRate: 63,
  profitFactor: 1.84,
  totalPnlFCFA: 184500,
  bestTradeFCFA: 42000,
  bestTradeAsset: 'SOL/USDT',
};
