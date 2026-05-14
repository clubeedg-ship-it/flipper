import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { amiraSales } from '../data/sales';
import CountUp from '../components/ui/CountUp';

type Filter = 'Todas' | 'SP' | 'RJ';

interface BrandVendasPageProps {
  onNavigate?: (page: string) => void;
}

export default function BrandVendasPage({ onNavigate }: BrandVendasPageProps) {
  const [filter, setFilter] = useState<Filter>('Todas');
  const [period, setPeriod] = useState('Junho 2025');
  const [exporting, setExporting] = useState(false);

  const filtered = amiraSales.filter(s => filter === 'Todas' || s.store === filter);
  const totalValue = filtered.reduce((s, r) => s + r.value, 0);
  const totalItems = filtered.reduce((s, r) => s + r.qty, 0);
  const ticketMedio = totalItems > 0 ? Math.round(totalValue / totalItems) : 0;

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1200);
  };

  return (
    <div className="content-max space-y-6">
      {/* Period nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px]">Período</span>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1.5 border border-[--border] rounded-lg font-body text-[13px] text-[--text-primary] bg-white cursor-pointer"
          >
            <option>Junho 2025</option>
            <option>Maio 2025</option>
            <option>Abril 2025</option>
            <option>Março 2025</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 rounded-lg font-label text-[12px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-white text-[--text-primary] disabled:opacity-60"
        >
          {exporting ? 'Exportando...' : 'Exportar CSV'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[
          { label: 'TOTAL VENDIDO', value: totalValue, sub: `${filtered.length} vendas` },
          { label: 'ITENS VENDIDOS', value: totalItems, sub: `Em ${filter === 'Todas' ? 'todas as unidades' : filter}`, raw: true },
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
            <CountUp end={m.value} prefix={m.raw ? '' : 'R$'} start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
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
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Minhas vendas — {period}</h3>
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
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[--border]">
          <p className="font-caption text-[--text-tertiary]">Mostrando {filtered.length} de {amiraSales.length} vendas</p>
          <button
            onClick={() => onNavigate?.('brand-repasses')}
            className="font-label text-[12px] text-[--accent] cursor-pointer bg-transparent border-none hover:underline"
          >
            Ver repasse do mês →
          </button>
        </div>
      </div>
    </div>
  );
}
