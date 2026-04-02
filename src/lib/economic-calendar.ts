export type EconomicEvent = {
  id: string;
  date: string;
  time: string;
  country: string;
  flag: string;
  event: string;
  impact: 'low' | 'medium' | 'high';
  forecast: string | null;
  previous: string | null;
  actual: string | null;
};

export const mockEvents: EconomicEvent[] = [
  { id: '1', date: '2026-04-02', time: '14:30', country: 'USD', flag: '🇺🇸', event: 'Non-Farm Payrolls', impact: 'high', forecast: '200K', previous: '151K', actual: null },
  { id: '2', date: '2026-04-02', time: '14:30', country: 'USD', flag: '🇺🇸', event: 'Taux de chômage', impact: 'high', forecast: '4.1%', previous: '4.1%', actual: null },
  { id: '3', date: '2026-04-02', time: '16:00', country: 'USD', flag: '🇺🇸', event: 'ISM Manufacturing PMI', impact: 'medium', forecast: '49.5', previous: '50.3', actual: null },
  { id: '4', date: '2026-04-03', time: '08:55', country: 'EUR', flag: '🇩🇪', event: 'Unemployment Change Germany', impact: 'medium', forecast: '-5K', previous: '-2K', actual: null },
  { id: '5', date: '2026-04-03', time: '12:00', country: 'GBP', flag: '🇬🇧', event: 'BoE Interest Rate Decision', impact: 'high', forecast: '4.50%', previous: '4.50%', actual: null },
  { id: '6', date: '2026-04-04', time: '09:30', country: 'EUR', flag: '🇪🇺', event: 'ECB Meeting Minutes', impact: 'medium', forecast: null, previous: null, actual: null },
  { id: '7', date: '2026-04-04', time: '14:30', country: 'CAD', flag: '🇨🇦', event: 'Employment Change', impact: 'high', forecast: '25.0K', previous: '1.1K', actual: null },
  { id: '8', date: '2026-04-05', time: '03:30', country: 'AUD', flag: '🇦🇺', event: 'RBA Interest Rate', impact: 'high', forecast: '4.10%', previous: '4.10%', actual: null },
];
