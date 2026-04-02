"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChartUploadRef } from "./ChartUploadZone";
import type { RiskFormRef } from "./RiskForm";
import type { AnalyseResponse } from "@/app/api/analyse/types";

interface AnalyseButtonProps {
  getFormData: () => ReturnType<RiskFormRef["getFormData"]>;
  getImageData: () => ReturnType<ChartUploadRef["getImageData"]>;
  mode: "swing" | "scalp";
}

export default function AnalyseButton({ getFormData, getImageData, mode }: AnalyseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accentColor = mode === "scalp" ? "#F5A623" : "#00FF88";
  const accentBg = mode === "scalp" ? "#F5A623" : "#00FF88";

  async function handleAnalyse() {
    setError(null);

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

      const result: AnalyseResponse & { error?: string } = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Erreur lors de l'analyse. Réessayez.");
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

      {error && (
        <div className="px-4 py-3 rounded-xl text-xs font-medium"
          style={{ background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "#FF3B5C" }}>
          {error}
        </div>
      )}
    </div>
  );
}
