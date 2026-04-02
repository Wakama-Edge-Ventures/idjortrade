import Link from "next/link";
import { mockResult } from "@/lib/mock-result";

const CIRCUMFERENCE = 2 * Math.PI * 42; // ~264

function SignalBadge({ signal }: { signal: "BUY" | "SELL" }) {
  const isBuy = signal === "BUY";
  return (
    <div
      className="inline-flex items-center px-8 py-4 rounded-2xl"
      style={{
        background: isBuy
          ? "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.05))"
          : "linear-gradient(135deg, rgba(255,59,92,0.15), rgba(255,59,92,0.05))",
        border: `1px solid ${isBuy ? "rgba(0,255,136,0.3)" : "rgba(255,59,92,0.3)"}`,
      }}
    >
      <span
        className="font-headline font-black text-4xl tracking-wide"
        style={{ color: isBuy ? "#00FF88" : "#FF3B5C" }}
      >
        {isBuy ? "ACHAT" : "VENTE"}
      </span>
    </div>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const offset = CIRCUMFERENCE * (1 - value / 100);
  const color = value > 75 ? "#00FF88" : value > 50 ? "#F5A623" : "#FF3B5C";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42"
          fill="none" stroke="rgba(0,255,136,0.08)" strokeWidth="8" />
        <circle cx="50" cy="50" r="42"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fill={color}
          fontFamily="JetBrains Mono, monospace"
          fontSize="20" fontWeight="700">
          {value}%
        </text>
      </svg>
      <p className="text-xs" style={{ color: "var(--on-surface-dim)" }}>Confiance IA</p>
    </div>
  );
}

function TradePlanCard({
  label, price, subLabel, color, glow
}: {
  label: string; price: string; subLabel: string; color: string; glow?: boolean
}) {
  return (
    <div
      className="card p-5 space-y-2"
      style={{
        borderLeft: `2px solid ${color}`,
        ...(glow ? { boxShadow: `0 0 20px ${color}22` } : {}),
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--on-surface-dim)" }}>
        {label}
      </p>
      <p className="font-mono-data text-2xl font-bold" style={{ color }}>
        {price}
      </p>
      <p className="text-xs" style={{ color: "var(--on-surface-dim)" }}>{subLabel}</p>
    </div>
  );
}

export default function ResultatPage() {
  const r = mockResult;
  const isBuy = r.signal === "BUY";
  const signalColor = isBuy ? "#00FF88" : "#FF3B5C";

  const slDistancePct = (((r.entry - r.stopLoss) / r.entry) * 100).toFixed(2);
  const slFCFA = r.riskFCFA.toLocaleString("fr-FR");
  const tp1Pct = (((r.tp1 - r.entry) / r.entry) * 100).toFixed(2);
  const tp2Pct = (((r.tp2 - r.entry) / r.entry) * 100).toFixed(2);

  const rrSegmentRisk = 100 / (1 + r.rrRatio);
  const rrSegmentReward = 100 - rrSegmentRisk;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header navigation */}
      <div className="flex items-center justify-between">
        <Link href="/swing"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
          style={{ color: "var(--on-surface-dim)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono-data text-sm font-bold text-white">{r.asset}</span>
          <span className="text-xs px-2 py-0.5 rounded-md font-semibold"
            style={{ background: "var(--surface-highest)", color: "var(--on-surface-dim)" }}>
            {r.timeframe.toUpperCase()}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md font-semibold capitalize"
            style={{ background: "var(--surface-highest)", color: "var(--on-surface-dim)" }}>
            {r.mode}
          </span>
        </div>
      </div>

      {/* Signal Hero */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <SignalBadge signal={r.signal} />
          <ConfidenceRing value={r.confidence} />
          <div className="flex flex-col gap-2 text-sm md:ml-auto text-center md:text-right">
            <p style={{ color: "var(--on-surface-dim)" }}>
              <span className="text-white font-semibold">{r.asset}</span> · {r.timeframe.toUpperCase()}
            </p>
            <p style={{ color: "var(--on-surface-dim)" }}>Mode: <span className="text-white capitalize">{r.mode}</span></p>
            <p style={{ color: "var(--on-surface-dim)" }}>{r.timestamp}</p>
          </div>
        </div>
      </div>

      {/* Trade Plan */}
      <div className="grid grid-cols-2 gap-3">
        <TradePlanCard
          label="Point d’entrée"
          price={`$${r.entry.toFixed(2)}`}
          subLabel="Prix suggéré"
          color={signalColor}
        />
        <TradePlanCard
          label="Stop-Loss"
          price={`$${r.stopLoss.toFixed(2)}`}
          subLabel={`−${slDistancePct}% · ${slFCFA} FCFA`}
          color="#FF3B5C"
        />
        <TradePlanCard
          label="Take Profit 1"
          price={`$${r.tp1.toFixed(2)}`}
          subLabel={`+${tp1Pct}% · ${r.gainTP1FCFA.toLocaleString("fr-FR")} FCFA`}
          color="#00CC6A"
        />
        <TradePlanCard
          label="Take Profit 2"
          price={`$${r.tp2.toFixed(2)}`}
          subLabel={`+${tp2Pct}% · ${r.gainTP2FCFA.toLocaleString("fr-FR")} FCFA`}
          color="#00FF88"
          glow
        />
      </div>

      {/* R/R + Sizing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RR Card */}
        <div className="card p-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Ratio Risque / Récompense
          </p>
          <p className="font-mono-data text-5xl font-bold text-white">
            1 : <span style={{ color: "#00FF88" }}>{r.rrRatio}</span>
          </p>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            <div className="h-full rounded-l-full"
              style={{ width: `${rrSegmentRisk}%`, background: "#FF3B5C" }} />
            <div className="h-full rounded-r-full"
              style={{ width: `${rrSegmentReward}%`, background: "#00FF88" }} />
          </div>
          <div className="flex justify-between text-xs" style={{ color: "var(--on-surface-dim)" }}>
            <span>Risque</span>
            <span>Récompense</span>
          </div>
        </div>

        {/* Sizing Card */}
        <div className="card p-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Taille de position
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-data text-4xl font-bold text-white">
              {r.positionSize}
            </span>
            <span className="text-lg" style={{ color: "var(--on-surface-dim)" }}>
              {r.positionUnit}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--on-surface-dim)" }}>Perte max</span>
              <span className="font-mono-data font-bold" style={{ color: "#FF3B5C" }}>
                −{r.riskFCFA.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--on-surface-dim)" }}>Gain TP1</span>
              <span className="font-mono-data font-bold" style={{ color: "#00CC6A" }}>
                +{r.gainTP1FCFA.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--on-surface-dim)" }}>Gain TP2</span>
              <span className="font-mono-data font-bold" style={{ color: "#00FF88" }}>
                +{r.gainTP2FCFA.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explication IA */}
      <div className="card p-6 space-y-4">
        <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
          <span>💡</span> Pourquoi ce signal ?
        </h3>
        <ul className="space-y-3">
          {r.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                style={{
                  background: reason.type === "positive"
                    ? "rgba(0,255,136,0.15)"
                    : "rgba(245,166,35,0.15)",
                  color: reason.type === "positive" ? "#00FF88" : "#F5A623",
                }}
              >
                {reason.type === "positive" ? "✓" : "⚠"}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface)" }}>
                {reason.text}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-4">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all"
          style={{
            border: "1px solid rgba(0,255,136,0.3)",
            color: "#00FF88",
          }}
        >
          💾 Sauvegarder dans le journal
        </button>
        <Link
          href="/swing"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all"
          style={{ background: "#00FF88", color: "#0A0E1A" }}
        >
          🔄 Nouvelle analyse
        </Link>
      </div>

      <p className="text-center text-xs pb-2" style={{ color: "var(--on-surface-dim)" }}>
        ⚠ Ce résultat est fourni à titre indicatif uniquement et ne constitue pas un conseil financier.
        Tradez responsablement.
      </p>

    </div>
  );
}
