export interface Metric {
  label: string;
  value: number;
  formatted: string;
  variation?: string;
  variationType?: 'success' | 'warning' | 'neutral';
  detail: string;
  breakdown?: { label: string; value: string; pct: string }[];
}

export const dashboardMetrics: Metric[] = [
  {
    label: 'Vendas brutas',
    value: 34200,
    formatted: 'R$ 34.200',
    variation: '+12% vs mai',
    variationType: 'success',
    detail: '312 itens vendidos',
    breakdown: [
      { label: 'SP (Jardins)', value: 'R$ 22.100', pct: '64,6%' },
      { label: 'RJ (Leblon)', value: 'R$ 12.100', pct: '35,4%' },
    ],
  },
  {
    label: 'Repasse marcas',
    value: 15800,
    formatted: 'R$ 15.800',
    detail: '6 de 8 marcas processadas',
  },
  {
    label: 'Mensalidades',
    value: 12400,
    formatted: 'R$ 12.400',
    variation: 'R$ 3.200 em aberto',
    variationType: 'warning',
    detail: '2 pendentes',
  },
  {
    label: 'Margem loja',
    value: 18400,
    formatted: 'R$ 18.400',
    variation: '53,8%',
    variationType: 'neutral',
    detail: 'Após repasses',
  },
];

export interface ChecklistItem {
  id: number;
  label: string;
  status: 'done' | 'warning' | 'pending' | 'blocked';
  statusText: string;
  interactive: boolean;
}

export const checklistItems: ChecklistItem[] = [
  { id: 1, label: 'Sync de vendas (Bling)', status: 'done', statusText: 'Concluído 01/jul 09:12', interactive: false },
  { id: 2, label: 'Vincular SKUs pendentes', status: 'warning', statusText: '3 SKUs sem marca', interactive: true },
  { id: 3, label: 'Conferir splits por marca', status: 'done', statusText: 'Concluído 01/jul 10:30', interactive: false },
  { id: 4, label: 'Cobrar mensalidades pendentes', status: 'warning', statusText: '2 pendentes', interactive: true },
  { id: 5, label: 'Calcular repasses', status: 'done', statusText: 'Concluído automaticamente', interactive: false },
  { id: 6, label: 'Emitir NF-e de repasse', status: 'pending', statusText: '3 de 6 emitidas', interactive: true },
  { id: 7, label: 'Receber NF-e das marcas', status: 'pending', statusText: '4 de 6 recebidas', interactive: false },
  { id: 8, label: 'Fechar mês', status: 'blocked', statusText: 'Bloqueado (itens pendentes)', interactive: false },
];

export const amiraMetrics = [
  { label: 'Minhas vendas', value: 5840, formatted: 'R$ 5.840', detail: '47 itens · SP e RJ' },
  { label: 'Meu repasse', value: 2920, formatted: 'R$ 2.920', detail: 'Previsão · Split 50/50' },
  { label: 'Mensalidade', value: 0, formatted: 'Paga', detail: 'R$ 1.800 · Venc. dia 5', isBadge: true },
];

export const roadmapFeatures = [
  { title: 'Relatórios avançados', description: 'Análise por marca, período, categoria. Exportação PDF.' },
  { title: 'App da marca', description: 'Portal mobile nativo para marcas parceiras.' },
  { title: 'Integrações', description: 'Tiny, Omie, Nuvemshop — conecte qualquer sistema.' },
];
