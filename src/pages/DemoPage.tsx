import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JSX } from 'react';

interface GuideStep {
  id: string;
  icon: JSX.Element;
  title: string;
  headline: string;
  description: string;
  details: { label: string; text: string }[];
  highlight?: string;
  navTarget?: string;
}

const steps: GuideStep[] = [
  {
    id: 'overview',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    title: 'O que é o Flipper',
    headline: 'A camada financeira entre a loja e as marcas parceiras.',
    description: 'A Pinga Store trabalha com consignação: marcas expõem produtos na loja, e a loja vende em nome delas. O Flipper organiza toda a parte financeira — vendas, repasses, mensalidades, notas fiscais — num único lugar.',
    details: [
      { label: 'Problema que resolve', text: 'Planilhas, WhatsApp, e-mail. Todo mês o financeiro gasta 2 dias fechando manualmente com cada marca.' },
      { label: 'Como resolve', text: 'Importa vendas automaticamente, calcula repasses por regra de contrato, cobra mensalidades, e dá visibilidade para as marcas.' },
      { label: 'Resultado', text: 'Fechamento que levava 2 dias leva 45 minutos. Cada marca acompanha tudo em tempo real.' },
    ],
  },
  {
    id: 'import',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    title: 'Importação de vendas',
    headline: 'Vendas entram automaticamente do PDV.',
    description: 'O Flipper conecta com o sistema de vendas da loja (Bling, Tiny, Nuvemshop) e importa cada venda com SKU, valor, data e loja. Nenhuma digitação manual.',
    details: [
      { label: 'Frequência', text: 'Sincronização automática diária. A loja também pode disparar manualmente a qualquer momento.' },
      { label: 'Vinculação de SKU', text: 'Cada produto vendido é vinculado à marca parceira correspondente. SKUs sem vínculo ficam na fila para resolução.' },
      { label: 'Multi-unidade', text: 'A Pinga tem lojas em SP (Jardins) e RJ (Leblon). Vendas de todas as unidades entram no mesmo painel.' },
    ],
    navTarget: 'vendas',
  },
  {
    id: 'brands',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Gestão de marcas',
    headline: 'Cada marca tem contrato, split e regras próprias.',
    description: 'O Flipper armazena o contrato de cada marca: qual o percentual de split (ex: 50/50), valor da mensalidade, dia de vencimento. Tudo configurável por marca.',
    details: [
      { label: 'Contrato', text: 'Split de vendas (ex: 50% loja, 50% marca), mensalidade fixa, dia de vencimento. Cada marca pode ter regras diferentes.' },
      { label: 'Status em tempo real', text: 'O painel mostra se a marca está em dia, pendente ou inadimplente. O status atualiza automaticamente.' },
      { label: 'Modelos flexíveis', text: 'Consignação, híbrido ou sem contrato. Marcas novas podem operar enquanto o modelo comercial é definido.' },
    ],
    navTarget: 'lojas',
  },
  {
    id: 'closing',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    title: 'Fechamento mensal',
    headline: 'Checklist guiado: abra, resolva, feche.',
    description: 'Todo mês, o Flipper gera um checklist de fechamento. Cada item tem status (OK, pendente, bloqueado) e ações para resolver. Quando tudo está verde, o mês fecha.',
    details: [
      { label: 'Checklist automático', text: 'Vendas importadas? SKUs vinculados? Splits aplicados? Mensalidades cobradas? O sistema verifica cada etapa.' },
      { label: 'Bloqueios inteligentes', text: 'Se uma marca está inadimplente, o fechamento fica bloqueado até regularização. Sem surpresas.' },
      { label: 'Relatórios', text: 'Ao fechar, o Flipper gera relatórios por marca com detalhamento de vendas, splits e repasses.' },
    ],
    navTarget: 'fechamento',
  },
  {
    id: 'billing',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    title: 'Cobranças automáticas',
    headline: 'Mensalidades cobradas sem intervenção.',
    description: 'No dia do vencimento, o Flipper gera automaticamente a cobrança de mensalidade para cada marca. Lembretes são enviados por e-mail. Pagamentos via Pix são confirmados em tempo real.',
    details: [
      { label: 'Geração automática', text: 'Cobranças geradas no dia 1 de cada mês. Vencimento conforme contrato (ex: dia 5, dia 10).' },
      { label: 'Lembretes', text: 'E-mail automático na data de vencimento. Lembrete adicional após 3 dias de atraso.' },
      { label: 'Rastreamento', text: 'Status de cada cobrança: Pago, Pendente, Atrasado. Histórico completo por marca.' },
    ],
    navTarget: 'cobrancas',
  },
  {
    id: 'repasses',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    title: 'Repasses',
    headline: 'O dinheiro certo, para a marca certa, na hora certa.',
    description: 'O Flipper calcula o repasse de cada marca com base nas vendas do mês e no split contratual. O valor é líquido — já descontada a parte da loja.',
    details: [
      { label: 'Cálculo automático', text: 'Vendas brutas x split = repasse. Exemplo: R$ 5.840 em vendas, split 50/50 = R$ 2.920 de repasse para a marca.' },
      { label: 'Condições', text: 'Repasse só é liberado quando a mensalidade está em dia e a NF-e da loja foi emitida.' },
      { label: 'Transparência', text: 'A marca vê o extrato completo: cada venda, o cálculo do split, e o valor final do repasse.' },
    ],
    navTarget: 'repasses',
  },
  {
    id: 'protection',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Proteção financeira',
    headline: 'Regras aplicadas automaticamente. Sem conversa difícil.',
    description: 'Se uma marca atrasa a mensalidade, o Flipper bloqueia automaticamente o repasse, a NF-e e o fechamento do mês. A cascata protege a loja sem precisar de confronto.',
    details: [
      { label: 'Cascata de bloqueio', text: 'Mensalidade atrasada -> Repasse bloqueado -> NF-e bloqueada -> Fechamento impedido. Tudo automático.' },
      { label: 'Visibilidade para a marca', text: 'A marca vê no portal dela que há uma pendência e pode resolver com um clique (Pix).' },
      { label: 'Isenção manual', text: 'O financeiro pode isentar o bloqueio manualmente se houver acordo. O sistema registra a exceção.' },
    ],
  },
  {
    id: 'portal',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    title: 'Portal da marca',
    headline: 'Cada marca acompanha tudo. Sem ligar pra loja.',
    description: 'A marca parceira tem seu próprio acesso ao Flipper. Vê vendas em tempo real, status do repasse, histórico de pagamentos e notas fiscais. Transparência que fideliza.',
    details: [
      { label: 'Vendas em tempo real', text: 'A marca vê cada venda com data, produto, SKU, valor e loja. Filtros por período e unidade.' },
      { label: 'Repasse e NF-e', text: 'Previsão de repasse, histórico de meses anteriores, download de notas fiscais.' },
      { label: 'Autonomia', text: 'A marca para de cobrar pelo WhatsApp. Tudo que ela precisa está no painel dela.' },
    ],
    navTarget: 'brand-home',
  },
];

function StepCard({ step, index, expanded, onToggle, onNavigate }: {
  step: GuideStep;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onNavigate?: (page: string) => void;
}) {
  return (
    <div className="relative flex gap-5">
      {/* Timeline */}
      <div className="flex flex-col items-center shrink-0 w-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: expanded ? '#0D9488' : 'var(--bg-content)',
            color: expanded ? 'white' : '#0D9488',
            border: expanded ? 'none' : '1px solid var(--border)',
          }}
        >
          {step.icon}
        </motion.div>
        {index < steps.length - 1 && (
          <div className="w-px flex-1 min-h-[24px]" style={{ background: 'var(--border)' }} />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.08 }}
        className="flex-1 pb-8"
      >
        <button
          onClick={onToggle}
          className="w-full text-left cursor-pointer bg-transparent border-none p-0"
        >
          <p className="font-label text-[11px] uppercase tracking-[1.2px] mb-1" style={{ color: '#0D9488' }}>
            {String(index + 1).padStart(2, '0')} — {step.title}
          </p>
          <h3 className="font-heading text-[18px] leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>
            {step.headline}
          </h3>
          <p className="font-body text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {step.description}
          </p>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 space-y-4">
                {step.details.map((d, i) => (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.08 }}
                    className="rounded-xl p-4"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                  >
                    <p className="font-subheading text-[13px] mb-1.5" style={{ color: 'var(--text-primary)' }}>{d.label}</p>
                    <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.text}</p>
                  </motion.div>
                ))}

                {step.navTarget && onNavigate && (
                  <button
                    onClick={() => onNavigate(step.navTarget!)}
                    className="flex items-center gap-2 font-label text-[13px] cursor-pointer bg-transparent border-none mt-2 py-1"
                    style={{ color: '#0D9488' }}
                  >
                    Ver no painel
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function DemoPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>('overview');
  const expandedCount = expandedId ? steps.findIndex(s => s.id === expandedId) + 1 : 0;
  const progress = Math.round((expandedCount / steps.length) * 100);

  return (
    <div className="content-max" style={{ maxWidth: 720 }}>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0D9488' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h2 className="font-heading text-[22px]" style={{ color: 'var(--text-primary)' }}>Conheça o Flipper</h2>
        </div>
        <p className="font-body text-[15px] leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          Um guia rápido de 5 minutos sobre como o Flipper funciona.
          Clique em cada seção para expandir os detalhes.
        </p>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#0D9488' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="font-label text-[12px] shrink-0" style={{ color: 'var(--text-tertiary)' }}>
            {expandedCount} de {steps.length}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div>
        {steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            expanded={expandedId === step.id}
            onToggle={() => setExpandedId(expandedId === step.id ? null : step.id)}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 mb-8 rounded-xl p-6 text-center"
        style={{ background: 'var(--bg-content)', border: '1px solid var(--border)' }}
      >
        <p className="font-subheading text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>
          Pronto para explorar?
        </p>
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
  );
}
