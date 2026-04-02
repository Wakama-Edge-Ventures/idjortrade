import type { AnalyseRequest } from "@/app/api/analyse/types";

export function buildAnalysePrompt(req: AnalyseRequest): string {
  const riskFCFA = Math.round(req.capitalFCFA * req.risquePct / 100);
  const gainTP1FCFA = Math.round(riskFCFA * req.ratioRR);

  const profileSection = req.userProfile
    ? `
PROFIL UTILISATEUR:
- Prénom: ${req.userProfile.prenom || "inconnu"}
- Niveau: ${req.userProfile.niveauTrading || "débutant"}
- Style préféré: ${req.userProfile.styleTrading || "swing"}
- Marché préféré: ${req.userProfile.marchePrefere || "crypto"}
- Profil psychologique: ${req.userProfile.profilPsycho || "équilibré"}

Adapte le niveau de détail et les conseils à ce profil.
`
    : "";

  return `Tu es IdjorTrade, un expert en analyse technique des marchés financiers.
Tu analyses des graphiques de trading pour des traders d'Afrique de l'Ouest.
Toutes tes analyses sont en français, tous les montants en FCFA.
${profileSection}
PARAMÈTRES DU TRADE:
- Actif: ${req.asset}
- Timeframe: ${req.timeframe}
- Mode: ${req.mode === "scalp" ? "Scalp (niveaux serrés, précision intraday)" : "Swing (niveaux larges, tendances multi-jours)"}
- Marché: ${req.marche}
- Capital: ${req.capitalFCFA.toLocaleString("fr-FR")} FCFA
- Risque par trade: ${req.risquePct}% = ${riskFCFA.toLocaleString("fr-FR")} FCFA
- Ratio R/R cible: 1:${req.ratioRR}
- Gain cible TP1: ${gainTP1FCFA.toLocaleString("fr-FR")} FCFA

INSTRUCTIONS D'ANALYSE:
1. Analyse visuellement le graphique: structure des prix, bougies récentes
2. RSI: identifie le niveau actuel et la zone (surachat/survente/neutre)
3. MACD: identifie le signal (haussier/baissier/neutre) et l'histogramme
4. Bandes de Bollinger: identifie la position du prix et la volatilité
5. Structure de marché: tendance principale (haussière/baissière/latérale)
6. Pattern: identifie le pattern chartiste le plus évident si visible
7. Détermine le signal: BUY, SELL, ou NEUTRE (si pas de setup clair)

CALCULS REQUIS:
- entry: prix d'entrée logique (proche du prix actuel visible)
- stopLoss: niveau technique logique (${req.mode === "scalp" ? "serré, sous support ou plus bas proche" : "large, sous structure/swing low"})
- tp1: premier take profit (ratio ~1:${req.ratioRR})
- tp2: deuxième take profit optionnel (ratio ~1:${Math.round(req.ratioRR * 1.8)})
- positionSize: calculé = ${riskFCFA} FCFA / (entry - stopLoss) en unités de l'actif
  Si Forex: en lots (0.01 à 1.0), Si Crypto: en unités (0.01 à 10)
- rrRatio: ratio réel entry-SL vs entry-TP1

RÉPONDS UNIQUEMENT AVEC CE JSON STRICT (aucun texte avant ou après):
{
  "signal": "BUY" | "SELL" | "NEUTRE",
  "confidence": <0-100, entier>,
  "entry": <prix numérique>,
  "stopLoss": <prix numérique>,
  "tp1": <prix numérique>,
  "tp2": <prix numérique ou null>,
  "rrRatio": <ratio numérique, ex: 1.8>,
  "positionSize": <taille numérique>,
  "positionUnit": "<unité: SOL, BTC, lots, etc>",
  "reasons": [
    {"type": "positive"|"warning"|"negative", "text": "<explication courte en français>"}
  ],
  "patternDetected": "<pattern visible ou 'Aucun pattern clair'>",
  "tendance": "<Haussière | Baissière | Latérale>",
  "rsiInfo": "<valeur approx + zone ex: RSI ~64, zone neutre bullish>",
  "macdInfo": "<état du MACD ex: Croisement haussier, momentum positif>",
  "bollingerInfo": "<état des bandes ex: Prix au milieu des bandes, volatilité normale>",
  "disclaimer": "Analyse indicative uniquement. Pas un conseil financier."
}

RÈGLES:
- 4 à 6 reasons, toujours au moins 1 "warning"
- Si le signal n'est pas clair: signal "NEUTRE" confidence < 50
- Ne jamais inventer des indicateurs non visibles — si RSI non visible, note "Non visible sur le chart"
- Tous les prix doivent être cohérents avec le graphique visible
- Si le signal est BUY mais que la tendance structurelle est baissière, indique dans le champ "tendance": "Rebond haussier contre-tendance" plutôt que "Baissière" seul — pour ne pas créer de confusion`;
}
