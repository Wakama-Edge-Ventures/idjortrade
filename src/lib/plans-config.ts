export type PlanKey = "STARTER" | "BASIC" | "PRO" | "TRADER";

export type PlanConfig = {
  nameFr: string;
  monthlyFCFA: number;
  annualFCFA: number;
  quotaAnalyses: number;
  quotaIdjorMsg: number;
};

export const PLANS_CONFIG: Record<PlanKey, PlanConfig> = {
  STARTER: {
    nameFr: "Starter",
    monthlyFCFA: 2900,
    annualFCFA: 2300,
    quotaAnalyses: 3,
    quotaIdjorMsg: 20,
  },
  BASIC: {
    nameFr: "Basic",
    monthlyFCFA: 7900,
    annualFCFA: 6300,
    quotaAnalyses: 10,
    quotaIdjorMsg: 50,
  },
  PRO: {
    nameFr: "Pro",
    monthlyFCFA: 19900,
    annualFCFA: 15900,
    quotaAnalyses: 30,
    quotaIdjorMsg: Infinity,
  },
  TRADER: {
    nameFr: "Trader",
    monthlyFCFA: 39900,
    annualFCFA: 31900,
    quotaAnalyses: Infinity,
    quotaIdjorMsg: Infinity,
  },
};
