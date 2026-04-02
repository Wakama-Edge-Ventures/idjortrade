"use client";

import { usePricing } from "@/context/PricingContext";

export default function PricingToggle() {
  const { isAnnual, setIsAnnual } = usePricing();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setIsAnnual(false)}
        className="text-sm font-semibold transition-colors"
        style={{ color: !isAnnual ? "var(--on-surface)" : "var(--on-surface-dim)" }}
      >
        Mensuel
      </button>

      {/* Toggle track */}
      <button
        onClick={() => setIsAnnual(!isAnnual)}
        className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
        style={{
          background: isAnnual ? "rgba(0,255,136,0.25)" : "var(--surface-highest)",
          border: isAnnual ? "1px solid rgba(0,255,136,0.4)" : "1px solid var(--outline)",
        }}
        aria-label="Basculer facturation annuelle"
      >
        {/* Knob */}
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
          style={{
            background: isAnnual ? "#00FF88" : "var(--on-surface-dim)",
            transform: isAnnual ? "translateX(26px)" : "translateX(2px)",
          }}
        />
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsAnnual(true)}
          className="text-sm font-semibold transition-colors"
          style={{ color: isAnnual ? "var(--on-surface)" : "var(--on-surface-dim)" }}
        >
          Annuel
        </button>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(0,255,136,0.12)",
            color: "#00FF88",
            border: "1px solid rgba(0,255,136,0.2)",
          }}
        >
          −20%
        </span>
      </div>
    </div>
  );
}
