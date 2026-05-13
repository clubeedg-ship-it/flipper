import { useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Sidebar from './components/Sidebar';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LojasPage = lazy(() => import('./pages/LojasPage'));
const FechamentoPage = lazy(() => import('./pages/FechamentoPage'));
const BrandHomePage = lazy(() => import('./pages/BrandHomePage'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));

type Role = 'financeiro' | 'expositor';

const pageLabels: Record<string, string> = {
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

function renderPage(page: string) {
  switch (page) {
    case 'dashboard':
      return <DashboardPage />;
    case 'lojas':
      return <LojasPage />;
    case 'fechamento':
      return <FechamentoPage />;
    case 'brand-home':
      return <BrandHomePage />;
    default:
      return <PlaceholderPage title={pageLabels[page] || page} />;
  }
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>('financeiro');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = useCallback((r: Role) => {
    setRole(r);
    setCurrentPage(r === 'financeiro' ? 'dashboard' : 'brand-home');
    setLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setLoggedIn(false);
    setCurrentPage('dashboard');
  }, []);

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={role} currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-[--border] bg-[--bg-content] flex items-center justify-between px-8 shrink-0">
          <h1 className="font-heading text-[17px] text-[--text-primary]">{pageLabels[currentPage] || ''}</h1>
          <div className="flex items-center gap-3">
            <div className="border border-[--border] rounded-lg px-3 py-1.5 font-label text-[12px] text-[--text-secondary] flex items-center gap-1.5">
              Todas as unidades
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8" style={{ background: 'var(--bg-primary)' }}>
          <Suspense fallback={<div className="flex items-center justify-center h-64 text-[--text-tertiary] font-label">Carregando...</div>}>
            <AnimatePresence mode="wait">
              <PageWrapper key={currentPage}>
                {renderPage(currentPage)}
              </PageWrapper>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
