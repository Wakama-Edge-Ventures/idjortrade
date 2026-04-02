"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { usePricing } from "@/context/PricingContext";
import type { Plan } from "@/lib/mock-plans";
import PaymentModal from "@/components/plans/PaymentModal";
import type { PlanKey } from "@/lib/plans-config";
import Link from "next/link";

export default function PlanCard({ plan }: { plan: Plan }) {
  const { isAnnual } = usePricing();
  const [showModal, setShowModal] = useState(false);
  const price = isAnnual ? plan.priceAnnualFCFA : plan.priceFCFA;
  const isFree = plan.id === "free";
  const isPro = plan.id === "pro";
  const isTrader = plan.id === "trader";

  let cardBg = "var(--surface-low)";
  let cardBorder = "1px solid rgba(255,255,255,0.05)";
  let cardStyle: React.CSSProperties = {};

  if (isPro) {
    cardBg = "linear-gradient(135deg, #0A1A0F 0%, #0E1320 100%)";
    cardBorder = "1px solid rgba(0,255,136,0.25)";
    cardStyle = { boxShadow: "0 0 30px rgba(0,255,136,0.12)", transform: "scale(1.02)" };
  } else if (isTrader) {
    cardBg = "linear-gradient(135deg, #1A1200 0%, #1A1208 100%)";
    cardBorder = "1px solid rgba(245,166,35,0.2)";
  }

  const ctaStyles: Record<string, React.CSSProperties> = {
    primary: { background: "#00FF88", color: "#0A0E1A" },
    outline: { border: "1px solid rgba(0,255,136,0.3)", color: "#00FF88" },
    amber: { background: "#F5A623", color: "#0A0E1A" },
    ghost: { border: "1px solid rgba(255,255,255,0.08)", color: "var(--on-surface-dim)" },
  };

  return (
    <>
      <div
        className="relative flex flex-col rounded-2xl p-6 gap-5"
        style={{ background: cardBg, border: cardBorder, ...cardStyle }}
      >
        {/* Badge */}
        {plan.badge && (
          <span
            className="absolute -top-3 right-4 text-[10px] font-bold px-3 py-1 rounded-full"
            style={
              isPro
                ? { background: "#F5A623", color: "#0A0E1A" }
                : { background: "rgba(245,166,35,0.15)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.3)" }
            }
          >
            {plan.badge}
          </span>
        )}

        {/* Header */}
        <div>
          <p
            className="text-xs font-bold tracking-widest mb-2"
            style={{ color: isPro ? "#00FF88" : isTrader ? "#F5A623" : "var(--on-surface-dim)" }}
          >
            {plan.name}
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            {isFree ? (
              <span className="font-mono-data text-4xl font-bold text-white">Gratuit</span>
            ) : (
              <>
                <span className="font-mono-data text-4xl font-bold text-white">
                  {price.toLocaleString("fr-FR")}
                </span>
                <span className="text-sm" style={{ color: "var(--on-surface-dim)" }}>FCFA/mois</span>
              </>
            )}
          </div>
          {isAnnual && !isFree && (
            <p className="text-xs line-through" style={{ color: "var(--on-surface-dim)" }}>
              {plan.priceFCFA.toLocaleString("fr-FR")} FCFA/mois
            </p>
          )}
          <p className="text-xs mt-1.5" style={{ color: "var(--on-surface-dim)" }}>
            {plan.tagline}
          </p>
        </div>

        {/* CTA */}
        {isFree ? (
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-xl text-sm font-bold text-center block transition-all"
            style={ctaStyles[plan.ctaStyle]}
          >
            {plan.cta}
          </Link>
        ) : (
          <button
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={ctaStyles[plan.ctaStyle]}
            onClick={() => setShowModal(true)}
          >
            {plan.cta}
          </button>
        )}

        {/* Separator */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

        {/* Features */}
        <ul className="space-y-2.5">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm">
              {f.included ? (
                <CheckCircle2 size={15} style={{ color: "#00FF88", flexShrink: 0 }} />
              ) : (
                <XCircle size={15} style={{ color: "var(--outline)", flexShrink: 0 }} />
              )}
              <span style={{ color: f.included ? "var(--on-surface)" : "var(--on-surface-dim)" }}>
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && !isFree && (
        <PaymentModal
          plan={plan.id.toUpperCase() as PlanKey}
          annual={isAnnual}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
