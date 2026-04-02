export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen circuit-bg flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.2)" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 14 C5.5 14 5.5 8 8 8 C10.5 8 10.5 14 13 14 C15.5 14 15.5 8 18 8"
              stroke="#00FF88" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="9" cy="4" r="2" fill="#00FF88" opacity="0.8" />
          </svg>
        </div>
        <span className="font-headline font-bold text-lg text-white tracking-tight">IdjorTrade</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md card p-8 space-y-6">
        {children}
      </div>

      <p className="mt-6 text-[11px] text-center" style={{ color: "var(--on-surface-dim)" }}>
        © 2026 IdjorTrade · Analyse IA pour traders d'Afrique de l'Ouest
      </p>
    </div>
  );
}
