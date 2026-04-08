export type PlanFeature = { text: string; included: boolean };

export type Plan = {
  id: string;
  name: string;
  priceFCFA: number;
  priceAnnualFCFA: number;
  tagline: string;
  highlighted: boolean;
  badge?: string;
  features: PlanFeature[];
  cta: string;
  ctaStyle: "primary" | "outline" | "amber" | "ghost" | "sky";
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "GRATUIT",
    priceFCFA: 0,
    priceAnnualFCFA: 0,
    tagline: "Pour découvrir Wickox",
    highlighted: false,
    features: [
      { text: "1 analyse/jour (signal uniquement)", included: true },
      { text: "3 messages Idjor IA/jour", included: true },
      { text: "3 cours de formation", included: true },
      { text: "Journal: 5 trades max", included: true },
      { text: "Entry / SL / TP / Sizing", included: false },
      { text: "Contexte marché", included: false },
      { text: "Historique analyses", included: false },
    ],
    cta: "Commencer gratuitement",
    ctaStyle: "ghost",
  },
  {
    id: "starter",
    name: "STARTER",
    priceFCFA: 2900,
    priceAnnualFCFA: 2300,
    tagline: "Pour démarrer sérieusement",
    highlighted: false,
    badge: "🚀 POPULAIRE",
    features: [
      { text: "3 analyses/jour complètes", included: true },
      { text: "Entry + SL + TP + RR + Sizing", included: true },
      { text: "20 messages Idjor IA/jour", included: true },
      { text: "Tous les cours de formation", included: true },
      { text: "Journal: 30 trades", included: true },
      { text: "Contexte marché", included: false },
      { text: "Historique 90 jours", included: false },
    ],
    cta: "Choisir Starter",
    ctaStyle: "sky",
  },
  {
    id: "basic",
    name: "BASIC",
    priceFCFA: 7900,
    priceAnnualFCFA: 6300,
    tagline: "Pour le trader régulier",
    highlighted: false,
    features: [
      { text: "10 analyses/jour complètes", included: true },
      { text: "Entry + SL + TP + RR + Sizing", included: true },
      { text: "50 messages Idjor IA/jour", included: true },
      { text: "Journal illimité", included: true },
      { text: "Historique 90 jours", included: true },
      { text: "Contexte marché par asset", included: true },
      { text: "Export CSV", included: false },
    ],
    cta: "Choisir Basic",
    ctaStyle: "outline",
  },
  {
    id: "pro",
    name: "PRO",
    priceFCFA: 19900,
    priceAnnualFCFA: 15900,
    tagline: "Pour les traders actifs",
    highlighted: true,
    badge: "⭐ RECOMMANDÉ",
    features: [
      { text: "30 analyses/jour", included: true },
      { text: "Idjor IA illimité", included: true },
      { text: "Order Blocks + FVG", included: true },
      { text: "Alertes prix", included: true },
      { text: "Export CSV", included: true },
      { text: "Support WhatsApp", included: true },
      { text: "API Access", included: false },
    ],
    cta: "Choisir Pro",
    ctaStyle: "primary",
  },
  {
    id: "trader",
    name: "TRADER",
    priceFCFA: 39900,
    priceAnnualFCFA: 31900,
    tagline: "Pour les pros et institutions",
    highlighted: false,
    badge: "🏆 ÉLITE",
    features: [
      { text: "Analyses illimitées", included: true },
      { text: "Idjor IA illimité", included: true },
      { text: "API Access", included: true },
      { text: "Multi-comptes ×3", included: true },
      { text: "Rapport IA hebdomadaire", included: true },
      { text: "Onboarding 1-1", included: true },
      { text: "Support prioritaire", included: true },
    ],
    cta: "Choisir Trader",
    ctaStyle: "amber",
  },
];

export const faqItems = [
  {
    q: "Comment payer avec Wave ou Orange Money ?",
    a: "Lors du paiement, sélectionnez \"Mobile Money\", choisissez votre opérateur (Wave, Orange Money, MTN), entrez votre numéro et confirmez par SMS. Le paiement est instantané et sécurisé.",
  },
  {
    q: "Puis-je payer en crypto (USDT, BTC, SOL) ?",
    a: "Oui ! Nous acceptons USDT (TRC20/ERC20), BTC et SOL. Sélectionnez \"Crypto\" lors du checkout. Le montant est converti automatiquement au taux du marché.",
  },
  {
    q: "Puis-je payer par carte Visa ou Mastercard ?",
    a: "Absolument. Visa et Mastercard sont acceptées pour tous les plans payants. Le paiement est sécurisé.",
  },
  {
    q: "Les prix sont-ils en FCFA ?",
    a: "Oui, tous les prix affichés sont en Francs CFA (XOF). Aucune conversion nécessaire pour les utilisateurs d'Afrique de l'Ouest.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, l'annulation est possible à tout moment depuis les Paramètres > Abonnement. Vous continuez à bénéficier de votre plan jusqu'à la fin de la période payée.",
  },
  {
    q: "Quelle est la différence entre Starter et Basic ?",
    a: "Starter donne 3 analyses/jour avec tous les niveaux (Entry/SL/TP). Basic monte à 10 analyses/jour, journal illimité, historique 90 jours et contexte marché en temps réel.",
  },
  {
    q: "Y a-t-il un essai gratuit ?",
    a: "Le plan Gratuit est disponible sans limite de temps avec 1 analyse/jour. Pour tester Pro, contactez-nous à support@idjortrade.com.",
  },
];

export const comparisonRows: {
  feature: string;
  free: string | boolean;
  starter: string | boolean;
  basic: string | boolean;
  pro: string | boolean;
  trader: string | boolean;
}[] = [
  { feature: "Analyses / jour",      free: "1 (signal)", starter: "3", basic: "10", pro: "30", trader: "Illimité" },
  { feature: "Entry + SL + TP",      free: false,        starter: true, basic: true, pro: true, trader: true },
  { feature: "Messages Idjor IA",    free: "3",          starter: "20", basic: "50", pro: "Illimité", trader: "Illimité" },
  { feature: "Journal trades",       free: "5 max",      starter: "30", basic: "Illimité", pro: "Illimité", trader: "Illimité" },
  { feature: "Formation vidéo",      free: "3 cours",    starter: true, basic: true, pro: true, trader: true },
  { feature: "Contexte marché",      free: false,        starter: false, basic: true, pro: true, trader: true },
  { feature: "Historique",           free: false,        starter: false, basic: "90 jours", pro: "Illimité", trader: "Illimité" },
  { feature: "Order Blocks + FVG",   free: false,        starter: false, basic: false, pro: true, trader: true },
  { feature: "Export CSV",           free: false,        starter: false, basic: false, pro: true, trader: true },
  { feature: "Alertes prix",         free: false,        starter: false, basic: false, pro: true, trader: true },
  { feature: "Support WhatsApp",     free: false,        starter: false, basic: false, pro: true, trader: true },
  { feature: "API Access",           free: false,        starter: false, basic: false, pro: false, trader: true },
  { feature: "Multi-comptes (×3)",   free: false,        starter: false, basic: false, pro: false, trader: true },
  { feature: "Rapport IA hebdo",     free: false,        starter: false, basic: false, pro: false, trader: true },
  { feature: "Onboarding 1-1",       free: false,        starter: false, basic: false, pro: false, trader: true },
];
