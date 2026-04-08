"use client";

import type { OnboardingData } from "@/types/onboarding";

const countries = ["Côte d'Ivoire", "Sénégal", "Mali", "Burkina Faso", "Guinée", "Togo", "Bénin", "Niger", "Cameroun", "Autre"];
const ages = ["18-24", "25-34", "35-44", "45-54", "55+"];

interface Props {
  data: Partial<OnboardingData>;
  onChange: (d: Partial<OnboardingData>) => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--surface-high)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "14px",
  color: "var(--text-primary)",
  width: "100%",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "var(--text-secondary)",
  marginBottom: "8px",
};

export default function Step1Identite({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display font-semibold text-2xl text-white">👋 Bienvenue ! Parlons de toi</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Ces informations permettent à Idjor de personnaliser ses conseils.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Prénom *</label>
          <input
            type="text"
            placeholder="Ex: Mamadou"
            value={data.prenom || ""}
            onChange={(e) => onChange({ prenom: e.target.value })}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "rgba(153,69,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
        </div>

        <div>
          <label style={labelStyle}>Âge</label>
          <select
            value={data.age || ""}
            onChange={(e) => onChange({ age: e.target.value })}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(153,69,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            <option value="">Sélectionner</option>
            {ages.map((a) => <option key={a} value={a}>{a} ans</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Pays</label>
          <select
            value={data.pays || "Côte d'Ivoire"}
            onChange={(e) => onChange({ pays: e.target.value })}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(153,69,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Ville</label>
          <input
            type="text"
            placeholder="Ex: Abidjan"
            value={data.ville || ""}
            onChange={(e) => onChange({ ville: e.target.value })}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "rgba(153,69,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
        </div>
      </div>

      <p className="text-xs text-center italic" style={{ color: "var(--text-secondary)" }}>
        🔒 Ces informations sont confidentielles et ne sont jamais partagées.
      </p>
    </div>
  );
}
