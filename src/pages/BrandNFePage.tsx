import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { amiraNfes } from '../data/nfe';
import Badge from '../components/ui/Badge';

type UploadState = 'idle' | 'uploading' | 'aguardando' | 'confirmada' | 'rejeitada';

export default function BrandNFePage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>('idle');

  const handleDownload = (numero: string) => {
    if (numero === '—') return;
    setDownloading(numero);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(prev => [...prev, numero]);
    }, 1200);
  };

  const cycleUpload = () => {
    if (uploadState === 'idle') {
      setUploadState('uploading');
      setTimeout(() => setUploadState('aguardando'), 1400);
      return;
    }
    if (uploadState === 'aguardando') { setUploadState('confirmada'); return; }
    if (uploadState === 'confirmada') { setUploadState('rejeitada'); return; }
    if (uploadState === 'rejeitada') { setUploadState('idle'); return; }
  };

  const enviadas = amiraNfes.filter(n => n.tipo === 'Mensalidade');
  const recebidas = amiraNfes.filter(n => n.tipo === 'Repasse');

  return (
    <div className="content-max space-y-6">
      {/* Pending NF-e upload — current month mensalidade */}
      <div
        className="card p-6"
        style={uploadState === 'confirmada'
          ? { borderColor: '#16A34A' }
          : uploadState === 'rejeitada'
          ? { borderColor: '#DC2626' }
          : { borderColor: '#F59E0B' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-label text-[11px] uppercase tracking-[1px] mb-1" style={{
              color: uploadState === 'confirmada' ? '#16A34A' : uploadState === 'rejeitada' ? '#DC2626' : '#F59E0B',
            }}>NF-E DA MENSALIDADE</p>
            <h3 className="font-heading text-[20px] text-[--text-primary]">Junho 2025</h3>
          </div>
          {uploadState === 'idle' && <Badge status="warning" label="Pendente" showDot />}
          {uploadState === 'uploading' && <Badge status="warning" label="Enviando..." showDot />}
          {uploadState === 'aguardando' && <Badge status="warning" label="Aguardando" showDot />}
          {uploadState === 'confirmada' && <Badge status="success" label="Confirmada" showDot />}
          {uploadState === 'rejeitada' && <Badge status="danger" label="Rejeitada" showDot />}
        </div>

        <AnimatePresence mode="wait">
          {uploadState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cycleUpload}
              className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors hover:bg-[--bg-primary]"
              style={{ borderColor: 'var(--border)' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" className="mx-auto mb-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              <p className="font-body text-[14px] text-[--text-primary] mb-1">Enviar XML da NF-e</p>
              <p className="font-caption text-[--text-tertiary]">Clique para selecionar o arquivo (XML emitido pela sua contabilidade)</p>
            </motion.div>
          )}

          {uploadState === 'uploading' && (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </motion.div>
              <p className="font-body text-[14px] text-[--text-primary]">Enviando NF-e...</p>
            </motion.div>
          )}

          {(uploadState === 'aguardando' || uploadState === 'confirmada' || uploadState === 'rejeitada') && (
            <motion.div key={uploadState} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--bg-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[13px] text-[--text-primary] truncate">nfe-amira-mensalidade-junho-2025.xml</p>
                  <p className="font-caption text-[--text-tertiary]">Enviado em 14/06/2025 · 18 KB</p>
                </div>
              </div>

              {uploadState === 'aguardando' && (
                <p className="font-body text-[13px]" style={{ color: '#D4860A' }}>
                  A loja revisará sua NF-e em até 1 dia útil. Você será notificada quando confirmada.
                </p>
              )}
              {uploadState === 'confirmada' && (
                <p className="font-body text-[13px]" style={{ color: '#16A34A' }}>
                  NF-e confirmada pela loja. Mensalidade documentada. Obrigada!
                </p>
              )}
              {uploadState === 'rejeitada' && (
                <p className="font-body text-[13px]" style={{ color: '#DC2626' }}>
                  NF-e rejeitada: chave de acesso inválida. Verifique com sua contabilidade e reenvie o XML correto.
                </p>
              )}

              <button
                onClick={cycleUpload}
                className="px-4 py-2 rounded-lg font-label text-[13px] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content-solid] text-[--text-primary]"
              >
                {uploadState === 'aguardando' && 'Substituir arquivo'}
                {uploadState === 'confirmada' && 'Enviar nova versão'}
                {uploadState === 'rejeitada' && 'Reenviar XML'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NF-es enviadas (mensalidades) */}
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-1">NF-es enviadas</h3>
        <p className="font-caption text-[--text-tertiary] mb-5">Emitidas por você, referentes à sua mensalidade</p>
        <div className="table-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['NÚMERO', 'REFERÊNCIA', 'VALOR', 'ENVIADA EM', 'STATUS', ''].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enviadas.map(n => {
              const isDownloading = downloading === n.numero;
              const isDownloaded = downloaded.includes(n.numero);
              const canDownload = n.numero !== '—';
              return (
                <tr key={`enviada-${n.numero}`} className="border-b border-[--border] last:border-b-0">
                  <td className="py-3.5 pr-4 font-mono text-[13px]">{n.numero}</td>
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
                        {isDownloading ? 'Baixando...' : isDownloaded ? 'Baixado' : 'Baixar'}
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

      {/* NF-es recebidas (repasses) */}
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-1">NF-es recebidas</h3>
        <p className="font-caption text-[--text-tertiary] mb-5">Emitidas pela loja, referentes aos seus repasses</p>
        <div className="table-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['NÚMERO', 'REFERÊNCIA', 'VALOR', 'RECEBIDA EM', 'STATUS', ''].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recebidas.map(n => {
              const isDownloading = downloading === n.numero;
              const isDownloaded = downloaded.includes(n.numero);
              const canDownload = n.numero !== '—';
              return (
                <tr key={`recebida-${n.numero}`} className="border-b border-[--border] last:border-b-0">
                  <td className="py-3.5 pr-4 font-mono text-[13px]">{n.numero}</td>
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
                        {isDownloading ? 'Baixando...' : isDownloaded ? 'Baixado' : 'Baixar'}
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

      {/* Guide link — replaces "Preciso de ajuda" */}
      <div className="rounded-xl border border-[--border] p-4 flex items-center justify-between" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="1.8" className="shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="15" y2="17"/>
          </svg>
          <div>
            <p className="font-subheading text-[13px] text-[--text-primary]">Como emitir a NF-e da mensalidade</p>
            <p className="font-caption text-[--text-tertiary]">CFOP, natureza da operação e dados da loja consignatária</p>
          </div>
        </div>
        <a
          href="#"
          onClick={e => e.preventDefault()}
          className="font-label text-[12px] cursor-pointer hover:underline"
          style={{ color: '#0D9488' }}
        >
          Abrir guia de emissão →
        </a>
      </div>
    </div>
  );
}
