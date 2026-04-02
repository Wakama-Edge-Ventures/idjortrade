export type Session = {
  id: string;
  label: string;
  flag: string;
  openHourGMT: number;
  closeHourGMT: number;
  color: string;
};

export const sessions: Session[] = [
  { id: 'tokyo', label: 'Tokyo', flag: '🇯🇵', openHourGMT: 0, closeHourGMT: 9, color: '#F5A623' },
  { id: 'london', label: 'Londres', flag: '🇬🇧', openHourGMT: 8, closeHourGMT: 17, color: '#0EA5E9' },
  { id: 'new-york', label: 'New York', flag: '🇺🇸', openHourGMT: 13, closeHourGMT: 22, color: '#00FF88' },
  { id: 'overlap', label: 'Overlap', flag: '🔥', openHourGMT: 13, closeHourGMT: 17, color: '#FF3B5C' },
  { id: 'crypto', label: 'Crypto', flag: '₿', openHourGMT: 0, closeHourGMT: 24, color: '#F5A623' },
];

export function isSessionOpen(session: Session): boolean {
  if (session.id === 'crypto') return true;
  const hourGMT = new Date().getUTCHours();
  return hourGMT >= session.openHourGMT && hourGMT < session.closeHourGMT;
}
