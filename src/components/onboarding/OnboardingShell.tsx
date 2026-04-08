"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingData } from "@/types/onboarding";
import StepIndicator from "./StepIndicator";
import Step1Identite from "./steps/Step1Identite";
import Step2Experience from "./steps/Step2Experience";
import Step3Marches from "./steps/Step3Marches";
import Step4Capital from "./steps/Step4Capital";
import Step5Psychologie from "./steps/Step5Psychologie";
import Step6Disponibilite from "./steps/Step6Disponibilite";
import Step7Recap from "./steps/Step7Recap";
import WeexBanner from "@/components/shared/WeexBanner";

const TOTAL_STEPS = 7;

/** Returns true when the minimum required fields for the given step are filled */
function isStepValid(step: number, data: Partial<OnboardingData>): boolean {
  if (step === 1) return !!(data.prenom && data.prenom.trim().length > 0);
  if (step === 2) return !!(data.niveauTrading);
  if (step === 3) return !!(data.styleTrading);
  if (step === 4) return !!(data.capitalDisponibleFCFA);
  if (step === 5) return !!(
    data.reactionPerteRapide &&
    data.comportementApresDefaite &&
    data.reactionFOMO &&
    data.respecteSL &&
    data.patientAvantEntree &&
    data.gestionStress
  );
  if (step === 6) return !!(data.heuresParJour);
  return true;
}

export default function OnboardingShell() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({ pays: "Côte d'Ivoire" });

  // Redirect to dashboard if onboarding already completed
  useEffect(() => {
    const done = typeof window !== "undefined" && localStorage.getItem("idjor_onboarding_done");
    if (done) router.replace("/dashboard");
  }, [router]);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const next = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      // Persist to localStorage (fallback)
      if (typeof window !== "undefined") {
        localStorage.setItem("idjor_onboarding_done", "true");
        localStorage.setItem("idjor_profile", JSON.stringify(data));
      }
      // Persist to DB (non-blocking)
      fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {});
      router.push("/dashboard");
    }
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const valid = isStepValid(step, data);
  const stepProps = { data, onChange: updateData };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-8 px-4"
      style={{ background: "var(--surface)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "var(--sol-gradient)", boxShadow: "0 0 14px rgba(153,69,255,0.3)" }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 12L8 4l5 8H3z" fill="white" fillOpacity="0.9" />
            <circle cx="8" cy="9" r="2" fill="white" fillOpacity="0.6" />
          </svg>
        </div>
        <span className="font-display text-xl font-semibold text-gradient-sol-static">Wickox</span>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

      {/* Step card */}
      <div
        className="w-full max-w-2xl rounded-3xl p-8 md:p-10"
        style={{
          background: "var(--surface-mid)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {step === 1 && <Step1Identite {...stepProps} />}
        {step === 2 && <Step2Experience {...stepProps} />}
        {step === 3 && <Step3Marches {...stepProps} />}
        {step === 4 && <Step4Capital {...stepProps} />}
        {step === 5 && <Step5Psychologie {...stepProps} />}
        {step === 6 && <Step6Disponibilite {...stepProps} />}
        {step === 7 && <Step7Recap data={data} />}

        {/* Weex banner on last step */}
        {step === TOTAL_STEPS && (
          <div className="mt-6">
            <WeexBanner />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {step > 1 ? (
            <button onClick={back}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              ← Précédent
            </button>
          ) : <div />}

          <button
            onClick={next}
            disabled={!valid}
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: valid ? "var(--bullish)" : "var(--surface-highest)",
              color: valid ? "white" : "var(--text-secondary)",
              cursor: valid ? "pointer" : "not-allowed",
            }}>
            {step === TOTAL_STEPS ? "Commencer avec Idjor →" : "Suivant →"}
          </button>
        </div>
      </div>

      <p className="text-xs mt-6 text-center" style={{ color: "var(--text-secondary)" }}>
        Étape {step} sur {TOTAL_STEPS}
      </p>
    </div>
  );
}
