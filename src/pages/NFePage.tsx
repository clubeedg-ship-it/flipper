import { useState } from 'react';
import { nfesRecebidas, nfesEmitidas } from '../data/nfe';
import Badge from '../components/ui/Badge';

export default function NFePage() {
  const [emitirDone, setEmitirDone] = useState(false);

  const pendingRecebidas = nfesRecebidas.filter(n => n.statusType !== 'success').length;

  return (
    <div className="content-max space-y-6">
      {emitirDone && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>NF-e emitida com sucesso via Focus NF-e.</span>
        </div>
      )}

      {/* NF-es recebidas */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">NF-es recebidas das lojas parceiras</h3>
          {pendingRecebidas > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[--warning]">
              <span className="w-2 h-2 rounded-full bg-[--warning]" />
              {pendingRecebidas} pendentes
            </span>
          )}
        </div>

        {pendingRecebidas > 0 && (
          <div className="alert-banner alert-banner-warning mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>{pendingRecebidas} pendentes — {nfesRecebidas.filter(n => n.statusType !== 'success').map(n => n.brand).join(' e ')}</span>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['LOJA PARCEIRA', 'REFERÊNCIA', 'VALOR', 'RECEBIDA EM', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nfesRecebidas.map(n => (
              <tr key={`${n.brand}-rec`} className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: n.brandAvatar.color }}>{n.brandAvatar.letters}</span>
                    <span className="font-subheading text-[14px]">{n.brand}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{n.referencia}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {n.valor.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{n.data}</td>
                <td className="py-3.5"><Badge status={n.statusType} label={n.status} showDot /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NF-es emitidas */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">NF-es emitidas pela loja</h3>
          <button
            onClick={() => setEmitirDone(true)}
            className="px-4 py-2 rounded-lg font-label text-[12px] text-white cursor-pointer border-none transition-colors"
            style={{ background: '#0D9488' }}
          >
            + Emitir NF-e
          </button>
        </div>

        <p className="font-caption text-[--text-tertiary] mb-4">Emissão via Focus NF-e · XML e DANFE enviados por e-mail</p>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['NÚMERO', 'LOJA PARCEIRA', 'TIPO', 'VALOR', 'EMITIDA EM', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nfesEmitidas.map(n => (
              <tr key={`${n.brand}-emit`} className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors">
                <td className="py-3.5 pr-4 font-mono text-[13px]">{n.numero}</td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: n.brandAvatar.color }}>{n.brandAvatar.letters}</span>
                    <span className="font-subheading text-[14px]">{n.brand}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4"><Badge status={n.tipo === 'Repasse' ? 'success' : 'neutral'} label={n.tipo} showDot={false} /></td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {n.valor.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{n.data}</td>
                <td className="py-3.5"><Badge status={n.statusType} label={n.status} showDot /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
