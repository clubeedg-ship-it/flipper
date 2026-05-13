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
];

export default function BrandMensalidadePage() {
  return (
    <div className="content-max space-y-6">
      {/* Current month */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-6"
      >
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-5">Mensalidade — Junho 2025</h3>
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
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">STATUS</p>
            <Badge status="success" label="Paga em 07/06" showDot />
          </div>
          <div>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">MÉTODO</p>
            <p className="font-body text-[16px] text-[--text-primary]">Pix</p>
          </div>
        </div>
      </motion.div>

      {/* History table */}
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-5">Histórico de pagamentos</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['MÊS', 'VALOR', 'PAGO EM', 'MÉTODO', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map(p => (
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
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-[--border] p-5" style={{ background: '#F0FDFA' }}>
        <p className="font-body text-[14px]" style={{ color: '#0D9488' }}>
          Mensalidade em dia garante repasse e NF-e liberados. Em caso de atraso, o repasse fica bloqueado até regularização.
        </p>
      </div>
    </div>
  );
}
