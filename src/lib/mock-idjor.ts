export type CourseLevel = 'DÉBUTANT' | 'INTERMÉDIAIRE' | 'AVANCÉ';

export type Course = {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: CourseLevel;
  locked: boolean;
  emoji: string;
};

export const courses: Course[] = [
  { id: '1', title: 'Lire le RSI en 5 minutes', description: 'Zones de surachat, survente, divergences', duration: '12 min', level: 'DÉBUTANT', locked: false, emoji: '📊' },
  { id: '2', title: 'Bandes de Bollinger décodées', description: 'Volatilité, squeezes, rebonds de bandes', duration: '18 min', level: 'DÉBUTANT', locked: false, emoji: '📉' },
  { id: '3', title: 'Introduction au Scalping', description: 'Timeframes courts, gestion rapide des positions', duration: '22 min', level: 'DÉBUTANT', locked: false, emoji: '⚡' },
  { id: '4', title: 'Ne jamais brûler son compte', description: 'Risk management fondamental pour survivre', duration: '28 min', level: 'DÉBUTANT', locked: false, emoji: '🛡️' },
  { id: '5', title: 'Identifier une tendance', description: 'Structure de marché, Higher Highs / Higher Lows', duration: '25 min', level: 'INTERMÉDIAIRE', locked: false, emoji: '📈' },
  { id: '6', title: 'Order Blocks & Smart Money', description: 'ICT concepts, liquidité institutionnelle', duration: '35 min', level: 'AVANCÉ', locked: true, emoji: '🧱' },
  { id: '7', title: 'Psychologie du trader', description: 'Gérer FOMO, revenge trading, biais cognitifs', duration: '20 min', level: 'INTERMÉDIAIRE', locked: false, emoji: '🧠' },
  { id: '8', title: 'MACD: signal et divergences', description: 'Croisements, histogramme, divergences bullish', duration: '16 min', level: 'DÉBUTANT', locked: false, emoji: '〰️' },
];

export const levelColors: Record<CourseLevel, { bg: string; text: string }> = {
  DÉBUTANT: { bg: 'rgba(0,255,136,0.12)', text: '#00FF88' },
  INTERMÉDIAIRE: { bg: 'rgba(245,166,35,0.12)', text: '#F5A623' },
  AVANCÉ: { bg: 'rgba(255,59,92,0.12)', text: '#FF3B5C' },
};

export const levelBorderColors: Record<CourseLevel, string> = {
  DÉBUTANT: '#00FF88',
  INTERMÉDIAIRE: '#F5A623',
  AVANCÉ: '#FF3B5C',
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Bonjour ! Je suis **Idjor**, ton conseiller IA en trading.\n\nJe peux t'aider à :\n- Comprendre les indicateurs (RSI, MACD, Bollinger)\n- Analyser ton journal de trading\n- Te proposer des stratégies adaptées à ton profil\n- Répondre à toutes tes questions en français\n\nComment puis-je t'aider aujourd'hui ?`,
  },
];

export const quickPrompts = [
  "C'est quoi un Stop-Loss ?",
  'Explique-moi le RSI',
  'Stratégie pour débutant',
  'Analyse mon journal',
  'Quiz du jour 🎯',
  'Scalp vs Swing ?',
];
