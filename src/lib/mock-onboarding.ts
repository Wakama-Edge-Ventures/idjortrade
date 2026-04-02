export const niveaux = [
  { id: 'debutant', label: 'Débutant', description: 'Je commence tout juste, je découvre le trading', emoji: '🌱' },
  { id: 'intermediaire', label: 'Intermédiaire', description: "J'ai quelques bases, je trade depuis 1-2 ans", emoji: '📈' },
  { id: 'avance', label: 'Avancé', description: "Je maîtrise l'analyse technique, je trade régulièrement", emoji: '⚡' },
  { id: 'expert', label: 'Expert', description: 'Trading professionnel ou prop firm', emoji: '🎯' },
];

export const marchesOptions = [
  { id: 'crypto', label: 'Crypto', emoji: '₿' },
  { id: 'forex', label: 'Forex', emoji: '💱' },
  { id: 'actions', label: 'Actions', emoji: '📊' },
  { id: 'matieres', label: 'Matières premières', emoji: '🥇' },
  { id: 'indices', label: 'Indices', emoji: '📉' },
];

export const stylesTrading = [
  { id: 'scalp', label: 'Scalping', description: 'Trades de quelques secondes à minutes', timeframe: 'M1 – M5', emoji: '⚡' },
  { id: 'day', label: 'Day Trading', description: 'Ouverture et clôture le même jour', timeframe: 'M15 – H1', emoji: '☀️' },
  { id: 'swing', label: 'Swing Trading', description: 'Positions de plusieurs jours', timeframe: 'H4 – D1', emoji: '🌊' },
  { id: 'position', label: 'Position Trading', description: 'Positions de plusieurs semaines/mois', timeframe: 'D1 – W1', emoji: '🏔️' },
];

export const capitalRanges = [
  { id: '0-50k', label: 'Moins de 50 000 FCFA' },
  { id: '50k-200k', label: '50 000 – 200 000 FCFA' },
  { id: '200k-500k', label: '200 000 – 500 000 FCFA' },
  { id: '500k-1m', label: '500 000 – 1 000 000 FCFA' },
  { id: '1m+', label: 'Plus de 1 000 000 FCFA' },
];

export const revenuRanges = [
  { id: '0-100k', label: 'Moins de 100 000 FCFA/mois' },
  { id: '100k-300k', label: '100 000 – 300 000 FCFA/mois' },
  { id: '300k-600k', label: '300 000 – 600 000 FCFA/mois' },
  { id: '600k-1m', label: '600 000 – 1 000 000 FCFA/mois' },
  { id: '1m+', label: 'Plus de 1 000 000 FCFA/mois' },
];

export const questionsPsycho = [
  {
    id: 'reactionPerteRapide',
    question: "Tu viens de perdre 30% de ton capital en 1 heure. Quelle est ta première réaction ?",
    options: [
      { id: 'stop', label: 'Je coupe tout et je me repose', emoji: '🛑' },
      { id: 'analyse', label: "J'analyse ce qui s'est passé calmement", emoji: '🧘' },
      { id: 'revenge', label: 'Je veux récupérer immédiatement', emoji: '😤' },
      { id: 'panique', label: 'Je panique et je ne sais plus quoi faire', emoji: '😰' },
    ],
  },
  {
    id: 'comportementApresDefaite',
    question: 'Après 3 trades perdants consécutifs, tu...',
    options: [
      { id: 'pause', label: 'Fais une pause et reviens demain', emoji: '⏸️' },
      { id: 'analyse2', label: 'Revois ta stratégie avant de continuer', emoji: '📋' },
      { id: 'double', label: 'Doubles la mise pour récupérer', emoji: '🎲' },
      { id: 'abandonne', label: "Abandonnes pour aujourd'hui", emoji: '🚪' },
    ],
  },
  {
    id: 'reactionFOMO',
    question: "Tu vois un coin qui a pris +50% en 2h et tu n'es pas dessus. Tu...",
    options: [
      { id: 'ignore', label: "L'ignores, ce n'était pas dans ton plan", emoji: '😌' },
      { id: 'attend', label: 'Attends une correction pour entrer', emoji: '⏳' },
      { id: 'entre', label: 'Entres maintenant de peur de rater la suite', emoji: '🚀' },
      { id: 'frustre', label: 'Es frustré mais ne fais rien', emoji: '😣' },
    ],
  },
  {
    id: 'respecteSL',
    question: "Ton Stop-Loss est touché mais tu es convaincu que le trade va revenir. Tu...",
    options: [
      { id: 'respecte', label: "Respectes le SL, c'est la règle", emoji: '✅' },
      { id: 'deplace', label: 'Déplaces le SL pour donner plus de marge', emoji: '🔄' },
      { id: 'ajoute', label: 'Ajoutes à la position (averaging down)', emoji: '📉' },
      { id: 'hesites', label: 'Hésites longtemps puis fermes à perte plus grande', emoji: '😬' },
    ],
  },
  {
    id: 'patientAvantEntree',
    question: "Tu as repéré un setup parfait mais les conditions ne sont pas encore réunies. Tu...",
    options: [
      { id: 'attends', label: 'Attends patiemment la confirmation', emoji: '🎯' },
      { id: 'entresAvant', label: 'Entres un peu avant pour "ne pas rater"', emoji: '⚡' },
      { id: 'cherches', label: "Cherches un autre trade en attendant", emoji: '🔍' },
      { id: 'forces', label: "Forces l'entrée car tu veux trader", emoji: '💥' },
    ],
  },
  {
    id: 'gestionStress',
    question: "Comment gères-tu le stress quand une position est en cours ?",
    options: [
      { id: 'calm', label: "Je reste calme, j'ai confiance en mon plan", emoji: '🧘' },
      { id: 'surveille', label: 'Je surveille constamment le prix', emoji: '👀' },
      { id: 'ferme', label: "Je ferme tôt pour éviter l'angoisse", emoji: '🔒' },
      { id: 'evite', label: 'Je regarde ailleurs pour ne pas stresser', emoji: '🙈' },
    ],
  },
];

export const sessionsOptions = [
  { id: 'asie', label: 'Session Asie', hours: '01h–09h GMT', emoji: '🇯🇵' },
  { id: 'london', label: 'Session Londres', hours: '08h–17h GMT', emoji: '🇬🇧' },
  { id: 'new-york', label: 'Session New York', hours: '13h–22h GMT', emoji: '🇺🇸' },
  { id: 'overlap', label: 'Overlap Londres/NY', hours: '13h–17h GMT', emoji: '🔥' },
  { id: 'crypto-24', label: 'Crypto 24h/24', hours: 'Toujours ouvert', emoji: '₿' },
];

export const objectifs = [
  { id: 'revenu-complementaire', label: 'Revenu complémentaire', emoji: '💰' },
  { id: 'liberte-financiere', label: 'Liberté financière', emoji: '🌴' },
  { id: 'trading-pro', label: 'Devenir trader professionnel', emoji: '🎯' },
  { id: 'apprendre', label: 'Apprendre et progresser', emoji: '📚' },
  { id: 'gerer-epargne', label: 'Gérer mon épargne activement', emoji: '🏦' },
];
