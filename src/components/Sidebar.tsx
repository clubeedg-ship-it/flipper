import type { JSX } from 'react';

type Role = 'financeiro' | 'expositor';

interface NavItem {
  id: string;
  label: string;
  icon: JSX.Element;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);

const financeiroNav: NavSection[] = [
  {
    title: 'VISÃO GERAL',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    ],
  },
  {
    title: 'OPERAÇÃO',
    items: [
      { id: 'lojas', label: 'Lojas Parceiras', icon: icon('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75') },
      { id: 'produtos', label: 'Produtos/SKUs', icon: icon('M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01') },
      { id: 'vendas', label: 'Vendas', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    ],
  },
  {
    title: 'FINANCEIRO',
    items: [
      { id: 'cobrancas', label: 'Cobranças', icon: icon('M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8'), badge: 2 },
      { id: 'repasses', label: 'Repasses', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> },
      { id: 'fechamento', label: 'Fechamento', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
      { id: 'nfe', label: 'NF-e', icon: icon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8') },
    ],
  },
];

const expositorNav: NavSection[] = [
  {
    title: 'MINHA CONTA',
    items: [
      { id: 'brand-home', label: 'Início', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
      { id: 'brand-mensalidade', label: 'Mensalidade', icon: icon('M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8') },
      { id: 'brand-vendas', label: 'Minhas vendas', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
      { id: 'brand-repasses', label: 'Repasses', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> },
      { id: 'brand-nfe', label: 'Notas fiscais', icon: icon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8') },
    ],
  },
];

interface SidebarProps {
  role: Role;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ role, currentPage, onNavigate, onLogout }: SidebarProps) {
  const nav = role === 'financeiro' ? financeiroNav : expositorNav;
  const userName = role === 'financeiro' ? 'Financeiro' : 'Loja Parceira';
  const userEmail = role === 'financeiro' ? 'financeiro@pinga...' : 'amira@amirajoias...';

  return (
    <div className="w-[220px] min-w-[220px] h-full bg-[--bg-content] border-r border-[--border] flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div className="min-w-0">
          <p className="font-heading text-[16px] text-[--text-primary] leading-tight">Flipper</p>
          <p className="font-caption text-[--text-tertiary] truncate">{role === 'financeiro' ? 'financeiro · pinga store' : 'loja parceira · amira'}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
        {nav.map((section) => (
          <div key={section.title}>
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1.2px] px-2 mb-2">{section.title}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer border-none ${
                    currentPage === item.id
                      ? 'bg-[--accent-subtle] text-[--accent]'
                      : 'bg-transparent text-[--text-secondary] hover:bg-[--bg-primary] hover:text-[--text-primary]'
                  }`}
                >
                  <span className={currentPage === item.id ? 'text-[--accent]' : 'text-[--text-tertiary]'}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-[--danger] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[--border]">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-[--accent-light] text-[--accent] flex items-center justify-center font-subheading text-[12px] shrink-0">
            {role === 'financeiro' ? 'FI' : 'LP'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label text-[12px] text-[--text-primary] truncate">{userName}</p>
            <p className="font-caption text-[--text-tertiary] truncate">{userEmail}</p>
          </div>
          <button onClick={onLogout} className="text-[--text-tertiary] hover:text-[--text-primary] transition-colors cursor-pointer bg-transparent border-none p-1" aria-label="Sair">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
