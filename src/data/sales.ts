export interface Sale {
  date: string;
  product: string;
  sku: string;
  qty: number;
  value: number;
  store: 'SP' | 'RJ';
}

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
