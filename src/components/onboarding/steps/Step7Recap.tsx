"use client";

import { Sparkles } from "lucide-react";
import { niveaux, marchesOptions, stylesTrading, sessionsOptions } from "@/lib/mock-onboarding";
import type { OnboardingData } from "@/types/onboarding";

interface Props {
  data: Partial<OnboardingData>;
}

/** Calcule le profil psychologique à partir des réponses aux questions comportementales */
function calculateProfile(data: Partial<OnboardingData>): 'impulsif' | 'discipline' | 'equilibre' {
  const impulsiveAnswers = ['revenge', 'entre', 'double', 'deplace', 'forces', 'entresAvant'];
  const disciplinedAnswers = ['stop', 'analyse', 'ignore', 'respecte', 'attends', 'calm'];
  let impulsiveScore = 0;
  let disciplinedScore = 0;
  const fields = ['reactionPerteRapide', 'comportementApresDefaite', 'reactionFOMO', 'respecteSL', 'patientAvantEntree', 'gestionStress'];
  fields.forEach((f) => {
    const val = data[f as keyof OnboardingData] as string;
    if (impulsiveAnswers.includes(val)) impulsiveScore++;
    if (disciplinedAnswers.includes(val)) disciplinedScore++;
  });
  if (impulsiveScore >= 4) return 'impulsif';
  if (disciplinedScore >= 4) return 'discipline';
  return 'equilibre';
}

const profileData = {
  impulsif: {
    label: 'Trader Impulsif 🔥',
    forces: 'Réactivité rapide, pas peur de trader',
    risques: 'Revenge trading, FOMO, non-respect des SL',
    color: 'var(--bearish)',
  },
  discipline: {
    label: 'Trader Discipliné 🎯',
    forces: 'Respect des règles, patience',
    risques: "Parfois trop prudent, peut rater des opportunités",
    color: 'var(--bullish)',
  },
  equilibre: {
    label: 'Trader Équilibré ⚖️',
    forces: 'Adaptabilité, gestion émotionnelle correcte',
    risques: 'Manque parfois de conviction',
    color: '#F5A623',
  },
};

const cardStyle: React.CSSProperties = {
  background: "var(--surface-high)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
  padding: "16px",
};

const niveauColors: Record<string, string> = {
  debutant: 'var(--bullish)',
  intermediaire: '#F5A623',
  avance: '#0EA5E9',
  expert: 'var(--bearish)',
};

export default function Step7Recap({ data }: Props) {
  const profileType = calculateProfile(data);
  const profile = profileData[profileType];
  const niveau = niveaux.find((n) => n.id === data.niveauTrading);
  const style = stylesTrading.find((s) => s.id === data.styleTrading);
  const marches = (data.marchesTraites || []).map((id) => marchesOptions.find((m) => m.id === id)).filter(Boolean);
  const sessions = (data.sessionsPreferees || []).map((id) => sessionsOptions.find((s) => s.id === id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display font-semibold text-2xl text-white">✅ Ton profil est prêt !</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{"Voici ce qu'Idjor a retenu de toi"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Profil trader */}
        <div style={cardStyle} className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Profil trader</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{data.prenom || 'Trader'}</span>
            {niveau && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${niveauColors[niveau.id]}15`, color: niveauColors[niveau.id] }}>
                {niveau.emoji} {niveau.label}
              </span>
            )}
          </div>
          {data.anneesExperience && (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Expérience: <span className="text-white">{data.anneesExperience === '0' ? 'Débutant' : `${data.anneesExperience} ans`}</span>
            </p>
          )}
          {style && (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Style: <span className="text-white">{style.emoji} {style.label}</span>
            </p>
          )}
          {marches.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {marches.map((m) => m && (
                <span key={m.id} className="text-[10px] px-2 py-0.5 rounded"
                  style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}>
                  {m.emoji} {m.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Capital */}
        <div style={cardStyle} className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Capital & objectifs</p>
          {data.capitalDisponibleFCFA && (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Capital: <span className="text-white text-sm font-semibold">{data.capitalDisponibleFCFA.replace('k', ' 000').replace('m', ' 000 000')} FCFA</span>
            </p>
          )}
          {data.pourcentageCapitalRisque && (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Risque: <span className="font-bold" style={{ color: "var(--bullish)" }}>{data.pourcentageCapitalRisque}%</span> par trade
            </p>
          )}
          {data.objectifMensuelFCFA && (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Objectif: <span className="text-white">{data.objectifMensuelFCFA}</span> mensuel
            </p>
          )}
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {data.tradingEstRevenuPrincipal ? "🎯 Objectif: revenu principal" : "💼 Revenu complémentaire"}
          </p>
        </div>
      </div>

      {/* Profil psychologique */}
      <div style={{ ...cardStyle, borderColor: `${profile.color}22` }} className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Profil psychologique</p>
        <p className="font-display font-semibold text-lg" style={{ color: profile.color }}>
          Profil: {profile.label}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(20,241,149,0.05)", border: "1px solid rgba(20,241,149,0.1)" }}>
            <p className="font-semibold mb-1" style={{ color: "var(--bullish)" }}>Tes forces</p>
            <p style={{ color: "var(--text-secondary)" }}>{profile.forces}</p>
          </div>
          <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.1)" }}>
            <p className="font-semibold mb-1" style={{ color: "var(--bearish)" }}>Tes risques</p>
            <p style={{ color: "var(--text-secondary)" }}>{profile.risques}</p>
          </div>
        </div>
      </div>

      {/* Sessions & disponibilité */}
      {sessions.length > 0 && (
        <div style={cardStyle} className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Sessions & disponibilité</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Heures/jour: <span className="text-white">{data.heuresParJour || "—"}</span>
          </p>
          <div className="flex flex-wrap gap-1">
            {sessions.map((s) => s && (
              <span key={s.id} className="text-[10px] px-2 py-0.5 rounded"
                style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}>
                {s.emoji} {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Message personnalisé d'Idjor */}
      <div className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: "linear-gradient(135deg, #1A1200, #1A1208)", border: "1px solid rgba(245,166,35,0.2)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #F5A623, #E8940F)" }}>
          <Sparkles size={18} color="white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white mb-1">
            Parfait {data.prenom || 'trader'} !
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {"J'ai créé ton profil personnalisé. Je vais adapter tous mes conseils à ton niveau"}{' '}
            <span style={{ color: "#F5A623" }}>{niveau?.label || ''}</span>{", ton style"}{' '}
            <span style={{ color: "#F5A623" }}>{style?.label || ''}</span>{" et ta psychologie de trader. On commence ?"}
          </p>
        </div>
      </div>
    </div>
  );
}
