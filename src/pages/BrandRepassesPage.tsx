import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brands } from '../data/brands';
import CountUp from '../components/ui/CountUp';
import Badge from '../components/ui/Badge';
import type { BrandStatus } from '../data/brands';

const amira = brands.find(b => b.name === 'Amira')!;
const contract = amira.drawer.contract;
const june = amira.drawer.june;

interface RepasseHistoryRow {
  month: string;
  value: number;
  status: 'Pago' | 'Pendente' | 'Bloqueado';
  statusType: BrandStatus;
  paidDate?: string;
  method?: string;
  reason?: string;
  vendas: number;
  ficaLoja: number;
}

const repasseHistory: RepasseHistoryRow[] = [
  { month: 'Jun/2025', value: june.repasse, status: 'Pendente', statusType: 'warning', vendas: june.vendasBrutas, ficaLoja: june.vendasBrutas - june.repasse },
  { month: 'Mai/2025', value: 2650, status: 'Pago', statusType: 'success', paidDate: '08/06/2025', method: 'Pix', vendas: 5300, ficaLoja: 2650 },
  { month: 'Abr/2025', value: 3100, status: 'Pago', statusType: 'success', paidDate: '07/05/2025', method: 'Pix', vendas: 6200, ficaLoja: 3100 },
  { month: 'Mar/2025', value: 2200, status: 'Pago', statusType: 'success', paidDate: '08/04/2025', method: 'Pix', vendas: 4400, ficaLoja: 2200 },
  { month: 'Fev/2025', value: 1980, status: 'Pago', statusType: 'success', paidDate: '07/03/2025', method: 'Transferência', vendas: 3960, ficaLoja: 1980 },
  { month: 'Jan/2025', value: 2400, status: 'Pago', statusType: 'success', paidDate: '06/02/2025', method: 'Pix', vendas: 4800, ficaLoja: 2400 },
];

export default function BrandRepassesPage() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const acumulado2025 = repasseHistory.reduce((s, r) => s + r.value, 0);
  const selected = repasseHistory.find(r => r.month === selectedMonth);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1200);
  };

  return (
    <div className="content-max space-y-6">
      {/* KPIs */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="metric-card"
        >
          <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">PRÓXIMO REPASSE</p>
          <CountUp end={june.repasse} prefix="R$" start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
          <p className="font-caption text-[--text-tertiary] mt-1.5">Junho 2025 · Previsto até 20/07</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
          className="metric-card"
        >
          <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">ACUMULADO 2025</p>
          <CountUp end={acumulado2025} prefix="R$" start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
          <p className="font-caption text-[--text-tertiary] mt-1.5">6 meses · Média R$ {Math.round(acumulado2025 / 6).toLocaleString('pt-BR')}/mês</p>
        </motion.div>
      </div>

      {/* Current month highlight */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="card p-6"
        style={{ borderColor: '#F59E0B', background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, rgba(255,255,255,0) 60%)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-label text-[11px] uppercase tracking-[1px] mb-1" style={{ color: '#F59E0B' }}>REPASSE EM ANDAMENTO</p>
            <h3 className="font-heading text-[20px] text-[--text-primary]">Junho 2025</h3>
          </div>
          <Badge status="warning" label="Pendente" showDot />
        </div>
        <div className="space-y-3.5 text-[14px]">
          <div className="flex justify-between items-center py-1">
            <span className="text-[--text-secondary]">Vendas no mês</span>
            <span className="font-mono text-[--text-primary]">R$ {june.vendasBrutas.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[--text-secondary]">Split {contract.split} — fica para a loja</span>
            <span className="font-mono text-[--danger]">−R$ {(june.vendasBrutas - june.repasse).toLocaleString('pt-BR')}</span>
          </div>
          <div className="border-t border-[--border] pt-3 flex justify-between items-center">
            <span className="font-subheading text-[--text-primary]">Seu repasse</span>
            <span className="font-mono text-[24px] font-bold" style={{ color: '#0D9488' }}>R$ {june.repasse.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-caption text-[--text-tertiary]">Previsão de pagamento: 20/07/2025 · Via Pix</span>
            <button
              onClick={() => setSelectedMonth('Jun/2025')}
              className="font-label text-[12px] text-[--accent] cursor-pointer bg-transparent border-none hover:underline"
            >
              Ver composição →
            </button>
          </div>
        </div>
      </motion.div>

      {/* History table with clickable rows */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Histórico de repasses</h3>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 rounded-lg font-label text-[12px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary] disabled:opacity-60"
          >
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['MÊS', 'VALOR', 'STATUS', 'PAGO EM', 'MÉTODO'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repasseHistory.map(h => (
              <tr
                key={h.month}
                className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors cursor-pointer"
                onClick={() => setSelectedMonth(h.month)}
              >
                <td className="py-3.5 pr-4 font-label text-[--text-secondary]">{h.month}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {h.value.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4"><Badge status={h.statusType} label={h.status} showDot /></td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{h.paidDate || '—'}</td>
                <td className="py-3.5 font-body text-[13px] text-[--text-secondary]">{h.method || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setSelectedMonth(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[--bg-content-solid] rounded-2xl p-8 w-full max-w-lg shadow-2xl"
              style={{ border: '1px solid var(--border)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-[18px] text-[--text-primary]">Repasse — {selected.month}</h3>
                  <p className="font-caption text-[--text-tertiary] mt-1">Composição do valor</p>
                </div>
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-primary] transition-colors cursor-pointer bg-transparent border-none text-[--text-tertiary]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {selected.statusType === 'success' && (
                <div className="alert-banner alert-banner-success mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Repasse pago em {selected.paidDate} via {selected.method}</span>
                </div>
              )}
              {selected.statusType === 'warning' && (
                <div className="alert-banner alert-banner-warning mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>Repasse pendente · Pagamento previsto até 20/07/2025</span>
                </div>
              )}
              {selected.statusType === 'danger' && (
                <div className="alert-banner alert-banner-danger mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span>Repasse bloqueado · {selected.reason || 'Mensalidade em atraso'}</span>
                </div>
              )}

              <div className="space-y-3 text-[14px] mb-6">
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Vendido ao cliente</span>
                  <span className="font-mono">R$ {selected.vendas.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Split ({contract.split})</span>
                  <span className="font-mono text-[--text-tertiary]">−R$ {selected.ficaLoja.toLocaleString('pt-BR')}</span>
                </div>
                <div className="border-t border-[--border] pt-3 flex justify-between">
                  <span className="font-subheading">Seu repasse</span>
                  <span className="font-mono text-[20px] font-bold" style={{ color: '#0D9488' }}>R$ {selected.value.toLocaleString('pt-BR')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary]">
                  Baixar extrato
                </button>
                {selected.statusType === 'success' && (
                  <button className="flex-1 px-4 py-2 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary]">
                    Baixar comprovante
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
