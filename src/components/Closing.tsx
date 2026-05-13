import { motion } from 'framer-motion';
import { roadmapFeatures } from '../data/metrics';
import GlassCard from './ui/GlassCard';
import SectionTransition from './ui/SectionTransition';

const featureIcons = [
  <svg key="chart" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  <svg key="phone" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  <svg key="plug" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
];

export default function Closing() {
  return (
    <section
      data-act="5"
      className="min-h-screen snap-start flex flex-col items-center justify-center px-8 relative"
      style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #FAFAFA 100%)' }}
    >
      <div className="max-w-[800px] w-full text-center">
        <SectionTransition>
          <p className="font-label text-[#2563EB] uppercase tracking-[1.5px] mb-3">FLIPPER</p>
          <h2 className="font-display text-[clamp(32px,4vw,48px)] leading-[1.1] text-[#111111] mb-4">
            A camada financeira<br />que faltava.
          </h2>
          <p className="font-body text-[17px] text-[#6B7280] max-w-[460px] mx-auto">
            O Flipper não é ERP, PDV nem marketplace.
            É o que conecta o sistema de vendas da Pinga às marcas que expõem nela.
          </p>
        </SectionTransition>

        {/* Feature roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-16">
          {roadmapFeatures.map((f, i) => (
            <GlassCard key={f.title} delay={i * 0.08}>
              <div className="text-[#2563EB] mb-3">{featureIcons[i]}</div>
              <h4 className="font-subheading text-[16px] text-[#111111] mb-2">{f.title}</h4>
              <p className="font-body text-[14px] text-[#6B7280]">{f.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* CTA */}
        <SectionTransition delay={0.3} className="mt-4">
          <h3 className="font-heading text-[28px] text-[#111111] mb-8">
            Quer ver o Flipper com os dados da Pinga?
          </h3>

          <motion.a
            href="https://wa.me/31634367169"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#2563EB] text-white rounded-2xl font-subheading text-[17px] hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Conversar no WhatsApp
          </motion.a>

          <p className="font-caption text-[#9CA3AF] mt-4">
            Resposta em até 24h · Sem compromisso
          </p>
        </SectionTransition>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-6 text-center">
        <p className="font-caption text-[#9CA3AF]">flipper · 2025</p>
      </div>
    </section>
  );
}
