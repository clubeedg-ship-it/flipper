import { useState } from 'react';
import { motion } from 'framer-motion';
import { brands } from '../data/brands';
import Badge from '../components/ui/Badge';
import type { BrandStatus } from '../data/brands';

const amira = brands.find(b => b.name === 'Amira')!;
const contract = amira.drawer.contract;

interface PaymentRecord {
  month: string;
  value: number;
  paidDate: string;
  method: string;
  status: string;
  statusType: BrandStatus;
}

const paymentHistory: PaymentRecord[] = [
  { month: 'Jun/2025', value: contract.mensalidade, paidDate: '07/06/2025', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Mai/2025', value: contract.mensalidade, paidDate: '05/05/2025', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Abr/2025', value: contract.mensalidade, paidDate: '04/04/2025', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Mar/2025', value: contract.mensalidade, paidDate: '06/03/2025', method: 'Transferência', status: 'Pago', statusType: 'success' },
  { month: 'Fev/2025', value: contract.mensalidade, paidDate: '05/02/2025', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Jan/2025', value: contract.mensalidade, paidDate: '07/01/2025', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Dez/2024', value: contract.mensalidade, paidDate: '05/12/2024', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Nov/2024', value: contract.mensalidade, paidDate: '05/11/2024', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Out/2024', value: contract.mensalidade, paidDate: '06/10/2024', method: 'Boleto', status: 'Pago', statusType: 'success' },
  { month: 'Set/2024', value: contract.mensalidade, paidDate: '05/09/2024', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Ago/2024', value: contract.mensalidade, paidDate: '07/08/2024', method: 'Pix', status: 'Pago', statusType: 'success' },
  { month: 'Jul/2024', value: contract.mensalidade, paidDate: '05/07/2024', method: 'Pix', status: 'Pago', statusType: 'success' },
];

type ComprovanteState = 'idle' | 'uploading' | 'aguardando' | 'pago' | 'rejeitado';

interface BrandMensalidadePageProps {
  onNavigate?: (page: string) => void;
}

export default function BrandMensalidadePage({ onNavigate }: BrandMensalidadePageProps = {}) {
  const [showHistory, setShowHistory] = useState(false);
  const [comprovanteState, setComprovanteState] = useState<ComprovanteState>('idle');
  const [showPixPanel, setShowPixPanel] = useState(false);

  // Simulated "now" relative to next mensalidade (Jul/2025, due 05/07)
  // Spec: Pix/boleto liberado a partir de 5 dias antes do vencimento
  const daysToVencimento = 4;
  const nearVencimento = daysToVencimento <= 5;

  const cycleComprovante = () => {
    if (comprovanteState === 'idle') {
      setComprovanteState('uploading');
      setTimeout(() => setComprovanteState('aguardando'), 1200);
      return;
    }
    if (comprovanteState === 'aguardando') { setComprovanteState('pago'); return; }
    if (comprovanteState === 'pago') { setComprovanteState('rejeitado'); return; }
    if (comprovanteState === 'rejeitado') { setComprovanteState('idle'); return; }
  };

  const comprovanteLabel = {
    idle: 'Enviar comprovante',
    uploading: 'Enviando...',
    aguardando: 'Aguardando confirmação',
    pago: 'Pagamento confirmado',
    rejeitado: 'Rejeitado · reenviar',
  }[comprovanteState];

  const comprovanteBg =
    comprovanteState === 'pago' ? '#E6F4EC' :
    comprovanteState === 'aguardando' ? '#FEF3DC' :
    comprovanteState === 'rejeitado' ? '#FEE8E8' :
    '#0D9488';
  const comprovanteFg =
    comprovanteState === 'pago' ? '#16A34A' :
    comprovanteState === 'aguardando' ? '#D4860A' :
    comprovanteState === 'rejeitado' ? '#C53030' :
    '#FFFFFF';

  return (
    <div className="content-max space-y-6">
      {/* Current month */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Mensalidade — Junho 2025</h3>
          <Badge status="success" label="Paga" showDot />
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">VALOR</p>
            <p className="font-mono text-[20px] font-bold text-[--text-primary]">R$ {contract.mensalidade.toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">VENCIMENTO</p>
            <p className="font-body text-[16px] text-[--text-primary]">Dia 5</p>
          </div>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">PAGO EM</p>
            <p className="font-body text-[16px] text-[--text-primary]">07/06/2025</p>
          </div>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">MÉTODO</p>
            <p className="font-body text-[16px] text-[--text-primary]">Pix</p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-[--border] flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => onNavigate?.('brand-repasses')}
            className="font-label text-[13px] text-[--accent] cursor-pointer bg-transparent border-none hover:underline inline-flex items-center gap-1"
          >
            Ver repasse de Junho
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button
            className="px-3 py-1.5 rounded-lg font-label text-[12px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer text-[--text-primary] inline-flex items-center gap-1.5"
            style={{ background: 'var(--bg-content-solid)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Baixar comprovante
          </button>
        </div>
      </motion.div>

      {/* Próxima mensalidade — Pix/boleto only visible near vencimento */}
      <div
        className="card p-6"
        style={nearVencimento ? { borderColor: '#F59E0B' } : undefined}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-subheading text-[16px] text-[--text-primary]">Próxima mensalidade — Julho 2025</h3>
            <p className="font-caption text-[--text-tertiary] mt-1">
              {nearVencimento ? `Vence em ${daysToVencimento} dias (05/07/2025)` : 'Vencimento dia 5'}
            </p>
          </div>
          <Badge status={nearVencimento ? 'warning' : 'neutral'} label={nearVencimento ? 'A vencer' : 'Aberta'} showDot />
        </div>

        {nearVencimento ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPixPanel(p => !p)}
                className="flex-1 px-4 py-3 rounded-lg font-label text-[13px] text-white cursor-pointer border-none transition-colors flex items-center justify-center gap-2"
                style={{ background: '#0D9488' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                {showPixPanel ? 'Ocultar Pix' : 'Gerar Pix / Copia-e-cola'}
              </button>
              <button className="flex-1 px-4 py-3 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-white text-[--text-primary] flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="1"/><line x1="7" y1="6" x2="7" y2="18"/><line x1="11" y1="6" x2="11" y2="18"/><line x1="15" y1="6" x2="15" y2="18"/></svg>
                Gerar boleto bancário
              </button>
            </div>

            {showPixPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-[--border] p-5 overflow-hidden"
                style={{ background: 'var(--bg-primary)' }}
              >
                <div className="grid gap-5 items-center" style={{ gridTemplateColumns: "auto 1fr" }}>
                  <div className="w-32 h-32 rounded-lg flex items-center justify-center" style={{ background: '#fff', border: '1px solid var(--border)' }}>
                    {/* simulated QR */}
                    <div
                      className="w-24 h-24"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #111 1.5px, transparent 1.5px)',
                        backgroundSize: '6px 6px',
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">PIX COPIA-E-COLA</p>
                    <code className="font-mono text-[11px] text-[--text-primary] block break-all bg-white border border-[--border] rounded-lg p-2 mb-2">
                      00020126580014br.gov.bcb.pix0136fbb...e2152040000530398654041800.0...
                    </code>
                    <p className="font-caption text-[--text-tertiary]">
                      Confirmação automática via webhook · valor R$ {contract.mensalidade.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Comprovante upload — 3 states */}
            <div>
              <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-2">JÁ PAGOU FORA DO PIX/BOLETO?</p>
              <button
                onClick={cycleComprovante}
                disabled={comprovanteState === 'uploading'}
                className="w-full px-4 py-3 rounded-lg font-label text-[13px] cursor-pointer border-none transition-colors disabled:opacity-60"
                style={{ background: comprovanteBg, color: comprovanteFg, borderWidth: comprovanteState === 'idle' ? 0 : 1, borderStyle: 'solid', borderColor: comprovanteFg }}
              >
                {comprovanteLabel}
              </button>
              {comprovanteState !== 'idle' && comprovanteState !== 'uploading' && (
                <p className="font-caption text-[--text-tertiary] mt-2">
                  {comprovanteState === 'aguardando' && 'A loja revisará seu comprovante em até 1 dia útil.'}
                  {comprovanteState === 'pago' && 'Pagamento confirmado pela loja. Mensalidade quitada.'}
                  {comprovanteState === 'rejeitado' && 'Comprovante ilegível. Reenvie um arquivo válido (PDF/JPEG).'}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="font-body text-[14px] text-[--text-secondary]">
            Pix e boleto serão liberados a partir de 5 dias antes do vencimento.
          </p>
        )}
      </div>

      {/* Consequence callout */}
      <div className="rounded-xl border p-5" style={{ borderColor: '#F59E0B', background: '#FEF3DC' }}>
        <div className="flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4860A" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <p className="font-subheading text-[14px] mb-1" style={{ color: '#D4860A' }}>Atraso na mensalidade bloqueia o repasse</p>
            <p className="font-body text-[13px]" style={{ color: '#7A4D00' }}>
              Caso a mensalidade entre em atraso, o repasse do mês fica bloqueado até a regularização — e a NF-e do repasse não é emitida. Mantendo em dia, tudo flui normalmente.
            </p>
          </div>
        </div>
      </div>

      {/* History table — 12 months */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Histórico de pagamentos</h3>
          <button
            onClick={() => setShowHistory(s => !s)}
            className="font-label text-[12px] text-[--accent] cursor-pointer bg-transparent border-none hover:underline"
          >
            {showHistory ? 'Mostrar últimos 6' : 'Ver últimos 12 meses'}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['MÊS', 'VALOR', 'PAGO EM', 'MÉTODO', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(showHistory ? paymentHistory : paymentHistory.slice(0, 6)).map(p => (
              <tr key={p.month} className="border-b border-[--border] last:border-b-0">
                <td className="py-3.5 pr-4 font-label text-[--text-secondary]">{p.month}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {p.value.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{p.paidDate}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{p.method}</td>
                <td className="py-3.5"><Badge status={p.statusType} label={p.status} showDot /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-caption text-[--text-tertiary] mt-4">
          Mostrando {showHistory ? 12 : 6} de {paymentHistory.length} meses
        </p>
      </div>

      {/* Seu contrato */}
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-4">Seu contrato</h3>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">MARCA</p>
            <p className="font-subheading text-[14px] text-[--text-primary]">{amira.name}</p>
            <p className="font-caption text-[--text-tertiary] mt-1">{amira.drawer.description}</p>
          </div>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">SPLIT</p>
            <p className="font-mono text-[16px] text-[--text-primary]">{contract.split}</p>
            <p className="font-caption text-[--text-tertiary] mt-1">Loja/Marca</p>
          </div>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">MENSALIDADE</p>
            <p className="font-mono text-[16px] text-[--text-primary]">R$ {contract.mensalidade.toLocaleString('pt-BR')}</p>
            <p className="font-caption text-[--text-tertiary] mt-1">Vencimento {contract.vencimento}</p>
          </div>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">ATIVA DESDE</p>
            <p className="font-body text-[14px] text-[--text-primary]">{amira.drawer.activeSince}</p>
            <p className="font-caption text-[--text-tertiary] mt-1">Unidade {amira.location}</p>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-[--border] flex items-center justify-between">
          <p className="font-caption text-[--text-tertiary]">Dúvidas sobre o contrato? Fale com a loja.</p>
          <button className="px-4 py-2 rounded-lg font-label text-[12px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-white text-[--text-primary]">
            Baixar contrato (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
