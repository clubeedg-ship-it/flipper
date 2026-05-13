import { useState } from 'react';
import { motion } from 'framer-motion';

type Role = 'financeiro' | 'expositor';

interface LoginProps {
  onLogin: (role: Role) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<Role>('financeiro');

  const emails: Record<Role, string> = {
    financeiro: 'financeiro@pingastore.com.br',
    expositor: 'amira@amirajoias.com.br',
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="card w-[440px] max-w-[90vw] p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0D9488] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <h1 className="font-heading text-[22px] text-[--text-primary]">Flipper</h1>
            <p className="font-caption text-[--text-secondary]">Gestão de Consignações</p>
          </div>
        </div>

        <div className="flex rounded-xl border border-[--border] p-1 mb-8">
          <button
            onClick={() => setRole('financeiro')}
            className={`flex-1 py-2.5 rounded-lg font-label text-[13px] transition-all duration-200 cursor-pointer border-none ${
              role === 'financeiro'
                ? 'bg-[--bg-primary] text-[--text-primary] shadow-sm'
                : 'bg-transparent text-[--text-secondary] hover:text-[--text-primary]'
            }`}
          >
            Financeiro
          </button>
          <button
            onClick={() => setRole('expositor')}
            className={`flex-1 py-2.5 rounded-lg font-label text-[13px] transition-all duration-200 cursor-pointer border-none ${
              role === 'expositor'
                ? 'bg-[--bg-primary] text-[--text-primary] shadow-sm'
                : 'bg-transparent text-[--text-secondary] hover:text-[--text-primary]'
            }`}
          >
            Loja Parceira
          </button>
        </div>

        <div className="space-y-5 mb-8">
          <div>
            <label className="font-label text-[--text-secondary] block mb-2">E-mail</label>
            <div className="border border-[--border] rounded-xl px-4 py-3 font-body text-[14px] text-[--text-primary] bg-[--bg-primary]/50">
              {emails[role]}
            </div>
          </div>
          <div>
            <label className="font-label text-[--text-secondary] block mb-2">Senha</label>
            <div className="border border-[--border] rounded-xl px-4 py-3 font-body text-[14px] text-[--text-primary] bg-[--bg-primary]/50 tracking-widest">
              ••••••••
            </div>
          </div>
        </div>

        <button
          onClick={() => onLogin(role)}
          className="w-full py-3.5 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl font-subheading text-[15px] transition-colors duration-200 cursor-pointer border-none"
        >
          {role === 'financeiro' ? 'Entrar como financeiro' : 'Entrar como loja parceira'}
        </button>

        <p className="font-caption text-[--text-tertiary] text-center mt-6">
          Demo — Pinga Store · dados simulados
        </p>
      </motion.div>
    </div>
  );
}
