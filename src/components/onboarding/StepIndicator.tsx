// Step labels for each onboarding step
const stepLabels = ['Profil', 'Expérience', 'Marchés', 'Capital', 'Psychologie', 'Horaires', 'Récap'];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="flex items-center justify-between relative">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const completed = step < currentStep;
          const active = step === currentStep;
          return (
            <div key={step} className="flex flex-col items-center relative z-10" style={{ flex: 1 }}>
              {/* Connector line left */}
              {i > 0 && (
                <div
                  className="absolute top-4 right-1/2 left-0 h-px -translate-y-1/2"
                  style={{
                    background: completed || active ? "rgba(153,69,255,0.5)" : "var(--border)",
                  }}
                />
              )}
              {/* Connector line right */}
              {i < totalSteps - 1 && (
                <div
                  className="absolute top-4 left-1/2 right-0 h-px -translate-y-1/2"
                  style={{
                    background: completed ? "rgba(153,69,255,0.5)" : "var(--border)",
                  }}
                />
              )}

              {/* Circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold relative z-10"
                style={{
                  background: active
                    ? "var(--bullish)"
                    : completed
                    ? "rgba(20,241,149,0.25)"
                    : "var(--surface-high)",
                  color: active ? "white" : completed ? "var(--bullish)" : "var(--text-secondary)",
                  border: active ? "none" : completed ? "1px solid rgba(153,69,255,0.5)" : "1px solid var(--border)",
                }}
              >
                {completed ? "✓" : step}
              </div>

              {/* Label — desktop only */}
              <span
                className="hidden md:block text-[10px] mt-1.5 font-medium text-center"
                style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
