import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { AnalyseReason } from "@/app/api/analyse/types";
import ConfidenceRing from "@/components/analyse/ConfidenceRing";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import WeexBanner from "@/components/shared/WeexBanner";

const CIRCUMFERENCE = 2 * Math.PI * 42;

function SignalBadge({ signal }: { signal: "BUY" | "SELL" | "NEUTRE" }) {
  const config = {
    BUY:    { label: "ACHAT",  color: "var(--bullish)", bg: "rgba(20,241,149,0.12)", border: "rgba(20,241,149,0.3)", Icon: TrendingUp },
    SELL:   { label: "VENTE",  color: "var(--bearish)", bg: "rgba(244,63,94,0.12)",  border: "rgba(244,63,94,0.3)",  Icon: TrendingDown },
    NEUTRE: { label: "NEUTRE", color: "#F5A623",        bg: "rgba(245,166,35,0.12)", border: "rgba(245,166,35,0.3)", Icon: Minus },
  }[signal];
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl"
      style={{ background: config.bg, border: `1.5px solid ${config.border}` }}>
      <config.Icon size={20} style={{ color: config.color }} />
      <span className="font-display font-semibold text-xl tracking-widest" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
}

function TradePlanCard({ label, price, sub, color, glow }: {
  label: string; price: string; sub?: string; color: string; glow?: boolean;
}) {
  return (
    <div className="card p-4 space-y-1"
      style={{ borderLeft: `2px solid ${color}`, ...(glow ? { boxShadow: `0 0 20px ${color}22` } : {}) }}>
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>{label}</p>
      <p className="font-data font-semibold text-lg" style={{ color }}>{price}</p>
      {sub && <p className="text-xs font-data" style={{ color: "var(--text-secondary)" }}>{sub}</p>}
    </div>
  );
}

const fmt = (n: number | null | undefined) =>
  n == null || isNaN(n) ? "—" : n.toLocaleString("fr-FR");

const fmtPrice = (n: number | null | undefined) => {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1000) return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(4);
  return n.toFixed(6);
};

export default async function ResultatPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const analyse = await prisma.analyse.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!analyse) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(153,69,255,0.1)", color: "var(--sol-purple)", fontSize: 28 }}>
          📊
        </div>
        <h1 className="font-display font-semibold text-xl text-white">Aucune analyse</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Upload ton premier chart pour obtenir un signal IA.
        </p>
        <div className="flex gap-3">
          <Link href="/swing"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(3,225,255,0.1)", color: "#03E1FF", border: "1px solid rgba(3,225,255,0.3)" }}>
            Swing Trading
          </Link>
          <Link href="/scalp"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(245,166,35,0.1)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.3)" }}>
            Scalp Trading
          </Link>
        </div>
      </div>
    );
  }

  const signal = analyse.signal as "BUY" | "SELL" | "NEUTRE";
  const isBuy = signal === "BUY";
  const signalColor = isBuy ? "var(--bullish)" : signal === "SELL" ? "var(--bearish)" : "#F5A623";

  const reasons = (analyse.reasons ?? []) as AnalyseReason[];

  const slDistancePct = analyse.entry > 0
    ? (Math.abs(analyse.entry - analyse.stopLoss) / analyse.entry * 100).toFixed(2)
    : "—";
  const tp1Pct = analyse.entry > 0
    ? (((analyse.tp1 - analyse.entry) / analyse.entry) * 100).toFixed(2)
    : "—";

  const date = new Date(analyse.createdAt).toLocaleString("fr-FR", {
    timeZone: "Africa/Abidjan",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const reasonColor = (type: AnalyseReason["type"]) =>
    type === "positive" ? "var(--bullish)" : type === "warning" ? "#F5A623" : "var(--bearish)";
  const reasonBg = (type: AnalyseReason["type"]) =>
    type === "positive" ? "var(--bullish-muted)" : type === "warning" ? "rgba(245,166,35,0.08)" : "var(--bearish-muted)";
  const reasonDot = (type: AnalyseReason["type"]) =>
    type === "positive" ? "▲" : type === "warning" ? "◆" : "▼";

  const rrSegmentRisk = 100 / (1 + analyse.rrRatio);
  const rrSegmentReward = 100 - rrSegmentRisk;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/swing"
          className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors"
          style={{ color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retour
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-data text-sm font-bold text-white">{analyse.asset}</span>
          <span className="text-xs px-2 py-0.5 rounded-md font-semibold"
            style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}>
            {analyse.timeframe.toUpperCase()}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md font-semibold capitalize"
            style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}>
            {analyse.mode}
          </span>
        </div>
      </div>

      {/* Signal Hero */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <SignalBadge signal={signal} />
          <ConfidenceRing confidence={analyse.confidence} size={96} />
          <div className="flex flex-col gap-2 text-sm md:ml-auto text-center md:text-right">
            <p style={{ color: "var(--text-secondary)" }}>
              <span className="text-white font-semibold">{analyse.asset}</span> · {analyse.timeframe.toUpperCase()}
            </p>
            <p style={{ color: "var(--text-secondary)" }}>Mode: <span className="text-white capitalize">{analyse.mode}</span></p>
            <p style={{ color: "var(--text-secondary)" }}>{date}</p>
          </div>
        </div>
        {analyse.tendance && (
          <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            {analyse.tendance}
          </p>
        )}
      </div>

      {/* Trade Plan */}
      <div className="grid grid-cols-2 gap-3">
        <TradePlanCard
          label="Point d'entrée"
          price={fmtPrice(analyse.entry)}
          sub="Prix suggéré"
          color={signalColor}
        />
        <TradePlanCard
          label="Stop-Loss"
          price={fmtPrice(analyse.stopLoss)}
          sub={`−${slDistancePct}% · ${fmt(analyse.riskFCFA)} FCFA`}
          color="#F43F5E"
        />
        <TradePlanCard
          label="Take Profit 1"
          price={fmtPrice(analyse.tp1)}
          sub={`+${tp1Pct}% · ${fmt(analyse.gainTP1FCFA)} FCFA`}
          color="#00CC6A"
        />
        {analyse.tp2 ? (
          <TradePlanCard
            label="Take Profit 2"
            price={fmtPrice(analyse.tp2)}
            sub={analyse.gainTP2FCFA ? `+${fmt(analyse.gainTP2FCFA)} FCFA` : undefined}
            color="var(--bullish)"
            glow
          />
        ) : (
          <TradePlanCard
            label="Ratio R/R"
            price={`1 : ${analyse.rrRatio}`}
            color="var(--text-primary)"
          />
        )}
      </div>

      {/* R/R + Sizing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
            Ratio Risque / Récompense
          </p>
          <p className="font-data text-5xl font-bold text-white">
            1 : <span style={{ color: "var(--bullish)" }}>{analyse.rrRatio}</span>
          </p>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            <div className="h-full rounded-l-full"
              style={{ width: `${rrSegmentRisk}%`, background: "var(--bearish)" }} />
            <div className="h-full rounded-r-full"
              style={{ width: `${rrSegmentReward}%`, background: "var(--sol-gradient)" }} />
          </div>
          <div className="flex justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
            <span>Risque</span>
            <span>Récompense</span>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
            Taille de position
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-data text-4xl font-bold text-white">{analyse.positionSize}</span>
            <span className="text-lg" style={{ color: "var(--text-secondary)" }}>{analyse.positionUnit}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--text-secondary)" }}>Perte max</span>
              <span className="font-data font-bold" style={{ color: "var(--bearish)" }}>
                −{fmt(analyse.riskFCFA)} FCFA
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-secondary)" }}>Gain TP1</span>
              <span className="font-data font-bold" style={{ color: "#00CC6A" }}>
                +{fmt(analyse.gainTP1FCFA)} FCFA
              </span>
            </div>
            {analyse.gainTP2FCFA && (
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Gain TP2</span>
                <span className="font-data font-bold" style={{ color: "var(--bullish)" }}>
                  +{fmt(analyse.gainTP2FCFA)} FCFA
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <div className="card p-6 space-y-4">
          <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            <span>💡</span> Pourquoi ce signal ?
          </h3>
          <ul className="space-y-3">
            {reasons.map((reason, i) => (
              <li key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
                style={{ background: reasonBg(reason.type), border: `1px solid ${reasonColor(reason.type)}22` }}>
                <span className="text-[10px] mt-0.5 flex-shrink-0" style={{ color: reasonColor(reason.type) }}>
                  {reasonDot(reason.type)}
                </span>
                <span style={{ color: reason.type === "positive" ? "#E2FFF2" : reason.type === "warning" ? "#FFF8EC" : "#FFE8EC" }}>
                  {reason.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weex Affiliation */}
      <WeexBanner />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-4">
        <Link
          href={analyse.mode === "swing" ? "/swing" : "/scalp"}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold"
          style={{ background: "var(--sol-gradient)", color: "white" }}
        >
          🔄 Nouvelle analyse
        </Link>
        <Link
          href="/historique"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold"
          style={{ border: "1px solid rgba(20,241,149,0.3)", color: "var(--bullish)" }}
        >
          📋 Voir l'historique
        </Link>
      </div>

      <p className="text-center text-xs pb-2" style={{ color: "var(--text-secondary)" }}>
        ⚠ Ce résultat est fourni à titre indicatif uniquement et ne constitue pas un conseil financier.
        Tradez responsablement.
      </p>
    </div>
  );
}
