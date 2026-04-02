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
  ctaStyle: 'primary' | 'outline' | 'amber' | 'ghost';
};

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'GRATUIT',
    priceFCFA: 0,
    priceAnnualFCFA: 0,
    tagline: 'Pour découvrir IdjorTrade',
    highlighted: false,
    features: [
      { text: '3 analyses par jour', included: true },
      { text: '5 messages Idjor IA', included: true },
      { text: '7 jours d\'historique', included: true },
      { text: 'Crypto uniquement', included: true },
      { text: 'Forex & Actions', included: false },
      { text: 'Export CSV', included: false },
      { text: 'Alertes marché', included: false },
      { text: 'API Access', included: false },
    ],
    cta: 'Commencer gratuitement',
    ctaStyle: 'ghost',
  },
  {
    id: 'basic',
    name: 'BASIC',
    priceFCFA: 4900,
    priceAnnualFCFA: 3900,
    tagline: 'Pour le trader régulier',
    highlighted: false,
    features: [
      { text: '20 analyses par jour', included: true },
      { text: '30 messages Idjor IA', included: true },
      { text: '90 jours d\'historique', included: true },
      { text: 'Crypto uniquement', included: true },
      { text: 'Forex & Actions', included: false },
      { text: 'Export CSV', included: true },
      { text: 'Alertes marché', included: false },
      { text: 'API Access', included: false },
    ],
    cta: 'Choisir Basic',
    ctaStyle: 'outline',
  },
  {
    id: 'pro',
    name: 'PRO',
    priceFCFA: 14900,
    priceAnnualFCFA: 11900,
    tagline: 'Tout illimité, tous marchés',
    highlighted: true,
    badge: '⭐ RECOMMANDÉ',
    features: [
      { text: 'Analyses illimitées', included: true },
      { text: 'Idjor IA illimité', included: true },
      { text: 'Historique illimité', included: true },
      { text: 'Crypto + Forex + Actions', included: true },
      { text: 'Matières premières', included: true },
      { text: 'Export CSV', included: true },
      { text: 'Alertes marché', included: true },
      { text: 'API Access', included: false },
    ],
    cta: 'Choisir Pro',
    ctaStyle: 'primary',
  },
  {
    id: 'trader',
    name: 'TRADER',
    priceFCFA: 29900,
    priceAnnualFCFA: 23900,
    tagline: 'Pour les pros et institutions',
    highlighted: false,
    badge: '🏆 ÉLITE',
    features: [
      { text: 'Analyses illimitées', included: true },
      { text: 'Idjor IA illimité', included: true },
      { text: 'Historique illimité', included: true },
      { text: 'Tous les marchés', included: true },
      { text: 'Backtesting IA', included: true },
      { text: 'Export CSV', included: true },
      { text: 'Alertes avancées', included: true },
      { text: 'API Access', included: true },
    ],
    cta: 'Choisir Trader',
    ctaStyle: 'amber',
  },
];

export const faqItems = [
  {
    q: 'Comment payer avec Wave ou Orange Money ?',
    a: 'Lors du paiement, sélectionnez "Mobile Money", choisissez votre opérateur (Wave, Orange Money, MTN), entrez votre numéro et confirmez par SMS. Le paiement est instantané et sécurisé.',
  },
  {
    q: 'Puis-je payer en crypto (USDT, BTC, SOL) ?',
    a: 'Oui ! Nous acceptons USDT (TRC20/ERC20), BTC et SOL. Sélectionnez "Crypto" lors du checkout. Le montant est converti automatiquement au taux du marché.',
  },
  {
    q: 'Puis-je payer par carte Visa ou Mastercard ?',
    a: 'Absolument. Visa et Mastercard sont acceptées pour les plans Basic, Pro et Trader. Le paiement est sécurisé par Stripe.',
  },
  {
    q: 'Les prix sont-ils en FCFA ?',
    a: 'Oui, tous les prix affichés sont en Francs CFA (XOF). Aucune conversion nécessaire pour les utilisateurs d\'Afrique de l\'Ouest.',
  },
  {
    q: 'Puis-je annuler à tout moment ?',
    a: 'Oui, l\'annulation est possible à tout moment depuis les Paramètres > Abonnement. Vous continuez à bénéficier de votre plan jusqu\'à la fin de la période payée.',
  },
  {
    q: 'Quelle est la différence entre Basic et Pro ?',
    a: 'Basic est limité à la Crypto et 20 analyses/jour. Pro donne accès à tous les marchés (Forex, Actions, Matières premières), des analyses illimitées, et les alertes marché en temps réel.',
  },
  {
    q: 'Y a-t-il un essai gratuit Pro ?',
    a: 'Le plan Gratuit est disponible sans limite de temps. Pour tester Pro, contactez-nous à support@idjortrade.com — nous offrons parfois des essais 7 jours aux utilisateurs actifs.',
  },
];

export const comparisonRows = [
  { feature: 'Analyses / jour', free: '3', basic: '20', pro: 'Illimité', trader: 'Illimité' },
  { feature: 'Messages Idjor IA', free: '5', basic: '30', pro: 'Illimité', trader: 'Illimité' },
  { feature: 'Marchés', free: 'Crypto', basic: 'Crypto', pro: 'Tous', trader: 'Tous' },
  { feature: 'Historique', free: '7 jours', basic: '90 jours', pro: 'Illimité', trader: 'Illimité' },
  { feature: 'Formation vidéo', free: true, basic: true, pro: true, trader: true },
  { feature: 'Entry + SL + TP', free: true, basic: true, pro: true, trader: true },
  { feature: 'Export CSV', free: false, basic: true, pro: true, trader: true },
  { feature: 'Alertes marché', free: false, basic: false, pro: true, trader: true },
  { feature: 'Backtesting IA', free: false, basic: false, pro: false, trader: true },
  { feature: 'API Access', free: false, basic: false, pro: false, trader: true },
  { feature: 'Multi-comptes (×3)', free: false, basic: false, pro: false, trader: true },
  { feature: 'Support prioritaire', free: false, basic: false, pro: true, trader: true },
];
