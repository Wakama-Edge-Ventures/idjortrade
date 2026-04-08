"use client";

import { useEffect, useState } from "react";

const PROMPTS = [
  "$ Analyse BTC/USDT H4 — signal d'entrée optimal ?",
  "$ XAU/USD D1 — le Gold va-t-il casser 3 120 $ ?",
  "$ EUR/USD M15 — setup scalp haussier en vue ?",
  "$ SOL/USDT H1 — RSI survendu, bon point d'achat ?",
  "$ BTC/USDT — SL, TP et taille de position pour 50 000 FCFA",
  "$ GBP/USD swing — identifie le prochain support clé",
];

const RESULT_LINES = [
  { label: "Signal",  value: "BUY",      color: "var(--bullish)" },
  { label: "Entry",   value: "87 420 $", color: "var(--text-primary)" },
  { label: "SL",      value: "85 800 $", color: "var(--bearish)" },
  { label: "TP",      value: "91 200 $", color: "var(--bullish)" },
  { label: "R:R",     value: "1:2.2",    color: "var(--gold)" },
  { label: "Score IA",value: "82 / 100", color: "var(--sol-purple)" },
];

type Phase = "typing" | "wait" | "result" | "erasing";

export default function PromptAnimation() {
  const [promptIdx, setPromptIdx]   = useState(0);
  const [displayed, setDisplayed]   = useState("");
  const [phase, setPhase]           = useState<Phase>("typing");
  const [resultLines, setResultLines] = useState<number>(0);
  const [cursor, setCursor]         = useState(true);

  /* Clignotement curseur */
  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  /* Machine à états */
  useEffect(() => {
    const prompt = PROMPTS[promptIdx];

    if (phase === "typing") {
      if (displayed.length < prompt.length) {
        const t = setTimeout(() => {
          setDisplayed(prompt.slice(0, displayed.length + 1));
        }, 38);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("wait"), 800);
        return () => clearTimeout(t);
      }
    }

    if (phase === "wait") {
      const t = setTimeout(() => { setResultLines(0); setPhase("result"); }, 400);
      return () => clearTimeout(t);
    }

    if (phase === "result") {
      if (resultLines < RESULT_LINES.length) {
        const t = setTimeout(() => setResultLines(r => r + 1), 130);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("erasing"), 2800);
        return () => clearTimeout(t);
      }
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        const t = setTimeout(() => {
          setDisplayed(d => d.slice(0, -1));
        }, 18);
        return () => clearTimeout(t);
      } else {
        setPromptIdx(i => (i + 1) % PROMPTS.length);
        setResultLines(0);
        setPhase("typing");
      }
    }
  }, [phase, displayed, promptIdx, resultLines]);

  return (
    <div
      style={{
        background: "var(--surface-mid)",
        border: "1px solid var(--border-sol)",
        borderRadius: 14,
        overflow: "hidden",
        maxWidth: 580,
        width: "100%",
        boxShadow: "0 0 40px rgba(153,69,255,0.15), var(--shadow-lg)",
        fontFamily: "inherit",
      }}
    >
      {/* ── Barre titre terminal ── */}
      <div
        style={{
          background: "var(--surface-highest)",
          borderBottom: "1px solid var(--border)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6 }}>
          {["#F43F5E", "#F59E0B", "#14F195"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }} />
          ))}
        </div>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.06em", fontWeight: 600 }}>
          WICKOX AI — TERMINAL
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <span className="live-dot" style={{ transform: "scale(0.75)" }} />
          <span style={{ fontSize: 10, color: "var(--bullish)", fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {/* ── Corps terminal ── */}
      <div style={{ padding: "18px 20px", minHeight: 220 }}>
        {/* Ligne prompt */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--sol-purple)",
              fontFamily: "'JetBrains Mono', monospace",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            ›
          </span>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1.5,
              flex: 1,
              minHeight: "1.5em",
            }}
          >
            {displayed}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                background: "var(--sol-green)",
                marginLeft: 2,
                verticalAlign: "text-bottom",
                opacity: cursor ? 1 : 0,
                transition: "opacity 0.1s",
              }}
              aria-hidden="true"
            />
          </p>
        </div>

        {/* Résultat IA */}
        {(phase === "result" || phase === "erasing" || phase === "wait") && resultLines > 0 && (
          <div
            style={{
              background: "var(--surface-high)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "14px 16px",
              animation: "fade-in 0.25s ease both",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--text-tertiary)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 12,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Analyse Wickox IA
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {RESULT_LINES.slice(0, resultLines).map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    animation: "fade-in-up 0.2s ease both",
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {line.label}
                  </span>
                  <span
                    className="font-data"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: line.color,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {line.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {phase === "wait" && resultLines === 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--sol-purple)",
                    animation: `pulse-dot 1s ease ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: "'Inter', sans-serif" }}>
              Analyse en cours...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
