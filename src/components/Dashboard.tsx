import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardMetrics, checklistItems, type ChecklistItem } from '../data/metrics';
import { brands, type Brand } from '../data/brands';
import { pendingSkus, pendingMensalidades } from '../data/sales';
import MetricCard from './ui/MetricCard';
import Badge from './ui/Badge';
import SectionTransition from './ui/SectionTransition';
import { useInView } from '../hooks/useInView';

// ---- Brand Drawer ----
function BrandDrawer({ brand, onClose, onNfeEmit }: { brand: Brand; onClose: () => void; onNfeEmit: (name: string) => void }) {
  const [nfeEmitted, setNfeEmitted] = useState(false);
  const [nfeLoading, setNfeLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleEmitNfe = () => {
    setNfeLoading(true);
    setTimeout(() => {
      setNfeLoading(false);
      setNfeEmitted(true);
      onNfeEmit(brand.name);
    }, 500);
  };

  const d = brand.drawer;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed right-0 top-0 bottom-0 w-[420px] max-w-[90vw] glass z-50 overflow-y-auto"
        style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.1)' }}
        role="dialog"
        aria-label={`Detalhes da marca ${brand.name}`}
      >
        <div className="p-8">
          <button onClick={onClose} className="absolute top-6 right-6 text-[#9CA3AF] hover:text-[#111111] transition-colors" aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <h3 className="font-heading text-[28px] text-[#111111] mb-1">{brand.name}</h3>
          <p className="font-body text-[#6B7280] mb-6">{d.description} · Ativa desde {d.activeSince}</p>

          <div className="border-t border-[#E5E7EB] pt-5 mb-5">
            <h4 className="font-subheading text-[16px] text-[#111111] mb-3">Contrato</h4>
            <div className="space-y-1.5 font-body text-[14px]">
              <div className="flex justify-between"><span className="text-[#6B7280]">Split</span><span>{d.contract.split}</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">Mensalidade</span><span className="font-mono">R$ {d.contract.mensalidade.toLocaleString('pt-BR')}/mês</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">Vencimento</span><span>{d.contract.vencimento}</span></div>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] pt-5 mb-5">
            <h4 className="font-subheading text-[16px] text-[#111111] mb-3">Junho 2025</h4>
            <div className="space-y-2 font-body text-[14px]">
              <div className="flex justify-between"><span className="text-[#6B7280]">Vendas brutas</span><span className="font-mono">R$ {d.june.vendasBrutas.toLocaleString('pt-BR')}</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">Repasse ({d.contract.split})</span><span className="font-mono">R$ {d.june.repasse.toLocaleString('pt-BR')}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">Mensalidade</span>
                <Badge status={brand.mensalidadeStatus} label={d.june.mensalidadeStatus} showDot={false} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280]">NF-e repasse</span>
                {nfeEmitted ? (
                  <Badge status="success" label="Emitida #4612" showDot={false} />
                ) : (
                  <span className="text-[#F59E0B] font-label">{d.june.nfeRepasse}</span>
                )}
              </div>
              {d.june.nfeMensalidade && (
                <div className="flex justify-between"><span className="text-[#6B7280]">NF-e mensalidade</span><span className="text-[#16A34A]">{d.june.nfeMensalidade}</span></div>
              )}
            </div>
          </div>

          <div className="space-y-2.5 mt-6">
            {!nfeEmitted && brand.mensalidadeStatus === 'success' && d.june.nfeRepasse.includes('Aguardando') && (
              <button onClick={handleEmitNfe} disabled={nfeLoading} className="w-full py-2.5 px-4 bg-[#2563EB] text-white rounded-xl font-subheading text-[14px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {nfeLoading ? (
                  <motion.svg animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></motion.svg>
                ) : null}
                {nfeLoading ? 'Emitindo...' : 'Emitir NF-e repasse'}
              </button>
            )}
            <button onClick={() => setShowHistory(!showHistory)} className="w-full py-2.5 px-4 border border-[#E5E7EB] text-[#111111] rounded-xl font-subheading text-[14px] hover:bg-[#F3F4F6] transition-colors">
              {showHistory ? 'Ocultar histórico' : 'Ver histórico'}
            </button>
          </div>

          <AnimatePresence>
            {showHistory && d.history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="space-y-3">
                  {d.history.map((h, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-label text-[#6B7280] w-20 shrink-0">{h.month}</span>
                      <div className="flex-1 bg-[#DCFCE7] rounded-full h-2.5 overflow-hidden">
                        <div className="bg-[#16A34A] h-full rounded-full" style={{ width: `${Math.min((h.value / 3500) * 100, 100)}%` }} />
                      </div>
                      <span className="font-mono text-[13px] w-20 text-right">R$ {h.value.toLocaleString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

// ---- Main Dashboard ----
export default function Dashboard() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandOverrides, setBrandOverrides] = useState<Record<string, Partial<Brand>>>({});
  const [checklist, setChecklist] = useState<ChecklistItem[]>(checklistItems);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [skuLinked, setSkuLinked] = useState<boolean[]>([false, false, false]);
  const [mensalidadesCharged, setMensalidadesCharged] = useState(false);
  const { ref: metricsRef, isInView: metricsInView } = useInView();

  const completedCount = checklist.filter(c => c.status === 'done').length;
  const progressPct = (completedCount / checklist.length) * 100;

  const handleNfeEmit = useCallback((brandName: string) => {
    setBrandOverrides(prev => ({
      ...prev,
      [brandName]: { nfe: 'Emitida', nfeStatus: 'success' as const },
    }));
  }, []);

  const handleLinkAll = () => {
    setSkuLinked([true, true, true]);
    setTimeout(() => {
      setChecklist(prev => prev.map(c => c.id === 2 ? { ...c, status: 'done' as const, statusText: 'Concluído' } : c));
    }, 400);
  };

  const handleLinkSku = (idx: number) => {
    setSkuLinked(prev => { const n = [...prev]; n[idx] = true; return n; });
    if (skuLinked.filter(Boolean).length === 2) {
      setTimeout(() => {
        setChecklist(prev => prev.map(c => c.id === 2 ? { ...c, status: 'done' as const, statusText: 'Concluído' } : c));
      }, 300);
    }
  };

  const handleChargeAll = () => {
    setMensalidadesCharged(true);
    setTimeout(() => {
      setChecklist(prev => prev.map(c => c.id === 4 ? { ...c, status: 'done' as const, statusText: 'Cobranças enviadas' } : c));
    }, 400);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'done': return <span className="text-[#16A34A]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>;
      case 'warning': return <span className="text-[#F59E0B]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>;
      case 'pending': return <span className="text-[#F59E0B]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>;
      case 'blocked': return <span className="text-[#DC2626]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>;
      default: return null;
    }
  };

  return (
    <section data-act="2" className="min-h-screen snap-start bg-[#FAFAFA] pt-20 pb-20">
      <div className="content-max">
        {/* 2A - Headline */}
        <SectionTransition className="mb-12">
          <p className="font-label text-[#2563EB] uppercase tracking-[1.5px] mb-3">PAINEL FINANCEIRO</p>
          <h2 className="font-display text-[clamp(32px,4vw,48px)] leading-[1.1] text-[#111111] mb-4">Tudo num lugar só.</h2>
          <p className="font-body text-[17px] text-[#6B7280] max-w-[500px]">
            Dashboard da Pinga — Junho 2025. Os números, o status de cada marca, o que precisa da sua atenção. Explore.
          </p>
        </SectionTransition>

        {/* 2B - Metrics */}
        <div ref={metricsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {dashboardMetrics.map((m, i) => (
            <MetricCard key={m.label} metric={m} delay={i * 0.06} inView={metricsInView} />
          ))}
        </div>

        {/* 2C - Brand Table */}
        <SectionTransition className="mb-16">
          <h3 className="font-heading text-[24px] text-[#111111] mb-2">Marcas parceiras</h3>
          <p className="font-body text-[#6B7280] mb-6">8 marcas ativas na Pinga · Junho 2025</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left font-label text-[#9CA3AF] py-3 pr-4">Marca</th>
                  <th className="text-left font-label text-[#9CA3AF] py-3 pr-4">Mensalidade</th>
                  <th className="text-right font-label text-[#9CA3AF] py-3 pr-4">Vendas jun</th>
                  <th className="text-left font-label text-[#9CA3AF] py-3 pr-4">Repasse</th>
                  <th className="text-left font-label text-[#9CA3AF] py-3 pr-4">NF-e</th>
                  <th className="text-left font-label text-[#9CA3AF] py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => {
                  const override = brandOverrides[b.name] || {};
                  const merged = { ...b, ...override };
                  return (
                    <motion.tr
                      key={b.name}
                      onClick={() => setSelectedBrand(b)}
                      className="border-b border-[#E5E7EB] cursor-pointer hover:bg-[#F9FAFB] transition-colors group"
                      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    >
                      <td className="py-3.5 pr-4 font-subheading text-[15px]">{b.name}</td>
                      <td className="py-3.5 pr-4"><Badge status={b.mensalidadeStatus} label={b.mensalidade} /></td>
                      <td className="py-3.5 pr-4 text-right font-mono text-[14px]">R$ {b.vendasJun.toLocaleString('pt-BR')}</td>
                      <td className="py-3.5 pr-4"><Badge status={merged.repasseStatus} label={merged.nfe === 'Emitida' && b.repasseStatus === 'warning' ? `R$ ${b.drawer.june.repasse.toLocaleString('pt-BR')}` : b.repasse} /></td>
                      <td className="py-3.5 pr-4"><Badge status={merged.nfeStatus} label={merged.nfe} /></td>
                      <td className="py-3.5">
                        <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                          merged.status === 'success' ? 'bg-[#16A34A]' : merged.status === 'warning' ? 'bg-[#F59E0B]' : merged.status === 'danger' ? 'bg-[#DC2626]' : 'bg-[#9CA3AF]'
                        }`} />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionTransition>

        {/* 2D - Checklist */}
        <SectionTransition>
          <div className="rounded-2xl border border-[#E5E7EB] bg-[--bg-content-solid] p-8 border-l-4 border-l-[#2563EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-subheading text-[20px] text-[#111111]">Fechamento · Junho 2025</h3>
              <span className="font-label text-[#6B7280]">{completedCount} de {checklist.length} itens concluídos</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-[#2563EB] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="space-y-1">
              {checklist.map((item) => (
                <div key={item.id}>
                  <div
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${item.interactive && item.status !== 'done' ? 'cursor-pointer hover:bg-[#F9FAFB]' : ''} transition-colors`}
                    onClick={item.interactive && item.status !== 'done' ? () => setExpandedItem(expandedItem === item.id ? null : item.id) : undefined}
                  >
                    {statusIcon(item.status)}
                    <span className={`font-body text-[14px] flex-1 ${item.status === 'done' ? 'text-[#6B7280]' : 'text-[#111111]'}`}>{item.label}</span>
                    <span className="font-caption text-[#9CA3AF]">{item.statusText}</span>
                    {item.interactive && item.status !== 'done' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedItem === item.id && item.id === 2 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 p-4 bg-[#F9FAFB] rounded-xl mb-2">
                          <p className="font-subheading text-[14px] text-[#111111] mb-3">SKUs sem marca vinculada</p>
                          <div className="space-y-2">
                            {pendingSkus.map((sku, idx) => (
                              <motion.div
                                key={sku.sku}
                                initial={false}
                                animate={skuLinked[idx] ? { opacity: 0.5 } : {}}
                                className="flex items-center gap-3 text-[13px]"
                              >
                                <span className="font-mono text-[#6B7280] w-20">{sku.sku}</span>
                                <span className="flex-1 text-[#111111]">{sku.product}</span>
                                <span className="text-[#9CA3AF]">{sku.suggestion}</span>
                                {skuLinked[idx] ? (
                                  <span className="text-[#16A34A]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></span>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); handleLinkSku(idx); }} className="text-[#2563EB] font-label hover:underline">Vincular</button>
                                )}
                              </motion.div>
                            ))}
                          </div>
                          {!skuLinked.every(Boolean) && (
                            <button onClick={(e) => { e.stopPropagation(); handleLinkAll(); }} className="mt-3 py-2 px-4 bg-[#2563EB] text-white rounded-lg font-label text-[13px] hover:bg-[#1D4ED8] transition-colors">
                              Vincular todos
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {expandedItem === item.id && item.id === 4 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 p-4 bg-[#F9FAFB] rounded-xl mb-2">
                          <p className="font-subheading text-[14px] text-[#111111] mb-3">Mensalidades pendentes</p>
                          <div className="space-y-2">
                            {pendingMensalidades.map((m) => (
                              <div key={m.brand} className="flex items-center gap-3 text-[13px]">
                                <span className="font-subheading w-24">{m.brand}</span>
                                <span className="font-mono text-[#111111] w-20">R$ {m.value.toLocaleString('pt-BR')}</span>
                                <span className="text-[#9CA3AF] w-16">{m.vencimento}</span>
                                <span className="text-[#DC2626] flex-1">{m.delay}</span>
                                {mensalidadesCharged ? (
                                  <span className="text-[#16A34A] font-label">Cobrança enviada via Pix</span>
                                ) : (
                                  <button className="text-[#2563EB] font-label hover:underline">Enviar cobrança</button>
                                )}
                              </div>
                            ))}
                          </div>
                          {!mensalidadesCharged && (
                            <button onClick={(e) => { e.stopPropagation(); handleChargeAll(); }} className="mt-3 py-2 px-4 bg-[#2563EB] text-white rounded-lg font-label text-[13px] hover:bg-[#1D4ED8] transition-colors">
                              Cobrar todas
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {completedCount >= 6 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-subheading text-[17px] text-[#6B7280] italic text-center mt-8"
                >
                  "Você abre, vê o que falta, resolve e fecha."
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </SectionTransition>
      </div>

      <AnimatePresence>
        {selectedBrand && (
          <BrandDrawer brand={selectedBrand} onClose={() => setSelectedBrand(null)} onNfeEmit={handleNfeEmit} />
        )}
      </AnimatePresence>
    </section>
  );
}
