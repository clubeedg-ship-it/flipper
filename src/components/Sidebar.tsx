import { useState, useRef, useEffect } from 'react';
import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const starIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const financeiroNav: NavSection[] = [
  {
    title: 'VISÃO GERAL',
    items: [
      { id: 'demo', label: 'Conheça o Flipper', icon: starIcon },
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
    title: 'GUIA',
    items: [
      { id: 'demo', label: 'Conheça o Flipper', icon: starIcon },
    ],
  },
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

function FlipperLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5 overflow-hidden">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0D9488, #0B7A70)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16v2H4V4zm0 7h12v2H4v-2zm0 7h16v2H4v-2z" fill="white" fillOpacity="0.9"/>
          <circle cx="19" cy="14" r="3" fill="white" fillOpacity="0.7"/>
        </svg>
      </div>
      <motion.div
        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden whitespace-nowrap"
      >
        <p className="font-heading text-[17px] text-[--text-primary] leading-tight">Flipper</p>
      </motion.div>
    </div>
  );
}

function AccountPopover({ role, userName, userEmail, onSwitchRole, collapsed }: { role: Role; userName: string; userEmail: string; onSwitchRole: () => void; collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const otherRole = role === 'financeiro' ? 'Loja Parceira' : 'Financeiro';

  return (
    <div ref={ref} className="relative px-2 py-3" style={{ borderTop: '1px solid var(--border)' }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-2 mb-2 rounded-xl overflow-hidden z-50 glass-surface"
            style={{ right: collapsed ? 'auto' : '8px', minWidth: 200 }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-1">Visualizando como</p>
              <p className="font-subheading text-[13px] text-[--text-primary]">{userName}</p>
            </div>
            <button
              onClick={() => { onSwitchRole(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-left font-label text-[13px] text-[--text-secondary] hover:text-[--accent] transition-colors cursor-pointer bg-transparent border-none"
              style={{ background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              Ver como {otherRole}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors cursor-pointer bg-transparent border-none"
        style={{ background: 'transparent' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-subheading text-[12px] shrink-0" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
          {role === 'financeiro' ? 'FI' : 'LP'}
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 min-w-0 text-left"
          >
            <p className="font-label text-[12px] text-[--text-primary] truncate">{userName}</p>
            <p className="font-caption text-[--text-tertiary] truncate">{userEmail}</p>
          </motion.div>
        )}
      </button>
    </div>
  );
}

interface SidebarProps {
  role: Role;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ role, currentPage, onNavigate, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const nav = role === 'financeiro' ? financeiroNav : expositorNav;
  const userName = role === 'financeiro' ? 'Financeiro' : 'Loja Parceira';
  const userEmail = role === 'financeiro' ? 'financeiro@pinga...' : 'amira@amirajoias...';

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <motion.div
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="h-full flex flex-col shrink-0 overflow-hidden"
      style={{
        width: sidebarWidth,
        margin: 'var(--sidebar-gap)',
        marginRight: 0,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(var(--blur))',
        WebkitBackdropFilter: 'blur(var(--blur))',
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-glass)',
      }}
    >
      {/* Logo + collapse toggle */}
      <div className="px-4 py-4 flex items-center justify-between">
        <FlipperLogo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-transparent border-none text-[--text-tertiary] hover:text-[--text-primary] transition-colors shrink-0"
        >
          <motion.svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <polyline points="15 18 9 12 15 6"/>
          </motion.svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-5 overflow-y-auto overflow-x-hidden">
        {nav.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-label text-[10px] text-[--text-tertiary] uppercase tracking-[1.5px] px-2 mb-1.5"
              >
                {section.title}
              </motion.p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="w-full flex items-center rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer border-none"
                    style={{
                      gap: collapsed ? 0 : 10,
                      padding: collapsed ? '8px' : '8px 10px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      background: active ? 'var(--accent-subtle)' : 'transparent',
                      color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-glass-hover)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={`shrink-0 ${active ? 'text-[--accent]' : 'text-[--text-tertiary]'}`}>{item.icon}</span>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 text-left whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {item.badge && !collapsed && (
                      <span className="text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--danger)' }}>{item.badge}</span>
                    )}
                    {item.badge && collapsed && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <AccountPopover role={role} userName={userName} userEmail={userEmail} onSwitchRole={onLogout} collapsed={collapsed} />
    </motion.div>
  );
}
