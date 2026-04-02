export type AnalyseRequest = {
  imageBase64: string;
  imageMediaType: "image/jpeg" | "image/png" | "image/webp";
  asset: string;
  timeframe: string;
  mode: "swing" | "scalp";
  capitalFCFA: number;
  risquePct: number;
  ratioRR: number;
  marche: string;
  userProfile?: {
    prenom?: string;
    niveauTrading?: string;
    styleTrading?: string;
    profilPsycho?: string;
    marchePrefere?: string;
  };
};

export type AnalyseReason = {
  type: "positive" | "warning" | "negative";
  text: string;
};

export type AnalyseResponse = {
  id: string;
  signal: "BUY" | "SELL" | "NEUTRE";
  confidence: number;
  entry: number;
  stopLoss: number;
  tp1: number;
  tp2?: number;
  rrRatio: number;
  positionSize: number;
  positionUnit: string;
  riskFCFA: number;
  gainTP1FCFA: number;
  gainTP2FCFA?: number;
  reasons: AnalyseReason[];
  patternDetected: string;
  tendance: string;
  rsiInfo: string;
  macdInfo: string;
  bollingerInfo: string;
  disclaimer: string;
  timestamp: string;
  asset: string;
  timeframe: string;
  mode: string;
};
