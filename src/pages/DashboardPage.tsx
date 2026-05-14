import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { brands } from '../data/brands';
import type { UnitFilter } from '../data/brands';
import CountUp from '../components/ui/CountUp';
import Badge from '../components/ui/Badge';
import BrandProfileDrawer from '../components/ui/BrandProfileDrawer';

const brandInitials: Record<string, { letters: string; color: string }> = {
  'Amira': { letters: 'AM', color: '#0D9488' },
  'Lua Cheia': { letters: 'LC', color: '#7C3AED' },
  'Mar e Rio': { letters: 'MR', color: '#2563EB' },
  'Dona Sol': { letters: 'DS', color: '#DC2626' },
  'Casa Bruta': { letters: 'CB', color: '#D97706' },
  'Brisa': { letters: 'BR', color: '#059669' },
  'Bruta': { letters: 'BT', color: '#7C3AED' },
  'Terra Mãe': { letters: 'TM', color: '#6B7280' },
};

const actionQueue = [
  { id: 1, title: 'Vincular 3 SKUs sem loja parceira', sub: 'R$ 890 travados fora do fechamento', action: 'Resolver' },
  { id: 2, title: 'Confirmar contrato de Terra Mãe', sub: 'Modelo comercial pendente de aprovação', action: 'Revisar' },
  { id: 3, title: 'NF-e pendente — Lua Cheia e Dona Sol', sub: 'Repasse aguarda recebimento da nota fiscal', action: 'Ver' },
];

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
  unitFilter?: UnitFilter;
}

export default function DashboardPage({ onNavigate, unitFilter = 'Todas' }: DashboardPageProps) {
  const [resolvedActions, setResolvedActions] = useState<number[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const filteredBrands = useMemo(() =>
    unitFilter === 'Todas' ? brands : brands.filter(b => b.location === unitFilter),
    [unitFilter]
  );

  const metrics = useMemo(() => {
    const vendasBrutas = filteredBrands.reduce((s, b) => s + b.vendasJun, 0);
    const repasseMarcas = filteredBrands.reduce((s, b) => s + (b.repasseValue || Math.round(b.vendasJun * 0.5)), 0);
    const mensalidadesTotal = filteredBrands.reduce((s, b) => s + b.drawer.contract.mensalidade, 0);
    const mensalidadesAberto = filteredBrands.filter(b => b.mensalidadeStatus !== 'success' && b.mensalidadeStatus !== 'neutral').reduce((s, b) => s + b.drawer.contract.mensalidade, 0);
    const pendentes = filteredBrands.filter(b => b.mensalidadeStatus !== 'success' && b.mensalidadeStatus !== 'neutral').length;

    // Margem loja = retido em vendas (por split contratual) + mensalidades confirmadas
    const retidoVendas = filteredBrands.reduce((s, b) => {
      const split = b.drawer.contract.split; // e.g. "50/50", "45/55"
      const lojaPct = split.includes('/') ? Number(split.split('/')[0]) / 100 : 0.5;
      return s + Math.round(b.vendasJun * lojaPct);
    }, 0);
    const mensalidadesConfirmadas = filteredBrands
      .filter(b => b.mensalidadeStatus === 'success')
      .reduce((s, b) => s + b.drawer.contract.mensalidade, 0);
    const margemLoja = retidoVendas + mensalidadesConfirmadas;

    // Previous-month estimate: derive loja's retained portion from history (Mai/2025)
    const previousRetido = filteredBrands.reduce((s, b) => {
      const last = b.drawer.history[0];
      const split = b.drawer.contract.split;
      const lojaPct = split.includes('/') ? Number(split.split('/')[0]) / 100 : 0.5;
      return s + (last ? Math.round((last.value / (1 - lojaPct)) * lojaPct) : 0);
    }, 0);
    const previousMargem = previousRetido + mensalidadesTotal;
    const margemDelta = previousMargem > 0 ? ((margemLoja - previousMargem) / previousMargem) * 100 : 0;
    const deltaSign = margemDelta >= 0 ? '+' : '';

    return [
      { label: 'Vendas brutas', value: vendasBrutas, variation: '+12% vs mai', variationType: 'success' as const, detail: `${filteredBrands.length} lojas parceiras` },
      { label: 'Repasse previsto', value: repasseMarcas, variation: `${filteredBrands.filter(b => b.repasseStatus === 'success').length} de ${filteredBrands.length} pagos`, variationType: 'neutral' as const, detail: `Dia 20/07/2025` },
      { label: 'Mensalidades', value: mensalidadesTotal, variation: mensalidadesAberto > 0 ? `R$ ${mensalidadesAberto.toLocaleString('pt-BR')} em aberto` : undefined, variationType: 'warning' as const, detail: pendentes > 0 ? `${pendentes} pendentes` : 'Todas em dia' },
      { label: 'Margem loja', value: margemLoja, variation: previousMargem > 0 ? `${deltaSign}${margemDelta.toFixed(1)}% vs mai` : '—', variationType: (margemDelta >= 0 ? 'success' : 'warning') as 'success' | 'warning' | 'neutral', detail: `Retido vendas + ${mensalidadesConfirmadas > 0 ? `R$ ${mensalidadesConfirmadas.toLocaleString('pt-BR')} mensalidades` : 'sem mensalidades'}` },
    ];
  }, [filteredBrands]);

  return (
    <div className="content-max space-y-8">
      {/* Metrics */}
      <div className="kpi-grid-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="metric-card"
          >
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">{m.label}</p>
            <div className="mb-1">
              <CountUp end={m.value} prefix="R$ " start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
            </div>
            {m.variation && (
              <span className={`inline-flex items-center gap-1 text-[12px] font-medium ${
                m.variationType === 'success' ? 'text-[--success]' : m.variationType === 'warning' ? 'text-[--warning]' : 'text-[--text-secondary]'
              }`}>
                {m.variationType === 'success' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                )}
                {m.variation}
              </span>
            )}
            <p className="font-caption text-[--text-tertiary] mt-1.5">{m.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Unified alert block */}
      <div className="card p-5" style={{ borderLeft: '3px solid var(--warning)' }}>
        <h4 className="font-label text-[11px] text-[--warning] uppercase tracking-[1px] mb-3">Pendências críticas</h4>
        <div className="space-y-2.5">
          <div className="pending-item-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span className="font-body text-[13px] text-[--text-primary]"><strong>2 lojas parceiras</strong> com mensalidade em aberto — Lua Cheia e Marca D · Lembretes enviados em 01/06</span>
          </div>
          <div className="pending-item-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span className="font-body text-[13px] text-[--text-primary]"><strong>3 SKUs sem loja parceira</strong> · R$ 890 travados fora do fechamento</span>
            <button onClick={() => onNavigate?.('produtos')} className="pending-item-btn px-3 py-1 border border-[--border] rounded-md font-label text-[11px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]">Resolver</button>
          </div>
          <div className="pending-item-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span className="font-body text-[13px] text-[--text-secondary]"><strong>Terra Mãe</strong> — cadastro incompleto, sem contrato definido</span>
            <button onClick={() => setSelectedBrand('Terra Mãe')} className="pending-item-btn px-3 py-1 border border-[--border] rounded-md font-label text-[11px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]">Revisar</button>
          </div>
        </div>
      </div>

      {/* Action queue */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Fila operacional</h3>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[--warning]">
            <span className="w-2 h-2 rounded-full bg-[--warning]" />
            {3 - resolvedActions.length} pendências
          </span>
        </div>
        <div className="space-y-1">
          {actionQueue.map((item) => {
            const resolved = resolvedActions.includes(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                className={`flex items-center gap-4 py-3.5 px-4 rounded-lg transition-colors ${resolved ? 'opacity-50' : 'hover:bg-[--bg-primary]'}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${resolved ? 'bg-[--success-light] text-[--success]' : 'bg-[--bg-primary] text-[--text-tertiary] border border-[--border]'}`}>
                  {resolved ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : item.id}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-[14px] ${resolved ? 'line-through text-[--text-tertiary]' : 'text-[--text-primary]'}`}>{item.title}</p>
                  <p className="font-caption text-[--text-tertiary]">{item.sub}</p>
                </div>
                {!resolved && (
                  <button
                    onClick={() => setResolvedActions(prev => [...prev, item.id])}
                    className="px-4 py-1.5 border border-[--border] rounded-lg font-label text-[12px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]"
                  >
                    {item.action}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Brand status table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Status das lojas parceiras — Junho 2025</h3>
          <button
            onClick={() => onNavigate?.('lojas')}
            className="px-4 py-1.5 border border-[--border] rounded-lg font-label text-[12px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]"
          >
            Ver todos
          </button>
        </div>
        <div className="table-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Marca</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Mensalidade</th>
              <th className="text-right font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Vendas maio</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Repasse</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3">NF-e</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((b) => {
              const ini = brandInitials[b.name] || { letters: b.name.slice(0, 2).toUpperCase(), color: '#6B7280' };
              return (
                <tr key={b.name} className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors cursor-pointer" onClick={() => setSelectedBrand(b.name)}>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: ini.color }}>{ini.letters}</span>
                      <span className="font-subheading text-[14px]">{b.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[--bg-primary] text-[--text-tertiary] border border-[--border]">{b.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4"><Badge status={b.mensalidadeStatus} label={b.mensalidade} showDot /></td>
                  <td className="py-3.5 pr-4 text-right font-mono text-[14px]">R$ {b.vendasJun.toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 pr-4"><Badge status={b.repasseStatus} label={b.repasse} showDot /></td>
                  <td className="py-3.5"><Badge status={b.nfeStatus} label={b.nfe} showDot /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Bottom row */}
      <div className="two-col-grid">
        <div className="card p-6">
          <h3 className="font-subheading text-[16px] text-[--text-primary] mb-4">Próximos vencimentos</h3>
          <div className="space-y-3">
            {[
              { type: 'mensalidade', brand: 'Lua Cheia', status: 'Atrasada', statusType: 'danger' as const, value: 'R$ 1.200', due: 'Venceu 05/06/2025' },
              { type: 'mensalidade', brand: 'Marca D', status: 'Pendente', statusType: 'warning' as const, value: 'R$ 800', due: 'Vence 10/06/2025' },
              { type: 'repasse', brand: 'Amira', status: 'Pendente', statusType: 'warning' as const, value: 'R$ 2.920', due: 'Vence 20/07 · NF-e recebida', nfe: true },
              { type: 'repasse', brand: 'Lua Cheia', status: 'Bloqueado', statusType: 'danger' as const, value: 'R$ 2.105', due: 'Vence 20/07 · NF-e pendente', nfe: false },
            ].map(r => (
              <div key={`${r.type}-${r.brand}`} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-body text-[14px] text-[--text-primary]">{r.type === 'mensalidade' ? 'Mensalidade' : 'Repasse'} — {r.brand}</p>
                  <p className="font-caption text-[--text-tertiary] flex items-center gap-1.5">
                    {r.due}
                    {r.type === 'repasse' && (
                      <span className={`inline-flex items-center gap-1 ${r.nfe ? 'text-[--success]' : 'text-[--warning]'}`}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={r.statusType} label={r.status} showDot />
                  <span className="font-mono text-[14px]">{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-subheading text-[16px] text-[--text-primary] mb-4">Atividade recente</h3>
          <div className="space-y-3">
            {[
              { title: 'Mensalidade paga', sub: 'Amira · Pix · agora', badge: '+R$ 1.800', badgeColor: 'text-[--success]' },
              { title: 'NF-e emitida', sub: 'Mar e Rio · #4590', badge: 'NF-e', badgeColor: 'text-[--accent]' },
              { title: 'Vendas importadas', sub: 'ERP · 42 itens · 09:12', badge: 'Sync', badgeColor: 'text-[--text-tertiary]' },
            ].map(a => (
              <div key={a.title} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-body text-[14px] text-[--text-primary]">{a.title}</p>
                  <p className="font-caption text-[--text-tertiary]">{a.sub}</p>
                </div>
                <span className={`font-mono text-[13px] ${a.badgeColor}`}>{a.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BrandProfileDrawer brandName={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </div>
  );
}
