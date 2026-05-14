import { useState, useMemo } from 'react';
import { storeSales, type StoreSale } from '../data/sales';
import type { UnitFilter } from '../data/brands';
import Badge from '../components/ui/Badge';
import VendaDetailModal from '../components/ui/VendaDetailModal';

type TypeFilter = 'Todas' | 'Vendas' | 'Devoluções';

interface VendasPageProps {
  unitFilter?: UnitFilter;
}

const periods = ['Junho 2025', 'Maio 2025', 'Abril 2025', 'Março 2025'];

export default function VendasPage({ unitFilter = 'Todas' }: VendasPageProps) {
  const [brandFilter, setBrandFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todas');
  const [syncing, setSyncing] = useState(false);
  const [period, setPeriod] = useState(periods[0]);
  const [selectedSale, setSelectedSale] = useState<StoreSale | null>(null);

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
  const totalRepasse = filtered.reduce((s, r) => s + r.repasse, 0);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  const totalDevolutions = filtered.filter(s => s.isReturn).reduce((s, r) => s + Math.abs(r.value), 0);
  const blockedCount = filtered.filter(s => s.pgto === 'Bloqueado').length;

  return (
    <div className="content-max space-y-6">
      {/* Period nav */}
      <div className="filter-bar justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const i = periods.indexOf(period);
              if (i < periods.length - 1) setPeriod(periods[i + 1]);
            }}
            disabled={period === periods[periods.length - 1]}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border border-[--border] text-[--text-secondary] hover:bg-[--bg-primary] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--bg-content-solid)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1.5 border border-[--border] rounded-lg font-body text-[13px] text-[--text-primary] cursor-pointer"
            style={{ background: 'var(--bg-content-solid)' }}
          >
            {periods.map(p => <option key={p}>{p}</option>)}
          </select>
          <button
            onClick={() => {
              const i = periods.indexOf(period);
              if (i > 0) setPeriod(periods[i - 1]);
            }}
            disabled={period === periods[0]}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border border-[--border] text-[--text-secondary] hover:bg-[--bg-primary] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--bg-content-solid)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <p className="font-caption text-[--text-tertiary]">{filtered.length} registros · {period}</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid-4">
        {[
          { label: 'Total vendido', value: `R$ ${totalCliente.toLocaleString('pt-BR')}`, color: 'var(--text-primary)' },
          { label: 'Devoluções', value: `R$ ${totalDevolutions.toLocaleString('pt-BR')}`, color: 'var(--danger)' },
          { label: 'Repasse gerado', value: `R$ ${totalRepasse.toLocaleString('pt-BR')}`, color: 'var(--success)' },
          { label: 'Itens bloqueados', value: String(blockedCount), color: blockedCount > 0 ? 'var(--warning)' : 'var(--text-tertiary)' },
        ].map(k => (
          <div key={k.label} className="metric-card">
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-2">{k.label}</p>
            <p className="text-[24px] font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Sync banner */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>ERP sincronizado · última leitura hoje 14:32</span>
        <Badge status="success" label="OK" showDot={false} />
        <button
          onClick={handleSync}
          disabled={syncing}
          className="ml-auto px-3 py-1 border border-[--border] rounded-lg font-label text-[12px] text-[--text-secondary] hover:bg-[--bg-content-solid] transition-colors cursor-pointer bg-transparent disabled:opacity-50"
        >
          {syncing ? 'Sincronizando...' : 'Atualizar sync'}
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
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
        <button className="px-3 py-2 border border-[--border] rounded-lg font-label text-[13px] text-[--text-secondary] bg-[--bg-content] hover:bg-[--bg-primary] cursor-pointer transition-colors">+ Lançamento manual</button>
        <span className="ml-auto font-caption text-[--text-tertiary]">{filtered.length} registros</span>
      </div>

      {/* Sales table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Vendas — {period}</h3>
          <button className="px-3 py-1.5 border border-[--border] rounded-lg font-label text-[12px] text-[--text-secondary] hover:bg-[--bg-primary] cursor-pointer bg-[--bg-content] transition-colors">Exportar CSV</button>
        </div>
        <div className="table-scroll">
        <table className="w-full" style={{ minWidth: 700 }}>
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
                onClick={() => setSelectedSale(s)}
                className={`border-b border-[--border] last:border-b-0 cursor-pointer hover:bg-[--bg-primary]/50 transition-colors ${s.isReturn ? 'opacity-70' : ''}`}
              >
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{s.date}</td>
                <td className="py-3.5 pr-4">
                  <div>
                    <p className="font-mono text-[13px]">{s.sku}</p>
                    <p className="font-caption text-[--text-tertiary]">{s.brand}</p>
                  </div>
                </td>
                <td className="py-3.5 pr-4 font-body text-[14px] text-[--text-primary]">
                  {s.product}
                  {s.isReturn && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">Devolução</span>}
                </td>
                <td className="py-3.5 pr-4 font-mono text-[14px]" style={s.isReturn ? { color: '#DC2626' } : undefined}>
                  {s.isReturn ? '−' : ''}R$ {Math.abs(s.value).toLocaleString('pt-BR')}
                </td>
                <td className="py-3.5 pr-4 font-mono text-[14px]" style={s.isReturn ? { color: '#DC2626' } : undefined}>
                  {s.isReturn ? '−' : ''}R$ {Math.abs(s.ficaLoja).toLocaleString('pt-BR')}
                </td>
                <td className="py-3.5 pr-4 font-mono text-[14px]" style={s.isReturn ? { color: '#DC2626' } : { color: '#0D9488' }}>
                  {s.isReturn ? '−' : ''}R$ {Math.abs(s.repasse).toLocaleString('pt-BR')}
                </td>
                <td className="py-3.5">
                  {s.pgto === 'Bloqueado'
                    ? <Badge status="warning" label="Bloqueado" showDot />
                    : <span className="font-body text-[13px] text-[--text-secondary]">{s.pgto}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
          {/* Total moved to KPIs at top */}
        </table>
        </div>
      </div>

      <VendaDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  );
}
