export default function PaymentBadges() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Wave */}
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: "rgba(0,102,255,0.12)", color: "#0066FF", border: "1px solid rgba(0,102,255,0.2)" }}
        >
          Wave
        </div>

        {/* Orange Money */}
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: "rgba(255,102,0,0.12)", color: "#FF6600", border: "1px solid rgba(255,102,0,0.2)" }}
        >
          Orange Money
        </div>

        {/* MTN */}
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: "rgba(255,204,0,0.12)", color: "#FFCC00", border: "1px solid rgba(255,204,0,0.2)" }}
        >
          MTN
        </div>

        {/* Visa */}
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-bold italic"
          style={{ background: "rgba(26,31,79,0.6)", color: "#A8B4E8", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          VISA
        </div>

        {/* Mastercard */}
        <div
          className="px-2 py-1.5 rounded-lg flex items-center gap-0.5"
          style={{ background: "var(--surface-highest)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-5 h-5 rounded-full" style={{ background: "#EB001B" }} />
          <div className="w-5 h-5 rounded-full -ml-2.5" style={{ background: "#F79E1B", opacity: 0.9 }} />
        </div>

        {/* Crypto */}
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: "rgba(245,166,35,0.1)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.2)" }}
        >
          ₿ Crypto
        </div>
      </div>

      <p className="text-xs text-center" style={{ color: "var(--on-surface-dim)" }}>
        Paiement 100% sécurisé · Sans carte pour Mobile Money
      </p>
    </div>
  );
}
