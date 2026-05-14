import { useState } from 'react';
import { motion } from 'framer-motion';
import { amiraSales } from '../data/sales';
import CountUp from '../components/ui/CountUp';
import Badge from '../components/ui/Badge';

const repasseHistory = [
  { month: 'Mai/2025', value: 2650, status: 'Pago em 08/jun' },
  { month: 'Abr/2025', value: 3100, status: 'Pago em 07/mai' },
  { month: 'Mar/2025', value: 2200, status: 'Pago em 08/abr' },
  { month: 'Fev/2025', value: 1980, status: 'Pago em 07/mar' },
  { month: 'Jan/2025', value: 2400, status: 'Pago em 06/fev' },
  { month: 'Dez/2024', value: 2850, status: 'Pago em 08/jan' },
];

export default function BrandHomePage() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="content-max space-y-8">
      {/* Success banner */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Mensalidade de junho paga em 07/06/2025. Obrigada!</span>
      </div>

      {/* Metrics */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[
          { label: 'VENDAS EM JUNHO', value: 5840, sub: '47 vendas · SP e RJ' },
          { label: 'SEU REPASSE', value: 2920, sub: 'Até 20/07/2025' },
          { label: 'MENSALIDADE JUN', value: 1800, sub: 'Pago em 07/06', highlight: true },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className={`metric-card ${m.highlight ? 'bg-[--success-light]/30' : ''}`}
          >
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">{m.label}</p>
            <CountUp end={m.value} prefix="R$" start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
            <p className="font-caption text-[--text-tertiary] mt-1.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Resumo do mes */}
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-5">Resumo do mês</h3>
        <div className="space-y-3.5 text-[14px]">
          <div className="flex justify-between items-center py-1">
            <span className="text-[--text-secondary]">Valor vendido ao cliente</span>
            <span className="font-mono text-[--text-primary]">R$ 5.840</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[--text-secondary]">Valor que fica para a loja (50%)</span>
            <span className="font-mono text-[--danger]">-R$ 2.920</span>
          </div>
          <div className="border-t border-[--border] pt-3 flex justify-between items-center">
            <span className="font-subheading text-[--text-primary]">Seu repasse</span>
            <span className="font-mono text-[20px] font-bold text-[--accent]">R$ 2.920</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-caption text-[--text-tertiary]">Pagamento previsto até 20/07/2025</span>
            <Badge status="warning" label="Pendente" showDot />
          </div>
        </div>
      </div>

      {/* Recent sales + Repasse history */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        <div className="card p-6">
          <h3 className="font-subheading text-[16px] text-[--text-primary] mb-4">Últimas vendas</h3>
          <div className="space-y-0">
            {amiraSales.slice(0, 5).map((s, i) => (
              <div key={`${s.sku}-${i}`} className="flex items-center justify-between py-2.5 border-b border-[--border] last:border-b-0">
                <div>
                  <p className="font-body text-[13px] text-[--text-primary]">{s.product}</p>
                  <p className="font-caption text-[--text-tertiary]">{s.date} · {s.store}</p>
                </div>
                <span className="font-mono text-[13px]">R$ {s.value.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-subheading text-[16px] text-[--text-primary]">Histórico de repasses</h3>
            <button onClick={() => setShowHistory(!showHistory)} className="font-label text-[12px] text-[--accent] cursor-pointer bg-transparent border-none hover:underline">
              {showHistory ? 'Ocultar' : 'Ver todos'}
            </button>
          </div>
          <div className="space-y-0">
            {(showHistory ? repasseHistory : repasseHistory.slice(0, 3)).map(h => (
              <div key={h.month} className="flex items-center justify-between py-3 border-b border-[--border] last:border-b-0">
                <span className="font-label text-[--text-secondary]">{h.month}</span>
                <span className="font-mono text-[14px]">R$ {h.value.toLocaleString('pt-BR')}</span>
                <Badge status="success" label={h.status} showDot={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
