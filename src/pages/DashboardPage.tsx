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
    return [
      { label: 'Vendas brutas', value: vendasBrutas, variation: '+12% vs mai', variationType: 'success' as const, detail: `${filteredBrands.length} lojas parceiras` },
      { label: 'Repasse marcas', value: repasseMarcas, detail: `${filteredBrands.filter(b => b.repasseStatus === 'success').length} de ${filteredBrands.length} processados` },
      { label: 'Mensalidades', value: mensalidadesTotal, variation: mensalidadesAberto > 0 ? `R$ ${mensalidadesAberto.toLocaleString('pt-BR')} em aberto` : undefined, variationType: 'warning' as const, detail: pendentes > 0 ? `${pendentes} pendentes` : 'Todas em dia' },
      { label: 'Margem loja', value: vendasBrutas - repasseMarcas, variation: vendasBrutas > 0 ? `${((1 - repasseMarcas / vendasBrutas) * 100).toFixed(1)}%` : '—', variationType: 'neutral' as const, detail: 'Após repasses' },
    ];
  }, [filteredBrands]);

  return (
    <div className="content-max space-y-8">
      {/* Metrics */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
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

      {/* Alert banners */}
      <div className="space-y-3">
        <div className="alert-banner alert-banner-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span><strong>2 lojas parceiras</strong> com mensalidade em aberto · Lembretes enviados automaticamente em 01/06</span>
        </div>
        <div className="alert-banner alert-banner-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span><strong>3 itens importados sem loja parceira</strong> · vincule os SKUs antes do fechamento para liberar R$ 890 em vendas</span>
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
            {filteredBrands.slice(0, 6).map((b) => {
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

      {/* Bottom row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        <div className="card p-6">
          <h3 className="font-subheading text-[16px] text-[--text-primary] mb-4">Próximos vencimentos</h3>
          <div className="space-y-3">
            {[
              { brand: 'Amira', status: 'Pendente', statusType: 'warning' as const, value: 'R$ 2.920', due: 'Vence 20/06/2025 · 47 vendas no extrato' },
              { brand: 'Lua Cheia', status: 'Pendente', statusType: 'warning' as const, value: 'R$ 2.105', due: 'Vence 20/06/2025 · 31 vendas no extrato' },
            ].map(r => (
              <div key={r.brand} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-body text-[14px] text-[--text-primary]">Repasse — {r.brand}</p>
                  <p className="font-caption text-[--text-tertiary]">{r.due}</p>
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
              { title: 'Vendas importadas', sub: 'Bling · 42 itens · 09:12', badge: 'Sync', badgeColor: 'text-[--text-tertiary]' },
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
