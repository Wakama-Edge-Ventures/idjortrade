"use client";

import { useState } from "react";
import { questionsPsycho } from "@/lib/mock-onboarding";
import type { OnboardingData } from "@/types/onboarding";

interface Props {
  data: Partial<OnboardingData>;
  onChange: (d: Partial<OnboardingData>) => void;
}

export default function Step5Psychologie({ data, onChange }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const currentQ = questionsPsycho[qIndex];
  const currentAnswer = data[currentQ.id as keyof OnboardingData] as string;
  const progress = (qIndex / questionsPsycho.length) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-headline font-bold text-2xl text-white">🧠 Ton profil psychologique</h2>
        <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>
          {"Réponds honnêtement — il n'y a pas de bonnes ou mauvaises réponses."}
        </p>
      </div>

      {/* Progress interne */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs" style={{ color: "var(--on-surface-dim)" }}>
          <span>Question {qIndex + 1} / {questionsPsycho.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: "var(--surface-highest)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "#00FF88" }} />
        </div>
      </div>

      {/* Question courante */}
      <div className="space-y-4">
        <p className="text-base font-semibold text-white leading-relaxed">{currentQ.question}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt) => {
            const active = currentAnswer === opt.id;
            return (
              <button key={opt.id}
                onClick={() => onChange({ [currentQ.id]: opt.id } as Partial<OnboardingData>)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all"
                style={{
                  background: active ? "rgba(0,255,136,0.08)" : "var(--surface-high)",
                  border: active ? "1px solid rgba(0,255,136,0.4)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-sm font-medium text-white leading-snug">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation interne entre questions */}
      <div className="flex justify-between items-center pt-2">
        {qIndex > 0 ? (
          <button onClick={() => setQIndex(q => q - 1)} className="text-sm font-semibold"
            style={{ color: "var(--on-surface-dim)" }}>
            ← Précédent
          </button>
        ) : <div />}

        {qIndex < questionsPsycho.length - 1 && (
          <button
            onClick={() => { if (currentAnswer) setQIndex(q => q + 1); }}
            disabled={!currentAnswer}
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: currentAnswer ? "#00FF88" : "var(--surface-highest)",
              color: currentAnswer ? "#0A0E1A" : "var(--on-surface-dim)",
              cursor: currentAnswer ? "pointer" : "not-allowed",
            }}>
            Question suivante →
          </button>
        )}
      </div>

      <p className="text-xs text-center" style={{ color: "var(--on-surface-dim)" }}>
        {"Tes réponses créent ton profil psychologique. Idjor t'alertera sur tes biais comportementaux."}
      </p>
    </div>
  );
}
