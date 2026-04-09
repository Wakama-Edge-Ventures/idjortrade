"use client";

import { useLang } from "@/lib/LangContext";

interface AnalyseHeaderProps {
  title: string;
  subtitle: string;
  mode: "swing" | "scalp" | "day";
  accentColor: string;
}

export default function AnalyseHeader({ title, subtitle, mode, accentColor }: AnalyseHeaderProps) {
  const { t } = useLang();

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}15`, color: accentColor }}>
          {mode === "swing" ? (
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
              <path d="M2 14 C5 14 5 8 8 8 C11 8 11 14 14 14 C17 14 17 8 20 8"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : mode === "day" ? (
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="2"/>
              <line x1="11" y1="2" x2="11" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="11" y1="18" x2="11" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="2" y1="11" x2="4" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4.5" y1="4.5" x2="6" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="16" x2="17.5" y2="17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="17.5" y1="4.5" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="16" x2="4.5" y2="17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
              <polyline points="2,16 6,8 10,13 14,4 18,9 22,4"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(20,241,149,0.12)",
                color: "var(--bullish)",
                border: "1px solid rgba(20,241,149,0.2)",
              }}>
              {t("analyse.active")}
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl self-start sm:flex-shrink-0"
        style={{
          background: "rgba(245,166,35,0.06)",
          border: "1px solid rgba(245,166,35,0.15)",
        }}>
        <span style={{ color: "#F5A623" }}>⚠</span>
        <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
          {t("analyse.disclaimer")}
        </p>
      </div>
    </div>
  );
}
