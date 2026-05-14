import { useState } from 'react';
import { storeSales } from '../data/sales';
import Badge from '../components/ui/Badge';

type UnitFilter = 'Todas' | 'SP' | 'RJ';

export default function VendasPage() {
  const [unit, setUnit] = useState<UnitFilter>('Todas');
  const [showManual, setShowManual] = useState(false);
  const [csvImported, setCsvImported] = useState(false);

  const filtered = storeSales.filter(s => unit === 'Todas' || s.store === unit);
  const totalCliente = filtered.reduce((s, r) => s + r.value, 0);
  const totalLoja = filtered.reduce((s, r) => s + r.ficaLoja, 0);
  const totalRepasse = filtered.reduce((s, r) => s + r.repasse, 0);

  return (
    <div className="content-max space-y-6">
      {/* Sync banner */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>ERP sincronizado · última leitura hoje 14:32</span>
        <Badge status="success" label="OK" showDot={false} />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['Todas', 'SP', 'RJ'] as UnitFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setUnit(f)}
              className={`px-4 py-2 rounded-lg font-label text-[13px] transition-all duration-200 cursor-pointer border ${
                unit === f
                  ? 'text-white border-transparent'
                  : 'bg-[--bg-content] text-[--text-secondary] border-[--border] hover:bg-[--bg-primary]'
              }`}
              style={unit === f ? { background: '#0D9488', borderColor: '#0D9488' } : undefined}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowManual(true)}
            className="px-4 py-2 border border-[--border] rounded-lg font-label text-[12px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]"
          >
            + Lançamento manual
          </button>
          <button
            onClick={() => setCsvImported(true)}
            className="px-4 py-2 border border-[--border] rounded-lg font-label text-[12px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]"
          >
            Importar CSV
          </button>
        </div>
      </div>

      {showManual && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Lançamento manual registrado com sucesso.</span>
        </div>
      )}

      {csvImported && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>CSV importado com sucesso — 28 vendas adicionadas.</span>
        </div>
      )}

      {/* Sales table */}
      <div className="card p-6">
        <h3 className="font-subheading text-[16px] text-[--text-primary] mb-5">Vendas — Junho 2025</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['DATA', 'CÓDIGO / SKU', 'PRODUTO', 'VALOR CLIENTE', 'LOJA 50%', 'REPASSE', 'PGTO PREVISTO'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr
                key={`${s.sku}-${i}`}
                className={`border-b border-[--border] last:border-b-0 ${s.isReturn ? 'opacity-70' : ''}`}
              >
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{s.date}</td>
                <td className="py-3.5 pr-4">
                  <div>
                    <p className="font-mono text-[13px]">{s.sku}</p>
                    <p className="font-caption text-[--text-tertiary]">{s.brand}</p>
                  </div>
                </td>
                <td className="py-3.5 pr-4 font-body text-[14px] text-[--text-primary]">{s.product}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]" style={s.isReturn ? { color: '#DC2626' } : undefined}>
                  {s.isReturn ? '−' : ''}R$ {Math.abs(s.value).toLocaleString('pt-BR')}
                </td>
                <td className="py-3.5 pr-4 font-mono text-[14px]" style={s.isReturn ? { color: '#DC2626' } : undefined}>
                  {s.isReturn ? '−' : ''}R$ {Math.abs(s.ficaLoja).toLocaleString('pt-BR')}
                </td>
                <td className="py-3.5 pr-4 font-mono text-[14px]" style={s.isReturn ? { color: '#DC2626' } : { color: '#0D9488' }}>
                  {s.isReturn ? '−' : ''}R$ {Math.abs(s.repasse).toLocaleString('pt-BR')}
                </td>
                <td className="py-3.5 font-body text-[13px] text-[--text-secondary]">{s.pgto}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[--border]">
              <td colSpan={3} className="py-3.5 pr-4 font-subheading text-[14px] text-[--text-primary]">Total</td>
              <td className="py-3.5 pr-4 font-mono text-[14px] font-bold">R$ {totalCliente.toLocaleString('pt-BR')}</td>
              <td className="py-3.5 pr-4 font-mono text-[14px] font-bold">R$ {totalLoja.toLocaleString('pt-BR')}</td>
              <td className="py-3.5 pr-4 font-mono text-[14px] font-bold" style={{ color: '#0D9488' }}>R$ {totalRepasse.toLocaleString('pt-BR')}</td>
              <td className="py-3.5"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
