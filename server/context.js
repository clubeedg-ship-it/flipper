/**
 * context.js
 *
 * Loads all mock data from src/data/ and formats it as a compact
 * structured text block to be injected into the Ollama system prompt.
 * Data is ingested once at process startup.
 */

// ---------------------------------------------------------------------------
// Raw data — mirrored from src/data/*.ts (ESM imports of .ts are not possible
// in a plain Node server, so the values are inlined here and kept in sync).
// ---------------------------------------------------------------------------

/** @type {import('../src/data/metrics.ts').Metric[]} */
const dashboardMetrics = [
  { label: 'Vendas brutas',   value: 34200, formatted: 'R$ 34.200', variation: '+12% vs mai', detail: '312 itens vendidos', breakdown: [{ label: 'SP (Jardins)', value: 'R$ 22.100', pct: '64,6%' }, { label: 'RJ (Leblon)', value: 'R$ 12.100', pct: '35,4%' }] },
  { label: 'Repasse marcas',  value: 15800, formatted: 'R$ 15.800', detail: '6 de 8 marcas processadas' },
  { label: 'Mensalidades',    value: 12400, formatted: 'R$ 12.400', variation: 'R$ 3.200 em aberto', detail: '2 pendentes' },
  { label: 'Margem loja',     value: 18400, formatted: 'R$ 18.400', variation: '53,8%', detail: 'Após repasses' },
];

const checklistItems = [
  { label: 'Sync de vendas (Bling)',       status: 'done',    statusText: 'Concluído 01/jul 09:12' },
  { label: 'Vincular SKUs pendentes',      status: 'warning', statusText: '3 SKUs sem marca' },
  { label: 'Conferir splits por marca',    status: 'done',    statusText: 'Concluído 01/jul 10:30' },
  { label: 'Cobrar mensalidades pendentes',status: 'warning', statusText: '2 pendentes' },
  { label: 'Calcular repasses',            status: 'done',    statusText: 'Concluído automaticamente' },
  { label: 'Emitir NF-e de repasse',       status: 'pending', statusText: '3 de 6 emitidas' },
  { label: 'Receber NF-e das marcas',      status: 'pending', statusText: '4 de 6 recebidas' },
  { label: 'Fechar mês',                   status: 'blocked', statusText: 'Bloqueado (itens pendentes)' },
];

/** @type {import('../src/data/brands.ts').Brand[]} */
const brands = [
  { name: 'Amira',     location: 'SP', mensalidade: 'Paga',          mensalidadeStatus: 'success', vendasJun: 5840, repasse: 'Pendente',    repasseStatus: 'warning', nfe: 'Aguardando', nfeStatus: 'warning', status: 'warning', drawer: { description: 'Joias artesanais',          activeSince: 'mar/2024', contract: { split: '50/50', mensalidade: 1800, vencimento: 'dia 5' }, june: { vendasBrutas: 5840, repasse: 2920, mensalidadeStatus: 'Paga em 03/jun', nfeRepasse: 'Aguardando emissão', nfeMensalidade: '#4587' }, history: [{ month: 'Mai/2025', value: 2650, status: 'Pago em 08/jun' }, { month: 'Abr/2025', value: 3100, status: 'Pago em 07/mai' }, { month: 'Mar/2025', value: 2200, status: 'Pago em 08/abr' }] } },
  { name: 'Lua Cheia', location: 'SP', mensalidade: 'Pendente',       mensalidadeStatus: 'warning', vendasJun: 4210, repasse: 'Pendente',    repasseStatus: 'warning', nfe: '—',          nfeStatus: 'neutral', status: 'warning', drawer: { description: 'Moda praia artesanal',       activeSince: 'jan/2024', contract: { split: '50/50', mensalidade: 1400, vencimento: 'dia 5' }, june: { vendasBrutas: 4210, repasse: 2105, mensalidadeStatus: 'Pendente',        nfeRepasse: 'Aguardando' },                                   history: [{ month: 'Mai/2025', value: 1980, status: 'Pago em 10/jun' }, { month: 'Abr/2025', value: 2300, status: 'Pago em 09/mai' }, { month: 'Mar/2025', value: 1750, status: 'Pago em 07/abr' }] } },
  { name: 'Mar e Rio', location: 'RJ', mensalidade: 'Paga',          mensalidadeStatus: 'success', vendasJun: 6320, repasse: 'R$ 2.890',   repasseStatus: 'success', nfe: 'Emitida',    nfeStatus: 'success', status: 'success', drawer: { description: 'Acessórios sustentáveis',    activeSince: 'nov/2023', contract: { split: '45/55', mensalidade: 1600, vencimento: 'dia 5' }, june: { vendasBrutas: 6320, repasse: 2890, mensalidadeStatus: 'Paga em 04/jun', nfeRepasse: 'Emitida #4590',        nfeMensalidade: '#4585' }, history: [{ month: 'Mai/2025', value: 2700, status: 'Pago em 07/jun' }, { month: 'Abr/2025', value: 3200, status: 'Pago em 08/mai' }, { month: 'Mar/2025', value: 2500, status: 'Pago em 06/abr' }] } },
  { name: 'Dona Sol',  location: 'RJ', mensalidade: 'Inadimplente',  mensalidadeStatus: 'danger',  vendasJun: 2180, repasse: 'Bloqueado',  repasseStatus: 'danger',  nfe: 'Bloqueada',  nfeStatus: 'danger',  status: 'danger',  drawer: { description: 'Cerâmica e decoração',      activeSince: 'jun/2024', contract: { split: '45/55', mensalidade: 1800, vencimento: 'dia 5' }, june: { vendasBrutas: 2180, repasse: 990,  mensalidadeStatus: 'Atrasada (7 dias)', nfeRepasse: 'Bloqueada' },                              history: [{ month: 'Mai/2025', value: 1200, status: 'Pago em 12/jun' }, { month: 'Abr/2025', value: 1500, status: 'Pago em 10/mai' }, { month: 'Mar/2025', value: 980,  status: 'Pago em 09/abr' }] } },
  { name: 'Casa Bruta',location: 'RJ', mensalidade: 'Paga',          mensalidadeStatus: 'success', vendasJun: 4950, repasse: 'R$ 2.260',   repasseStatus: 'success', nfe: 'Emitida',    nfeStatus: 'success', status: 'success', drawer: { description: 'Bolsas e couro',             activeSince: 'fev/2024', contract: { split: '45/55', mensalidade: 1500, vencimento: 'dia 5' }, june: { vendasBrutas: 4950, repasse: 2260, mensalidadeStatus: 'Paga em 02/jun', nfeRepasse: 'Emitida #4591',        nfeMensalidade: '#4583' }, history: [{ month: 'Mai/2025', value: 2100, status: 'Pago em 06/jun' }, { month: 'Abr/2025', value: 2400, status: 'Pago em 07/mai' }, { month: 'Mar/2025', value: 1900, status: 'Pago em 08/abr' }] } },
  { name: 'Brisa',     location: 'SP', mensalidade: 'Paga',          mensalidadeStatus: 'success', vendasJun: 3780, repasse: 'R$ 1.730',   repasseStatus: 'success', nfe: 'Emitida',    nfeStatus: 'success', status: 'success', drawer: { description: 'Roupas e acessórios',        activeSince: 'abr/2024', contract: { split: '45/55', mensalidade: 1200, vencimento: 'dia 5' }, june: { vendasBrutas: 3780, repasse: 1730, mensalidadeStatus: 'Paga em 03/jun', nfeRepasse: 'Emitida #4592',        nfeMensalidade: '#4584' }, history: [{ month: 'Mai/2025', value: 1600, status: 'Pago em 07/jun' }, { month: 'Abr/2025', value: 1800, status: 'Pago em 06/mai' }, { month: 'Mar/2025', value: 1400, status: 'Pago em 07/abr' }] } },
  { name: 'Bruta',     location: 'SP', mensalidade: 'Paga',          mensalidadeStatus: 'success', vendasJun: 5120, repasse: 'R$ 2.340',   repasseStatus: 'success', nfe: 'Emitida',    nfeStatus: 'success', status: 'success', drawer: { description: 'Moda autoral',               activeSince: 'mar/2024', contract: { split: '45/55', mensalidade: 1500, vencimento: 'dia 5' }, june: { vendasBrutas: 5120, repasse: 2340, mensalidadeStatus: 'Paga em 04/jun', nfeRepasse: 'Emitida #4593',        nfeMensalidade: '#4586' }, history: [{ month: 'Mai/2025', value: 2200, status: 'Pago em 08/jun' }, { month: 'Abr/2025', value: 2600, status: 'Pago em 07/mai' }, { month: 'Mar/2025', value: 2000, status: 'Pago em 06/abr' }] } },
  { name: 'Terra Mãe', location: 'SP', mensalidade: 'Sem contrato',  mensalidadeStatus: 'neutral', vendasJun: 1800, repasse: '—',          repasseStatus: 'neutral', nfe: '—',          nfeStatus: 'neutral', status: 'neutral', drawer: { description: 'Cosméticos naturais',        activeSince: 'mai/2025', contract: { split: '—',     mensalidade: 0,    vencimento: '—'   }, june: { vendasBrutas: 1800, repasse: 0,    mensalidadeStatus: 'Sem contrato',    nfeRepasse: '—' },                                         history: [] } },
];

const storeSales = [
  { date: '28/jun', product: 'Brinco Cascata Ouro',    sku: 'AMR-0087', qty: 1,  value: 420,  store: 'SP', brand: 'Amira',     split: 50, repasse: 210,  ficaLoja: 210,  pgto: '20/07' },
  { date: '27/jun', product: 'Saída de Praia Azul',    sku: 'LCH-0115', qty: 2,  value: 580,  store: 'SP', brand: 'Lua Cheia', split: 50, repasse: 290,  ficaLoja: 290,  pgto: '20/07' },
  { date: '27/jun', product: 'Pulseira Coral',         sku: 'MER-0042', qty: 3,  value: 570,  store: 'RJ', brand: 'Mar e Rio', split: 55, repasse: 314,  ficaLoja: 257,  pgto: '20/07' },
  { date: '26/jun', product: 'Bolsa Tote Caramelo',    sku: 'CBR-0088', qty: 1,  value: 480,  store: 'SP', brand: 'Casa Bruta',split: 55, repasse: 264,  ficaLoja: 216,  pgto: '20/07' },
  { date: '26/jun', product: 'Colar Mandala P',        sku: 'AMR-0034', qty: 2,  value: 680,  store: 'SP', brand: 'Amira',     split: 50, repasse: 340,  ficaLoja: 340,  pgto: '20/07' },
  { date: '25/jun', product: 'Vestido Linho P',        sku: 'BRS-0056', qty: 1,  value: 320,  store: 'RJ', brand: 'Brisa',     split: 55, repasse: 176,  ficaLoja: 144,  pgto: '20/07' },
  { date: '25/jun', product: 'Blazer Oversized',       sku: 'BRT-0019', qty: 1,  value: 450,  store: 'SP', brand: 'Bruta',     split: 55, repasse: 248,  ficaLoja: 203,  pgto: '20/07' },
  { date: '24/jun', product: 'Vaso Cerâmica G',        sku: 'DSL-0031', qty: 2,  value: 520,  store: 'RJ', brand: 'Dona Sol',  split: 55, repasse: 286,  ficaLoja: 234,  pgto: 'Bloqueado' },
  { date: '23/jun', product: 'Saída de Praia Azul',    sku: 'LCH-0115', qty: -1, value: -290, store: 'SP', brand: 'Lua Cheia', split: 50, repasse: -145, ficaLoja: -145, pgto: '—', isReturn: true },
  { date: '22/jun', product: 'Brinco Cascata Ouro',    sku: 'AMR-0087', qty: 1,  value: 420,  store: 'RJ', brand: 'Amira',     split: 50, repasse: 210,  ficaLoja: 210,  pgto: '20/07' },
  { date: '20/jun', product: 'Bolsa Tote Caramelo',    sku: 'CBR-0088', qty: 1,  value: 480,  store: 'RJ', brand: 'Casa Bruta',split: 55, repasse: 264,  ficaLoja: 216,  pgto: '20/07' },
  { date: '18/jun', product: 'Pulseira Coral',         sku: 'MER-0042', qty: 2,  value: 380,  store: 'SP', brand: 'Mar e Rio', split: 55, repasse: 209,  ficaLoja: 171,  pgto: '20/07' },
];

const pendingMensalidades = [
  { brand: 'Lua Cheia', value: 1400, vencimento: '05/jun', delay: '7 dias atraso' },
  { brand: 'Dona Sol',  value: 1800, vencimento: '05/jun', delay: '7 dias atraso' },
];

const pendingSkus = [
  { sku: 'BRC-1042', product: 'Bolsa Trançada P',    suggestion: 'Casa Bruta' },
  { sku: 'AMR-0087', product: 'Brinco Cascata',      suggestion: 'Amira' },
  { sku: 'LCH-0223', product: 'Tiara Crescente',     suggestion: 'Lua Cheia' },
];

const products = [
  { sku: 'AMR-0087', name: 'Brinco Cascata Ouro',   brand: 'Amira',     partnerValue: 210, salePrice: 420, status: 'success', origin: 'Bling' },
  { sku: 'AMR-0034', name: 'Colar Mandala P',        brand: 'Amira',     partnerValue: 170, salePrice: 340, status: 'success', origin: 'Bling' },
  { sku: 'LCH-0115', name: 'Saída de Praia Azul',   brand: 'Lua Cheia', partnerValue: 145, salePrice: 290, status: 'success', origin: 'Bling' },
  { sku: 'MER-0042', name: 'Pulseira Coral',         brand: 'Mar e Rio', partnerValue: 95,  salePrice: 190, status: 'success', origin: 'Bling' },
  { sku: 'CBR-0088', name: 'Bolsa Tote Caramelo',    brand: 'Casa Bruta',partnerValue: 240, salePrice: 480, status: 'success', origin: 'Bling' },
  { sku: 'BRS-0056', name: 'Vestido Linho P',        brand: 'Brisa',     partnerValue: 160, salePrice: 320, status: 'success', origin: 'Manual' },
  { sku: 'BRT-0019', name: 'Blazer Oversized',       brand: 'Bruta',     partnerValue: 225, salePrice: 450, status: 'success', origin: 'Bling' },
  { sku: 'DSL-0031', name: 'Vaso Cerâmica G',        brand: 'Dona Sol',  partnerValue: 130, salePrice: 260, status: 'warning', origin: 'Bling' },
];

const nfesRecebidas = [
  { numero: '#4587', brand: 'Amira',     tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1800, data: '03/06/2025', status: 'Confirmada' },
  { numero: '#4585', brand: 'Mar e Rio', tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1600, data: '04/06/2025', status: 'Confirmada' },
  { numero: '#4583', brand: 'Casa Bruta',tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1500, data: '02/06/2025', status: 'Confirmada' },
  { numero: '#4584', brand: 'Brisa',     tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1200, data: '03/06/2025', status: 'Confirmada' },
  { numero: '—',     brand: 'Lua Cheia', tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1400, data: '—',          status: 'Pendente'   },
  { numero: '—',     brand: 'Dona Sol',  tipo: 'Mensalidade', referencia: 'Jun/2025', valor: 1800, data: '—',          status: 'Bloqueada'  },
];

const nfesEmitidas = [
  { numero: '#4590', brand: 'Mar e Rio', tipo: 'Repasse', referencia: 'Jun/2025', valor: 2890, data: '15/06/2025', status: 'Emitida'  },
  { numero: '#4591', brand: 'Casa Bruta',tipo: 'Repasse', referencia: 'Jun/2025', valor: 2260, data: '15/06/2025', status: 'Emitida'  },
  { numero: '#4592', brand: 'Brisa',     tipo: 'Repasse', referencia: 'Jun/2025', valor: 1730, data: '15/06/2025', status: 'Emitida'  },
  { numero: '#4593', brand: 'Bruta',     tipo: 'Repasse', referencia: 'Jun/2025', valor: 2340, data: '15/06/2025', status: 'Emitida'  },
  { numero: '—',     brand: 'Amira',     tipo: 'Repasse', referencia: 'Jun/2025', valor: 2920, data: '—',          status: 'Pendente' },
  { numero: '—',     brand: 'Lua Cheia', tipo: 'Repasse', referencia: 'Jun/2025', valor: 2105, data: '—',          status: 'Pendente' },
];

// ---------------------------------------------------------------------------
// Formatter — builds the prompt context string once at startup
// ---------------------------------------------------------------------------

function formatMetrics() {
  const lines = dashboardMetrics.map(m => {
    let line = `  - ${m.label}: ${m.formatted}`;
    if (m.variation) line += ` (${m.variation})`;
    if (m.detail)    line += ` — ${m.detail}`;
    return line;
  });
  return lines.join('\n');
}

function formatBrands() {
  return brands.map(b => {
    const d = b.drawer;
    const june = d.june;
    return [
      `  Marca: ${b.name} (${b.location}) — ${d.description} — ativa desde ${d.activeSince}`,
      `    Contrato: split ${d.contract.split}, mensalidade R$ ${d.contract.mensalidade}, vencimento ${d.contract.vencimento}`,
      `    Jun/2025: vendas brutas R$ ${june.vendasBrutas}, repasse R$ ${june.repasse}`,
      `    Mensalidade: ${june.mensalidadeStatus} | NF-e repasse: ${june.nfeRepasse}`,
      `    Status geral: ${b.status}`,
    ].join('\n');
  }).join('\n');
}

function formatSales() {
  return storeSales.map(s => {
    const tag = s.isReturn ? ' [DEVOLUÇÃO]' : '';
    return `  ${s.date} | ${s.brand} | ${s.product} (${s.sku}) | qtd ${s.qty} | R$ ${s.value}${tag} | loja ${s.store} | repasse R$ ${s.repasse} | fica loja R$ ${s.ficaLoja} | pgto ${s.pgto}`;
  }).join('\n');
}

function formatProducts() {
  const mapped = products.map(p =>
    `  ${p.sku} — ${p.name} | marca: ${p.brand} | custo parceiro: R$ ${p.partnerValue} | preço venda: R$ ${p.salePrice} | origem: ${p.origin}`
  ).join('\n');

  const pending = pendingSkus.map(p =>
    `  ${p.sku} — ${p.product} | sugestão de marca: ${p.suggestion} [PENDENTE de vínculo]`
  ).join('\n');

  return `Mapeados:\n${mapped}\n\nSKUs pendentes de vínculo:\n${pending}`;
}

function formatNFe() {
  const recebidas = nfesRecebidas.map(n =>
    `  ${n.numero} | ${n.brand} | ${n.tipo} | ${n.referencia} | R$ ${n.valor} | ${n.data} | ${n.status}`
  ).join('\n');

  const emitidas = nfesEmitidas.map(n =>
    `  ${n.numero} | ${n.brand} | ${n.tipo} | ${n.referencia} | R$ ${n.valor} | ${n.data} | ${n.status}`
  ).join('\n');

  return `NF-e recebidas das marcas:\n${recebidas}\n\nNF-e emitidas (repasses):\n${emitidas}`;
}

function formatChecklist() {
  return checklistItems.map(c => `  [${c.status}] ${c.label}: ${c.statusText}`).join('\n');
}

function formatMensalidadesPendentes() {
  return pendingMensalidades.map(m =>
    `  ${m.brand}: R$ ${m.value} | vencimento ${m.vencimento} | ${m.delay}`
  ).join('\n');
}

// ---------------------------------------------------------------------------
// Exported context string — built once at module load time
// ---------------------------------------------------------------------------

export const dataContext = `
=== DADOS DO SISTEMA FLIPPER — Junho/2025 ===

## Métricas do dashboard
${formatMetrics()}

## Checklist de fechamento de mês
${formatChecklist()}

## Marcas parceiras (${brands.length} marcas)
${formatBrands()}

## Mensalidades pendentes
${formatMensalidadesPendentes()}

## Vendas recentes da loja (últimas ${storeSales.length} transações)
${formatSales()}

## Catálogo de produtos
${formatProducts()}

## NF-e
${formatNFe()}

=== FIM DOS DADOS ===
`.trim();
