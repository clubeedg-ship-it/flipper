import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brands } from '../data/brands';
import Badge from '../components/ui/Badge';
import type { BrandStatus } from '../data/brands';

const brandAvatars: Record<string, { letters: string; color: string }> = {
  'Amira': { letters: 'AM', color: '#0D9488' },
  'Lua Cheia': { letters: 'LC', color: '#7C3AED' },
  'Mar e Rio': { letters: 'MR', color: '#2563EB' },
  'Dona Sol': { letters: 'DS', color: '#DC2626' },
  'Casa Bruta': { letters: 'CB', color: '#D97706' },
  'Brisa': { letters: 'BR', color: '#059669' },
  'Bruta': { letters: 'BT', color: '#7C3AED' },
};

interface RepasseRow {
  brand: string;
  avatar: { letters: string; color: string };
  vendido: number;
  ficaLoja: number;
  repasse: number;
  split: string;
  status: string;
  statusType: BrandStatus;
}

const repasseRows: RepasseRow[] = brands
  .filter(b => b.status !== 'neutral')
  .map(b => {
    const split = b.drawer.contract.split;
    const splitPct = split === '50/50' ? 0.5 : 0.55;
    return {
      brand: b.name,
      avatar: brandAvatars[b.name] || { letters: b.name.slice(0, 2).toUpperCase(), color: '#6B7280' },
      vendido: b.vendasJun,
      ficaLoja: Math.round(b.vendasJun * (1 - splitPct)),
      repasse: Math.round(b.vendasJun * splitPct),
      split,
      status: b.repasseStatus === 'success' ? 'Pago' : b.repasseStatus === 'danger' ? 'Bloqueado' : 'Pendente',
      statusType: b.repasseStatus,
    };
  });

export default function RepassesPage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [reportsSent, setReportsSent] = useState(false);

  const totalVendido = repasseRows.reduce((s, r) => s + r.vendido, 0);
  const totalLoja = repasseRows.reduce((s, r) => s + r.ficaLoja, 0);
  const totalRepasse = repasseRows.reduce((s, r) => s + r.repasse, 0);
  const selected = repasseRows.find(r => r.brand === selectedBrand);

  return (
    <div className="content-max space-y-6">
      {/* Alert */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Repasses de junho serão processados até 20/07/2025.</span>
      </div>

      {reportsSent && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Relatórios enviados por e-mail para todas as lojas parceiras.</span>
        </div>
      )}

      {/* Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Repasses — Junho 2025</h3>
          <button
            onClick={() => setReportsSent(true)}
            className="px-4 py-2 rounded-lg font-label text-[12px] text-white cursor-pointer border-none transition-colors"
            style={{ background: '#0D9488' }}
          >
            Enviar relatórios
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['LOJA PARCEIRA', 'VENDIDO CLIENTE', 'FICA LOJA', 'REPASSE', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repasseRows.map(r => (
              <tr
                key={r.brand}
                className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors cursor-pointer"
                onClick={() => setSelectedBrand(r.brand)}
              >
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: r.avatar.color }}>{r.avatar.letters}</span>
                    <span className="font-subheading text-[14px]">{r.brand}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {r.vendido.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {r.ficaLoja.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]" style={{ color: '#0D9488' }}>R$ {r.repasse.toLocaleString('pt-BR')}</td>
                <td className="py-3.5"><Badge status={r.statusType} label={r.status} showDot /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[--border]">
              <td className="py-3.5 pr-4 font-subheading text-[14px] text-[--text-primary]">Total</td>
              <td className="py-3.5 pr-4 font-mono text-[14px] font-bold">R$ {totalVendido.toLocaleString('pt-BR')}</td>
              <td className="py-3.5 pr-4 font-mono text-[14px] font-bold">R$ {totalLoja.toLocaleString('pt-BR')}</td>
              <td className="py-3.5 pr-4 font-mono text-[14px] font-bold" style={{ color: '#0D9488' }}>R$ {totalRepasse.toLocaleString('pt-BR')}</td>
              <td className="py-3.5"></td>
            </tr>
          </tfoot>
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
            onClick={() => setSelectedBrand(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ background: selected.avatar.color }}>{selected.avatar.letters}</span>
                <div>
                  <h3 className="font-heading text-[18px] text-[--text-primary]">{selected.brand}</h3>
                  <p className="font-caption text-[--text-tertiary]">Repasse — Junho 2025</p>
                </div>
              </div>
              <div className="space-y-3 text-[14px] mb-6">
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Vendido ao cliente</span>
                  <span className="font-mono">R$ {selected.vendido.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Split ({selected.split})</span>
                  <span className="font-mono text-[--text-tertiary]">−R$ {selected.ficaLoja.toLocaleString('pt-BR')}</span>
                </div>
                <div className="border-t border-[--border] pt-3 flex justify-between">
                  <span className="font-subheading">Repasse</span>
                  <span className="font-mono text-[20px] font-bold" style={{ color: '#0D9488' }}>R$ {selected.repasse.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-caption text-[--text-tertiary]">Previsão: 20/07/2025</span>
                  <Badge status={selected.statusType} label={selected.status} showDot />
                </div>
              </div>
              <button
                onClick={() => setSelectedBrand(null)}
                className="w-full px-4 py-2 rounded-lg font-label text-[13px] text-[--text-secondary] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
