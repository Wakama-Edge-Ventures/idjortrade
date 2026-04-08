export interface AnalysisEntry {
  id: string;
  asset: string;
  timeframe: string;
  mode: "swing" | "scalp";
  signal: "BUY" | "SELL" | "NEUTRE";
  confidence: number;
  date: string;
  rRealized: number | null;
  tracked: boolean;
  locked: boolean;
}
