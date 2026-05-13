import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import BrandPortal from './components/BrandPortal';
import BlockChain from './components/BlockChain';
import Closing from './components/Closing';

const actLabels = ['O Problema', 'Visão Geral', 'Portal da Marca', 'Proteção Automática', 'Próximos Passos'];

function ProgressDots({ activeAct }: { activeAct: number }) {
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  const scrollToAct = (index: number) => {
    const el = document.querySelector(`[data-act="${index + 1}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 items-end">
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

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onDone={handleDone} />}
      </AnimatePresence>

      {/* Fixed logo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed top-6 left-8 z-50 font-display text-[20px] text-[#111111] hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none"
      >
        flipper
      </button>

      {/* Context badge */}
      <div className="fixed top-6 right-20 z-50">
        <div className="glass rounded-full px-4 py-1.5 font-label text-[12px] text-[#6B7280]">
          Demo · Pinga Store · Jun 2025
        </div>
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
