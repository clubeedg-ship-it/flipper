import type { JSX } from 'react';
import { motion } from 'framer-motion';
import SectionTransition from './ui/SectionTransition';

const chaosCards = [
  { text: 'Vendas_JUN_v3_FINAL(2).xlsx', icon: 'spreadsheet' },
  { text: '"Oi, cadê meu repasse?" — 14:32', icon: 'chat' },
  { text: 'NF 4521 — REJEITADA', icon: 'docx' },
  { text: 'Re: Re: Re: Fechamento junho', icon: 'mail' },
  { text: '"Marca X ligou de novo" — Post-it', icon: 'sticky' },
  { text: 'Conferir planilha marca Y e Z', icon: 'checklist' },
];

const icons: Record<string, JSX.Element> = {
  spreadsheet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  docx: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="9"/></svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  sticky: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M14 3v4a2 2 0 0 0 2 2h4"/></svg>
  ),
  checklist: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  ),
};

const rotations = [-2.5, 1.8, -1.2, 2.1, -3, 1.5];
const floatDurations = [3.2, 4.1, 3.7, 4.5, 3.5, 4.3];
const floatYs = [-4, 3, -3, 4, -3.5, 3.5];

export default function Hero() {
  return (
    <section
      data-act="1"
      className="min-h-screen flex flex-col items-center justify-center px-8 snap-start relative"
      style={{ background: 'linear-gradient(135deg, #FAFAFA 0%, #EFF6FF 50%, #F3F4F6 100%)' }}
    >
      <div className="max-w-[800px] w-full text-center">
        <SectionTransition>
          <h1 className="font-display text-[clamp(32px,5vw,56px)] leading-[1.1] text-[#111111] mb-6">
            Planilha, WhatsApp, e-mail.<br />
            Repetir todo mês.
          </h1>
        </SectionTransition>

        <SectionTransition delay={0.1}>
          <p className="font-body text-[18px] leading-[1.6] text-[#6B7280] max-w-[520px] mx-auto mb-10">
            A gestão financeira de consignações ainda funciona assim na maioria das lojas multimarca.
            A Pinga gerencia mais de 30 marcas com esse fluxo.
            E funciona — até que não funciona mais.
          </p>
        </SectionTransition>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[680px] mx-auto mt-10">
          {chaosCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="glass rounded-xl p-4 text-left"
              style={{
                transform: `rotate(${rotations[i]}deg)`,
                willChange: 'transform, opacity',
                animation: `float ${floatDurations[i]}s ease-in-out infinite`,
                ['--float-y' as string]: `${floatYs[i]}px`,
                ['--float-rotate' as string]: `${rotations[i]}deg`,
                ['--float-rotate-delta' as string]: `${rotations[i] > 0 ? 1 : -1}deg`,
              }}
            >
              <div className="text-[#9CA3AF] mb-2">{icons[card.icon]}</div>
              <p className="font-label text-[#111111] text-[12px] leading-snug">{card.text}</p>
            </motion.div>
          ))}
        </div>

        <SectionTransition delay={0.6} className="mt-12">
          <p className="font-subheading text-[20px] text-[#6B7280]">
            E se existisse um lugar só pra isso?
          </p>
        </SectionTransition>

        <motion.div
          className="mt-8 text-[#9CA3AF]"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
