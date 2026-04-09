"use client";

import { useRef, useState } from "react";
import AnalyseHeader from "@/components/analyse/AnalyseHeader";
import RiskForm, { type RiskFormRef } from "@/components/analyse/RiskForm";
import ChartUploadZone, { type ChartUploadRef } from "@/components/analyse/ChartUploadZone";
import AnalyseButton, { type AnalyseButtonRef } from "@/components/analyse/AnalyseButton";
import MarketContext from "@/components/analyse/MarketContext";

export default function SwingPage() {
  const formRef    = useRef<RiskFormRef>(null);
  const uploadRef  = useRef<ChartUploadRef>(null);
  const analyseRef = useRef<AnalyseButtonRef>(null);
  const [asset, setAsset]               = useState("");
  const [productType, setProductType]   = useState<"spot" | "futures">("spot");

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <AnalyseHeader
        title="Swing Trading"
        subtitle="Analyse de tendances multi-jours. Timeframes H4 et Daily."
        mode="swing"
        accentColor="#0EA5E9"
      />

      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">

          {/* Section 1 — Configuration */}
          <div className="pb-6 lg:pb-0 lg:pr-6 lg:w-[38%]">
            <h2 className="font-display font-semibold text-base text-white mb-5">Configuration du trade</h2>
            <RiskForm ref={formRef} mode="swing"
              onAssetChange={setAsset}
              onProductTypeChange={setProductType} />
          </div>

          {/* Section 2 — Upload + Analyse */}
          <div className="py-6 lg:py-0 lg:px-6 lg:w-[35%] flex flex-col gap-5">
            <h2 className="font-display font-semibold text-base text-white">Charger votre graphique</h2>
            <ChartUploadZone
              ref={uploadRef}
              accentColor="#0EA5E9"
              onClipboardImageLoaded={() => analyseRef.current?.trigger()}
            />
            <AnalyseButton
              ref={analyseRef}
              mode="swing"
              getFormData={() => formRef.current?.getFormData() ?? null}
              getImageData={() => uploadRef.current?.getImageData() ?? null}
            />
            <p className="text-center text-xs" style={{ color: "var(--text-secondary)" }}>
              ⚠ L&apos;IA analyse l&apos;image — résultats indicatifs uniquement
            </p>
          </div>

          {/* Section 3 — Contexte marché */}
          <div className="pt-6 lg:pt-0 lg:pl-6 lg:w-[27%]">
            <MarketContext asset={asset} productType={productType} />
          </div>

        </div>
      </div>
    </div>
  );
}
