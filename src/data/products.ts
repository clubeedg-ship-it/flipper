import type { BrandStatus } from './brands';

export interface Product {
  sku: string;
  name: string;
  brand: string | null;
  brandAvatar: { letters: string; color: string } | null;
  partnerValue: number;
  salePrice: number;
  status: BrandStatus;
  origin: string;
}

export const products: Product[] = [
  { sku: 'AMR-0087', name: 'Brinco Cascata Ouro', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, partnerValue: 210, salePrice: 420, status: 'success', origin: 'Bling' },
  { sku: 'AMR-0034', name: 'Colar Mandala P', brand: 'Amira', brandAvatar: { letters: 'AM', color: '#0D9488' }, partnerValue: 170, salePrice: 340, status: 'success', origin: 'Bling' },
  { sku: 'LCH-0115', name: 'Saída de Praia Azul', brand: 'Lua Cheia', brandAvatar: { letters: 'LC', color: '#7C3AED' }, partnerValue: 145, salePrice: 290, status: 'success', origin: 'Bling' },
  { sku: 'MER-0042', name: 'Pulseira Coral', brand: 'Mar e Rio', brandAvatar: { letters: 'MR', color: '#2563EB' }, partnerValue: 95, salePrice: 190, status: 'success', origin: 'Bling' },
  { sku: 'CBR-0088', name: 'Bolsa Tote Caramelo', brand: 'Casa Bruta', brandAvatar: { letters: 'CB', color: '#D97706' }, partnerValue: 240, salePrice: 480, status: 'success', origin: 'Bling' },
  { sku: 'BRS-0056', name: 'Vestido Linho P', brand: 'Brisa', brandAvatar: { letters: 'BR', color: '#059669' }, partnerValue: 160, salePrice: 320, status: 'success', origin: 'Manual' },
  { sku: 'BRT-0019', name: 'Blazer Oversized', brand: 'Bruta', brandAvatar: { letters: 'BT', color: '#7C3AED' }, partnerValue: 225, salePrice: 450, status: 'success', origin: 'Bling' },
  { sku: 'DSL-0031', name: 'Vaso Cerâmica G', brand: 'Dona Sol', brandAvatar: { letters: 'DS', color: '#DC2626' }, partnerValue: 130, salePrice: 260, status: 'warning', origin: 'Bling' },
];

export interface UnmappedSku {
  sku: string;
  name: string;
  origin: string;
  lockedValue: number;
}

export const unmappedSkus: UnmappedSku[] = [
  { sku: 'IMP-4021', name: 'Cinto Trançado Bege', origin: 'Bling', lockedValue: 280 },
  { sku: 'IMP-4022', name: 'Anel Prata Martelado', origin: 'Manual', lockedValue: 350 },
  { sku: 'IMP-4023', name: 'Lenço Estampado Floral', origin: 'Bling', lockedValue: 260 },
];
