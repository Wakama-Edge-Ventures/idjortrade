"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const countries = ["Côte d'Ivoire", "Sénégal", "Mali", "Burkina Faso", "Ghana", "Nigeria", "Cameroun", "France"];
const timezones = ["Africa/Abidjan GMT+0", "Africa/Dakar GMT+0", "Africa/Lagos GMT+1", "Europe/Paris GMT+1"];

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [prenom, setPrenom] = useState(session?.user?.prenom ?? "");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [timezone, setTimezone] = useState("Africa/Abidjan GMT+0");
  const [hovered, setHovered] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved profile data on mount
  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.phoneNumber) setPhone(data.phoneNumber);
        if (data.profile?.pays) setCountry(data.profile.pays);
      })
      .catch(() => {});
  }, []);

  const initials = prenom
    ? prenom.slice(0, 2).toUpperCase()
    : (session?.user?.email?.[0] ?? "?").toUpperCase();

  const planLabel = (session?.user?.plan as string) ?? "FREE";

  const inputStyle: React.CSSProperties = {
    background: "var(--surface-highest)",
    border: "1px solid var(--outline)",
    color: "var(--on-surface)",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--on-surface-dim)",
    marginBottom: "6px",
    display: "block",
  };

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: prenom.trim() || undefined,
          phoneNumber: phone.trim() || undefined,
          pays: country,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la sauvegarde.");
        return;
      }

      // Refresh JWT with updated prenom so sidebar re-renders
      await update({ prenom: prenom.trim() });

      // Refresh Server Components
      router.refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erreur réseau. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold cursor-pointer overflow-hidden flex-shrink-0"
          style={{ background: "rgba(0,255,136,0.15)", color: "#00FF88" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className={`transition-opacity ${hovered ? "opacity-0" : "opacity-100"}`}>{initials}</span>
          {hovered && (
            <div
              className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              Modifier
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{prenom || session?.user?.email}</p>
          <p className="text-xs" style={{ color: "var(--on-surface-dim)" }}>Plan {planLabel}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label style={labelStyle}>Prénom</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "rgba(0,255,136,0.4)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--outline)"; }}
          />
        </div>

        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={session?.user?.email ?? ""}
            disabled
            style={{ ...inputStyle, opacity: 0.45, cursor: "not-allowed" }}
          />
        </div>

        <div>
          <label style={labelStyle}>Téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+225 07 00 00 00 00"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "rgba(0,255,136,0.4)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--outline)"; }}
          />
        </div>

        <div>
          <label style={labelStyle}>Pays</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(0,255,136,0.4)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--outline)"; }}
          >
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Fuseau horaire</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(0,255,136,0.4)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--outline)"; }}
          >
            {timezones.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <p
          className="text-xs font-semibold px-4 py-3 rounded-xl"
          style={{ background: "rgba(255,59,92,0.08)", color: "#FF3B5C", border: "1px solid rgba(255,59,92,0.2)" }}
        >
          {error}
        </p>
      )}

      {saved && (
        <p className="text-xs font-semibold" style={{ color: "#00FF88" }}>
          ✓ Profil sauvegardé
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
        style={{
          background: saving ? "var(--surface-highest)" : "#00FF88",
          color: saving ? "var(--on-surface-dim)" : "#0A0E1A",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? "Sauvegarde…" : "Sauvegarder"}
      </button>
    </div>
  );
}
