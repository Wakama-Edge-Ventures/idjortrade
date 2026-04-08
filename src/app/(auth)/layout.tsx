export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--surface)" }}
      suppressHydrationWarning
    >
      {/* Orbes de fond */}
      <div
        className="absolute top-1/4 -left-32 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(153,69,255,0.08) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(20,241,149,0.06) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Logo Wickox */}
      <div className="mb-8 flex items-center gap-2.5 animate-fade-in" suppressHydrationWarning>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--sol-gradient)",
            boxShadow: "0 0 16px rgba(153,69,255,0.35)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 12L8 4l5 8H3z" fill="white" fillOpacity="0.9" />
            <circle cx="8" cy="9" r="2" fill="white" fillOpacity="0.6" />
          </svg>
        </div>
        <span
          className="font-display font-semibold text-xl text-gradient-sol-static"
          style={{ letterSpacing: "-0.02em" }}
        >
          Wickox
        </span>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md card p-8 space-y-6 animate-scale-in"
        suppressHydrationWarning
      >
        {children}
      </div>

      <p className="mt-6 text-[11px] text-center" style={{ color: "var(--text-tertiary)" }}>
        © 2026 Wickox · Analyse IA pour traders d&apos;Afrique de l&apos;Ouest
      </p>
    </div>
  );
}
