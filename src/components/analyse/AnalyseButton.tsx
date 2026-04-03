"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChartUploadRef } from "./ChartUploadZone";
import type { RiskFormRef } from "./RiskForm";
import type { AnalyseResponse } from "@/app/api/analyse/types";

type ErrorType = "NOT_A_CHART" | "CHART_TOO_OLD" | "GENERIC" | null;

function ErrorModal({ type, message, onClose }: { type: ErrorType; message: string; onClose: () => void }) {
  if (!type) return null;
  const isNotChart = type === "NOT_A_CHART";
  const accentColor = isNotChart ? "#F5A623" : "#FF3B5C";
  const borderColor = isNotChart ? "rgba(245,166,35,0.25)" : "rgba(255,59,92,0.25)";
  const bgColor = isNotChart ? "rgba(245,166,35,0.06)" : "rgba(255,59,92,0.06)";
  const icon = isNotChart ? "⚠️" : "🕐";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}>
      <div className="max-w-sm w-full rounded-2xl p-6 space-y-4"
        style={{ background: "var(--surface-high)", border: `1px solid ${borderColor}`, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              {isNotChart ? "Ce n'est pas un graphique de trading" : "Graphique trop ancien"}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--on-surface-dim)" }}>
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: bgColor, color: accentColor, border: `1px solid ${borderColor}` }}>
          Réessayer
        </button>
      </div>
    </div>
  );
}

interface AnalyseButtonProps {
  getFormData: () => ReturnType<RiskFormRef["getFormData"]>;
  getImageData: () => ReturnType<ChartUploadRef["getImageData"]>;
  mode: "swing" | "scalp";
}

export default function AnalyseButton({ getFormData, getImageData, mode }: AnalyseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);

  const accentColor = mode === "scalp" ? "#F5A623" : "#00FF88";
  const accentBg = mode === "scalp" ? "#F5A623" : "#00FF88";

  async function handleAnalyse() {
    setError(null);
    setErrorType(null);

    const imageData = getImageData();
    if (!imageData) {
      setError("Veuillez d'abord charger un graphique.");
      return;
    }

    const formData = getFormData();
    if (!formData) {
      setError("Veuillez renseigner l'actif (ex: SOL/USDT).");
      return;
    }

    // Get user profile from localStorage
    let userProfile: Record<string, string> | undefined;
    try {
      const stored = localStorage.getItem("idjor_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        userProfile = {
          prenom: parsed.prenom,
          niveauTrading: parsed.niveauTrading,
          styleTrading: parsed.styleTrading,
          marchePrefere: parsed.marchePrefere,
        };
      }
    } catch {
      // ignore
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageData.base64,
          imageMediaType: imageData.mediaType,
          asset: formData.asset,
          timeframe: formData.timeframe,
          mode,
          capitalFCFA: formData.capitalFCFA,
          risquePct: formData.risquePct,
          ratioRR: formData.ratioRR,
          marche: formData.marche,
          userProfile,
        }),
      });

      const result: AnalyseResponse & { error?: string; message?: string } = await response.json();

      if (!response.ok || result.error) {
        const errType = result.error as ErrorType;
        if (errType === "NOT_A_CHART" || errType === "CHART_TOO_OLD") {
          setErrorType(errType);
          setError(result.message ?? result.error ?? "Erreur.");
        } else {
          setErrorType("GENERIC");
          setError(result.error || "Erreur lors de l'analyse. Réessayez.");
        }
        return;
      }

      // Store in sessionStorage
      sessionStorage.setItem(result.id, JSON.stringify(result));

      // Navigate to result page
      router.push(`/resultat/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    {(errorType === "NOT_A_CHART" || errorType === "CHART_TOO_OLD") && error && (
      <ErrorModal
        type={errorType}
        message={error}
        onClose={() => { setError(null); setErrorType(null); }}
      />
    )}
    <div className="space-y-3">
      <button
        onClick={handleAnalyse}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-headline font-bold text-base transition-all"
        style={{
          background: loading ? "var(--surface-highest)" : accentBg,
          color: loading ? "var(--on-surface-dim)" : "#0A0E1A",
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            {/* Spinner */}
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
              <path d="M10 2a8 8 0 0 1 8 8" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ color: accentColor }}>Claude analyse votre chart…</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="12" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Analyser ce chart
          </>
        )}
      </button>

      {loading && (
        <p className="text-center text-xs" style={{ color: "var(--on-surface-dim)" }}>
          Cela prend 5 à 15 secondes — Claude analyse les indicateurs...
        </p>
      )}

      {error && errorType === "GENERIC" && (
        <div className="px-4 py-3 rounded-xl text-xs font-medium"
          style={{ background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "#FF3B5C" }}>
          {error}
        </div>
      )}
    </div>
    </>
  );
}
