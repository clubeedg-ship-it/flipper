import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SetupWizard from './components/SetupWizard';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';

import type { UnitFilter } from './data/brands';
const unitLabels: Record<UnitFilter, string> = {
  'Todas': 'Todas as unidades',
  'SP': 'SP — Jardins',
  'RJ': 'RJ — Leblon',
};

const DemoPage = lazy(() => import('./pages/DemoPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LojasPage = lazy(() => import('./pages/LojasPage'));
const FechamentoPage = lazy(() => import('./pages/FechamentoPage'));
const BrandHomePage = lazy(() => import('./pages/BrandHomePage'));
const VendasPage = lazy(() => import('./pages/VendasPage'));
const ProdutosPage = lazy(() => import('./pages/ProdutosPage'));
const CobrancasPage = lazy(() => import('./pages/CobrancasPage'));
const RepassesPage = lazy(() => import('./pages/RepassesPage'));
const NFePage = lazy(() => import('./pages/NFePage'));
const BrandVendasPage = lazy(() => import('./pages/BrandVendasPage'));
const BrandRepassesPage = lazy(() => import('./pages/BrandRepassesPage'));
const BrandMensalidadePage = lazy(() => import('./pages/BrandMensalidadePage'));
const BrandNFePage = lazy(() => import('./pages/BrandNFePage'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));

type Role = 'financeiro' | 'expositor';

const pageLabels: Record<string, string> = {
  demo: 'Conheça o Flipper',
  dashboard: 'Dashboard',
  lojas: 'Lojas Parceiras',
  produtos: 'Produtos/SKUs',
  vendas: 'Vendas',
  cobrancas: 'Cobranças',
  repasses: 'Repasses',
  fechamento: 'Fechamento mensal',
  nfe: 'NF-e',
  'brand-home': 'Início',
  'brand-mensalidade': 'Mensalidade',
  'brand-vendas': 'Minhas vendas',
  'brand-repasses': 'Repasses',
  'brand-nfe': 'Notas fiscais',
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function renderPage(page: string, onNavigate: (p: string) => void, unitFilter: UnitFilter) {
  switch (page) {
    case 'demo':
      return <DemoPage onNavigate={onNavigate} />;
    case 'dashboard':
      return <DashboardPage onNavigate={onNavigate} unitFilter={unitFilter} />;
    case 'lojas':
      return <LojasPage />;
    case 'fechamento':
      return <FechamentoPage onNavigate={onNavigate} unitFilter={unitFilter} />;
    case 'vendas':
      return <VendasPage unitFilter={unitFilter} />;
    case 'produtos':
      return <ProdutosPage />;
    case 'cobrancas':
      return <CobrancasPage unitFilter={unitFilter} onNavigate={onNavigate} />;
    case 'repasses':
      return <RepassesPage onNavigate={onNavigate} unitFilter={unitFilter} />;
    case 'nfe':
      return <NFePage unitFilter={unitFilter} />;
    case 'brand-home':
      return <BrandHomePage onNavigate={onNavigate} />;
    case 'brand-vendas':
      return <BrandVendasPage onNavigate={onNavigate} />;
    case 'brand-repasses':
      return <BrandRepassesPage />;
    case 'brand-mensalidade':
      return <BrandMensalidadePage onNavigate={onNavigate} />;
    case 'brand-nfe':
      return <BrandNFePage />;
    default:
      return <PlaceholderPage title={pageLabels[page] || page} />;
  }
}

export default function App() {
  const [setupDone, setSetupDone] = useState(() => sessionStorage.getItem('flipper-setup-done') === '1');
  const [role, setRole] = useState<Role>(() => (sessionStorage.getItem('flipper-role') as Role) || 'financeiro');
  const [currentPage, setCurrentPage] = useState(() => sessionStorage.getItem('flipper-page') || 'dashboard');
  const [unitFilter, setUnitFilter] = useState<UnitFilter>('Todas');
  const [unitOpen, setUnitOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const unitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!unitOpen) return;
    const handler = (e: MouseEvent) => {
      if (unitRef.current && !unitRef.current.contains(e.target as Node)) setUnitOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [unitOpen]);

  // Close mobile sidebar on page change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [currentPage]);

  const handleSetupComplete = (config: { language: string; role: Role }) => {
    const page = config.role === 'financeiro' ? 'dashboard' : 'brand-home';
    setRole(config.role);
    setCurrentPage(page);
    setSetupDone(true);
    sessionStorage.setItem('flipper-setup-done', '1');
    sessionStorage.setItem('flipper-role', config.role);
    sessionStorage.setItem('flipper-page', page);
  };

  const handleNavigate = (page: string) => {
    const newRole = page.startsWith('brand-') ? 'expositor' : 'financeiro';
    setCurrentPage(page);
    setRole(newRole);
    sessionStorage.setItem('flipper-page', page);
    sessionStorage.setItem('flipper-role', newRole);
  };

  const switchRole = () => {
    const next: Role = role === 'financeiro' ? 'expositor' : 'financeiro';
    const page = next === 'financeiro' ? 'dashboard' : 'brand-home';
    setRole(next);
    setCurrentPage(page);
    sessionStorage.setItem('flipper-role', next);
    sessionStorage.setItem('flipper-page', page);
  };

  if (!setupDone) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.18)' }}
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar — fixed overlay, slides in from left */}
      <div
        className="mobile-sidebar-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 50,
          transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Sidebar role={role} currentPage={currentPage} onNavigate={handleNavigate} onLogout={switchRole} />
      </div>

      {/* Desktop sidebar — inline in flex row */}
      <div className="desktop-sidebar h-full">
        <Sidebar role={role} currentPage={currentPage} onNavigate={handleNavigate} onLogout={switchRole} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 main-area-padding">
        <div
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
          style={{
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-content)',
            backdropFilter: 'blur(var(--blur))',
            WebkitBackdropFilter: 'blur(var(--blur))',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-glass)',
          }}
        >
          <header
            className="flex items-center justify-between shrink-0 px-4"
            style={{ borderBottom: '1px solid var(--border)', height: 56, minHeight: 56 }}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Hamburger button — visible only on mobile via CSS */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="mobile-menu-btn w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-none text-[--text-secondary] shrink-0"
                style={{ background: 'rgba(0,0,0,0.04)' }}
                aria-label="Abrir menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <h1 className="font-heading text-[--text-primary] truncate" style={{ fontSize: 17 }}>{pageLabels[currentPage] || ''}</h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setChatOpen(prev => !prev)}
                className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-none transition-colors shrink-0"
                style={{ background: chatOpen ? 'var(--accent-subtle)' : 'rgba(0,0,0,0.04)', color: chatOpen ? 'var(--accent)' : 'var(--text-secondary)' }}
                onMouseEnter={e => { if (!chatOpen) e.currentTarget.style.background = 'rgba(0,0,0,0.07)'; }}
                onMouseLeave={e => { if (!chatOpen) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
                aria-label={chatOpen ? 'Fechar assistente' : 'Abrir assistente'}
                aria-expanded={chatOpen}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <div ref={unitRef} className="relative">
                <button
                  onClick={() => setUnitOpen(!unitOpen)}
                  className="rounded-xl px-3 py-1.5 font-label text-[12px] text-[--text-secondary] flex items-center gap-1.5 cursor-pointer transition-colors border-none"
                  style={{ background: 'rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                >
                  <span className="unit-filter-label">{unitLabels[unitFilter]}</span>
                  <span className="unit-filter-short">{unitFilter === 'Todas' ? 'Unid.' : unitFilter}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-150 ${unitOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <AnimatePresence>
                  {unitOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50 glass-surface"
                      style={{ minWidth: 180 }}
                    >
                      {(['Todas', 'SP', 'RJ'] as UnitFilter[]).map(u => (
                        <button
                          key={u}
                          onClick={() => { setUnitFilter(u); setUnitOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 font-label text-[13px] transition-colors cursor-pointer border-none ${
                            unitFilter === u ? 'text-[--accent]' : 'text-[--text-secondary]'
                          }`}
                          style={{ background: unitFilter === u ? 'var(--accent-subtle)' : 'transparent' }}
                          onMouseEnter={e => { if (unitFilter !== u) e.currentTarget.style.background = 'var(--bg-glass-hover)'; }}
                          onMouseLeave={e => { if (unitFilter !== u) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {unitLabels[u]}
                          {unitFilter === u && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline ml-2"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto main-content-padding">
            <Suspense fallback={<div className="flex items-center justify-center h-64 text-[--text-tertiary] font-label">Carregando...</div>}>
              <AnimatePresence mode="wait">
                <PageWrapper key={currentPage}>
                  {renderPage(currentPage, handleNavigate, unitFilter)}
                </PageWrapper>
              </AnimatePresence>
            </Suspense>
          </main>
        </div>
      </div>

      {/* Chat right sidebar — desktop: inline flex, mobile: overlay from right */}
      <AnimatePresence>
        {chatOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="chat-mobile-backdrop"
              style={{ background: 'rgba(0,0,0,0.18)' }}
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="chat-sidebar h-full shrink-0 overflow-hidden"
              style={{ padding: '12px 12px 12px 4px' }}
            >
              <ChatPanel onClose={() => setChatOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
