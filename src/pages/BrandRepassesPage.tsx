import { motion } from 'framer-motion';
import { brands } from '../data/brands';
import Badge from '../components/ui/Badge';

const amira = brands.find(b => b.name === 'Amira')!;
const contract = amira.drawer.contract;
const june = amira.drawer.june;

const repasseHistory = [
  { month: 'Mai/2025', value: 2650, status: 'Pago em 08/jun', paidDate: '08/06/2025' },
  { month: 'Abr/2025', value: 3100, status: 'Pago em 07/mai', paidDate: '07/05/2025' },
  { month: 'Mar/2025', value: 2200, status: 'Pago em 08/abr', paidDate: '08/04/2025' },
  { month: 'Fev/2025', value: 1980, status: 'Pago em 07/mar', paidDate: '07/03/2025' },
  { month: 'Jan/2025', value: 2400, status: 'Pago em 06/fev', paidDate: '06/02/2025' },
];

export default function BrandRepassesPage() {
  return (
    <div className="content-max space-y-6">
      {/* Current month card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-6"
      >
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-5">Repasse — Junho 2025</h3>
        <div className="space-y-3.5 text-[14px]">
          <div className="flex justify-between items-center py-1">
            <span className="text-[--text-secondary]">Vendas no mês</span>
            <span className="font-mono text-[--text-primary]">R$ {june.vendasBrutas.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[--text-secondary]">Split {contract.split} — fica para a loja</span>
            <span className="font-mono text-[--danger]">−R$ {(june.vendasBrutas - june.repasse).toLocaleString('pt-BR')}</span>
          </div>
          <div className="border-t border-[--border] pt-3 flex justify-between items-center">
            <span className="font-subheading text-[--text-primary]">Seu repasse</span>
            <span className="font-mono text-[20px] font-bold" style={{ color: '#0D9488' }}>R$ {june.repasse.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-caption text-[--text-tertiary]">Previsão de pagamento: 20/07/2025</span>
            <Badge status="warning" label="Pendente" showDot />
          </div>
        </div>
      </motion.div>

      {/* History table */}
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-5">Histórico de repasses</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['MÊS', 'VALOR', 'STATUS', 'PAGO EM'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repasseHistory.map(h => (
              <tr key={h.month} className="border-b border-[--border] last:border-b-0">
                <td className="py-3.5 pr-4 font-label text-[--text-secondary]">{h.month}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {h.value.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4"><Badge status="success" label="Pago" showDot /></td>
                <td className="py-3.5 font-body text-[13px] text-[--text-secondary]">{h.paidDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-[--border] p-5" style={{ background: '#F0FDFA' }}>
        <p className="font-body text-[14px]" style={{ color: '#0D9488' }}>
          Repasse é calculado automaticamente sobre vendas confirmadas. O valor é creditado após conferência e emissão de NF-e.
        </p>
      </div>
    </div>
  );
}
