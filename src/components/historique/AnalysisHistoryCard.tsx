import Link from "next/link";
import { Lock } from "lucide-react";
import type { AnalysisEntry } from "@/types/analyse";

type Signal = "BUY" | "SELL" | "NEUTRE";
const signalLabel: Record<Signal, string> = { BUY: "ACHAT", SELL: "VENTE", NEUTRE: "NEUTRE" };
const signalColor: Record<Signal, { bg: string; color: string }> = {
  BUY: { bg: "rgba(20,241,149,0.12)", color: "var(--bullish)" },
  SELL: { bg: "rgba(244,63,94,0.12)", color: "var(--bearish)" },
  NEUTRE: { bg: "rgba(167,170,187,0.1)", color: "#A7AABB" },
};
function confidenceColor(v: number) {
  if (v >= 75) return "var(--bullish)";
  if (v >= 50) return "#F5A623";
  return "var(--bearish)";
}

export default function AnalysisHistoryCard({ analysis }: { analysis: AnalysisEntry }) {
  const sig = signalColor[analysis.signal];
  const [base] = analysis.asset.split("/");
  const Wrapper = analysis.locked ? "div" : Link;
  const wrapperProps = analysis.locked ? {} : { href: "/resultat" };

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className="card relative flex items-center gap-4 px-4 py-3 transition-colors"
      style={{
        opacity: analysis.locked ? 0.6 : 1,
        cursor: analysis.locked ? "default" : "pointer",
        borderRadius: "10px",
      }}
    >
      {/* Lock overlay */}
      {analysis.locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[10px]" style={{ zIndex: 1 }}>
          <Lock size={20} style={{ color: "#F5A623" }} />
        </div>
      )}

      {/* Asset logo */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 font-data"
        style={{ background: "var(--surface-highest)", color: "var(--text-primary)" }}
      >
        {base.slice(0, 3)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white">{analysis.asset}</span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}
          >
            {analysis.timeframe.toUpperCase()}
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize"
            style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}
          >
            {analysis.mode}
          </span>
        </div>
        <p className="text-xs font-data" style={{ color: "var(--text-secondary)" }}>
          {analysis.date}
        </p>
      </div>

      {/* Signal */}
      <span
        className="text-[10px] font-bold px-2 py-1 rounded-md flex-shrink-0"
        style={{ background: sig.bg, color: sig.color }}
      >
        {signalLabel[analysis.signal]}
      </span>

      {/* Confidence */}
      <div className="text-right flex-shrink-0 w-12">
        <p className="font-data text-sm font-bold" style={{ color: confidenceColor(analysis.confidence) }}>
          {analysis.confidence}%
        </p>
        <p className="text-[9px]" style={{ color: "var(--text-secondary)" }}>confiance</p>
      </div>

      {/* R réalisé */}
      {analysis.tracked && analysis.rRealized !== null && (
        <span
          className="text-xs font-data font-bold flex-shrink-0 px-2 py-0.5 rounded"
          style={{
            background: analysis.rRealized >= 0 ? "rgba(20,241,149,0.1)" : "rgba(244,63,94,0.1)",
            color: analysis.rRealized >= 0 ? "var(--bullish)" : "var(--bearish)",
          }}
        >
          {analysis.rRealized >= 0 ? "+" : ""}{analysis.rRealized}R
        </span>
      )}

      {/* CTA */}
      {!analysis.locked && (
        <span className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--bullish)" }}>
          Voir →
        </span>
      )}
    </Wrapper>
  );
}
