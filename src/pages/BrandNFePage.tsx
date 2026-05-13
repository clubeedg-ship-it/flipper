import { useState } from 'react';
import { motion } from 'framer-motion';
import { amiraNfes } from '../data/nfe';
import Badge from '../components/ui/Badge';

export default function BrandNFePage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const handleDownload = (numero: string) => {
    if (numero === '—') return;
    setDownloading(numero);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(prev => [...prev, numero]);
    }, 1200);
  };

  return (
    <div className="content-max space-y-6">
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-5">Notas fiscais</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['NÚMERO', 'TIPO', 'REFERÊNCIA', 'VALOR', 'DATA', 'STATUS', ''].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {amiraNfes.map(n => {
              const isDownloading = downloading === n.numero;
              const isDownloaded = downloaded.includes(n.numero);
              const canDownload = n.numero !== '—';
              return (
                <tr key={`${n.numero}-${n.tipo}`} className="border-b border-[--border] last:border-b-0">
                  <td className="py-3.5 pr-4 font-mono text-[13px]">{n.numero}</td>
                  <td className="py-3.5 pr-4"><Badge status={n.tipo === 'Repasse' ? 'success' : 'neutral'} label={n.tipo} showDot={false} /></td>
                  <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{n.referencia}</td>
                  <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {n.valor.toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{n.data}</td>
                  <td className="py-3.5 pr-4"><Badge status={n.statusType} label={n.status} showDot /></td>
                  <td className="py-3.5 text-right">
                    {canDownload && (
                      <button
                        onClick={() => handleDownload(n.numero)}
                        disabled={isDownloading}
                        className="px-3 py-1.5 border border-[--border] rounded-lg font-label text-[12px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content] disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="inline-block"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                          </motion.span>
                        ) : isDownloaded ? (
                          <span className="flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Baixado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Baixar
                          </span>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
