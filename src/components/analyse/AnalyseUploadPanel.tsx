"use client";

import { useState } from "react";
import Link from "next/link";
import ChartUploadZone from "./ChartUploadZone";

interface AnalyseUploadPanelProps {
  accentColor?: string;
  analyseHref?: string;
}

export default function AnalyseUploadPanel({
  accentColor = "#00FF88",
  analyseHref = "/resultat",
}: AnalyseUploadPanelProps) {
  const [, setFile] = useState<File | null>(null);

  return (
    <div className="card p-6 flex flex-col gap-5">
      <h2 className="font-headline font-bold text-base text-white">
        Charger votre graphique
      </h2>

      <ChartUploadZone
        onFileSelect={(f) => setFile(f)}
        accentColor={accentColor}
      />

      <Link
        href={analyseHref}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl
          font-headline font-bold text-base transition-all"
        style={{
          background: accentColor,
          color: "#0A0E1A",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="12" x2="16" y2="16" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Analyser ce chart
      </Link>

      <p className="text-center text-xs" style={{ color: "var(--on-surface-dim)" }}>
        ⚠ L’IA analyse l’image — résultats indicatifs uniquement
      </p>
    </div>
  );
}
