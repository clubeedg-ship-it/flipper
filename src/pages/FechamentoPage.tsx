import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { brands } from '../data/brands';
import type { UnitFilter } from '../data/brands';
import CountUp from '../components/ui/CountUp';
import Badge from '../components/ui/Badge';

const checklistSteps = [
  { label: 'Vendas importadas', sub: '42 itens lidos do Bling/PDV', status: 'ok' as const, link: null },
  { label: 'SKUs sem loja parceira', sub: '3 itens precisam de vínculo', status: 'block' as const, link: 'produtos' },
  { label: 'Regra 50/50 aplicada', sub: 'Loja e parceira calculadas por item', status: 'ok' as const, link: null },
  { label: 'Dona Sol inadimplente', sub: 'Repasse bloqueado até regularização', status: 'review' as const, link: 'cobrancas' },
];

const closingBrands = brands.filter(b => b.status !== 'neutral').map(b => ({
  name: b.name,
  vendido: b.vendasJun,
  ficaLoja: Math.round(b.vendasJun * 0.5),
  repasse: Math.round(b.vendasJun * 0.5),
  nfe: b.nfeStatus === 'success' ? 'Emitida' : b.nfeStatus === 'danger' ? 'Bloqueada' : 'Aguardando',
  nfeStatus: b.nfeStatus,
  statusLabel: b.status === 'success' ? 'OK' : b.status === 'danger' ? 'Bloqueado' : 'Pendente',
  statusSub: b.status === 'warning' ? 'Aguardando NF-e da marca' : b.status === 'danger' ? 'Mensalidade inadimplente' : undefined,
  statusType: b.status,
}));

interface FechamentoPageProps {
  onNavigate?: (page: string) => void;
  unitFilter?: UnitFilter;
}

export default function FechamentoPage({ onNavigate, unitFilter = 'Todas' }: FechamentoPageProps) {
  const [nfeSent, setNfeSent] = useState(false);
  const [reportsSent, setReportsSent] = useState(false);
  const [closed, setClosed] = useState(false);
  const [period, setPeriod] = useState('Junho 2025');
  const [rowsEmitted, setRowsEmitted] = useState<string[]>([]);

  const filteredClosing = useMemo(() =>
    unitFilter === 'Todas' ? closingBrands : closingBrands.filter(cb => {
      const brand = brands.find(b => b.name === cb.name);
      return brand && brand.location === unitFilter;
    }),
    [unitFilter]
  );
  const totalVendido = filteredClosing.reduce((s, b) => s + b.vendido, 0);
  const totalLoja = filteredClosing.reduce((s, b) => s + b.ficaLoja, 0);
  const totalRepasse = filteredClosing.reduce((s, b) => s + b.repasse, 0);
  const totalMensalidades = filteredClosing.reduce((s, b) => {
    const brand = brands.find(br => br.name === b.name);
    return s + (brand?.drawer.contract.mensalidade || 0);
  }, 0);
  const mensalidadesPagas = filteredClosing.reduce((s, b) => {
    const brand = brands.find(br => br.name === b.name);
    return s + (brand && brand.mensalidadeStatus === 'success' ? brand.drawer.contract.mensalidade : 0);
  }, 0);
  const pendentesNomes = filteredClosing
    .filter(b => { const brand = brands.find(br => br.name === b.name); return brand && brand.mensalidadeStatus !== 'success' && brand.mensalidadeStatus !== 'neutral'; })
    .map(b => b.name);

  const hasBlockers = checklistSteps.some(s => s.status !== 'ok');

  return (
    <div className="content-max space-y-8">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px]">Período</span>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1.5 border border-[--border] rounded-lg font-body text-[13px] text-[--text-primary] bg-white cursor-pointer"
          >
            <option>Junho 2025</option>
            <option>Maio 2025</option>
            <option>Abril 2025</option>
            <option>Março 2025</option>
          </select>
        </div>
        <p className="font-caption text-[--text-tertiary]">
          Visualizando: <span className="text-[--text-secondary] font-medium">{period}</span>
        </p>
      </div>

      {/* Section: Junho 2025 — em andamento */}
      <div>
        <h2 className="font-heading text-[20px] text-[--text-primary] mb-6">Junho 2025 — em andamento</h2>

        {/* Metrics */}
        <div className="grid gap-5 mb-6" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {[
            { label: 'TOTAL VENDAS', value: totalVendido, sub: `${filteredClosing.length} lojas parceiras` },
            { label: 'FICA PARA LOJA', value: totalLoja, sub: '50% das vendas elegíveis' },
            { label: 'A REPASSAR', value: totalRepasse, sub: 'Até 20/07' },
            { label: 'MENSALIDADES', value: totalMensalidades, sub: `R$ ${mensalidadesPagas.toLocaleString('pt-BR')} de R$ ${totalMensalidades.toLocaleString('pt-BR')} recebidos${pendentesNomes.length > 0 ? ` · ${pendentesNomes.join(' e ')} pendentes` : ''}` },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="metric-card"
            >
              <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">{m.label}</p>
              <CountUp end={m.value} prefix="R$" start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
              <p className="font-caption text-[--text-tertiary] mt-1.5">{m.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Alert */}
        {hasBlockers && !closed && (
          <div className="alert-banner alert-banner-warning mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Fechamento ainda não pode ser concluído: <strong>pendências precisam ser resolvidas</strong>.</span>
          </div>
        )}

        {closed && (
          <div className="alert-banner alert-banner-success mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Mês de junho fechado com sucesso. Relatórios enviados às lojas parceiras.</span>
          </div>
        )}

        {/* Checklist */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-subheading text-[16px] text-[--text-primary]">Checklist de fechamento</h3>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[--warning]">
              <span className="w-2 h-2 rounded-full bg-[--warning]" />
              {checklistSteps.filter(s => s.status !== 'ok').length} pendências
            </span>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {checklistSteps.map(step => (
              <div
                key={step.label}
                className={`rounded-xl border p-4 ${step.link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                style={{ borderColor: step.status === 'block' ? '#DC2626' : step.status === 'review' ? '#F59E0B' : 'var(--border)', background: 'var(--bg-primary)' }}
                onClick={() => step.link && onNavigate?.(step.link)}
              >
                <Badge
                  status={step.status === 'ok' ? 'success' : step.status === 'block' ? 'danger' : 'warning'}
                  label={step.status === 'ok' ? 'OK' : step.status === 'block' ? 'Bloqueio' : 'Revisar'}
                  showDot
                />
                <p className="font-subheading text-[14px] text-[--text-primary] mt-3">{step.label}</p>
                <p className="font-caption text-[--text-tertiary] mt-1">{step.sub}</p>
                {step.link && (
                  <p className="font-caption mt-2" style={{ color: '#0D9488' }}>Resolver →</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Concluir button */}
        <button
          onClick={() => setClosed(true)}
          disabled={hasBlockers}
          className="px-6 py-3 rounded-lg font-subheading text-[14px] text-white cursor-pointer border-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: hasBlockers ? '#9CA3AF' : '#16A34A' }}
          title={hasBlockers ? 'Resolva as pendências antes de fechar' : ''}
        >
          {closed ? 'Fechamento concluído' : 'Concluir fechamento'}
        </button>
      </div>

      {/* Section: Maio 2025 — fechado */}
      <div>
        <h2 className="font-heading text-[20px] text-[--text-primary] mb-6 pt-4 border-t border-[--border]">Maio 2025 — fechado</h2>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <Badge status="success" label="Fechado" showDot />
            <div className="flex gap-2">
              <button
                onClick={() => setReportsSent(true)}
                className={`px-4 py-2 border border-[--border] rounded-lg font-label text-[12px] transition-colors cursor-pointer ${reportsSent ? 'bg-[--success-light] text-[--success] border-[--success]' : 'text-[--text-primary] hover:bg-[--bg-primary] bg-[--bg-content]'}`}
              >
                {reportsSent ? 'Relatórios enviados' : 'Enviar relatórios'}
              </button>
              <button
                onClick={() => setNfeSent(true)}
                className={`px-4 py-2 rounded-lg font-label text-[12px] transition-colors cursor-pointer border-none ${nfeSent ? 'bg-[--success] text-white' : 'text-white'}`}
                style={!nfeSent ? { background: '#0D9488' } : undefined}
              >
                {nfeSent ? 'NF-es emitidas' : 'Emitir NF-es'}
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[--border]">
                {['LOJA PARCEIRA', 'VENDIDO CLIENTE', 'FICA LOJA', 'REPASSE', 'NF-E', 'STATUS', ''].map(h => (
                  <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClosing.map(b => {
                const rowEmitted = rowsEmitted.includes(b.name);
                const effectiveNfeStatus = (nfeSent || rowEmitted) && b.nfeStatus !== 'danger' ? 'success' : b.nfeStatus;
                const effectiveNfeLabel = (nfeSent || rowEmitted) && b.nfeStatus !== 'danger' ? 'Emitida' : b.nfe;
                const canEmit = b.nfeStatus !== 'success' && b.nfeStatus !== 'danger' && !nfeSent && !rowEmitted;
                return (
                  <tr key={b.name} className="border-b border-[--border] last:border-b-0">
                    <td className="py-3.5 pr-4">
                      <div>
                        <span className="font-subheading text-[14px]">{b.name}</span>
                        {b.statusSub && <p className="font-caption text-[--text-tertiary]">{b.statusSub}</p>}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {b.vendido.toLocaleString('pt-BR')}</td>
                    <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {b.ficaLoja.toLocaleString('pt-BR')}</td>
                    <td className="py-3.5 pr-4 font-mono text-[14px]" style={{ color: '#0D9488' }}>R$ {b.repasse.toLocaleString('pt-BR')}</td>
                    <td className="py-3.5 pr-4"><Badge status={effectiveNfeStatus} label={effectiveNfeLabel} showDot /></td>
                    <td className="py-3.5 pr-4"><Badge status={b.statusType} label={b.statusLabel} showDot /></td>
                    <td className="py-3.5 text-right">
                      {canEmit && (
                        <button
                          onClick={() => setRowsEmitted(prev => [...prev, b.name])}
                          className="px-3 py-1.5 rounded-lg font-label text-[12px] text-white cursor-pointer border-none transition-colors"
                          style={{ background: '#0D9488' }}
                        >
                          Emitir
                        </button>
                      )}
                      {rowEmitted && !nfeSent && (
                        <span className="font-caption text-[--success]">Emitida</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
