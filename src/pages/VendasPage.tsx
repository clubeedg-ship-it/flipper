import { useState, useMemo } from 'react';
import { storeSales } from '../data/sales';
import type { UnitFilter } from '../data/brands';
import Badge from '../components/ui/Badge';

type TypeFilter = 'Todas' | 'Vendas' | 'Devoluções';

interface VendasPageProps {
  unitFilter?: UnitFilter;
}

export default function VendasPage({ unitFilter = 'Todas' }: VendasPageProps) {
  const [brandFilter, setBrandFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todas');
  const [syncing, setSyncing] = useState(false);

  const brandNames = useMemo(() => {
    const names = [...new Set(storeSales.map(s => s.brand))];
    return ['Todas', ...names];
  }, []);

  const filtered = useMemo(() => {
    let result = storeSales;
    if (unitFilter !== 'Todas') result = result.filter(s => s.store === unitFilter);
    if (brandFilter !== 'Todas') result = result.filter(s => s.brand === brandFilter);
    if (typeFilter === 'Vendas') result = result.filter(s => !s.isReturn);
    if (typeFilter === 'Devoluções') result = result.filter(s => s.isReturn);
    return result;
  }, [unitFilter, brandFilter, typeFilter]);

  const totalCliente = filtered.reduce((s, r) => s + r.value, 0);
  const totalLoja = filtered.reduce((s, r) => s + r.ficaLoja, 0);
  const totalRepasse = filtered.reduce((s, r) => s + r.repasse, 0);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  return (
    <div className="content-max space-y-6">
      {/* Sync banner */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>ERP sincronizado · última leitura hoje 14:32</span>
        <Badge status="success" label="OK" showDot={false} />
        <button
          onClick={handleSync}
          disabled={syncing}
          className="ml-auto px-3 py-1 border border-[--border] rounded-lg font-label text-[12px] text-[--text-secondary] hover:bg-white transition-colors cursor-pointer bg-transparent disabled:opacity-50"
        >
          {syncing ? 'Sincronizando...' : 'Atualizar sync'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          className="px-3 py-2 border border-[--border] rounded-lg font-label text-[13px] text-[--text-secondary] bg-[--bg-content] cursor-pointer"
        >
          {brandNames.map(b => (
            <option key={b} value={b}>{b === 'Todas' ? 'Todas as marcas' : b}</option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          {(['Todas', 'Vendas', 'Devoluções'] as TypeFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-2 rounded-lg font-label text-[13px] transition-all duration-200 cursor-pointer border ${
                typeFilter === f
                  ? 'text-white border-transparent'
                  : 'bg-[--bg-content] text-[--text-secondary] border-[--border] hover:bg-[--bg-primary]'
              }`}
              style={typeFilter === f ? { background: '#0D9488', borderColor: '#0D9488' } : undefined}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="ml-auto font-caption text-[--text-tertiary]">{filtered.length} registros</span>
      </div>

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
