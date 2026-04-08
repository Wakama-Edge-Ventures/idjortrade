"use client";

import { usePricing } from "@/context/PricingContext";

export default function PricingToggle() {
  const { isAnnual, setIsAnnual } = usePricing();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setIsAnnual(false)}
        className="text-sm font-semibold transition-colors"
        style={{ color: !isAnnual ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        Mensuel
      </button>

      {/* Toggle track */}
      <button
        onClick={() => setIsAnnual(!isAnnual)}
        className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
        style={{
          background: isAnnual ? "rgba(20,241,149,0.25)" : "var(--surface-highest)",
          border: isAnnual ? "1px solid rgba(153,69,255,0.5)" : "1px solid var(--border)",
        }}
        aria-label="Basculer facturation annuelle"
      >
        {/* Knob */}
        <span
          className="absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-200"
          style={{
            background: isAnnual ? "var(--bullish)" : "var(--text-secondary)",
            transform: isAnnual ? "translateX(20px)" : "translateX(0px)",
          }}
        />
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsAnnual(true)}
          className="text-sm font-semibold transition-colors"
          style={{ color: isAnnual ? "var(--text-primary)" : "var(--text-secondary)" }}
        >
          Annuel
        </button>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(20,241,149,0.12)",
            color: "var(--bullish)",
            border: "1px solid rgba(20,241,149,0.2)",
          }}
        >
          −20%
        </span>
      </div>
    </div>
  );
}
