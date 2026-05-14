import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brands } from '../data/brands';
import CountUp from '../components/ui/CountUp';
import Badge from '../components/ui/Badge';
import type { BrandStatus, UnitFilter } from '../data/brands';

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
  paidDate?: string;
  paidMethod?: string;
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
      paidDate: b.repasseStatus === 'success' ? '15/06/2025' : undefined,
      paidMethod: b.repasseStatus === 'success' ? 'Pix' : undefined,
    };
  });

interface RepassesPageProps {
  onNavigate?: (page: string) => void;
  unitFilter?: UnitFilter;
}

export default function RepassesPage({ onNavigate, unitFilter = 'Todas' }: RepassesPageProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [paidBrands, setPaidBrands] = useState<Record<string, { date: string; method: string }>>({});
  const [downloadingExtrato, setDownloadingExtrato] = useState(false);

  const filteredRows = useMemo(() =>
    unitFilter === 'Todas' ? repasseRows : repasseRows.filter(r => {
      const brand = brands.find(b => b.name === r.brand);
      return brand && brand.location === unitFilter;
    }),
    [unitFilter]
  );

  const getEffectiveStatus = (r: RepasseRow): BrandStatus => {
    if (paidBrands[r.brand]) return 'success';
    return r.statusType;
  };

  const totalRepasse = filteredRows.reduce((s, r) => s + r.repasse, 0);
  const totalPago = filteredRows.filter(r => getEffectiveStatus(r) === 'success').reduce((s, r) => s + r.repasse, 0);
  const totalPendente = filteredRows.filter(r => getEffectiveStatus(r) === 'warning').reduce((s, r) => s + r.repasse, 0);
  const totalBloqueado = filteredRows.filter(r => getEffectiveStatus(r) === 'danger').reduce((s, r) => s + r.repasse, 0);

  const selected = filteredRows.find(r => r.brand === selectedBrand);
  const selectedEffective = selected ? getEffectiveStatus(selected) : null;

  const handleConfirmPayment = (brand: string, date: string, method: string) => {
    setPaidBrands(prev => ({ ...prev, [brand]: { date, method } }));
    setSelectedBrand(null);
  };

  const handleDownloadExtrato = () => {
    setDownloadingExtrato(true);
    setTimeout(() => setDownloadingExtrato(false), 1200);
  };

  return (
    <div className="content-max space-y-6">
      {/* KPI strip */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {[
          { label: 'TOTAL A REPASSAR', value: totalRepasse, color: undefined },
          { label: 'TOTAL PAGO', value: totalPago, color: '#16A34A' },
          { label: 'TOTAL PENDENTE', value: totalPendente, color: '#F59E0B' },
          { label: 'TOTAL BLOQUEADO', value: totalBloqueado, color: '#DC2626' },
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
          </motion.div>
        ))}
      </div>

      {/* Alert */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Repasses de junho serão processados até 20/07/2025.</span>
      </div>

      {/* Table */}
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-5">Repasses — Junho 2025</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['LOJA PARCEIRA', 'VENDIDO CLIENTE', 'FICA LOJA', 'REPASSE', 'PGTO', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(r => {
              const eff = getEffectiveStatus(r);
              const paid = paidBrands[r.brand] || (r.paidDate ? { date: r.paidDate, method: r.paidMethod || '' } : null);
              return (
                <tr
                  key={r.brand}
                  className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedBrand(r.brand)}
                >
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: r.avatar.color }}>{r.avatar.letters}</span>
                      <div>
                        <span className="font-subheading text-[14px]">{r.brand}</span>
                        {eff === 'danger' && (
                          <p className="font-caption text-[--danger]">
                            Mensalidade em atraso ·{' '}
                            <span className="underline cursor-pointer" onClick={e => { e.stopPropagation(); onNavigate?.('cobrancas'); }}>Regularizar em Cobranças</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {r.vendido.toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {r.ficaLoja.toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 pr-4 font-mono text-[14px]" style={{ color: '#0D9488' }}>R$ {r.repasse.toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">
                    {paid ? `${paid.date} · ${paid.method}` : '—'}
                  </td>
                  <td className="py-3.5">
                    <Badge status={eff} label={eff === 'success' ? 'Pago' : eff === 'danger' ? 'Bloqueado' : 'Pendente'} showDot />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3-state modal */}
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
              className="bg-[--bg-content-solid] rounded-2xl p-8 w-full max-w-lg shadow-2xl"
              style={{ border: '1px solid var(--border)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ background: selected.avatar.color }}>{selected.avatar.letters}</span>
                  <div>
                    <h3 className="font-heading text-[18px] text-[--text-primary]">{selected.brand}</h3>
                    <p className="font-caption text-[--text-tertiary]">Repasse — Junho 2025</p>
                  </div>
                </div>
                <button onClick={() => setSelectedBrand(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-primary] transition-colors cursor-pointer bg-transparent border-none text-[--text-tertiary]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Bloqueado state */}
              {selectedEffective === 'danger' && (
                <div>
                  <div className="alert-banner alert-banner-warning mb-6">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>Repasse bloqueado — mensalidade de {selected.brand} está em atraso.</span>
                  </div>
                  <p className="font-body text-[14px] text-[--text-secondary] mb-4">O repasse só será liberado após regularização da mensalidade pendente.</p>
                  <button
                    onClick={() => { setSelectedBrand(null); onNavigate?.('cobrancas'); }}
                    className="w-full px-4 py-2.5 rounded-lg font-label text-[13px] text-white cursor-pointer border-none transition-colors"
                    style={{ background: '#F59E0B' }}
                  >
                    Regularizar em Cobranças
                  </button>
                </div>
              )}

              {/* Pago state */}
              {selectedEffective === 'success' && (
                <div>
                  <div className="alert-banner alert-banner-success mb-6">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>Repasse pago em {paidBrands[selected.brand]?.date || selected.paidDate} via {paidBrands[selected.brand]?.method || selected.paidMethod}</span>
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
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadExtrato}
                      className="flex-1 px-4 py-2 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary]"
                    >
                      {downloadingExtrato ? 'Baixando...' : 'Baixar extrato'}
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary]">
                      Baixar comprovante
                    </button>
                  </div>
                </div>
              )}

              {/* Pendente state */}
              {selectedEffective === 'warning' && (
                <PendenteForm
                  selected={selected}
                  onConfirm={handleConfirmPayment}
                  onDownload={handleDownloadExtrato}
                  downloading={downloadingExtrato}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PendenteForm({ selected, onConfirm, onDownload, downloading }: {
  selected: RepasseRow;
  onConfirm: (brand: string, date: string, method: string) => void;
  onDownload: () => void;
  downloading: boolean;
}) {
  const [date, setDate] = useState('');
  const [method, setMethod] = useState('Pix');

  return (
    <div>
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
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1.5 block">Data do pagamento</label>
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-[--border] rounded-lg font-body text-[14px] text-[--text-primary] bg-[--bg-content-solid]"
            style={{ outline: 'none' }}
          />
        </div>
        <div>
          <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1.5 block">Forma de pagamento</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="w-full px-3 py-2 border border-[--border] rounded-lg font-body text-[14px] text-[--text-primary] bg-[--bg-content-solid] cursor-pointer"
          >
            <option>Pix</option>
            <option>TED</option>
            <option>Dinheiro</option>
            <option>Outro</option>
          </select>
        </div>
        <div>
          <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1.5 block">Comprovante</label>
          <div className="w-full px-3 py-3 border border-dashed border-[--border] rounded-lg text-center font-caption text-[--text-tertiary] cursor-pointer hover:bg-[--bg-primary] transition-colors">
            Clique para anexar comprovante (PDF/JPEG)
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(selected.brand, date || '15/07/2025', method)}
          className="flex-1 px-4 py-2.5 rounded-lg font-label text-[13px] text-white cursor-pointer border-none transition-colors"
          style={{ background: '#16A34A' }}
        >
          Confirmar pagamento
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-2.5 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary]"
        >
          {downloading ? 'Baixando...' : 'Baixar extrato'}
        </button>
      </div>
    </div>
  );
}
