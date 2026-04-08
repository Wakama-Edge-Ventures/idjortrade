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
  const [hovered, setHovered] = useState(false);
  const price = isAnnual ? plan.priceAnnualFCFA : plan.priceFCFA;
  const isFree    = plan.id === "free";
  const isStarter = plan.id === "starter";
  const isPro     = plan.id === "pro";
  const isTrader  = plan.id === "trader";

  let cardBg     = "var(--surface-low)";
  let cardBorder = hovered ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.05)";
  let cardShadow = hovered ? "0 8px 32px rgba(0,0,0,0.4)" : "none";

  if (isPro) {
    cardBg     = "linear-gradient(135deg, #0A1A0F 0%, #0E1320 100%)";
    cardBorder = hovered ? "1px solid rgba(20,241,149,0.5)" : "1px solid rgba(20,241,149,0.25)";
    cardShadow = hovered ? "0 8px 40px rgba(20,241,149,0.2)" : "0 0 30px rgba(20,241,149,0.12)";
  } else if (isTrader) {
    cardBg     = "linear-gradient(135deg, #1A1200 0%, #1A1208 100%)";
    cardBorder = hovered ? "1px solid rgba(245,166,35,0.5)" : "1px solid rgba(245,166,35,0.2)";
    cardShadow = hovered ? "0 8px 40px rgba(245,166,35,0.18)" : "none";
  } else if (isStarter) {
    cardBorder = hovered ? "1px solid rgba(14,165,233,0.5)" : "1px solid rgba(14,165,233,0.2)";
    cardShadow = hovered ? "0 8px 32px rgba(14,165,233,0.15)" : "none";
  }

  const cardStyle: React.CSSProperties = {
    background: cardBg,
    border: cardBorder,
    boxShadow: cardShadow,
    transform: isPro ? (hovered ? "translateY(-6px) scale(1.02)" : "scale(1.02)") : (hovered ? "translateY(-6px)" : "none"),
    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
  };

  // Couleur d'accent par plan — même style outlined pour tous
  const accentColor = isPro
    ? "var(--bullish)"
    : isTrader
    ? "#F5A623"
    : isStarter
    ? "#0EA5E9"
    : isFree
    ? "var(--text-secondary)"
    : "var(--bullish)";

  const accentBorder = isPro
    ? "rgba(20,241,149,0.35)"
    : isTrader
    ? "rgba(245,166,35,0.35)"
    : isStarter
    ? "rgba(14,165,233,0.35)"
    : "rgba(255,255,255,0.10)";

  const accentBorderHover = isPro
    ? "rgba(20,241,149,0.65)"
    : isTrader
    ? "rgba(245,166,35,0.65)"
    : isStarter
    ? "rgba(14,165,233,0.65)"
    : "rgba(255,255,255,0.20)";

  const ctaStyle: React.CSSProperties = {
    border: `1px solid ${hovered ? accentBorderHover : accentBorder}`,
    color: accentColor,
    background: "transparent",
    transition: "border-color 200ms ease, background 200ms ease",
  };

  const nameColor = accentColor;

  return (
    <>
      <div
        className="relative flex flex-col rounded-2xl p-6 gap-5 h-full"
        style={cardStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Badge */}
        {plan.badge && (
          <span
            className="absolute -top-3 right-4 text-[10px] font-bold px-3 py-1 rounded-full"
            style={
              isPro
                ? { background: "#F5A623", color: "white" }
                : isStarter
                ? { background: "rgba(14,165,233,0.15)", color: "#0EA5E9", border: "1px solid rgba(14,165,233,0.3)" }
                : { background: "rgba(245,166,35,0.15)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.3)" }
            }
          >
            {plan.badge}
          </span>
        )}

        {/* Header */}
        <div>
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: nameColor }}>
            {plan.name}
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            {isFree ? (
              <span className="font-data text-4xl font-bold text-white">Gratuit</span>
            ) : (
              <>
                <span className="font-data text-4xl font-bold text-white">
                  {price.toLocaleString("fr-FR")}
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>FCFA/mois</span>
              </>
            )}
          </div>
          {isAnnual && !isFree && (
            <p className="text-xs line-through" style={{ color: "var(--text-secondary)" }}>
              {plan.priceFCFA.toLocaleString("fr-FR")} FCFA/mois
            </p>
          )}
          <p className="text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>
            {plan.tagline}
          </p>
        </div>

        {/* CTA */}
        {isFree ? (
          <Link
            href="/dashboard"
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-center block"
            style={ctaStyle}
          >
            {plan.cta}
          </Link>
        ) : (
          <button
            className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
            style={ctaStyle}
            onClick={() => setShowModal(true)}
          >
            {plan.cta}
          </button>
        )}

        {/* Separator */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

        {/* Features */}
        <ul className="space-y-2.5 flex-1">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm">
              {f.included ? (
                <CheckCircle2 size={15} style={{ color: "var(--bullish)", flexShrink: 0 }} />
              ) : (
                <XCircle size={15} style={{ color: "var(--border)", flexShrink: 0 }} />
              )}
              <span style={{ color: f.included ? "var(--text-primary)" : "var(--text-secondary)" }}>
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
