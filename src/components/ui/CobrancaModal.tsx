import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from './Badge';
import type { BrandStatus } from '../../data/brands';

export interface CobrancaModalData {
  brand: string;
  avatar: { letters: string; color: string };
  valor: number;
  vencimento: string;
  pagamento: string;
  metodo: string;
  status: string;
  statusType: BrandStatus;
  // Optional comprovante sent by the brand pending review
  comprovante?: { fileName: string; sentAt: string };
}

interface CobrancaModalProps {
  data: CobrancaModalData | null;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

type ConfirmState = 'idle' | 'confirmed' | 'rejected';

export default function CobrancaModal({ data, onClose, onNavigate }: CobrancaModalProps) {
  const [notified, setNotified] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>('idle');
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [paymentRecorded, setPaymentRecorded] = useState(false);

  if (!data) return null;

  const isPaid = data.statusType === 'success';
  const isLate = data.statusType === 'danger';
  const hasComprovante = Boolean(data.comprovante);

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setShowRejectReason(true);
      return;
    }
    setConfirmState('rejected');
  };

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{ background: '#FFFFFF' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 px-6 py-5 flex items-center justify-between z-10 border-b border-[--border]" style={{ background: '#FFFFFF' }}>
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                  style={{ background: data.avatar.color }}
                >{data.avatar.letters}</span>
                <div>
                  <h2 className="font-heading text-[18px] text-[--text-primary]">{data.brand}</h2>
                  <p className="font-caption text-[--text-tertiary]">Mensalidade · R$ {data.valor.toLocaleString('pt-BR')} · vence {data.vencimento}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-primary] transition-colors cursor-pointer bg-transparent border-none text-[--text-tertiary]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Status */}
              <div className="flex items-center gap-3">
                <Badge status={data.statusType} label={data.status} showDot />
                {isLate && (
                  <span className="font-caption text-[--danger]">Em atraso desde {data.vencimento}</span>
                )}
              </div>

              {/* Late impact callout */}
              {isLate && (
                <div className="rounded-xl border p-4" style={{ borderColor: '#DC2626', background: 'rgba(220,38,38,0.06)' }}>
                  <div className="flex items-start gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div>
                      <p className="font-subheading text-[13px]" style={{ color: '#DC2626' }}>Repasse de Junho bloqueado até regularização</p>
                      <p className="font-caption text-[--text-secondary] mt-0.5">A NF-e do repasse desta marca também fica suspensa enquanto a mensalidade estiver em atraso.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Paid view */}
              {isPaid && (
                <div className="rounded-xl border border-[--border] p-5">
                  <h3 className="font-subheading text-[14px] text-[--text-primary] mb-4">Pagamento confirmado</h3>
                  <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                    <div>
                      <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">DATA</p>
                      <p className="font-body text-[14px] text-[--text-primary]">{data.pagamento}</p>
                    </div>
                    <div>
                      <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">FORMA</p>
                      <p className="font-body text-[14px] text-[--text-primary]">{data.metodo}</p>
                    </div>
                    <div>
                      <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">VALOR</p>
                      <p className="font-mono text-[14px] text-[--text-primary]">R$ {data.valor.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[--border] flex items-center gap-2">
                    <button className="px-3 py-2 rounded-lg font-label text-[12px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer text-[--text-primary]" style={{ background: 'var(--bg-content-solid)' }}>
                      Baixar comprovante
                    </button>
                  </div>
                </div>
              )}

              {/* Comprovante review (when brand sent) */}
              {!isPaid && hasComprovante && confirmState === 'idle' && (
                <div className="rounded-xl border p-5" style={{ borderColor: '#0D9488', background: 'rgba(13,148,136,0.05)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-subheading text-[14px]" style={{ color: '#0D9488' }}>Comprovante recebido da marca</p>
                      <p className="font-caption text-[--text-tertiary]">{data.comprovante?.fileName} · enviado {data.comprovante?.sentAt}</p>
                    </div>
                    <Badge status="warning" label="Aguardando revisão" showDot />
                  </div>
                  {/* Simulated comprovante preview */}
                  <div className="rounded-lg border border-[--border] overflow-hidden" style={{ background: '#fff' }}>
                    <div className="p-4 flex items-center gap-3 border-b border-[--border]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span className="font-mono text-[12px] text-[--text-primary]">{data.comprovante?.fileName}</span>
                    </div>
                    <div className="p-6 space-y-2" style={{ background: '#FAFAFA' }}>
                      <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px]">Comprovante de transferência</p>
                      <p className="font-mono text-[13px] text-[--text-primary]">Banco: Itaú · Pix</p>
                      <p className="font-mono text-[13px] text-[--text-primary]">Valor: R$ {data.valor.toLocaleString('pt-BR')}</p>
                      <p className="font-mono text-[13px] text-[--text-primary]">Data: {data.comprovante?.sentAt}</p>
                      <p className="font-mono text-[13px] text-[--text-primary]">Beneficiário: PINGA STORE LTDA</p>
                      <p className="font-mono text-[13px] text-[--text-primary]">ID Pix: E60746948202506...</p>
                    </div>
                  </div>
                  {showRejectReason && (
                    <div className="mt-3">
                      <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1 block">MOTIVO DA REJEIÇÃO</label>
                      <input
                        autoFocus
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Ex: valor incorreto, comprovante ilegível..."
                        className="w-full px-3 py-2 rounded-lg border border-[--border] font-body text-[13px] outline-none focus:border-[--accent] transition-colors"
                        style={{ background: 'var(--bg-content-solid)' }}
                      />
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setConfirmState('confirmed')}
                      className="flex-1 px-4 py-2.5 rounded-lg font-label text-[13px] text-white cursor-pointer border-none transition-colors"
                      style={{ background: '#16A34A' }}
                    >
                      Confirmar pagamento
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 px-4 py-2.5 rounded-lg font-label text-[13px] cursor-pointer border transition-colors"
                      style={{ background: 'var(--bg-content-solid)', borderColor: '#DC2626', color: '#DC2626' }}
                    >
                      {showRejectReason ? 'Rejeitar e notificar' : 'Rejeitar'}
                    </button>
                  </div>
                </div>
              )}

              {confirmState === 'confirmed' && (
                <div className="alert-banner alert-banner-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Comprovante aprovado. {data.brand} foi notificada.</span>
                </div>
              )}

              {confirmState === 'rejected' && (
                <div className="rounded-xl border p-3 flex items-start gap-2" style={{ borderColor: '#DC2626', background: 'rgba(220,38,38,0.05)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" className="shrink-0 mt-0.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span className="font-body text-[13px]" style={{ color: '#DC2626' }}>Comprovante rejeitado. {data.brand} foi notificada com o motivo: <em>{rejectReason}</em></span>
                </div>
              )}

              {/* Manual payment record (pending/late) */}
              {!isPaid && !hasComprovante && !paymentRecorded && (
                <div className="rounded-xl border border-[--border] p-5">
                  <h3 className="font-subheading text-[14px] text-[--text-primary] mb-4">Registrar pagamento manual</h3>
                  <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <div>
                      <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1 block">DATA DO PAGAMENTO</label>
                      <input
                        type="date"
                        value={paymentDate}
                        onChange={e => setPaymentDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[--border] font-body text-[13px] outline-none focus:border-[--accent] transition-colors"
                        style={{ background: 'var(--bg-content-solid)' }}
                      />
                    </div>
                    <div>
                      <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1 block">FORMA</label>
                      <select
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[--border] font-body text-[13px] outline-none focus:border-[--accent] transition-colors cursor-pointer"
                        style={{ background: 'var(--bg-content-solid)' }}
                      >
                        <option>Pix</option>
                        <option>TED</option>
                        <option>Dinheiro</option>
                        <option>Outro</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1 block">COMPROVANTE (PDF/JPEG)</label>
                    <button className="w-full px-3 py-2.5 rounded-lg border border-dashed border-[--border] font-label text-[12px] text-[--text-secondary] hover:bg-[--bg-primary] transition-colors cursor-pointer" style={{ background: 'var(--bg-content-solid)' }}>
                      + Anexar arquivo
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentRecorded(true)}
                      className="flex-1 px-4 py-2.5 rounded-lg font-label text-[13px] text-white cursor-pointer border-none transition-colors"
                      style={{ background: '#16A34A' }}
                    >
                      Confirmar pagamento
                    </button>
                  </div>
                </div>
              )}

              {paymentRecorded && (
                <div className="alert-banner alert-banner-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Pagamento de {data.brand} registrado. Status atualizado para Pago.</span>
                </div>
              )}

              {/* Notify line action (pending/late, no comprovante) */}
              {!isPaid && !hasComprovante && !paymentRecorded && (
                <div className="flex items-center justify-between pt-2">
                  <p className="font-caption text-[--text-tertiary]">Sem comprovante? Notifique a marca individualmente.</p>
                  <button
                    onClick={() => setNotified(true)}
                    disabled={notified}
                    className="px-3 py-2 rounded-lg font-label text-[12px] cursor-pointer border transition-colors disabled:opacity-60"
                    style={{ background: notified ? 'var(--bg-primary)' : 'var(--bg-content-solid)', borderColor: notified ? 'var(--success)' : 'var(--border)', color: notified ? 'var(--success)' : 'var(--text-primary)' }}
                  >
                    {notified ? 'Notificada ✓' : 'Notificar pendência'}
                  </button>
                </div>
              )}

              {/* Cross-link to repasse for late brands */}
              {isLate && onNavigate && (
                <button
                  onClick={() => { onNavigate('repasses'); onClose(); }}
                  className="font-label text-[12px] text-[--accent] cursor-pointer bg-transparent border-none hover:underline"
                >
                  Ver repasses bloqueados →
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
