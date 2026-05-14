import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SetupWizardProps {
  onComplete: (config: { language: string; role: 'financeiro' | 'expositor' }) => void;
}

const languages = [
  { code: 'pt-BR', label: 'Português (BR)', flag: 'PT' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'nl', label: 'Nederlands', flag: 'NL' },
];

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('pt-BR');
  const [role, setRole] = useState<'financeiro' | 'expositor'>('financeiro');

  const steps = [
    {
      title: 'Flipper',
      subtitle: 'Gestão de Consignações',
      content: (
        <div className="space-y-5">
          <p className="font-body text-[15px] text-[--text-secondary] leading-relaxed">
            Esta é uma demo interativa do Flipper — a camada financeira para lojas multimarca que trabalham com consignação.
          </p>
          <p className="font-body text-[14px] text-[--text-tertiary] leading-relaxed">
            Você vai explorar um painel com dados simulados da Pinga Store, uma galeria multimarca com lojas parceiras em São Paulo e Rio de Janeiro.
          </p>
        </div>
      ),
    },
    {
      title: 'Idioma',
      subtitle: 'Escolha seu idioma preferido',
      content: (
        <div className="space-y-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer"
              style={{
                border: language === lang.code ? '1px solid #0D9488' : '1px solid var(--border)',
                background: language === lang.code ? '#F0FDFA' : 'transparent',
                color: language === lang.code ? '#0D9488' : 'var(--text-primary)',
              }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center font-subheading text-[11px] shrink-0"
                style={{
                  background: language === lang.code ? '#0D9488' : 'var(--bg-primary)',
                  color: language === lang.code ? 'white' : 'var(--text-tertiary)',
                }}
              >{lang.flag}</span>
              <span className="font-label text-[14px]">{lang.label}</span>
              {language === lang.code && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Perspectiva',
      subtitle: 'Como deseja começar?',
      content: (
        <div className="space-y-3">
          <p className="font-body text-[13px] text-[--text-tertiary] mb-1">
            Escolha qualquer uma — você pode alternar entre as duas visões a qualquer momento pelo menu da conta.
          </p>
          <button
            onClick={() => setRole('financeiro')}
            className="w-full text-left px-5 py-4 rounded-xl transition-all duration-150 cursor-pointer"
            style={{
              border: role === 'financeiro' ? '1px solid #0D9488' : '1px solid var(--border)',
              background: role === 'financeiro' ? '#F0FDFA' : 'transparent',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={role === 'financeiro' ? '#0D9488' : 'var(--text-tertiary)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              <span className="font-subheading text-[15px]" style={{ color: role === 'financeiro' ? '#0D9488' : 'var(--text-primary)' }}>Financeiro da loja</span>
            </div>
            <p className="font-body text-[13px] text-[--text-secondary] ml-[30px]">
              Veja o dashboard completo, gerencie marcas, cobranças, repasses e fechamento mensal.
            </p>
          </button>
          <button
            onClick={() => setRole('expositor')}
            className="w-full text-left px-5 py-4 rounded-xl transition-all duration-150 cursor-pointer"
            style={{
              border: role === 'expositor' ? '1px solid #0D9488' : '1px solid var(--border)',
              background: role === 'expositor' ? '#F0FDFA' : 'transparent',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={role === 'expositor' ? '#0D9488' : 'var(--text-tertiary)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span className="font-subheading text-[15px]" style={{ color: role === 'expositor' ? '#0D9488' : 'var(--text-primary)' }}>Loja parceira (Amira)</span>
            </div>
            <p className="font-body text-[13px] text-[--text-secondary] ml-[30px]">
              Veja como uma marca parceira acompanha vendas, repasses e notas fiscais.
            </p>
          </button>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="card w-[480px] max-w-[90vw] p-0 overflow-hidden"
      >
        {/* Progress */}
        <div className="flex gap-1.5 px-8 pt-8">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-[--border]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#0D9488' }}
                initial={{ width: 0 }}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="px-8 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-1">
            {step === 0 && (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#0D9488' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
            )}
            <h2 className="font-heading text-[22px] text-[--text-primary]">{current.title}</h2>
          </div>
          <p className="font-body text-[14px] text-[--text-tertiary]">{current.subtitle}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`font-label text-[13px] cursor-pointer bg-transparent border-none transition-colors ${
              step > 0 ? 'text-[--text-secondary] hover:text-[--text-primary]' : 'text-transparent pointer-events-none'
            }`}
          >
            Voltar
          </button>
          <button
            onClick={() => isLast ? onComplete({ language, role }) : setStep(step + 1)}
            className="px-6 py-2.5 text-white rounded-xl font-subheading text-[14px] transition-colors cursor-pointer border-none flex items-center gap-2"
            style={{ background: '#0D9488' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0F766E')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0D9488')}
          >
            {isLast ? 'Começar' : 'Próximo'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        {/* Skip */}
        {!isLast && (
          <div className="px-8 pb-6 -mt-2">
            <button
              onClick={() => onComplete({ language, role })}
              className="font-caption text-[--text-tertiary] hover:text-[--text-secondary] cursor-pointer bg-transparent border-none transition-colors"
            >
              Pular e ir direto ao dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
