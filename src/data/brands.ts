export type BrandStatus = 'success' | 'warning' | 'danger' | 'neutral';

export interface BrandContract {
  split: string;
  mensalidade: number;
  vencimento: string;
}

export interface BrandHistory {
  month: string;
  value: number;
  status: string;
  paidDate: string;
}

export interface BrandDrawer {
  description: string;
  activeSince: string;
  contract: BrandContract;
  june: {
    vendasBrutas: number;
    repasse: number;
    mensalidadeStatus: string;
    mensalidadePaidDate?: string;
    nfeRepasse: string;
    nfeMensalidade?: string;
  };
  history: BrandHistory[];
}

export interface Brand {
  name: string;
  mensalidade: string;
  mensalidadeStatus: BrandStatus;
  vendasJun: number;
  repasse: string;
  repasseValue?: number;
  repasseStatus: BrandStatus;
  nfe: string;
  nfeStatus: BrandStatus;
  status: BrandStatus;
  drawer: BrandDrawer;
}

export const brands: Brand[] = [
  {
    name: 'Amira',
    mensalidade: 'Paga',
    mensalidadeStatus: 'success',
    vendasJun: 5840,
    repasse: 'Pendente',
    repasseStatus: 'warning',
    nfe: 'Aguardando',
    nfeStatus: 'warning',
    status: 'warning',
    drawer: {
      description: 'Joias artesanais',
      activeSince: 'mar/2024',
      contract: { split: '50/50', mensalidade: 1800, vencimento: 'dia 5' },
      june: {
        vendasBrutas: 5840,
        repasse: 2920,
        mensalidadeStatus: 'Paga em 03/jun',
        mensalidadePaidDate: '03/jun',
        nfeRepasse: 'Aguardando emissão',
        nfeMensalidade: '#4587',
      },
      history: [
        { month: 'Mai/2025', value: 2650, status: 'Pago em 08/jun', paidDate: '08/jun' },
        { month: 'Abr/2025', value: 3100, status: 'Pago em 07/mai', paidDate: '07/mai' },
        { month: 'Mar/2025', value: 2200, status: 'Pago em 08/abr', paidDate: '08/abr' },
      ],
    },
  },
  {
    name: 'Lua Cheia',
    mensalidade: 'Pendente',
    mensalidadeStatus: 'warning',
    vendasJun: 4210,
    repasse: 'Pendente',
    repasseStatus: 'warning',
    nfe: '—',
    nfeStatus: 'neutral',
    status: 'warning',
    drawer: {
      description: 'Moda praia artesanal',
      activeSince: 'jan/2024',
      contract: { split: '50/50', mensalidade: 1400, vencimento: 'dia 5' },
      june: {
        vendasBrutas: 4210,
        repasse: 2105,
        mensalidadeStatus: 'Pendente',
        nfeRepasse: 'Aguardando',
      },
      history: [
        { month: 'Mai/2025', value: 1980, status: 'Pago em 10/jun', paidDate: '10/jun' },
        { month: 'Abr/2025', value: 2300, status: 'Pago em 09/mai', paidDate: '09/mai' },
        { month: 'Mar/2025', value: 1750, status: 'Pago em 07/abr', paidDate: '07/abr' },
      ],
    },
  },
  {
    name: 'Mar e Rio',
    mensalidade: 'Paga',
    mensalidadeStatus: 'success',
    vendasJun: 6320,
    repasse: 'R$ 2.890',
    repasseValue: 2890,
    repasseStatus: 'success',
    nfe: 'Emitida',
    nfeStatus: 'success',
    status: 'success',
    drawer: {
      description: 'Acessórios sustentáveis',
      activeSince: 'nov/2023',
      contract: { split: '45/55', mensalidade: 1600, vencimento: 'dia 5' },
      june: {
        vendasBrutas: 6320,
        repasse: 2890,
        mensalidadeStatus: 'Paga em 04/jun',
        mensalidadePaidDate: '04/jun',
        nfeRepasse: 'Emitida #4590',
        nfeMensalidade: '#4585',
      },
      history: [
        { month: 'Mai/2025', value: 2700, status: 'Pago em 07/jun', paidDate: '07/jun' },
        { month: 'Abr/2025', value: 3200, status: 'Pago em 08/mai', paidDate: '08/mai' },
        { month: 'Mar/2025', value: 2500, status: 'Pago em 06/abr', paidDate: '06/abr' },
      ],
    },
  },
  {
    name: 'Dona Sol',
    mensalidade: 'Inadimplente',
    mensalidadeStatus: 'danger',
    vendasJun: 2180,
    repasse: 'Bloqueado',
    repasseStatus: 'danger',
    nfe: 'Bloqueada',
    nfeStatus: 'danger',
    status: 'danger',
    drawer: {
      description: 'Cerâmica e decoração',
      activeSince: 'jun/2024',
      contract: { split: '45/55', mensalidade: 1800, vencimento: 'dia 5' },
      june: {
        vendasBrutas: 2180,
        repasse: 990,
        mensalidadeStatus: 'Atrasada (7 dias)',
        nfeRepasse: 'Bloqueada',
      },
      history: [
        { month: 'Mai/2025', value: 1200, status: 'Pago em 12/jun', paidDate: '12/jun' },
        { month: 'Abr/2025', value: 1500, status: 'Pago em 10/mai', paidDate: '10/mai' },
        { month: 'Mar/2025', value: 980, status: 'Pago em 09/abr', paidDate: '09/abr' },
      ],
    },
  },
  {
    name: 'Casa Bruta',
    mensalidade: 'Paga',
    mensalidadeStatus: 'success',
    vendasJun: 4950,
    repasse: 'R$ 2.260',
    repasseValue: 2260,
    repasseStatus: 'success',
    nfe: 'Emitida',
    nfeStatus: 'success',
    status: 'success',
    drawer: {
      description: 'Bolsas e couro',
      activeSince: 'fev/2024',
      contract: { split: '45/55', mensalidade: 1500, vencimento: 'dia 5' },
      june: {
        vendasBrutas: 4950,
        repasse: 2260,
        mensalidadeStatus: 'Paga em 02/jun',
        mensalidadePaidDate: '02/jun',
        nfeRepasse: 'Emitida #4591',
        nfeMensalidade: '#4583',
      },
      history: [
        { month: 'Mai/2025', value: 2100, status: 'Pago em 06/jun', paidDate: '06/jun' },
        { month: 'Abr/2025', value: 2400, status: 'Pago em 07/mai', paidDate: '07/mai' },
        { month: 'Mar/2025', value: 1900, status: 'Pago em 08/abr', paidDate: '08/abr' },
      ],
    },
  },
  {
    name: 'Brisa',
    mensalidade: 'Paga',
    mensalidadeStatus: 'success',
    vendasJun: 3780,
    repasse: 'R$ 1.730',
    repasseValue: 1730,
    repasseStatus: 'success',
    nfe: 'Emitida',
    nfeStatus: 'success',
    status: 'success',
    drawer: {
      description: 'Roupas e acessórios',
      activeSince: 'abr/2024',
      contract: { split: '45/55', mensalidade: 1200, vencimento: 'dia 5' },
      june: {
        vendasBrutas: 3780,
        repasse: 1730,
        mensalidadeStatus: 'Paga em 03/jun',
        mensalidadePaidDate: '03/jun',
        nfeRepasse: 'Emitida #4592',
        nfeMensalidade: '#4584',
      },
      history: [
        { month: 'Mai/2025', value: 1600, status: 'Pago em 07/jun', paidDate: '07/jun' },
        { month: 'Abr/2025', value: 1800, status: 'Pago em 06/mai', paidDate: '06/mai' },
        { month: 'Mar/2025', value: 1400, status: 'Pago em 07/abr', paidDate: '07/abr' },
      ],
    },
  },
  {
    name: 'Bruta',
    mensalidade: 'Paga',
    mensalidadeStatus: 'success',
    vendasJun: 5120,
    repasse: 'R$ 2.340',
    repasseValue: 2340,
    repasseStatus: 'success',
    nfe: 'Emitida',
    nfeStatus: 'success',
    status: 'success',
    drawer: {
      description: 'Moda autoral',
      activeSince: 'mar/2024',
      contract: { split: '45/55', mensalidade: 1500, vencimento: 'dia 5' },
      june: {
        vendasBrutas: 5120,
        repasse: 2340,
        mensalidadeStatus: 'Paga em 04/jun',
        mensalidadePaidDate: '04/jun',
        nfeRepasse: 'Emitida #4593',
        nfeMensalidade: '#4586',
      },
      history: [
        { month: 'Mai/2025', value: 2200, status: 'Pago em 08/jun', paidDate: '08/jun' },
        { month: 'Abr/2025', value: 2600, status: 'Pago em 07/mai', paidDate: '07/mai' },
        { month: 'Mar/2025', value: 2000, status: 'Pago em 06/abr', paidDate: '06/abr' },
      ],
    },
  },
  {
    name: 'Terra Mãe',
    mensalidade: 'Sem contrato',
    mensalidadeStatus: 'neutral',
    vendasJun: 1800,
    repasse: '—',
    repasseStatus: 'neutral',
    nfe: '—',
    nfeStatus: 'neutral',
    status: 'neutral',
    drawer: {
      description: 'Cosméticos naturais',
      activeSince: 'mai/2025',
      contract: { split: '—', mensalidade: 0, vencimento: '—' },
      june: {
        vendasBrutas: 1800,
        repasse: 0,
        mensalidadeStatus: 'Sem contrato',
        nfeRepasse: '—',
      },
      history: [],
    },
  },
];
