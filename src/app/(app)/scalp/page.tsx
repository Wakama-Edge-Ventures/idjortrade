"use client";

import { useRef, useState } from "react";
import AnalyseHeader from "@/components/analyse/AnalyseHeader";
import RiskForm, { type RiskFormRef } from "@/components/analyse/RiskForm";
import ChartUploadZone, { type ChartUploadRef } from "@/components/analyse/ChartUploadZone";
import AnalyseButton from "@/components/analyse/AnalyseButton";
import MarketContext from "@/components/analyse/MarketContext";

export default function ScalpPage() {
  const formRef   = useRef<RiskFormRef>(null);
  const uploadRef = useRef<ChartUploadRef>(null);
  const [asset, setAsset] = useState("");
  const [productType, setProductType] = useState<"spot" | "futures">("spot");

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <AnalyseHeader
        title="Scalp Trading"
        subtitle="Précision intraday. Déséquilibres M1/M5 rapides."
        mode="scalp"
        accentColor="#F5A623"
      />

      {/* Mobile: MarketContext en premier */}
      <div className="md:hidden">
        <MarketContext asset={asset} productType={productType} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr_3fr] gap-6">
        <div className="card p-6">
          <h2 className="font-headline font-bold text-base text-white mb-5">Configuration du trade</h2>
          <RiskForm ref={formRef} mode="scalp"
            onAssetChange={setAsset}
            onProductTypeChange={setProductType} />
        </div>

        <div className="card p-6 flex flex-col gap-5">
          <h2 className="font-headline font-bold text-base text-white">Charger votre graphique</h2>
          <ChartUploadZone ref={uploadRef} accentColor="#F5A623" />
          <AnalyseButton
            mode="scalp"
            getFormData={() => formRef.current?.getFormData() ?? null}
            getImageData={() => uploadRef.current?.getImageData() ?? null}
          />
          <p className="text-center text-xs" style={{ color: "var(--on-surface-dim)" }}>
            ⚠ L'IA analyse l'image — résultats indicatifs uniquement
          </p>
        </div>

        <div className="hidden lg:block">
          <MarketContext asset={asset} productType={productType} />
        </div>
      </div>
    </div>
  );
}
