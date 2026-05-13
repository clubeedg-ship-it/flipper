import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import BrandPortal from './components/BrandPortal';
import BlockChain from './components/BlockChain';
import Closing from './components/Closing';

const actLabels = ['O Problema', 'Visão Geral', 'Portal da Marca', 'Proteção Automática', 'Próximos Passos'];

const appTabs = [
  { label: 'Dashboard', actIndex: 1 },
  { label: 'Portal da Marca', actIndex: 2 },
  { label: 'Proteção', actIndex: 3 },
];

function scrollToAct(index: number) {
  const el = document.querySelector(`[data-act="${index + 1}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function ProgressDots({ activeAct }: { activeAct: number }) {
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 items-end">
      {actLabels.map((label, i) => (
        <div key={i} className="relative flex items-center gap-3" onMouseEnter={() => setHoveredDot(i)} onMouseLeave={() => setHoveredDot(null)}>
          <AnimatePresence>
            {hoveredDot === i && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="font-label text-[12px] text-[#6B7280] whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => scrollToAct(i)}
            className="relative flex items-center justify-center"
            aria-label={label}
          >
            <span
              className={`rounded-full transition-all duration-300 ${
                activeAct === i
                  ? 'w-2.5 h-2.5 bg-[#2563EB]'
                  : 'w-2 h-2 bg-[#E5E7EB] hover:bg-[#9CA3AF]'
              }`}
              style={activeAct === i ? { animation: 'pulse-dot 2s ease-in-out infinite' } : {}}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

function AppToolbar({ activeAct }: { activeAct: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB]/60">
        <div className="content-max flex items-center justify-between h-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-[18px] text-[#111111] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none"
          >
            flipper
          </button>

          <nav className="flex gap-1">
            {appTabs.map(tab => (
              <button
                key={tab.actIndex}
                onClick={() => scrollToAct(tab.actIndex)}
                className={`px-3.5 py-1.5 rounded-lg font-label text-[13px] transition-all duration-200 cursor-pointer bg-transparent border-none ${
                  activeAct === tab.actIndex
                    ? 'bg-[#DBEAFE] text-[#2563EB]'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <span className="font-label text-[12px] text-[#9CA3AF]">
            Pinga Store · Jun 2025
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#FAFAFA] z-[100] flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="font-display text-[24px] text-[#111111]"
      >
        flipper
      </motion.span>
    </motion.div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [activeAct, setActiveAct] = useState(0);

  const handleDone = useCallback(() => setLoading(false), []);

  const showToolbar = activeAct >= 1 && activeAct <= 3;

  useEffect(() => {
    const sections = document.querySelectorAll('[data-act]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const act = parseInt(entry.target.getAttribute('data-act') || '1') - 1;
            setActiveAct(act);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToAct(Math.min(activeAct + 1, 4));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToAct(Math.max(activeAct - 1, 0));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeAct]);

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onDone={handleDone} />}
      </AnimatePresence>

      {/* Fixed logo — fades on desktop when toolbar shows */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed top-6 left-8 z-50 font-display text-[20px] text-[#111111] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none ${showToolbar ? 'md:opacity-0 md:pointer-events-none' : ''}`}
      >
        flipper
      </button>

      {/* Context badge — fades on desktop when toolbar shows */}
      <div className={`fixed top-6 right-4 sm:right-20 z-50 transition-opacity duration-200 ${showToolbar ? 'md:opacity-0 md:pointer-events-none' : ''}`}>
        <div className="glass rounded-full px-3 sm:px-4 py-1.5 font-label text-[11px] sm:text-[12px] text-[#6B7280]">
          Demo · Pinga Store · Jun 2025
        </div>
      </div>

      {/* App toolbar — desktop only, visible for Acts 2-4 */}
      <div className="hidden md:block">
        <AnimatePresence>
          {showToolbar && <AppToolbar activeAct={activeAct} />}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <ProgressDots activeAct={activeAct} />

      {/* Main content */}
      <main>
        <Hero />
        <Dashboard />
        <BrandPortal />
        <BlockChain />
        <Closing />
      </main>
    </>
  );
}

export default App;
