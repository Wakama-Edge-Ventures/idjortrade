export type TradingMode = "scalp" | "day" | "swing" | "position";

export type TimeframeGroup = {
  mode: TradingMode;
  label: string;
  frames: string[];
};

export const TIMEFRAME_GROUPS: TimeframeGroup[] = [
  { mode: "scalp",    label: "Scalp",    frames: ["1m", "3m", "5m", "15m", "30m"] },
  { mode: "day",      label: "Day",      frames: ["1H", "2H", "4H"] },
  { mode: "swing",    label: "Swing",    frames: ["1D", "3D", "1W", "2W"] },
  { mode: "position", label: "Position", frames: ["1M", "3M", "6M", "1Y", "ALL"] },
];

export const ALL_TIMEFRAMES = TIMEFRAME_GROUPS.flatMap(g => g.frames);

/** Max age in minutes for each timeframe before a chart is considered stale */
export const FRESHNESS_LIMITS: Record<string, number> = {
  "1m":   5,
  "3m":   15,
  "5m":   30,
  "15m":  60,
  "30m":  120,
  "1H":   240,
  "2H":   480,
  "4H":   960,
  "1D":   2880,
  "3D":   7200,
  "1W":   20160,
  "2W":   40320,
  "1M":   86400,
  "3M":   259200,
  "6M":   518400,
  "1Y":   1036800,
  "ALL":  Infinity,
};

export function defaultTimeframeForMode(mode: string): string {
  switch (mode) {
    case "scalp":    return "5m";
    case "day":      return "4H";
    case "swing":    return "1D";
    case "position": return "1W";
    default:         return "1D";
  }
}
