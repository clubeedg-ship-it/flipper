import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { dashboardMetrics, checklistItems } from '../data/metrics';
import { brands } from '../data/brands';
import { amiraSales } from '../data/sales';
import Badge from '../components/ui/Badge';
import CountUp from '../components/ui/CountUp';

const sections = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'vendas', label: 'Vendas' },
  { id: 'marcas', label: 'Marcas' },
  { id: 'fechamento', label: 'Fechamento' },
  { id: 'cobrancas', label: 'Cobranças' },
  { id: 'repasses', label: 'Repasses' },
  { id: 'protecao', label: 'Proteção' },
  { id: 'portal', label: 'Portal' },
];

function StickyNav({ activeId }: { activeId: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(`demo-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-0 z-10 -mx-8 px-8 py-3" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex gap-1.5 overflow-x-auto">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="px-3 py-1.5 rounded-lg font-label text-[12px] whitespace-nowrap cursor-pointer border-none transition-all duration-200 shrink-0"
            style={{
              background: activeId === s.id ? '#0D9488' : 'var(--bg-content)',
              color: activeId === s.id ? 'white' : 'var(--text-secondary)',
              border: activeId === s.id ? 'none' : '1px solid var(--border)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="rounded-xl overflow-hidden mt-5 mb-3" style={{ border: '1px solid var(--border)' }}>
      <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'var(--bg-content)', borderBottom: '1px solid var(--border)' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: '#E5E7EB' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: '#E5E7EB' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: '#E5E7EB' }} />
        <span className="font-caption ml-2" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      </div>
      <div className="p-5" style={{ background: 'var(--bg-primary)' }}>
        {children}
      </div>
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 my-3">
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#CCFBF1' }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </span>
      <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</p>
    </div>
  );
}

function SectionBlock({ id, title, headline, children, navTarget, onNavigate }: {
  id: string; title: string; headline: string; children: ReactNode; navTarget?: string; onNavigate?: (p: string) => void;
}) {
  return (
    <section id={`demo-${id}`} className="scroll-mt-16 pb-16">
      <p className="font-label text-[11px] uppercase tracking-[1.2px] mb-1" style={{ color: '#0D9488' }}>{title}</p>
      <h3 className="font-heading text-[20px] leading-snug mb-4" style={{ color: 'var(--text-primary)' }}>{headline}</h3>
      {children}
      {navTarget && onNavigate && (
        <button
          onClick={() => onNavigate(navTarget)}
          className="flex items-center gap-2 font-label text-[13px] cursor-pointer bg-transparent border-none mt-4 py-1.5"
          style={{ color: '#0D9488' }}
        >
          Abrir no painel
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      )}
    </section>
  );
}

const brandInitials: Record<string, { letters: string; color: string }> = {
  'Amira': { letters: 'AM', color: '#0D9488' },
  'Lua Cheia': { letters: 'LC', color: '#7C3AED' },
  'Mar e Rio': { letters: 'MR', color: '#2563EB' },
  'Dona Sol': { letters: 'DS', color: '#DC2626' },
  'Casa Bruta': { letters: 'CB', color: '#D97706' },
  'Brisa': { letters: 'BR', color: '#059669' },
};

export default function DemoPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeId, setActiveId] = useState('overview');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace('demo-', ''));
          }
        });
      },
      { threshold: 0.3, root: containerRef.current?.closest('main') }
    );

    sections.forEach(s => {
      const el = document.getElementById(`demo-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ maxWidth: 840, margin: '0 auto' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0D9488' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h2 className="font-heading text-[22px]" style={{ color: 'var(--text-primary)' }}>Conheça o Flipper</h2>
        </div>
        <p className="font-body text-[14px]" style={{ color: 'var(--text-secondary)' }}>
          Guia interativo — explore cada funcionalidade com os componentes reais da plataforma.
        </p>
      </div>

      <StickyNav activeId={activeId} />

      <div className="pt-8">
        {/* 1. Visão geral */}
        <SectionBlock id="overview" title="Visão geral" headline="Tudo o que acontece na loja, num painel só." navTarget="dashboard" onNavigate={onNavigate}>
          <p className="font-body text-[14px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            O dashboard mostra os números do mês em tempo real. Vendas, repasses, mensalidades e margem — tudo atualizado automaticamente.
          </p>
          <PreviewFrame label="Dashboard — Métricas do mês">
            <div className="flex gap-4" style={{ transform: 'scale(0.92)', transformOrigin: 'top left' }}>
              {dashboardMetrics.map(m => (
                <div key={m.label} className="metric-card flex-1">
                  <p className="font-label text-[10px] uppercase tracking-[1px] mb-2" style={{ color: 'var(--text-tertiary)' }}>{m.label}</p>
                  <CountUp end={m.value} prefix="R$ " start className="text-[22px] font-bold text-[--text-primary]" formatOptions={{ useGrouping: true }} />
                  {m.variation && (
                    <span className="block text-[11px] font-medium mt-1" style={{ color: m.variationType === 'success' ? '#16A34A' : m.variationType === 'warning' ? '#F59E0B' : '#6B7280' }}>{m.variation}</span>
                  )}
                  <p className="font-caption mt-1" style={{ color: 'var(--text-tertiary)' }}>{m.detail}</p>
                </div>
              ))}
            </div>
          </PreviewFrame>
          <Callout>Cada card é clicável — mostra um breakdown detalhado por unidade (SP/RJ).</Callout>
          <Callout>Os valores fazem count-up animado ao carregar. Variações positivas aparecem em verde.</Callout>
        </SectionBlock>

        {/* 2. Vendas */}
        <SectionBlock id="vendas" title="Importação de vendas" headline="Vendas entram do PDV automaticamente." navTarget="vendas" onNavigate={onNavigate}>
          <p className="font-body text-[14px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            O Flipper importa cada venda do sistema da loja (ERP, PDV) com produto, SKU, valor e loja de origem.
          </p>
          <PreviewFrame label="Vendas — Amira · Junho 2025">
            <table className="w-full" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Data', 'Produto', 'SKU', 'Qtd', 'Valor', 'Loja'].map(h => (
                    <th key={h} className="text-left font-label py-2 pr-3" style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {amiraSales.slice(0, 5).map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 pr-3 font-caption" style={{ color: 'var(--text-secondary)' }}>{s.date}</td>
                    <td className="py-2.5 pr-3 font-body text-[13px]">{s.product}</td>
                    <td className="py-2.5 pr-3 font-mono text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{s.sku}</td>
                    <td className="py-2.5 pr-3 font-mono text-[13px] text-right">{s.qty}</td>
                    <td className="py-2.5 pr-3 font-mono text-[13px] text-right">R$ {s.value.toLocaleString('pt-BR')}</td>
                    <td className="py-2.5 font-label" style={{ color: 'var(--text-secondary)' }}>{s.store}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PreviewFrame>
          <Callout>Filtros por loja (SP/RJ), período e marca. A tabela atualiza com animação ao trocar filtro.</Callout>
          <Callout>SKUs sem marca vinculada aparecem na fila operacional do dashboard para resolução rápida.</Callout>
        </SectionBlock>

        {/* 3. Marcas */}
        <SectionBlock id="marcas" title="Gestão de marcas" headline="Contrato, split e status de cada parceira." navTarget="lojas" onNavigate={onNavigate}>
          <p className="font-body text-[14px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            Cada marca tem regras próprias: percentual de split, mensalidade, dia de vencimento. O status atualiza em tempo real.
          </p>
          <PreviewFrame label="Lojas Parceiras — Status">
            <div className="space-y-0">
              {brands.slice(0, 4).map(b => {
                const ini = brandInitials[b.name] || { letters: b.name.slice(0, 2), color: '#6B7280' };
                return (
                  <div key={b.name} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: ini.color }}>{ini.letters}</span>
                    <span className="font-subheading text-[13px] flex-1" style={{ minWidth: 80 }}>{b.name}</span>
                    <Badge status={b.mensalidadeStatus} label={b.mensalidade} showDot />
                    <span className="font-mono text-[12px]" style={{ color: 'var(--text-secondary)', minWidth: 80, textAlign: 'right' }}>R$ {b.vendasJun.toLocaleString('pt-BR')}</span>
                    <Badge status={b.repasseStatus} label={b.repasse} showDot />
                  </div>
                );
              })}
            </div>
          </PreviewFrame>
          <Callout>Dona Sol está inadimplente — repasse e NF-e bloqueados automaticamente (veja Proteção).</Callout>
          <Callout>Clique em qualquer marca para abrir o drawer com contrato, histórico e ações.</Callout>
        </SectionBlock>

        {/* 4. Fechamento */}
        <SectionBlock id="fechamento" title="Fechamento mensal" headline="Checklist guiado — abra, resolva, feche." navTarget="fechamento" onNavigate={onNavigate}>
          <p className="font-body text-[14px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            Todo mês o Flipper gera um checklist. Cada etapa tem status e ação. Quando tudo está verde, o mês fecha.
          </p>
          <PreviewFrame label="Fechamento — Checklist · Junho 2025">
            <div className="space-y-1">
              {checklistItems.slice(0, 6).map(item => {
                const iconColor = item.status === 'done' ? '#16A34A' : item.status === 'warning' ? '#F59E0B' : item.status === 'pending' ? '#F59E0B' : '#DC2626';
                return (
                  <div key={item.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg">
                    <span style={{ color: iconColor }}>
                      {item.status === 'done' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      ) : item.status === 'blocked' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      )}
                    </span>
                    <span className="font-body text-[13px] flex-1" style={{ color: item.status === 'done' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{item.label}</span>
                    <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>{item.statusText}</span>
                  </div>
                );
              })}
            </div>
          </PreviewFrame>
          <Callout>Itens interativos (SKUs pendentes, cobranças) expandem inline com ações clicáveis.</Callout>
          <Callout>A barra de progresso atualiza conforme você resolve cada item.</Callout>
        </SectionBlock>

        {/* 5. Cobranças */}
        <SectionBlock id="cobrancas" title="Cobranças automáticas" headline="Mensalidades cobradas sem intervenção." navTarget="cobrancas" onNavigate={onNavigate}>
          <p className="font-body text-[14px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            No dia do vencimento, o Flipper gera cobranças automaticamente e envia lembretes. Pagamentos Pix são confirmados em tempo real.
          </p>
          <PreviewFrame label="Cobranças — Junho 2025">
            <div className="space-y-0">
              {[
                { brand: 'Amira', value: 1800, due: '10/06', payment: '07/06 · Pix', status: 'success' as const, label: 'Pago' },
                { brand: 'Lua Cheia', value: 1400, due: '10/06', payment: '—', status: 'warning' as const, label: 'Pendente' },
                { brand: 'Mar e Rio', value: 1600, due: '10/06', payment: '09/06 · Cartão', status: 'success' as const, label: 'Pago' },
                { brand: 'Dona Sol', value: 1800, due: '10/06', payment: '—', status: 'danger' as const, label: 'Atrasado' },
              ].map(c => (
                <div key={c.brand} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="font-subheading text-[13px]" style={{ minWidth: 80 }}>{c.brand}</span>
                  <span className="font-mono text-[13px]" style={{ minWidth: 70 }}>R$ {c.value.toLocaleString('pt-BR')}</span>
                  <span className="font-caption" style={{ color: 'var(--text-tertiary)', minWidth: 50 }}>{c.due}</span>
                  <span className="font-caption flex-1" style={{ color: 'var(--text-tertiary)' }}>{c.payment}</span>
                  <Badge status={c.status} label={c.label} showDot />
                </div>
              ))}
            </div>
          </PreviewFrame>
          <Callout>Cobranças atrasadas disparam bloqueio automático de repasse (veja Proteção).</Callout>
        </SectionBlock>

        {/* 6. Repasses */}
        <SectionBlock id="repasses" title="Repasses" headline="O dinheiro certo, para a marca certa." navTarget="repasses" onNavigate={onNavigate}>
          <p className="font-body text-[14px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            O Flipper calcula o repasse com base nas vendas e no split contratual. O valor é líquido — já descontada a parte da loja.
          </p>
          <PreviewFrame label="Repasse — Amira · Junho 2025">
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between py-1.5">
                <span style={{ color: 'var(--text-secondary)' }}>Valor vendido ao cliente</span>
                <span className="font-mono">R$ 5.840</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span style={{ color: 'var(--text-secondary)' }}>Split da loja (50%)</span>
                <span className="font-mono" style={{ color: '#DC2626' }}>- R$ 2.920</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderTop: '2px solid var(--border)' }}>
                <span className="font-subheading">Repasse para Amira</span>
                <span className="font-mono text-[18px] font-bold" style={{ color: '#0D9488' }}>R$ 2.920</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>Pagamento previsto até 20/07/2025</span>
                <Badge status="warning" label="Pendente" showDot />
              </div>
            </div>
          </PreviewFrame>
          <Callout>Repasse só é liberado quando a mensalidade está em dia e a NF-e da loja foi emitida.</Callout>
          <Callout>A marca acompanha o status do repasse em tempo real no portal dela.</Callout>
        </SectionBlock>

        {/* 7. Proteção */}
        <SectionBlock id="protecao" title="Proteção financeira" headline="Regras aplicadas automaticamente.">
          <p className="font-body text-[14px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            Se uma marca atrasa, o Flipper bloqueia repasse, NF-e e fechamento em cascata. Sem confronto — o sistema aplica as regras.
          </p>
          <PreviewFrame label="Cascata de bloqueio — Dona Sol">
            <div style={{ maxWidth: 400, margin: '0 auto' }}>
              {[
                { icon: 'warning', color: '#F59E0B', title: 'Mensalidade atrasada', detail: 'Dona Sol · R$ 1.800 · 7 dias' },
                { icon: 'lock', color: '#DC2626', title: 'Repasse bloqueado', detail: 'R$ 990 retido' },
                { icon: 'lock', color: '#DC2626', title: 'NF-e bloqueada', detail: 'Emissão suspensa' },
                { icon: 'ban', color: '#DC2626', title: 'Fechamento impedido', detail: 'Dona Sol impede o fechamento' },
              ].map((node, i) => (
                <div key={i}>
                  <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'var(--bg-content)', border: '1px solid var(--border)', borderLeft: `3px solid ${node.color}` }}>
                    <span style={{ color: node.color, marginTop: 1 }}>
                      {node.icon === 'warning' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      ) : node.icon === 'lock' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                      )}
                    </span>
                    <div>
                      <p className="font-subheading text-[13px]" style={{ color: 'var(--text-primary)' }}>{node.title}</p>
                      <p className="font-caption" style={{ color: 'var(--text-secondary)' }}>{node.detail}</p>
                    </div>
                  </div>
                  {i < 3 && <div className="w-px h-5 mx-auto" style={{ background: '#DC2626' }} />}
                </div>
              ))}
            </div>
          </PreviewFrame>
          <Callout>O financeiro pode registrar pagamento manual ou isentar o bloqueio. Ambas as ações ficam registradas.</Callout>
          <Callout>A marca vê a pendência no portal dela e pode resolver com Pix em um clique.</Callout>
        </SectionBlock>

        {/* 8. Portal */}
        <SectionBlock id="portal" title="Portal da marca" headline="Cada marca acompanha tudo. Sem ligar pra loja." navTarget="brand-home" onNavigate={onNavigate}>
          <p className="font-body text-[14px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            A marca tem seu próprio acesso. Vê vendas, repasse, mensalidade e notas fiscais — tudo em tempo real.
          </p>
          <PreviewFrame label="Portal — Amira · Início">
            <div className="rounded-lg p-3 mb-4 flex items-center gap-2" style={{ background: '#DCFCE7', color: '#166534', fontSize: 13 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Mensalidade de junho paga em 07/06/2025.
            </div>
            <div className="flex gap-4">
              {[
                { label: 'Vendas em junho', value: 'R$ 5.840', sub: '47 vendas' },
                { label: 'Seu repasse', value: 'R$ 2.920', sub: 'Split 50/50' },
                { label: 'Mensalidade', value: 'Paga', sub: 'R$ 1.800' },
              ].map(m => (
                <div key={m.label} className="flex-1 rounded-lg p-3" style={{ background: 'var(--bg-content)', border: '1px solid var(--border)' }}>
                  <p className="font-label text-[10px] uppercase tracking-[0.5px] mb-1" style={{ color: 'var(--text-tertiary)' }}>{m.label}</p>
                  <p className="font-mono text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{m.value}</p>
                  <p className="font-caption" style={{ color: 'var(--text-tertiary)' }}>{m.sub}</p>
                </div>
              ))}
            </div>
          </PreviewFrame>
          <Callout>A marca para de cobrar pelo WhatsApp. Tudo que ela precisa está no painel dela.</Callout>
          <Callout>Alterne para a visão "Loja Parceira" no menu de conta para explorar o portal completo.</Callout>
        </SectionBlock>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-8 text-center mb-8"
          style={{ background: 'var(--bg-content)', border: '1px solid var(--border)' }}
        >
          <p className="font-subheading text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>Pronto para explorar?</p>
          <p className="font-body text-[14px] mb-5" style={{ color: 'var(--text-secondary)' }}>
            Navegue pelo painel usando o menu lateral. Todos os dados são simulados — clique à vontade.
          </p>
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="px-6 py-2.5 text-white rounded-xl font-subheading text-[14px] cursor-pointer border-none"
            style={{ background: '#0D9488' }}
          >
            Ir para o Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}
