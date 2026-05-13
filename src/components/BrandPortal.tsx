import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { amiraSales, type Sale } from '../data/sales';
import { amiraMetrics } from '../data/metrics';
import GlassCard from './ui/GlassCard';
import CountUp from './ui/CountUp';
import Badge from './ui/Badge';
import SectionTransition from './ui/SectionTransition';
import { useInView } from '../hooks/useInView';

type Filter = 'Todas' | 'SP' | 'RJ' | 'Últimos 7 dias';

function filterSales(sales: Sale[], filter: Filter): Sale[] {
  switch (filter) {
    case 'SP': return sales.filter(s => s.store === 'SP');
    case 'RJ': return sales.filter(s => s.store === 'RJ');
    case 'Últimos 7 dias': return sales.slice(0, 5);
    default: return sales;
  }
}

const totalByFilter: Record<Filter, { shown: number; total: number }> = {
  'Todas': { shown: 10, total: 47 },
  'SP': { shown: 7, total: 34 },
  'RJ': { shown: 3, total: 13 },
  'Últimos 7 dias': { shown: 5, total: 5 },
};

const repasseHistory = [
  { month: 'Mai/2025', value: 2650, status: 'Pago em 08/jun' },
  { month: 'Abr/2025', value: 3100, status: 'Pago em 07/mai' },
  { month: 'Mar/2025', value: 2200, status: 'Pago em 08/abr' },
];

export default function BrandPortal() {
  const [filter, setFilter] = useState<Filter>('Todas');
  const [showSalesBreakdown, setShowSalesBreakdown] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'done'>('idle');
  const { ref: metricsRef, isInView: metricsInView } = useInView();

  const filteredSales = filterSales(amiraSales, filter);
  const totals = totalByFilter[filter];

  const handleDownload = () => {
    setDownloadState('loading');
    setTimeout(() => setDownloadState('done'), 500);
  };

  const filters: Filter[] = ['Todas', 'SP', 'RJ', 'Últimos 7 dias'];

  const { ref: sectionRef, isInView: sectionInView } = useInView({ threshold: 0.1, once: false });

  return (
    <section ref={sectionRef} data-act="3" className="min-h-screen snap-start pb-20" style={{ background: '#FAFAF8', paddingTop: '100px' }}>
      {/* Context badge - only visible when Act 3 is in view */}
      <AnimatePresence>
        {sectionInView && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-[#DBEAFE] text-[#2563EB] px-4 py-2 rounded-full font-label flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Visão da marca: Amira · Joias artesanais
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="content-max">
        {/* Transition label */}
        <SectionTransition className="text-center mb-16">
          <div className="inline-block glass rounded-full px-6 py-3">
            <p className="font-subheading text-[20px] text-[#6B7280]">
              Agora veja como a Amira enxerga o Flipper.
            </p>
          </div>
        </SectionTransition>

        {/* 3A - Welcome */}
        <SectionTransition className="mb-10">
          <h2 className="font-heading text-[32px] text-[#111111] mb-2">Olá, Amira.</h2>
          <p className="font-body text-[#6B7280]">Seu resumo na Pinga · Junho 2025</p>
        </SectionTransition>

        {/* 3B - Metrics */}
        <div ref={metricsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
          {amiraMetrics.map((m, i) => (
            <div key={m.label} className="relative">
              <GlassCard delay={i * 0.06} interactive={i === 0} onClick={i === 0 ? () => setShowSalesBreakdown(!showSalesBreakdown) : undefined}>
                <p className="font-label text-[#6B7280] mb-2">{m.label}</p>
                <div className="mb-1">
                  {metricsInView && m.value > 0 ? (
                    <CountUp end={m.value} prefix="R$ " start={metricsInView} className="text-[28px] font-bold text-[#111111]" formatOptions={{ useGrouping: true }} />
                  ) : (
                    m.isBadge ? (
                      <Badge status="success" label={m.formatted} showDot={false} />
                    ) : (
                      <span className="font-mono text-[28px] font-bold text-[#111111]">{m.formatted}</span>
                    )
                  )}
                </div>
                <p className="font-caption text-[#9CA3AF] mt-2">{m.detail}</p>
              </GlassCard>

              <AnimatePresence>
                {i === 0 && showSalesBreakdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 glass rounded-xl p-4 z-20"
                  >
                    <div className="flex justify-between py-1.5">
                      <span className="font-label text-[#6B7280]">SP (Jardins)</span>
                      <span className="font-mono text-sm">R$ 3.840 <span className="text-[#9CA3AF]">(34 itens)</span></span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-label text-[#6B7280]">RJ (Leblon)</span>
                      <span className="font-mono text-sm">R$ 2.000 <span className="text-[#9CA3AF]">(13 itens)</span></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* 3C - Sales Table */}
        <SectionTransition className="mb-16">
          <h3 className="font-heading text-[24px] text-[#111111] mb-4">Vendas do mês</h3>

          <div className="flex gap-2 mb-6">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full font-label text-[13px] transition-colors ${
                  filter === f
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.table
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left font-label text-[#9CA3AF] py-3 pr-4">Data</th>
                    <th className="text-left font-label text-[#9CA3AF] py-3 pr-4">Produto</th>
                    <th className="text-left font-label text-[#9CA3AF] py-3 pr-4">SKU</th>
                    <th className="text-right font-label text-[#9CA3AF] py-3 pr-4">Qtd</th>
                    <th className="text-right font-label text-[#9CA3AF] py-3 pr-4">Valor</th>
                    <th className="text-left font-label text-[#9CA3AF] py-3">Loja</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((s, i) => (
                    <tr key={`${s.sku}-${s.date}-${i}`} className="border-b border-[#E5E7EB]">
                      <td className="py-3 pr-4 font-caption text-[#6B7280]">{s.date}</td>
                      <td className="py-3 pr-4 font-body text-[14px]">{s.product}</td>
                      <td className="py-3 pr-4 font-mono text-[13px] text-[#9CA3AF]">{s.sku}</td>
                      <td className="py-3 pr-4 text-right font-mono text-[14px]">{s.qty}</td>
                      <td className="py-3 pr-4 text-right font-mono text-[14px]">R$ {s.value.toLocaleString('pt-BR')}</td>
                      <td className="py-3 font-label text-[#6B7280]">{s.store}</td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            </AnimatePresence>
          </div>
          <p className="font-caption text-[#9CA3AF] mt-3">Mostrando {filteredSales.length} de {totals.total} vendas</p>
        </SectionTransition>

        {/* 3D - Repasse & NF-e */}
        <SectionTransition className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Repasse */}
            <GlassCard>
              <h4 className="font-subheading text-[16px] text-[#111111] mb-4">Repasse previsto</h4>
              <p className="font-mono-lg text-[#111111] mb-4">R$ 2.920</p>
              <div className="space-y-2 text-[14px] mb-6">
                <div className="flex justify-between"><span className="text-[#6B7280]">Status</span><Badge status="warning" label="Aguardando NF-e da loja" showDot={false} /></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Split</span><span>50/50 (contrato vigente)</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Base</span><span className="font-mono">R$ 5.840 em vendas</span></div>
              </div>
              <h5 className="font-subheading text-[14px] text-[#111111] mb-3">Histórico</h5>
              <div className="space-y-2">
                {repasseHistory.map(h => (
                  <div key={h.month} className="flex items-center justify-between text-[13px]">
                    <span className="text-[#6B7280] w-20">{h.month}</span>
                    <span className="font-mono">R$ {h.value.toLocaleString('pt-BR')}</span>
                    <Badge status="success" label={h.status} showDot={false} />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* NF-e */}
            <GlassCard>
              <h4 className="font-subheading text-[16px] text-[#111111] mb-4">NF-e do mês</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-[14px]">
                  <div>
                    <span className="font-mono text-[#9CA3AF]">#4587</span>
                    <span className="ml-2">Mensalidade jun</span>
                  </div>
                  <span className="font-mono">R$ 1.800</span>
                  <Badge status="success" label="Emitida" showDot={false} />
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <div>
                    <span className="font-mono text-[#9CA3AF]">#---</span>
                    <span className="ml-2">Repasse jun</span>
                  </div>
                  <span className="font-mono">R$ 2.920</span>
                  <Badge status="warning" label="Pendente" showDot={false} />
                </div>
              </div>
              <button
                onClick={handleDownload}
                disabled={downloadState === 'loading'}
                className="py-2.5 px-4 border border-[#E5E7EB] text-[#111111] rounded-xl font-subheading text-[14px] hover:bg-[#F3F4F6] transition-colors flex items-center gap-2"
              >
                {downloadState === 'loading' ? (
                  <motion.svg animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></motion.svg>
                ) : downloadState === 'done' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                )}
                {downloadState === 'done' ? 'NF-e_4587_Amira_jun2025.pdf' : 'Baixar NF-e #4587'}
              </button>
            </GlassCard>
          </div>
        </SectionTransition>

        {/* Anchor phrase */}
        <SectionTransition className="text-center">
          <p className="font-subheading text-[20px] text-[#6B7280] italic">
            "Cada marca tem o painel dela. Transparência que fideliza."
          </p>
        </SectionTransition>
      </div>
    </section>
  );
}
