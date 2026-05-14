import { useState } from 'react';
import { motion } from 'framer-motion';
import { brands } from '../data/brands';
import CountUp from '../components/ui/CountUp';
import Badge from '../components/ui/Badge';

const checklistSteps = [
  { label: 'Vendas importadas', sub: '42 itens lidos do Bling/PDV', status: 'ok' as const },
  { label: 'SKUs sem loja parceira', sub: '3 itens precisam de vínculo', status: 'block' as const },
  { label: 'Regra 50/50 aplicada', sub: 'Loja e parceira calculadas por item', status: 'ok' as const },
  { label: 'Dona Sol inadimplente', sub: 'Repasse bloqueado até regularização', status: 'review' as const },
];

const closingBrands = brands.filter(b => b.status !== 'neutral').map(b => ({
  name: b.name,
  vendido: b.vendasJun,
  ficaLoja: Math.round(b.vendasJun * 0.5),
  repasse: Math.round(b.vendasJun * 0.5),
  nfe: b.nfeStatus === 'success' ? 'Emitida' : b.nfeStatus === 'danger' ? 'Bloqueada' : 'Aguardando',
  nfeStatus: b.nfeStatus,
  statusLabel: b.status === 'success' ? 'OK' : b.status === 'danger' ? 'Bloqueado' : 'Pendente',
  statusType: b.status,
}));

export default function FechamentoPage() {
  const [nfeSent, setNfeSent] = useState(false);
  const [reportsSent, setReportsSent] = useState(false);

  const totalVendido = closingBrands.reduce((s, b) => s + b.vendido, 0);
  const totalLoja = closingBrands.reduce((s, b) => s + b.ficaLoja, 0);
  const totalRepasse = closingBrands.reduce((s, b) => s + b.repasse, 0);
  const totalMensalidades = 12400;

  return (
    <div className="content-max space-y-8">
      {/* Metrics */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {[
          { label: 'TOTAL VENDAS', value: totalVendido, sub: `${closingBrands.length} lojas parceiras` },
          { label: 'FICA PARA LOJA', value: totalLoja, sub: '50% das vendas elegíveis' },
          { label: 'A REPASSAR', value: totalRepasse, sub: 'Até 20/06' },
          { label: 'MENSALIDADES', value: totalMensalidades, sub: `de R$ ${totalMensalidades.toLocaleString('pt-BR')} recebidos` },
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
      <div className="alert-banner alert-banner-warning">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Fechamento ainda não pode ser concluído: <strong>3 SKUs sem loja parceira</strong> precisam ser resolvidos.</span>
      </div>

      {/* Checklist */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Checklist de fechamento</h3>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[--warning]">
            <span className="w-2 h-2 rounded-full bg-[--warning]" />
            2 bloqueios
          </span>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {checklistSteps.map(step => (
            <div key={step.label} className="rounded-xl border border-[--border] p-4 bg-[--bg-primary]/50">
              <Badge
                status={step.status === 'ok' ? 'success' : step.status === 'block' ? 'danger' : 'warning'}
                label={step.status === 'ok' ? 'OK' : step.status === 'block' ? 'Bloqueio' : 'Revisar'}
                showDot
              />
              <p className="font-subheading text-[14px] text-[--text-primary] mt-3">{step.label}</p>
              <p className="font-caption text-[--text-tertiary] mt-1">{step.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Fechamento — Maio 2025</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setReportsSent(true)}
              className={`px-4 py-2 border border-[--border] rounded-lg font-label text-[12px] transition-colors cursor-pointer ${reportsSent ? 'bg-[--success-light] text-[--success] border-[--success]' : 'text-[--text-primary] hover:bg-[--bg-primary] bg-[--bg-content]'}`}
            >
              {reportsSent ? 'Relatórios enviados' : 'Enviar relatórios'}
            </button>
            <button
              onClick={() => setNfeSent(true)}
              className={`px-4 py-2 rounded-lg font-label text-[12px] transition-colors cursor-pointer border-none ${nfeSent ? 'bg-[--success] text-white' : 'bg-[--accent] hover:bg-[--accent-hover] text-white'}`}
            >
              {nfeSent ? 'NF-es emitidas' : 'Emitir NF-es'}
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['LOJA PARCEIRA', 'VENDIDO CLIENTE', 'FICA LOJA', 'REPASSE', 'NF-E', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {closingBrands.map(b => (
              <tr key={b.name} className="border-b border-[--border] last:border-b-0">
                <td className="py-3.5 pr-4 font-subheading text-[14px]">{b.name}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {b.vendido.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {b.ficaLoja.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px] text-[--accent]">R$ {b.repasse.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4"><Badge status={nfeSent && b.nfeStatus !== 'danger' ? 'success' : b.nfeStatus} label={nfeSent && b.nfeStatus !== 'danger' ? 'Emitida' : b.nfe} showDot /></td>
                <td className="py-3.5"><Badge status={b.statusType} label={b.statusLabel} showDot /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
