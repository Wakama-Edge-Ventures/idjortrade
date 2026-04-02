export type AnalysisEntry = {
  id: string;
  asset: string;
  timeframe: string;
  mode: 'swing' | 'scalp';
  signal: 'BUY' | 'SELL' | 'NEUTRE';
  confidence: number;
  date: string;
  rRealized: number | null;
  tracked: boolean;
  locked: boolean;
};

export const mockAnalyses: AnalysisEntry[] = [
  {
    id: '1',
    asset: 'SOL/USDT',
    timeframe: '5m',
    mode: 'scalp',
    signal: 'BUY',
    confidence: 78,
    date: '01 Avr · 18:32',
    rRealized: 2.3,
    tracked: true,
    locked: false,
  },
  {
    id: '2',
    asset: 'BTC/USDT',
    timeframe: 'D1',
    mode: 'swing',
    signal: 'SELL',
    confidence: 62,
    date: '31 Mar · 11:05',
    rRealized: -0.7,
    tracked: true,
    locked: false,
  },
  {
    id: '3',
    asset: 'EUR/USD',
    timeframe: 'H4',
    mode: 'swing',
    signal: 'BUY',
    confidence: 88,
    date: '30 Mar · 18:15',
    rRealized: 1.5,
    tracked: true,
    locked: false,
  },
  {
    id: '4',
    asset: 'ETH/USDT',
    timeframe: '15m',
    mode: 'scalp',
    signal: 'BUY',
    confidence: 71,
    date: '28 Mar · 09:00',
    rRealized: null,
    tracked: false,
    locked: true,
  },
  {
    id: '5',
    asset: 'XAU/USD',
    timeframe: 'D1',
    mode: 'swing',
    signal: 'NEUTRE',
    confidence: 54,
    date: '27 Mar · 14:20',
    rRealized: null,
    tracked: false,
    locked: true,
  },
  {
    id: '6',
    asset: 'GC=F',
    timeframe: 'H4',
    mode: 'swing',
    signal: 'SELL',
    confidence: 83,
    date: '26 Mar · 10:00',
    rRealized: null,
    tracked: false,
    locked: true,
  },
];
