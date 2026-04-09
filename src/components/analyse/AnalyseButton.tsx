"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";
import type { ChartUploadRef } from "./ChartUploadZone";
import type { RiskFormRef } from "./RiskForm";
import type { AnalyseResponse } from "@/app/api/analyse/types";
import { useLang } from "@/lib/LangContext";

export type AnalyseButtonRef = {
  trigger: () => void;
};

type ErrorType = "NOT_A_CHART" | "CHART_TOO_OLD" | "GENERIC" | null;

function ErrorModal({ type, message, onClose, t }: { type: ErrorType; message: string; onClose: () => void; t: (k: string) => string }) {
  if (!type) return null;
  const isNotChart  = type === "NOT_A_CHART";
  const accentColor = isNotChart ? "#F5A623" : "var(--bearish)";
  const borderColor = isNotChart ? "rgba(245,166,35,0.25)" : "rgba(244,63,94,0.25)";
  const bgColor     = isNotChart ? "rgba(245,166,35,0.06)" : "rgba(244,63,94,0.06)";
  const icon        = isNotChart ? "⚠️" : "🕐";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="max-w-sm w-full rounded-2xl p-6 space-y-4"
        style={{ background: "var(--surface-high)", border: `1px solid ${borderColor}`, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              {isNotChart ? t("analyse.notchart.title") : t("analyse.tooold.title")}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{message}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: bgColor, color: accentColor, border: `1px solid ${borderColor}` }}>
          {t("analyse.retry")}
        </button>
      </div>
    </div>
  );
}

function WarningModal({ message, onContinue, onModify, t }: {
  message: string;
  onContinue: () => void;
  onModify: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="max-w-sm w-full rounded-2xl p-6 space-y-4"
        style={{ background: "var(--surface-high)", border: "1px solid rgba(245,166,35,0.25)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">{t("analyse.warning.title")}</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{message}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onModify}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}>
            {t("analyse.modify")}
          </button>
          <button onClick={onContinue}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "rgba(245,166,35,0.15)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.3)" }}>
            {t("analyse.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AnalyseButtonProps {
  getFormData: () => ReturnType<RiskFormRef["getFormData"]>;
  getImageData: () => ReturnType<ChartUploadRef["getImageData"]>;
  mode: "swing" | "scalp" | "day";
}

const AnalyseButton = forwardRef<AnalyseButtonRef, AnalyseButtonProps>(
function AnalyseButton({ getFormData, getImageData, mode }: AnalyseButtonProps, ref) {
  const router = useRouter();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [warningResult, setWarningResult] = useState<AnalyseResponse | null>(null);

  useImperativeHandle(ref, () => ({ trigger: handleAnalyse }));

  const accentColor = mode === "scalp" ? "#F5A623" : mode === "day" ? "#0EA5E9" : "var(--bullish)";

  function navigateToResult(result: AnalyseResponse) {
    sessionStorage.setItem(result.id, JSON.stringify(result));
    router.push(`/resultat/${result.id}`);
  }

  async function handleAnalyse() {
    setError(null); setErrorType(null); setWarningResult(null);
    const imageData = getImageData();
    if (!imageData) { setError(t("analyse.err.noimage")); return; }
    const formData = getFormData();
    if (!formData) { setError(t("analyse.err.noasset")); return; }

    let userProfile: Record<string, string> | undefined;
    try {
      const stored = localStorage.getItem("idjor_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        userProfile = { prenom: parsed.prenom, niveauTrading: parsed.niveauTrading, styleTrading: parsed.styleTrading, marchePrefere: parsed.marchePrefere };
      }
    } catch { /* ignore */ }

    setLoading(true);
    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageData.base64, imageMediaType: imageData.mediaType,
          asset: formData.asset, timeframe: formData.timeframe, mode,
          capitalFCFA: formData.capitalFCFA, risquePct: formData.risquePct,
          ratioRR: formData.ratioRR, marche: formData.marche,
          productType: formData.productType, platform: formData.platform,
          currentPrice: formData.currentPrice, modeAnalyse: formData.modeAnalyse,
          userProfile,
        }),
      });
      const result: AnalyseResponse & { error?: string; message?: string } = await response.json();
      if (!response.ok || result.error) {
        const errType = result.error as ErrorType;
        if (errType === "NOT_A_CHART" || errType === "CHART_TOO_OLD") {
          setErrorType(errType); setError(result.message ?? result.error ?? t("analyse.err.generic"));
        } else {
          setErrorType("GENERIC"); setError(result.error || t("analyse.err.generic"));
        }
        return;
      }
      if (result.warning && result.warningMessage) { setWarningResult(result); return; }
      navigateToResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.network"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {(errorType === "NOT_A_CHART" || errorType === "CHART_TOO_OLD") && error && (
        <ErrorModal type={errorType} message={error} onClose={() => { setError(null); setErrorType(null); }} t={t} />
      )}
      {warningResult && (
        <WarningModal
          message={warningResult.warningMessage!}
          onContinue={() => { navigateToResult(warningResult); setWarningResult(null); }}
          onModify={() => setWarningResult(null)}
          t={t}
        />
      )}

      <div className="space-y-3">
        <button onClick={handleAnalyse} disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-display font-semibold text-base transition-all"
          style={{
            background: loading ? "var(--surface-highest)" : accentColor,
            color: loading ? "var(--text-secondary)" : "white",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}>
          {loading ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M10 2a8 8 0 0 1 8 8" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span style={{ color: accentColor }}>{t("analyse.loading")}</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="12" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("analyse.cta")}
            </>
          )}
        </button>

        {loading && (
          <p className="text-center text-xs" style={{ color: "var(--text-secondary)" }}>
            {t("analyse.loading.hint")}
          </p>
        )}

        {error && errorType === "GENERIC" && (
          <div className="px-4 py-3 rounded-xl text-xs font-medium"
            style={{ background: "var(--bearish-muted)", border: "1px solid rgba(244,63,94,0.2)", color: "var(--bearish)" }}>
            {error}
          </div>
        )}
      </div>
    </>
  );
});

export default AnalyseButton;
