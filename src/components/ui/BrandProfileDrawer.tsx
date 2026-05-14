import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brands } from '../../data/brands';
import Badge from './Badge';

const brandAvatars: Record<string, { letters: string; color: string }> = {
  'Amira': { letters: 'AM', color: '#0D9488' },
  'Lua Cheia': { letters: 'LC', color: '#7C3AED' },
  'Mar e Rio': { letters: 'MR', color: '#2563EB' },
  'Dona Sol': { letters: 'DS', color: '#DC2626' },
  'Casa Bruta': { letters: 'CB', color: '#D97706' },
  'Brisa': { letters: 'BR', color: '#059669' },
  'Bruta': { letters: 'BT', color: '#7C3AED' },
  'Terra Mãe': { letters: 'TM', color: '#6B7280' },
};

interface BrandProfileDrawerProps {
  brandName: string | null;
  onClose: () => void;
}

export default function BrandProfileDrawer({ brandName, onClose }: BrandProfileDrawerProps) {
  const [actionDone, setActionDone] = useState<string | null>(null);
  const brand = brandName ? brands.find(b => b.name === brandName) : null;
  if (!brand) return null;

  const avatar = brandAvatars[brand.name] || { letters: brand.name.slice(0, 2).toUpperCase(), color: '#6B7280' };
  const { contract, june, history } = brand.drawer;

  const vencimentoDate = contract.vencimento === '—' ? '—' : `05/07`;

  return (
    <AnimatePresence>
      {brandName && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-full max-w-md h-full overflow-y-auto shadow-2xl"
            style={{ background: '#FFFFFF' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 border-b border-[--border] px-6 py-5 flex items-center justify-between z-10" style={{ background: '#FFFFFF' }}>
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                  style={{ background: avatar.color }}
                >{avatar.letters}</span>
                <div>
                  <h2 className="font-heading text-[18px] text-[--text-primary]">{brand.name}</h2>
                  <p className="font-caption text-[--text-tertiary]">{brand.drawer.description} · {brand.location}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-primary] transition-colors cursor-pointer bg-transparent border-none text-[--text-tertiary]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Status + actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge status={brand.status} label={brand.status === 'success' ? 'Ativo' : brand.status === 'danger' ? 'Inadimplente' : brand.status === 'warning' ? 'Pendente' : 'Sem contrato'} showDot />
                  <span className="font-caption text-[--text-tertiary]">desde {brand.drawer.activeSince}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActionDone('repasse')}
                  className="flex-1 px-3 py-2 rounded-lg font-label text-[12px] text-white cursor-pointer border-none transition-colors"
                  style={{ background: '#0D9488' }}
                >
                  {actionDone === 'repasse' ? 'Repasse registrado' : 'Registrar repasse'}
                </button>
                <button
                  onClick={() => setActionDone('relatorio')}
                  className="flex-1 px-3 py-2 rounded-lg font-label text-[12px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-white text-[--text-primary]"
                >
                  {actionDone === 'relatorio' ? 'Enviado' : 'Enviar relatório'}
                </button>
                {brand.status !== 'success' && brand.status !== 'neutral' && (
                  <button
                    onClick={() => setActionDone('notificar')}
                    className="px-3 py-2 rounded-lg font-label text-[12px] border transition-colors cursor-pointer bg-white text-[--text-primary]"
                    style={{ borderColor: '#F59E0B' }}
                  >
                    {actionDone === 'notificar' ? 'Notificado' : 'Notificar'}
                  </button>
                )}
              </div>

              {actionDone && (
                <div className="alert-banner alert-banner-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>
                    {actionDone === 'repasse' && `Repasse de ${brand.name} registrado com sucesso.`}
                    {actionDone === 'relatorio' && `Relatório enviado por e-mail para ${brand.name}.`}
                    {actionDone === 'notificar' && `Notificação enviada para ${brand.name}.`}
                  </span>
                </div>
              )}

              {/* Contract */}
              <div className="rounded-xl border border-[--border] p-5 space-y-3">
                <h3 className="font-subheading text-[14px] text-[--text-primary]">Contrato</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                  <div>
                    <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">SPLIT</p>
                    <p className="font-mono text-[15px] text-[--text-primary]">{contract.split}</p>
                  </div>
                  <div>
                    <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">MENSALIDADE</p>
                    <p className="font-mono text-[15px] text-[--text-primary]">{contract.mensalidade > 0 ? `R$ ${contract.mensalidade.toLocaleString('pt-BR')}` : '—'}</p>
                  </div>
                  <div>
                    <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">VENCIMENTO</p>
                    <p className="font-mono text-[15px] text-[--text-primary]">{vencimentoDate}</p>
                  </div>
                </div>
              </div>

              {/* June numbers */}
              <div className="rounded-xl border border-[--border] p-5 space-y-4">
                <h3 className="font-subheading text-[14px] text-[--text-primary]">Junho 2025</h3>
                <div className="space-y-3 text-[14px]">
                  <div className="flex justify-between py-1">
                    <span className="text-[--text-secondary]">Vendas brutas</span>
                    <span className="font-mono">R$ {june.vendasBrutas.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[--text-secondary]">Repasse</span>
                    <span className="font-mono" style={{ color: '#0D9488' }}>R$ {june.repasse.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[--text-secondary]">Mensalidade</span>
                    <Badge status={brand.mensalidadeStatus} label={june.mensalidadeStatus} showDot />
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[--text-secondary]">NF-e repasse</span>
                    <span className="font-body text-[13px] text-[--text-secondary]">{june.nfeRepasse}</span>
                  </div>
                  {june.nfeMensalidade && (
                    <div className="flex justify-between py-1">
                      <span className="text-[--text-secondary]">NF-e mensalidade</span>
                      <span className="font-mono text-[13px]">{june.nfeMensalidade}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="rounded-xl border border-[--border] p-5 space-y-3">
                  <h3 className="font-subheading text-[14px] text-[--text-primary]">Histórico de repasses</h3>
                  <div className="space-y-0">
                    {history.map(h => (
                      <div key={h.month} className="flex items-center justify-between py-2.5 border-b border-[--border] last:border-b-0">
                        <span className="font-label text-[13px] text-[--text-secondary]">{h.month}</span>
                        <span className="font-mono text-[14px]">R$ {h.value.toLocaleString('pt-BR')}</span>
                        <Badge status="success" label={h.status} showDot={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
