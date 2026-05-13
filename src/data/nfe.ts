import type { BrandStatus } from './brands';

export interface NFeRecord {
  numero: string;
  brand: string;
  brandAvatar: { letters: string; color: string };
  tipo: 'Repasse' | 'Mensalidade';
  referencia: string;
  valor: number;
  data: string;
  status: string;
  statusType: BrandStatus;
}

export const nfesRecebidas: NFeRecord[] = [
  { numero: '#4587', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1800, data: '03/06/2025', status: 'Confirmada', statusType: 'success' },
  { numero: '#4585', brand: 'Mar e Rio', brandAvatar: { letters: 'MR', color: '#2563EB' }, tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1600, data: '04/06/2025', status: 'Confirmada', statusType: 'success' },
  { numero: '#4583', brand: 'Casa Bruta', brandAvatar: { letters: 'CB', color: '#D97706' }, tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1500, data: '02/06/2025', status: 'Confirmada', statusType: 'success' },
  { numero: '#4584', brand: 'Brisa', brandAvatar: { letters: 'BR', color: '#059669' }, tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1200, data: '03/06/2025', status: 'Confirmada', statusType: 'success' },
  { numero: '—', brand: 'Lua Cheia', brandAvatar: { letters: 'LC', color: '#7C3AED' }, tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1400, data: '—', status: 'Pendente', statusType: 'warning' },
  { numero: '—', brand: 'Dona Sol', brandAvatar: { letters: 'DS', color: '#DC2626' }, tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1800, data: '—', status: 'Bloqueada', statusType: 'danger' },
];

export const nfesEmitidas: NFeRecord[] = [
  { numero: '#4590', brand: 'Mar e Rio', brandAvatar: { letters: 'MR', color: '#2563EB' }, tipo: 'Repasse', referencia: 'Jun/2025', valor: 2890, data: '15/06/2025', status: 'Emitida', statusType: 'success' },
  { numero: '#4591', brand: 'Casa Bruta', brandAvatar: { letters: 'CB', color: '#D97706' }, tipo: 'Repasse', referencia: 'Jun/2025', valor: 2260, data: '15/06/2025', status: 'Emitida', statusType: 'success' },
  { numero: '#4592', brand: 'Brisa', brandAvatar: { letters: 'BR', color: '#059669' }, tipo: 'Repasse', referencia: 'Jun/2025', valor: 1730, data: '15/06/2025', status: 'Emitida', statusType: 'success' },
  { numero: '#4593', brand: 'Bruta', brandAvatar: { letters: 'BT', color: '#7C3AED' }, tipo: 'Repasse', referencia: 'Jun/2025', valor: 2340, data: '15/06/2025', status: 'Emitida', statusType: 'success' },
  { numero: '—', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, tipo: 'Repasse', referencia: 'Jun/2025', valor: 2920, data: '—', status: 'Pendente', statusType: 'warning' },
  { numero: '—', brand: 'Lua Cheia', brandAvatar: { letters: 'LC', color: '#7C3AED' }, tipo: 'Repasse', referencia: 'Jun/2025', valor: 2105, data: '—', status: 'Pendente', statusType: 'warning' },
];

export const amiraNfes: NFeRecord[] = [
  { numero: '#4587', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1800, data: '03/06/2025', status: 'Confirmada', statusType: 'success' },
  { numero: '—', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, tipo: 'Repasse', referencia: 'Jun/2025', valor: 2920, data: '—', status: 'Pendente', statusType: 'warning' },
  { numero: '#4501', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, tipo: 'Mensalidade', referencia: 'Mai/2025', valor: 1800, data: '03/05/2025', status: 'Confirmada', statusType: 'success' },
  { numero: '#4488', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, tipo: 'Repasse', referencia: 'Mai/2025', valor: 2650, data: '08/06/2025', status: 'Emitida', statusType: 'success' },
];
