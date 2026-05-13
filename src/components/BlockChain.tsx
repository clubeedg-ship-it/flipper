import { useState } from 'react';
import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTransition from './ui/SectionTransition';
import GlassCard from './ui/GlassCard';
import Badge from './ui/Badge';
import { useInView } from '../hooks/useInView';

type CascadeState = 'blocked' | 'resolved' | 'exempt';
type CascadeIcon = 'warning' | 'lock' | 'ban';

const cascadeIcons: Record<CascadeIcon | 'check', (color: string) => JSX.Element> = {
  warning: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  lock: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  ban: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
  ),
  check: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
};

interface CascadeNode {
  icon: CascadeIcon;
  title: string;
  detail: string;
  subtext?: string;
  borderColor: string;
  resolvedTitle?: string;
  resolvedDetail?: string;
  exemptTitle?: string;
  exemptDetail?: string;
}

const cascadeNodes: CascadeNode[] = [
  {
    icon: 'warning',
    title: 'Mensalidade atrasada',
    detail: 'Dona Sol · R$ 1.800',
    subtext: 'Vencimento: 05/jun · 7 dias',
    borderColor: '#F59E0B',
    resolvedTitle: 'Mensalidade paga',
    resolvedDetail: 'Dona Sol · R$ 1.800 · Confirmado',
    exemptTitle: 'Mensalidade pendente (isenta)',
    exemptDetail: 'Dona Sol · R$ 1.800',
  },
  {
    icon: 'lock',
    title: 'Repasse bloqueado',
    detail: 'R$ 990 retido',
    subtext: 'Repasse só libera com mensalidade em dia',
    borderColor: '#DC2626',
    resolvedTitle: 'Repasse liberado',
    resolvedDetail: 'R$ 990',
  },
  {
    icon: 'lock',
    title: 'NF-e bloqueada',
    detail: 'Emissão suspensa',
    subtext: 'NF-e de repasse requer repasse liberado',
    borderColor: '#DC2626',
    resolvedTitle: 'NF-e desbloqueada',
    resolvedDetail: 'Emissão liberada',
  },
  {
    icon: 'ban',
    title: 'Fechamento impedido',
    detail: 'Dona Sol impede o fechamento',
    subtext: 'do mês de Junho',
    borderColor: '#DC2626',
    resolvedTitle: 'Fechamento liberado',
    resolvedDetail: 'Junho 2025',
  },
];

export default function BlockChain() {
  const [state, setState] = useState<CascadeState>('blocked');
  const [showModal, setShowModal] = useState<'payment' | 'exempt' | null>(null);
  const { ref: cascadeRef, isInView: cascadeInView } = useInView({ threshold: 0.3 });

  const handleResolve = (type: 'resolved' | 'exempt') => {
    setShowModal(null);
    setState(type);
  };

  const getNodeState = (idx: number) => {
    if (state === 'resolved') return 'resolved';
    if (state === 'exempt') return idx === 0 ? 'exempt' : 'resolved';
    return 'blocked';
  };

  const getNodeBorder = (idx: number) => {
    const s = getNodeState(idx);
    if (s === 'resolved') return '#16A34A';
    if (s === 'exempt') return '#F59E0B';
    return cascadeNodes[idx].borderColor;
  };

  const getLineColor = (_idx: number) => {
    if (state === 'blocked') return '#DC2626';
    return '#16A34A';
  };

  return (
    <section data-act="4" className="min-h-screen snap-start bg-[#FAFAFA] pt-20 pb-20">
      <div className="content-max">
        {/* 4A - Setup */}
        <SectionTransition className="mb-12">
          <p className="font-label text-[#DC2626] uppercase tracking-[1.5px] mb-3">PROTEÇÃO FINANCEIRA</p>
          <h2 className="font-display text-[clamp(32px,4vw,48px)] leading-[1.1] text-[#111111] mb-4">
            Suas regras, aplicadas automaticamente.
          </h2>
          <p className="font-body text-[17px] text-[#6B7280] max-w-[520px]">
            A Dona Sol está com a mensalidade atrasada. Veja o que o Flipper faz — e o que a marca vê.
          </p>
        </SectionTransition>

        {/* 4B - Cascade */}
        <div ref={cascadeRef} className="max-w-[480px] mx-auto mb-20">
          {cascadeNodes.map((node, idx) => {
            const ns = getNodeState(idx);
            const isResolved = ns === 'resolved';
            const isExempt = ns === 'exempt';

            return (
              <div key={idx}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={cascadeInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: idx * 0.4 }}
                  className="glass rounded-2xl p-6 relative"
                  style={{
                    borderLeft: `4px solid ${getNodeBorder(idx)}`,
                    willChange: 'transform, opacity',
                  }}
                >
                  <motion.div
                    animate={isResolved || isExempt ? { borderColor: getNodeBorder(idx) } : {}}
                    transition={{ duration: 0.3, delay: idx * 0.3 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 mt-0.5">
                        {isResolved
                          ? cascadeIcons.check('#16A34A')
                          : isExempt
                          ? cascadeIcons.warning('#F59E0B')
                          : cascadeIcons[node.icon](node.borderColor)}
                      </span>
                      <div>
                        <h4 className="font-subheading text-[16px] text-[#111111]">
                          {isResolved ? node.resolvedTitle : isExempt ? node.exemptTitle : node.title}
                        </h4>
                        <p className="font-body text-[14px] text-[#6B7280]">
                          {isResolved ? node.resolvedDetail : isExempt ? node.exemptDetail : node.detail}
                        </p>
                        {!isResolved && !isExempt && node.subtext && (
                          <p className="font-caption text-[#9CA3AF] mt-1">{node.subtext}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {idx < cascadeNodes.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={cascadeInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.3, delay: idx * 0.4 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-0.5 h-8 mx-auto origin-top"
                    style={{
                      background: getLineColor(idx),
                      borderStyle: state === 'blocked' ? 'dashed' : 'solid',
                    }}
                  />
                )}
              </div>
            );
          })}

          {state === 'blocked' && cascadeInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute inset-0 pointer-events-none"
            />
          )}
        </div>

        {/* 4C - Dual View */}
        <SectionTransition className="mb-8">
          <h3 className="font-heading text-[24px] text-[#111111] text-center mb-8">O que cada lado vê</h3>
        </SectionTransition>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Store view */}
          <GlassCard>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#DBEAFE] text-[#2563EB] font-label text-[12px]">Financeiro da loja</span>
            </div>
            <h4 className="font-subheading text-[18px] text-[#111111] mb-4">
              Dona Sol — {state === 'blocked' ? 'Inadimplente' : state === 'exempt' ? 'Isenta' : 'Regularizada'}
            </h4>
            <div className="space-y-2.5 text-[14px] mb-6">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Mensalidade jun</span>
                <Badge status={state === 'resolved' ? 'success' : 'danger'} label={state === 'resolved' ? 'Paga' : 'Atrasada (7 dias)'} showDot={false} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Repasse jun</span>
                <Badge status={state !== 'blocked' ? 'success' : 'danger'} label={state !== 'blocked' ? 'R$ 990 liberado' : 'R$ 990 retido'} showDot={false} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">NF-e</span>
                <Badge status={state !== 'blocked' ? 'success' : 'danger'} label={state !== 'blocked' ? 'Desbloqueada' : 'Bloqueada'} showDot={false} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Fechamento</span>
                <Badge status={state !== 'blocked' ? 'success' : 'danger'} label={state !== 'blocked' ? 'Liberado' : 'Impedido por Dona Sol'} showDot={false} />
              </div>
            </div>
            {state === 'blocked' && (
              <div className="space-y-2">
                <button className="w-full py-2 px-4 bg-[#2563EB] text-white rounded-xl font-label text-[13px] hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Enviar cobrança
                </button>
                <button onClick={() => setShowModal('payment')} className="w-full py-2 px-4 border border-[#E5E7EB] text-[#111111] rounded-xl font-label text-[13px] hover:bg-[#F3F4F6] transition-colors">
                  Registrar pagamento manual
                </button>
                <button onClick={() => setShowModal('exempt')} className="w-full py-2 px-4 border border-[#E5E7EB] text-[#6B7280] rounded-xl font-label text-[13px] hover:bg-[#F3F4F6] transition-colors">
                  Isentar bloqueio
                </button>
              </div>
            )}
          </GlassCard>

          {/* Brand view */}
          <GlassCard>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] text-[#F59E0B] font-label text-[12px]">Visão da marca</span>
            </div>
            <h4 className="font-subheading text-[18px] text-[#111111] mb-2">Olá, Dona Sol.</h4>
            {state === 'blocked' && (
              <>
                <p className="text-[#F59E0B] font-label mb-4 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Você tem uma pendência.
                </p>
                <div className="space-y-2.5 text-[14px] mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Mensalidade jun</span>
                    <Badge status="danger" label="R$ 1.800 em aberto" showDot={false} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Repasse</span>
                    <Badge status="danger" label="Retido até regularização" showDot={false} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">NF-e</span>
                    <Badge status="danger" label="Aguardando liberação" showDot={false} />
                  </div>
                </div>
                <p className="font-label text-[#6B7280] mb-2">Para regularizar:</p>
                <button onClick={() => handleResolve('resolved')} className="w-full py-2.5 px-4 bg-[#2563EB] text-white rounded-xl font-label text-[13px] hover:bg-[#1D4ED8] transition-colors">
                  Pagar mensalidade — Pix, R$ 1.800
                </button>
              </>
            )}
            {state !== 'blocked' && (
              <div className="space-y-2.5 text-[14px]">
                <p className="text-[#16A34A] font-label mb-4 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {state === 'resolved' ? 'Tudo regularizado.' : 'Bloqueio isento para este mês.'}
                </p>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Mensalidade jun</span>
                  <Badge status={state === 'resolved' ? 'success' : 'warning'} label={state === 'resolved' ? 'Paga' : 'Pendente (isenta)'} showDot={false} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Repasse</span>
                  <Badge status="success" label="R$ 990 liberado" showDot={false} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">NF-e</span>
                  <Badge status="success" label="Desbloqueada" showDot={false} />
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Anchor phrase */}
        <SectionTransition className="text-center">
          <p className="font-subheading text-[20px] text-[#6B7280] italic">
            "Sem conversa difícil. O sistema aplica as regras que você definiu."
          </p>
        </SectionTransition>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass rounded-2xl p-8 z-50 w-[420px] max-w-[90vw]"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              {showModal === 'payment' && (
                <>
                  <h3 className="font-heading text-[20px] text-[#111111] mb-3">Confirmar pagamento</h3>
                  <p className="font-body text-[#6B7280] mb-6">Confirmar pagamento da Dona Sol? R$ 1.800</p>
                  <div className="flex gap-3">
                    <button onClick={() => handleResolve('resolved')} className="flex-1 py-2.5 bg-[#2563EB] text-white rounded-xl font-label hover:bg-[#1D4ED8] transition-colors">Confirmar</button>
                    <button onClick={() => setShowModal(null)} className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl font-label hover:bg-[#F3F4F6] transition-colors">Cancelar</button>
                  </div>
                </>
              )}
              {showModal === 'exempt' && (
                <>
                  <h3 className="font-heading text-[20px] text-[#111111] mb-3">Isentar bloqueio</h3>
                  <p className="font-body text-[#6B7280] mb-6">Isentar bloqueio para Dona Sol em Junho 2025? O repasse será liberado mesmo com mensalidade pendente.</p>
                  <div className="flex gap-3">
                    <button onClick={() => handleResolve('exempt')} className="flex-1 py-2.5 bg-[#F59E0B] text-white rounded-xl font-label hover:bg-[#D4860A] transition-colors">Isentar</button>
                    <button onClick={() => setShowModal(null)} className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl font-label hover:bg-[#F3F4F6] transition-colors">Cancelar</button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
