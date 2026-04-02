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
                    background: completed || active ? "rgba(0,255,136,0.4)" : "var(--outline)",
                  }}
                />
              )}
              {/* Connector line right */}
              {i < totalSteps - 1 && (
                <div
                  className="absolute top-4 left-1/2 right-0 h-px -translate-y-1/2"
                  style={{
                    background: completed ? "rgba(0,255,136,0.4)" : "var(--outline)",
                  }}
                />
              )}

              {/* Circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold relative z-10"
                style={{
                  background: active
                    ? "#00FF88"
                    : completed
                    ? "rgba(0,255,136,0.25)"
                    : "var(--surface-high)",
                  color: active ? "#0A0E1A" : completed ? "#00FF88" : "var(--on-surface-dim)",
                  border: active ? "none" : completed ? "1px solid rgba(0,255,136,0.4)" : "1px solid var(--outline)",
                }}
              >
                {completed ? "✓" : step}
              </div>

              {/* Label — desktop only */}
              <span
                className="hidden md:block text-[10px] mt-1.5 font-medium text-center"
                style={{ color: active ? "var(--on-surface)" : "var(--on-surface-dim)" }}
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
