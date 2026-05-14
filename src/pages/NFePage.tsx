import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nfesRecebidas, nfesEmitidas } from '../data/nfe';
import { brands } from '../data/brands';
import CountUp from '../components/ui/CountUp';
import Badge from '../components/ui/Badge';
import type { UnitFilter } from '../data/brands';

interface NFePageProps {
  unitFilter?: UnitFilter;
}

export default function NFePage({ unitFilter = 'Todas' }: NFePageProps) {
  const [emitirModal, setEmitirModal] = useState(false);
  const [emitirBrand, setEmitirBrand] = useState('');
  const [emitirDone, setEmitirDone] = useState(false);
  const [notifiedBrands, setNotifiedBrands] = useState<string[]>([]);
  const [selectedNfe, setSelectedNfe] = useState<string | null>(null);

  const filtRecebidas = useMemo(() =>
    unitFilter === 'Todas' ? nfesRecebidas : nfesRecebidas.filter(n => {
      const brand = brands.find(b => b.name === n.brand);
      return brand && brand.location === unitFilter;
    }),
    [unitFilter]
  );
  const filtEmitidas = useMemo(() =>
    unitFilter === 'Todas' ? nfesEmitidas : nfesEmitidas.filter(n => {
      const brand = brands.find(b => b.name === n.brand);
      return brand && brand.location === unitFilter;
    }),
    [unitFilter]
  );

  const confirmadas = filtRecebidas.filter(n => n.statusType === 'success').length;
  const pendentes = filtRecebidas.filter(n => n.statusType === 'warning').length;
  const valorAberto = filtRecebidas.filter(n => n.statusType !== 'success').reduce((s, n) => s + n.valor, 0);
  const pendenteBrands = filtRecebidas.filter(n => n.statusType === 'warning').map(n => n.brand);
  const bloqueadaBrands = filtRecebidas.filter(n => n.statusType === 'danger').map(n => n.brand);
  const selectedNfeData = filtRecebidas.find(n => n.brand === selectedNfe && n.statusType === 'success');

  const handleEmitir = () => {
    setEmitirDone(true);
    setEmitirModal(false);
  };

  return (
    <div className="content-max space-y-6">
      {/* KPI strip */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[
          { label: 'NF-ES CONFIRMADAS', value: confirmadas, isCurrency: false },
          { label: 'NF-ES PENDENTES', value: pendentes, isCurrency: false },
          { label: 'VALOR EM ABERTO', value: valorAberto, isCurrency: true },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="metric-card"
          >
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">{m.label}</p>
            <CountUp end={m.value} prefix={m.isCurrency ? 'R$' : ''} start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
          </motion.div>
        ))}
      </div>

      {emitirDone && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>NF-e emitida com sucesso via Focus NF-e.</span>
        </div>
      )}

      {/* Separate alerts */}
      {pendenteBrands.length > 0 && (
        <div className="alert-banner alert-banner-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>NF-e pendente — aguardando envio por {pendenteBrands.join(' e ')}</span>
        </div>
      )}
      {bloqueadaBrands.length > 0 && (
        <div className="alert-banner alert-banner-danger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>NF-e bloqueada — {bloqueadaBrands.join(' e ')} com mensalidade inadimplente</span>
        </div>
      )}

      {/* NF-es recebidas */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">NF-es recebidas das lojas parceiras</h3>
        </div>
        <p className="font-caption text-[--text-tertiary] mb-4">Emitidas pelas marcas parceiras, referentes ao consignado</p>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['NÚMERO', 'LOJA PARCEIRA', 'REFERÊNCIA', 'VALOR', 'RECEBIDA EM', 'STATUS', ''].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtRecebidas.map(n => (
              <tr
                key={`${n.brand}-rec`}
                className={`border-b border-[--border] last:border-b-0 transition-colors ${n.statusType === 'success' ? 'hover:bg-[--bg-primary]/50 cursor-pointer' : ''}`}
                onClick={() => n.statusType === 'success' && setSelectedNfe(n.brand)}
              >
                <td className="py-3.5 pr-4 font-mono text-[13px]">{n.numero}</td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: n.brandAvatar.color }}>{n.brandAvatar.letters}</span>
                    <span className="font-subheading text-[14px]">{n.brand}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{n.referencia}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {n.valor.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{n.data}</td>
                <td className="py-3.5 pr-4"><Badge status={n.statusType} label={n.status} showDot /></td>
                <td className="py-3.5 text-right">
                  {n.statusType === 'warning' && !notifiedBrands.includes(n.brand) && (
                    <button
                      onClick={e => { e.stopPropagation(); setNotifiedBrands(prev => [...prev, n.brand]); }}
                      className="px-3 py-1.5 rounded-lg font-label text-[12px] text-white cursor-pointer border-none transition-colors"
                      style={{ background: '#F59E0B' }}
                    >
                      Notificar
                    </button>
                  )}
                  {n.statusType === 'warning' && notifiedBrands.includes(n.brand) && (
                    <span className="font-caption text-[--text-tertiary]">Notificada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NF-es emitidas */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">NF-es emitidas pela loja</h3>
          <button
            onClick={() => setEmitirModal(true)}
            className="px-4 py-2 rounded-lg font-label text-[12px] text-white cursor-pointer border-none transition-colors"
            style={{ background: '#0D9488' }}
          >
            + Emitir NF-e
          </button>
        </div>
        <p className="font-caption text-[--text-tertiary] mb-4">Emitidas pela loja, referentes ao repasse pago</p>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['NÚMERO', 'LOJA PARCEIRA', 'TIPO', 'VALOR', 'EMITIDA EM', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtEmitidas.map(n => (
              <tr key={`${n.brand}-emit`} className="border-b border-[--border] last:border-b-0">
                <td className="py-3.5 pr-4 font-mono text-[13px]">{n.numero}</td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: n.brandAvatar.color }}>{n.brandAvatar.letters}</span>
                    <span className="font-subheading text-[14px]">{n.brand}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4"><Badge status={n.tipo === 'Repasse' ? 'success' : 'neutral'} label={n.tipo} showDot={false} /></td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {n.valor.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{n.data}</td>
                <td className="py-3.5"><Badge status={n.statusType} label={n.status} showDot /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Emitir NF-e modal */}
      <AnimatePresence>
        {emitirModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setEmitirModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[--bg-content-solid] rounded-2xl p-8 w-full max-w-md shadow-2xl"
              style={{ border: '1px solid var(--border)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-[18px] text-[--text-primary]">Emitir NF-e</h3>
                <button onClick={() => setEmitirModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-primary] transition-colors cursor-pointer bg-transparent border-none text-[--text-tertiary]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1.5 block">Loja parceira</label>
                  <select
                    value={emitirBrand}
                    onChange={e => setEmitirBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-[--border] rounded-lg font-body text-[14px] text-[--text-primary] bg-[--bg-content-solid] cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    {brands.filter(b => b.status !== 'neutral' && b.status !== 'danger').map(b => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1.5 block">Período</label>
                  <select className="w-full px-3 py-2 border border-[--border] rounded-lg font-body text-[14px] text-[--text-primary] bg-[--bg-content-solid] cursor-pointer">
                    <option>Junho 2025</option>
                    <option>Maio 2025</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleEmitir}
                disabled={!emitirBrand}
                className="w-full px-4 py-2.5 rounded-lg font-label text-[13px] text-white cursor-pointer border-none transition-colors disabled:opacity-50"
                style={{ background: '#0D9488' }}
              >
                Emitir NF-e via Focus NF-e
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NF-e detail modal */}
      <AnimatePresence>
        {selectedNfeData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setSelectedNfe(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[--bg-content-solid] rounded-2xl p-8 w-full max-w-md shadow-2xl"
              style={{ border: '1px solid var(--border)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-[18px] text-[--text-primary]">NF-e {selectedNfeData.numero}</h3>
                <button onClick={() => setSelectedNfe(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-primary] transition-colors cursor-pointer bg-transparent border-none text-[--text-tertiary]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="space-y-3 text-[14px] mb-6">
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Marca</span>
                  <span className="font-subheading">{selectedNfeData.brand}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Tipo</span>
                  <span>{selectedNfeData.tipo}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Valor</span>
                  <span className="font-mono">R$ {selectedNfeData.valor.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Recebida em</span>
                  <span>{selectedNfeData.data}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[--text-secondary]">Chave de acesso</span>
                  <span className="font-mono text-[12px]">3525...8847</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary]">
                  Baixar XML
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary]">
                  Baixar DANFE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
