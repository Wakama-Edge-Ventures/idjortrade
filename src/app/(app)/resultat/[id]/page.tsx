"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import type { AnalyseResponse, AnalyseReason } from "@/app/api/analyse/types";
import ConfidenceRing from "@/components/analyse/ConfidenceRing";

export default function ResultatPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [result, setResult] = useState<AnalyseResponse | null>(null);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(id);
      if (!raw) { setError(true); return; }
      setResult(JSON.parse(raw));
    } catch {
      setError(true);
    }
  }, [id]);

  async function saveToJournal() {
    if (!result || saving || saved) return;
    setSaving(true);
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analyseId: result.id,
          asset: result.asset,
          direction: result.signal === 'BUY' ? 'BUY' : 'SELL',
          entry: result.entry,
          source: 'IA',
          status: 'open',
        }),
      });
      if (res.ok) setSaved(true);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex flex-col items-center gap-6 text-center">
        <AlertTriangle size={40} style={{ color: "#F5A623" }} />
        <h1 className="font-headline font-bold text-xl text-white">Résultat introuvable</h1>
        <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>
          Cette analyse n'est plus disponible. Les résultats sont stockés localement dans votre navigateur.
        </p>
        <div className="flex gap-3">
          <Link href="/swing"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(0,255,136,0.12)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.3)" }}>
            Swing Trading
          </Link>
          <Link href="/scalp"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.3)" }}>
            Scalp Trading
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex flex-col items-center gap-4">
        <svg className="animate-spin" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="12" stroke="rgba(0,255,136,0.2)" strokeWidth="3" />
          <path d="M16 4a12 12 0 0 1 12 12" stroke="#00FF88" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>Chargement…</p>
      </div>
    );
  }

  const isSwing = result.mode === "swing";
  const accentColor = isSwing ? "#0EA5E9" : "#F5A623";

  const signalConfig = {
    BUY: { label: "ACHAT", color: "#00FF88", bg: "rgba(0,255,136,0.12)", border: "rgba(0,255,136,0.3)", Icon: TrendingUp },
    SELL: { label: "VENTE", color: "#FF3B5C", bg: "rgba(255,59,92,0.12)", border: "rgba(255,59,92,0.3)", Icon: TrendingDown },
    NEUTRE: { label: "NEUTRE", color: "#F5A623", bg: "rgba(245,166,35,0.12)", border: "rgba(245,166,35,0.3)", Icon: Minus },
  }[result.signal];

  const reasonColor = (type: AnalyseReason["type"]) =>
    type === "positive" ? "#00FF88" : type === "warning" ? "#F5A623" : "#FF3B5C";
  const reasonBg = (type: AnalyseReason["type"]) =>
    type === "positive" ? "rgba(0,255,136,0.08)" : type === "warning" ? "rgba(245,166,35,0.08)" : "rgba(255,59,92,0.08)";
  const reasonDot = (type: AnalyseReason["type"]) =>
    type === "positive" ? "▲" : type === "warning" ? "◆" : "▼";

  const fmt = (n: number) => n.toLocaleString("fr-FR");
  const fmtPrice = (n: number) => {
    if (n >= 1000) return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
    if (n >= 1) return n.toFixed(4);
    return n.toFixed(6);
  };

  const parsedDate = new Date(result.timestamp);
  const date = isNaN(parsedDate.getTime())
    ? result.timestamp
    : parsedDate.toLocaleString("fr-FR", {
        timeZone: "Africa/Abidjan",
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 pb-28">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: "var(--on-surface-dim)" }}>
          <ArrowLeft size={16} />
          Retour
        </button>
        <div className="text-right">
          <p className="text-xs font-mono-data" style={{ color: "var(--on-surface-dim)" }}>{date}</p>
          <p className="text-xs font-semibold" style={{ color: accentColor }}>
            {result.asset} · {result.timeframe} · {result.mode === "swing" ? "Swing" : "Scalp"}
          </p>
        </div>
      </div>

      {/* Signal Hero */}
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-6"
        style={{ border: `1px solid ${signalConfig.border}`, background: signalConfig.bg }}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl"
            style={{ background: signalConfig.bg, border: `1.5px solid ${signalConfig.border}` }}>
            <signalConfig.Icon size={20} style={{ color: signalConfig.color }} />
            <span className="font-headline font-bold text-xl tracking-widest" style={{ color: signalConfig.color }}>
              {signalConfig.label}
            </span>
          </div>
          <p className="text-xs text-center" style={{ color: "var(--on-surface-dim)" }}>
            {result.patternDetected}
          </p>
        </div>

        <div className="hidden sm:block w-px self-stretch" style={{ background: "var(--outline)" }} />

        <div className="flex flex-col items-center gap-1 text-center">
          <ConfidenceRing confidence={result.confidence} size={96} />
        </div>

        <div className="hidden sm:block w-px self-stretch" style={{ background: "var(--outline)" }} />

        <div className="flex-1 space-y-2 text-sm">
          <p className="font-semibold text-white">{result.tendance}</p>
          <div className="space-y-1">
            <p className="text-xs font-mono-data" style={{ color: "var(--on-surface-dim)" }}>
              RSI <span className="text-white">{result.rsiInfo}</span>
            </p>
            <p className="text-xs font-mono-data" style={{ color: "var(--on-surface-dim)" }}>
              MACD <span className="text-white">{result.macdInfo}</span>
            </p>
            <p className="text-xs font-mono-data" style={{ color: "var(--on-surface-dim)" }}>
              Bollinger <span className="text-white">{result.bollingerInfo}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Trade Plan Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Entry */}
        <div className="card p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
            Entrée
          </p>
          <p className="font-headline font-bold text-lg text-white font-mono-data">
            {fmtPrice(result.entry)}
          </p>
        </div>

        {/* Stop Loss */}
        <div className="card p-4 space-y-1" style={{ border: "1px solid rgba(255,59,92,0.2)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
            Stop Loss
          </p>
          <p className="font-headline font-bold text-lg font-mono-data" style={{ color: "#FF3B5C" }}>
            {fmtPrice(result.stopLoss)}
          </p>
        </div>

        {/* TP1 */}
        <div className="card p-4 space-y-1" style={{ border: "1px solid rgba(0,255,136,0.2)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
            Take Profit 1
          </p>
          <p className="font-headline font-bold text-lg font-mono-data" style={{ color: "#00FF88" }}>
            {fmtPrice(result.tp1)}
          </p>
          <p className="text-xs font-mono-data" style={{ color: "#00FF88" }}>
            +{fmt(result.gainTP1FCFA)} FCFA
          </p>
        </div>

        {/* TP2 or RR */}
        {result.tp2 ? (
          <div className="card p-4 space-y-1" style={{ border: "1px solid rgba(0,255,136,0.12)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
              Take Profit 2
            </p>
            <p className="font-headline font-bold text-lg font-mono-data" style={{ color: "#00FF88" }}>
              {fmtPrice(result.tp2)}
            </p>
            {result.gainTP2FCFA && (
              <p className="text-xs font-mono-data" style={{ color: "#00FF88" }}>
                +{fmt(result.gainTP2FCFA)} FCFA
              </p>
            )}
          </div>
        ) : (
          <div className="card p-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
              Ratio R/R
            </p>
            <p className="font-headline font-bold text-lg font-mono-data text-white">
              1:{result.rrRatio}
            </p>
          </div>
        )}
      </div>

      {/* Risk & Position Size */}
      <div className="card p-5 flex flex-col sm:flex-row items-center gap-5"
        style={{ border: "1px solid var(--outline)" }}>
        <div className="flex-1 text-center space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
            Risque engagé
          </p>
          <p className="font-headline font-bold text-xl font-mono-data" style={{ color: "#FF3B5C" }}>
            {fmt(result.riskFCFA)} FCFA
          </p>
        </div>
        <div className="hidden sm:block w-px self-stretch" style={{ background: "var(--outline)" }} />
        <div className="flex-1 text-center space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
            Taille de position
          </p>
          <p className="font-headline font-bold text-xl font-mono-data text-white">
            {result.positionSize} <span className="text-sm font-normal">{result.positionUnit}</span>
          </p>
        </div>
        <div className="hidden sm:block w-px self-stretch" style={{ background: "var(--outline)" }} />
        <div className="flex-1 text-center space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
            Gain cible (TP1)
          </p>
          <p className="font-headline font-bold text-xl font-mono-data" style={{ color: "#00FF88" }}>
            {fmt(result.gainTP1FCFA)} FCFA
          </p>
        </div>
      </div>

      {/* Reasons */}
      <div className="card p-5 space-y-3">
        <h3 className="font-headline font-bold text-sm text-white">
          Explication de l'analyse
        </h3>
        <div className="space-y-2">
          {result.reasons.map((r, i) => (
            <div key={i}
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: reasonBg(r.type), border: `1px solid ${reasonColor(r.type)}22` }}>
              <span className="text-[10px] mt-0.5 flex-shrink-0" style={{ color: reasonColor(r.type) }}>
                {reasonDot(r.type)}
              </span>
              <span style={{ color: r.type === "positive" ? "#E2FFF2" : r.type === "warning" ? "#FFF8EC" : "#FFE8EC" }}>
                {r.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded-xl text-xs"
        style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", color: "var(--on-surface-dim)" }}>
        ⚠ {result.disclaimer}
      </div>

      {/* Sticky Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 py-4 md:left-[220px]"
        style={{ background: "linear-gradient(to top, var(--surface) 70%, transparent)" }}>
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() => router.push(result.mode === "swing" ? "/swing" : "/scalp")}
            className="flex-1 py-3 rounded-2xl text-sm font-bold font-headline transition-all"
            style={{ background: "var(--surface-highest)", color: "var(--on-surface-dim)", border: "1px solid var(--outline)" }}>
            Nouvelle analyse
          </button>
          <button
            onClick={() => {
              const text = `Signal: ${signalConfig.label} | ${result.asset} ${result.timeframe}\nEntrée: ${fmtPrice(result.entry)} | SL: ${fmtPrice(result.stopLoss)} | TP1: ${fmtPrice(result.tp1)}\nConfiance: ${result.confidence}%\nVia IdjorTrade`;
              navigator.clipboard.writeText(text).catch(() => {});
            }}
            className="flex-1 py-3 rounded-2xl text-sm font-bold font-headline transition-all"
            style={{ background: signalConfig.bg, color: signalConfig.color, border: `1px solid ${signalConfig.border}` }}>
            Copier le signal
          </button>
          {/* Save to journal button — disabled for NEUTRE signals */}
          <button
            onClick={saveToJournal}
            disabled={saving || saved || result.signal === 'NEUTRE'}
            className="flex-1 py-3 rounded-2xl text-sm font-bold font-headline transition-all"
            style={{
              background: saved ? "rgba(0,255,136,0.12)" : "rgba(0,255,136,0.08)",
              color: "#00FF88",
              border: "1px solid rgba(0,255,136,0.3)",
              opacity: result.signal === 'NEUTRE' ? 0.4 : 1,
            }}
          >
            {saved ? "✓ Ajouté au journal" : saving ? "Ajout…" : "📌 Sauvegarder"}
          </button>
        </div>
      </div>

    </div>
  );
}
