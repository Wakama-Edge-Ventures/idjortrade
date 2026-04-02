export type PlanKey = "BASIC" | "PRO" | "TRADER";

export type PlanConfig = {
  nameFr: string;
  monthlyFCFA: number;
  annualFCFA: number;
  quotaAnalyses: number;
  quotaIdjorMsg: number;
};

export const PLANS_CONFIG: Record<PlanKey, PlanConfig> = {
  BASIC: {
    nameFr: "Basic",
    monthlyFCFA: 4900,
    annualFCFA: 3900,
    quotaAnalyses: 20,
    quotaIdjorMsg: 30,
  },
  PRO: {
    nameFr: "Pro",
    monthlyFCFA: 14900,
    annualFCFA: 11900,
    quotaAnalyses: Infinity,
    quotaIdjorMsg: Infinity,
  },
  TRADER: {
    nameFr: "Trader",
    monthlyFCFA: 29900,
    annualFCFA: 23900,
    quotaAnalyses: Infinity,
    quotaIdjorMsg: Infinity,
  },
};
