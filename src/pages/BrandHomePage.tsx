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

interface BrandHomePageProps {
  onNavigate?: (page: string) => void;
}

export default function BrandHomePage({ onNavigate }: BrandHomePageProps) {
  const [showHistory, setShowHistory] = useState(false);

  const vendasJun = 5840;
  const vendasMai = 5300;
  const momPct = Math.round(((vendasJun - vendasMai) / vendasMai) * 100);

  // Top 3 products by aggregate value
  const productAggregates = new Map<string, { product: string; value: number; qty: number }>();
  amiraSales.forEach(s => {
    const prev = productAggregates.get(s.product) || { product: s.product, value: 0, qty: 0 };
    productAggregates.set(s.product, { product: s.product, value: prev.value + s.value, qty: prev.qty + s.qty });
  });
  const topProducts = Array.from(productAggregates.values()).sort((a, b) => b.value - a.value).slice(0, 3);
  const seuRepasse = Math.round(vendasJun * 0.5);

  const shortcuts = [
    { id: 'brand-vendas', label: 'Minhas vendas', sub: `${amiraSales.length} vendas em junho`, icon: 'M3 3v18h18' },
    { id: 'brand-repasses', label: 'Meus repasses', sub: 'Histórico + próximo', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'brand-mensalidade', label: 'Mensalidade', sub: 'Pago em 07/06', icon: 'M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM1 10h22' },
    { id: 'brand-nfe', label: 'NF-e', sub: 'Enviar próxima', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
  ];

  return (
    <div className="content-max space-y-8">
      {/* Success banner */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Mensalidade de junho paga em 07/06/2025. Obrigada!</span>
      </div>

      {/* 4 KPIs */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {[
          {
            label: 'VENDAS EM JUNHO',
            value: vendasJun,
            prefix: 'R$',
            sub: (
              <span className="font-caption">
                <span style={{ color: momPct >= 0 ? '#16A34A' : '#DC2626' }}>{momPct >= 0 ? '↑' : '↓'} {Math.abs(momPct)}%</span>
                <span className="text-[--text-tertiary]"> vs maio (R$ {vendasMai.toLocaleString('pt-BR')})</span>
              </span>
            ),
          },
          { label: 'ITENS VENDIDOS', value: amiraSales.reduce((s, r) => s + r.qty, 0), prefix: '', sub: <span className="font-caption text-[--text-tertiary]">{amiraSales.length} pedidos</span> },
          { label: 'TICKET MÉDIO', value: Math.round(vendasJun / amiraSales.length), prefix: 'R$', sub: <span className="font-caption text-[--text-tertiary]">Por pedido em junho</span> },
          { label: 'MENSALIDADE JUN', value: 1800, prefix: 'R$', sub: <span className="font-caption text-[--text-tertiary]">Pago em 07/06</span>, highlight: true },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className={`metric-card ${m.highlight ? 'bg-[--success-light]/30' : ''}`}
          >
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">{m.label}</p>
            <CountUp end={m.value} prefix={m.prefix} start className="text-[28px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
            <div className="mt-1.5">{m.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Próximo repasse — dedicated featured card */}
      <div
        className="card p-6"
        style={{ borderColor: '#F59E0B', background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, rgba(255,255,255,0) 60%)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-label text-[11px] uppercase tracking-[1px] mb-1" style={{ color: '#F59E0B' }}>PRÓXIMO REPASSE</p>
            <h3 className="font-heading text-[20px] text-[--text-primary]">Junho 2025</h3>
          </div>
          <Badge status="warning" label="Pendente" showDot />
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
          <div className="space-y-3 text-[14px]">
            <div className="flex justify-between items-center">
              <span className="text-[--text-secondary]">Valor vendido ao cliente</span>
              <span className="font-mono text-[--text-primary]">R$ {vendasJun.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[--text-secondary]">Fica para a loja (50%)</span>
              <span className="font-mono text-[--danger]">−R$ {seuRepasse.toLocaleString('pt-BR')}</span>
            </div>
            <div className="border-t border-[--border] pt-3 flex justify-between items-center">
              <span className="font-subheading text-[--text-primary]">Seu repasse</span>
              <span className="font-mono text-[24px] font-bold" style={{ color: '#0D9488' }}>R$ {seuRepasse.toLocaleString('pt-BR')}</span>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-caption text-[--text-tertiary] mb-1">Pagamento previsto</p>
              <p className="font-subheading text-[18px] text-[--text-primary]">Até 20/07/2025</p>
              <p className="font-caption text-[--text-tertiary] mt-1">Via Pix · Banco do Brasil</p>
            </div>
            <button
              onClick={() => onNavigate?.('brand-repasses')}
              className="mt-4 px-4 py-2 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary] text-left"
            >
              Ver detalhes do repasse →
            </button>
          </div>
        </div>
      </div>

      {/* Produtos em destaque + Últimas vendas */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        <div className="card p-6">
          <h3 className="font-subheading text-[16px] text-[--text-primary] mb-4">Produtos em destaque</h3>
          <p className="font-caption text-[--text-tertiary] mb-4">Top 3 por valor vendido em junho</p>
          <div className="space-y-0">
            {topProducts.map((p, i) => (
              <div key={p.product} className="flex items-center justify-between py-3 border-b border-[--border] last:border-b-0">
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                    style={{ background: ['#0D9488', '#2563EB', '#7C3AED'][i] }}
                  >{i + 1}</span>
                  <div>
                    <p className="font-body text-[13px] text-[--text-primary]">{p.product}</p>
                    <p className="font-caption text-[--text-tertiary]">{p.qty} {p.qty === 1 ? 'unidade' : 'unidades'} vendidas</p>
                  </div>
                </div>
                <span className="font-mono text-[14px] text-[--text-primary]">R$ {p.value.toLocaleString('pt-BR')}</span>
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
            {(showHistory ? repasseHistory : repasseHistory.slice(0, 4)).map(h => (
              <div key={h.month} className="flex items-center justify-between py-3 border-b border-[--border] last:border-b-0">
                <span className="font-label text-[--text-secondary]">{h.month}</span>
                <span className="font-mono text-[14px]">R$ {h.value.toLocaleString('pt-BR')}</span>
                <Badge status="success" label={h.status} showDot={false} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick-access shortcuts */}
      <div>
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-4">Acesso rápido</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {shortcuts.map(s => (
            <button
              key={s.id}
              onClick={() => onNavigate?.(s.id)}
              className="card p-5 text-left hover:shadow-md transition-shadow cursor-pointer border border-[--border]"
              style={{ background: 'var(--bg-content)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#E6F2EF', color: '#0D9488' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>
                <p className="font-subheading text-[14px] text-[--text-primary]">{s.label}</p>
              </div>
              <p className="font-caption text-[--text-tertiary]">{s.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent sales */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Últimas vendas</h3>
          <button
            onClick={() => onNavigate?.('brand-vendas')}
            className="font-label text-[12px] text-[--accent] cursor-pointer bg-transparent border-none hover:underline"
          >
            Ver todas →
          </button>
        </div>
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
    </div>
  );
}
