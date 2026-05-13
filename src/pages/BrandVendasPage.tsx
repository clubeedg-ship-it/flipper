import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { amiraSales } from '../data/sales';
import CountUp from '../components/ui/CountUp';

type Filter = 'Todas' | 'SP' | 'RJ';

export default function BrandVendasPage() {
  const [filter, setFilter] = useState<Filter>('Todas');

  const filtered = amiraSales.filter(s => filter === 'Todas' || s.store === filter);
  const totalValue = filtered.reduce((s, r) => s + r.value, 0);
  const totalItems = filtered.reduce((s, r) => s + r.qty, 0);
  const ticketMedio = totalItems > 0 ? Math.round(totalValue / totalItems) : 0;

  return (
    <div className="content-max space-y-6">
      {/* Summary cards */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[
          { label: 'TOTAL VENDIDO', value: totalValue, sub: `${filtered.length} vendas` },
          { label: 'ITENS VENDIDOS', value: totalItems, sub: `Em ${filter === 'Todas' ? 'todas as unidades' : filter}` },
          { label: 'TICKET MÉDIO', value: ticketMedio, sub: 'Por item' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="metric-card"
          >
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">{m.label}</p>
            <CountUp end={m.value} prefix="R$" start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
            <p className="font-caption text-[--text-tertiary] mt-1.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['Todas', 'SP', 'RJ'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-label text-[13px] transition-all duration-200 cursor-pointer border ${
              filter === f
                ? 'text-white border-transparent'
                : 'bg-[--bg-content] text-[--text-secondary] border-[--border] hover:bg-[--bg-primary]'
            }`}
            style={filter === f ? { background: '#0D9488', borderColor: '#0D9488' } : undefined}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sales table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Minhas vendas — Junho 2025</h3>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-[--border]">
                  {['DATA', 'PRODUTO', 'SKU', 'QTD', 'VALOR', 'LOJA'].map(h => (
                    <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={`${s.sku}-${i}`} className="border-b border-[--border] last:border-b-0">
                    <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{s.date}</td>
                    <td className="py-3.5 pr-4 font-body text-[14px] text-[--text-primary]">{s.product}</td>
                    <td className="py-3.5 pr-4 font-mono text-[13px]">{s.sku}</td>
                    <td className="py-3.5 pr-4 font-mono text-[14px]">{s.qty}</td>
                    <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {s.value.toLocaleString('pt-BR')}</td>
                    <td className="py-3.5 font-body text-[13px] text-[--text-secondary]">{s.store}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
        <p className="font-caption text-[--text-tertiary] mt-4">Mostrando {filtered.length} de {amiraSales.length} vendas</p>
      </div>
    </div>
  );
}
