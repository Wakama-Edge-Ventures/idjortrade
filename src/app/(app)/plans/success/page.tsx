"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PlanSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/dashboard"), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon with decorative dots */}
        <div className="relative flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{ background: "rgba(0,255,136,0.1)", border: "2px solid rgba(0,255,136,0.3)" }}
          >
            🎉
          </div>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 8,
                height: 8,
                background: i % 2 === 0 ? "#00FF88" : "#F5A623",
                top: `${50 + 48 * Math.sin((i * Math.PI * 2) / 8)}%`,
                left: `${50 + 48 * Math.cos((i * Math.PI * 2) / 8)}%`,
                transform: "translate(-50%, -50%)",
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        <div className="space-y-2">
          <h1 className="font-headline font-black text-3xl text-white">
            Paiement confirmé !
          </h1>
          <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>
            Votre plan est maintenant actif. Redirection dans 3 secondes…
          </p>
        </div>

        <div
          className="rounded-2xl p-5 space-y-3 text-left"
          style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)" }}
        >
          <p className="text-sm font-semibold text-white">Ce qui s&apos;active maintenant :</p>
          <ul className="space-y-2 text-sm" style={{ color: "var(--on-surface-dim)" }}>
            <li className="flex items-center gap-2">
              <span style={{ color: "#00FF88" }}>✓</span> Analyses débloquées selon votre plan
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: "#00FF88" }}>✓</span> Accès à tous les marchés inclus
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: "#00FF88" }}>✓</span> Idjor IA avec quotas étendus
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/scalp"
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-center block"
            style={{ background: "#00FF88", color: "#0A0E1A" }}
          >
            Faire ma première analyse
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-2xl text-sm font-semibold text-center block"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface-dim)" }}
          >
            Aller au Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
