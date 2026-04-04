"use client";

import { useRef } from "react";
import AnalyseHeader from "@/components/analyse/AnalyseHeader";
import RiskForm, { type RiskFormRef } from "@/components/analyse/RiskForm";
import ChartUploadZone, { type ChartUploadRef } from "@/components/analyse/ChartUploadZone";
import AnalyseButton from "@/components/analyse/AnalyseButton";

export default function DayPage() {
  const formRef = useRef<RiskFormRef>(null);
  const uploadRef = useRef<ChartUploadRef>(null);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <AnalyseHeader
        title="Day Trading"
        subtitle="Analyses intraday 1H / 2H / 4H"
        mode="day"
        accentColor="#0EA5E9"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-headline font-bold text-base text-white mb-5">
            Configuration du trade
          </h2>
          <RiskForm ref={formRef} mode="day" />
        </div>

        <div className="card p-6 flex flex-col gap-5">
          <h2 className="font-headline font-bold text-base text-white">
            Charger votre graphique
          </h2>
          <ChartUploadZone ref={uploadRef} accentColor="#0EA5E9" />
          <AnalyseButton
            mode="day"
            getFormData={() => formRef.current?.getFormData() ?? null}
            getImageData={() => uploadRef.current?.getImageData() ?? null}
          />
          <p className="text-center text-xs" style={{ color: "var(--on-surface-dim)" }}>
            ⚠ L'IA analyse l'image — résultats indicatifs uniquement
          </p>
        </div>
      </div>
    </div>
  );
}
