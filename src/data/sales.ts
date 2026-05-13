export interface Sale {
  date: string;
  product: string;
  sku: string;
  qty: number;
  value: number;
  store: 'SP' | 'RJ';
  brand?: string;
  brandAvatar?: { letters: string; color: string };
}

export interface StoreSale extends Sale {
  brand: string;
  brandAvatar: { letters: string; color: string };
  split: number;
  repasse: number;
  ficaLoja: number;
  pgto: string;
  isReturn?: boolean;
}

export const storeSales: StoreSale[] = [
  { date: '28/jun', product: 'Brinco Cascata Ouro', sku: 'AMR-0087', qty: 1, value: 420, store: 'SP', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, split: 50, repasse: 210, ficaLoja: 210, pgto: '20/07' },
  { date: '27/jun', product: 'Saída de Praia Azul', sku: 'LCH-0115', qty: 2, value: 580, store: 'SP', brand: 'Lua Cheia', brandAvatar: { letters: 'LC', color: '#7C3AED' }, split: 50, repasse: 290, ficaLoja: 290, pgto: '20/07' },
  { date: '27/jun', product: 'Pulseira Coral', sku: 'MER-0042', qty: 3, value: 570, store: 'RJ', brand: 'Mar e Rio', brandAvatar: { letters: 'MR', color: '#2563EB' }, split: 55, repasse: 314, ficaLoja: 257, pgto: '20/07' },
  { date: '26/jun', product: 'Bolsa Tote Caramelo', sku: 'CBR-0088', qty: 1, value: 480, store: 'SP', brand: 'Casa Bruta', brandAvatar: { letters: 'CB', color: '#D97706' }, split: 55, repasse: 264, ficaLoja: 216, pgto: '20/07' },
  { date: '26/jun', product: 'Colar Mandala P', sku: 'AMR-0034', qty: 2, value: 680, store: 'SP', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, split: 50, repasse: 340, ficaLoja: 340, pgto: '20/07' },
  { date: '25/jun', product: 'Vestido Linho P', sku: 'BRS-0056', qty: 1, value: 320, store: 'RJ', brand: 'Brisa', brandAvatar: { letters: 'BR', color: '#059669' }, split: 55, repasse: 176, ficaLoja: 144, pgto: '20/07' },
  { date: '25/jun', product: 'Blazer Oversized', sku: 'BRT-0019', qty: 1, value: 450, store: 'SP', brand: 'Bruta', brandAvatar: { letters: 'BT', color: '#7C3AED' }, split: 55, repasse: 248, ficaLoja: 203, pgto: '20/07' },
  { date: '24/jun', product: 'Vaso Cerâmica G', sku: 'DSL-0031', qty: 2, value: 520, store: 'RJ', brand: 'Dona Sol', brandAvatar: { letters: 'DS', color: '#DC2626' }, split: 55, repasse: 286, ficaLoja: 234, pgto: 'Bloqueado' },
  { date: '23/jun', product: 'Saída de Praia Azul', sku: 'LCH-0115', qty: -1, value: -290, store: 'SP', brand: 'Lua Cheia', brandAvatar: { letters: 'LC', color: '#7C3AED' }, split: 50, repasse: -145, ficaLoja: -145, pgto: '—', isReturn: true },
  { date: '22/jun', product: 'Brinco Cascata Ouro', sku: 'AMR-0087', qty: 1, value: 420, store: 'RJ', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, split: 50, repasse: 210, ficaLoja: 210, pgto: '20/07' },
  { date: '20/jun', product: 'Bolsa Tote Caramelo', sku: 'CBR-0088', qty: 1, value: 480, store: 'RJ', brand: 'Casa Bruta', brandAvatar: { letters: 'CB', color: '#D97706' }, split: 55, repasse: 264, ficaLoja: 216, pgto: '20/07' },
  { date: '18/jun', product: 'Pulseira Coral', sku: 'MER-0042', qty: 2, value: 380, store: 'SP', brand: 'Mar e Rio', brandAvatar: { letters: 'MR', color: '#2563EB' }, split: 55, repasse: 209, ficaLoja: 171, pgto: '20/07' },
];

export const amiraSales: Sale[] = [
  { date: '28/jun', product: 'Brinco Cascata Ouro', sku: 'AMR-0087', qty: 1, value: 420, store: 'SP' },
  { date: '27/jun', product: 'Colar Mandala P', sku: 'AMR-0034', qty: 2, value: 680, store: 'SP' },
  { date: '27/jun', product: 'Anel Trançado', sku: 'AMR-0091', qty: 1, value: 190, store: 'RJ' },
  { date: '26/jun', product: 'Brinco Cascata Prata', sku: 'AMR-0088', qty: 3, value: 870, store: 'SP' },
  { date: '25/jun', product: 'Pulseira Gota', sku: 'AMR-0102', qty: 1, value: 310, store: 'RJ' },
  { date: '24/jun', product: 'Colar Mandala G', sku: 'AMR-0035', qty: 1, value: 520, store: 'SP' },
  { date: '23/jun', product: 'Anel Trançado', sku: 'AMR-0091', qty: 2, value: 380, store: 'SP' },
  { date: '22/jun', product: 'Brinco Cascata Ouro', sku: 'AMR-0087', qty: 1, value: 420, store: 'RJ' },
  { date: '20/jun', product: 'Bracelete Onda', sku: 'AMR-0110', qty: 1, value: 290, store: 'SP' },
  { date: '18/jun', product: 'Colar Mandala P', sku: 'AMR-0034', qty: 1, value: 340, store: 'SP' },
];

export const pendingSkus = [
  { sku: 'BRC-1042', product: 'Bolsa Trançada P', suggestion: 'Casa Bruta' },
  { sku: 'AMR-0087', product: 'Brinco Cascata', suggestion: 'Amira' },
  { sku: 'LCH-0223', product: 'Tiara Crescente', suggestion: 'Lua Cheia' },
];

export const pendingMensalidades = [
  { brand: 'Lua Cheia', value: 1400, vencimento: '05/jun', delay: '7 dias atraso' },
  { brand: 'Dona Sol', value: 1800, vencimento: '05/jun', delay: '7 dias atraso' },
];
