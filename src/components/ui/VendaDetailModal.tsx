import { motion, AnimatePresence } from 'framer-motion';
import Badge from './Badge';
import type { StoreSale } from '../../data/sales';

interface VendaDetailModalProps {
  sale: StoreSale | null;
  onClose: () => void;
}

export default function VendaDetailModal({ sale, onClose }: VendaDetailModalProps) {
  if (!sale) return null;

  const isReturn = Boolean(sale.isReturn);
  const isBlocked = sale.pgto === 'Bloqueado';

  return (
    <AnimatePresence>
      {sale && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end modal-center-md justify-center p-0 modal-p-md"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="w-full max-w-xl modal-rounded shadow-2xl overflow-hidden"
            style={{ background: '#FFFFFF' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5 flex items-center justify-between border-b border-[--border]">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                  style={{ background: sale.brandAvatar.color }}
                >{sale.brandAvatar.letters}</span>
                <div>
                  <h2 className="font-heading text-[17px] text-[--text-primary]">{sale.product}</h2>
                  <p className="font-caption text-[--text-tertiary]">{sale.brand} · {sale.date} · Unidade {sale.store}</p>
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
              {/* Type badges */}
              <div className="flex items-center gap-2">
                {isReturn && <Badge status="danger" label="Devolução" showDot />}
                {isBlocked && <Badge status="warning" label="Bloqueado" showDot />}
                {!isReturn && !isBlocked && <Badge status="success" label="Venda confirmada" showDot />}
              </div>

              {/* Product / SKU */}
              <div className="rounded-xl border border-[--border] p-5 space-y-3">
                <h3 className="font-subheading text-[14px] text-[--text-primary]">Produto</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <div>
                    <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">SKU</p>
                    <p className="font-mono text-[14px] text-[--text-primary]">{sale.sku}</p>
                  </div>
                  <div>
                    <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">QUANTIDADE</p>
                    <p className="font-mono text-[14px] text-[--text-primary]">{sale.qty}</p>
                  </div>
                </div>
              </div>

              {/* Split breakdown */}
              <div className="rounded-xl border border-[--border] p-5 space-y-3">
                <h3 className="font-subheading text-[14px] text-[--text-primary]">Divisão (split {sale.split}/{100 - sale.split})</h3>
                <div className="space-y-2.5 text-[14px]">
                  <div className="flex justify-between py-1">
                    <span className="text-[--text-secondary]">Valor bruto</span>
                    <span className="font-mono" style={isReturn ? { color: '#DC2626' } : undefined}>{isReturn ? '−' : ''}R$ {Math.abs(sale.value).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[--text-secondary]">Fica para a loja</span>
                    <span className="font-mono" style={isReturn ? { color: '#DC2626' } : undefined}>{isReturn ? '−' : ''}R$ {Math.abs(sale.ficaLoja).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 border-t border-[--border]">
                    <span className="font-subheading text-[--text-primary]">Repasse à marca</span>
                    <span className="font-mono font-bold" style={isReturn ? { color: '#DC2626' } : { color: '#0D9488' }}>{isReturn ? '−' : ''}R$ {Math.abs(sale.repasse).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Repasse status + origin */}
              <div className="rounded-xl border border-[--border] p-5 space-y-3">
                <h3 className="font-subheading text-[14px] text-[--text-primary]">Pagamento e origem</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <div>
                    <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">PAGAMENTO PREVISTO</p>
                    {isBlocked
                      ? <Badge status="warning" label="Bloqueado" showDot />
                      : <p className="font-body text-[14px] text-[--text-primary]">{sale.pgto}</p>
                    }
                  </div>
                  <div>
                    <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">ORIGEM DA IMPORTAÇÃO</p>
                    <p className="font-body text-[14px] text-[--text-primary]">ERP · Integração</p>
                  </div>
                </div>
                {isBlocked && (
                  <p className="font-caption text-[--warning] mt-2">
                    Repasse desta venda travado por inadimplência da marca. Regularize em Cobranças.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
