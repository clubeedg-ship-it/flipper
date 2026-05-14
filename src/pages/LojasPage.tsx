import { useState } from 'react';
import { brands } from '../data/brands';
import Badge from '../components/ui/Badge';
import BrandProfileDrawer from '../components/ui/BrandProfileDrawer';

type Filter = 'Todos' | 'Ativos' | 'Inadimplentes' | 'Pendentes';

const brandInitials: Record<string, { letters: string; color: string }> = {
  'Amira': { letters: 'AM', color: '#0D9488' },
  'Lua Cheia': { letters: 'LC', color: '#7C3AED' },
  'Mar e Rio': { letters: 'MR', color: '#2563EB' },
  'Dona Sol': { letters: 'DS', color: '#DC2626' },
  'Casa Bruta': { letters: 'CB', color: '#D97706' },
  'Brisa': { letters: 'BR', color: '#059669' },
  'Bruta': { letters: 'BT', color: '#7C3AED' },
  'Terra Mãe': { letters: 'TM', color: '#6B7280' },
};

const brandEmails: Record<string, string> = {
  'Amira': 'contato@amirajoias.com.br',
  'Lua Cheia': { toString: () => 'lua@luacheia.com' } as unknown as string,
  'Mar e Rio': 'contato@merio.com',
  'Dona Sol': 'contato@donasol.com',
  'Casa Bruta': 'oi@casabruta.com',
  'Brisa': 'contato@brisa.com',
  'Bruta': 'bruta@bruta.com',
  'Terra Mãe': 'terra@terramae.com',
};

const filters: Filter[] = ['Todos', 'Ativos', 'Inadimplentes', 'Pendentes'];

export default function LojasPage() {
  const [filter, setFilter] = useState<Filter>('Todos');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);
  const [search, setSearch] = useState('');

  const activeBrands = brands.filter(b => b.status === 'success');
  const inadimplentes = brands.filter(b => b.status === 'danger');
  const pendentes = brands.filter(b => b.status === 'warning' || b.status === 'neutral');

  const filtered = brands.filter(b => {
    if (filter === 'Ativos') return b.status === 'success';
    if (filter === 'Inadimplentes') return b.status === 'danger';
    if (filter === 'Pendentes') return b.status === 'warning' || b.status === 'neutral';
    return true;
  }).filter(b => {
    if (!search) return true;
    const s = search.toLowerCase();
    const email = typeof brandEmails[b.name] === 'string' ? brandEmails[b.name] : '';
    return b.name.toLowerCase().includes(s) || email.toLowerCase().includes(s);
  });

  const incompleteBrands = filtered.filter(b => b.mensalidadeStatus === 'neutral');
  const completeBrands = filtered.filter(b => b.mensalidadeStatus !== 'neutral');

  return (
    <div className="content-max space-y-6">
      {/* KPIs */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[
          { label: 'Marcas ativas', value: activeBrands.length, color: 'var(--success)' },
          { label: 'Inadimplentes', value: inadimplentes.length, color: 'var(--danger)' },
          { label: 'Pendentes', value: pendentes.length, color: 'var(--warning)' },
        ].map(k => (
          <div key={k.label} className="metric-card">
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-2">{k.label}</p>
            <p className="text-[28px] font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-label text-[13px] transition-all duration-200 cursor-pointer border ${
                filter === f
                  ? 'bg-[--accent] text-white border-[--accent]'
                  : 'bg-[--bg-content] text-[--text-secondary] border-[--border] hover:bg-[--bg-primary]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg font-body text-[13px] bg-[--bg-content] border border-[--border] text-[--text-primary] placeholder-[--text-tertiary] w-64 outline-none focus:border-[--accent] transition-colors"
        />
      </div>

      {inviteSent && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Convite enviado com sucesso. A nova loja parceira receberá as instruções por e-mail.</span>
        </div>
      )}

      {/* Incomplete brands section */}
      {incompleteBrands.length > 0 && (
        <div className="card p-5" style={{ borderLeft: '3px solid var(--warning)' }}>
          <h4 className="font-label text-[11px] text-[--warning] uppercase tracking-[1px] mb-3">Pendentes de cadastro</h4>
          {incompleteBrands.map(b => {
            const ini = brandInitials[b.name] || { letters: b.name.slice(0, 2).toUpperCase(), color: '#6B7280' };
            return (
              <div key={b.name} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-[--bg-primary]/50 rounded-lg px-2 transition-colors" onClick={() => setSelectedBrand(b.name)}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: ini.color }}>{ini.letters}</span>
                <div className="flex-1">
                  <p className="font-subheading text-[14px] text-[--text-primary]">{b.name}</p>
                  <p className="font-caption text-[--text-tertiary]">Sem contrato definido</p>
                </div>
                <button className="px-3 py-1.5 border border-[--border] rounded-lg font-label text-[12px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]">
                  Finalizar cadastro
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Lojas parceiras</h3>
          <button
            onClick={() => setInviteSent(true)}
            className="px-4 py-2 bg-[--accent] hover:bg-[--accent-hover] text-white rounded-lg font-label text-[13px] transition-colors cursor-pointer border-none"
          >
            + Nova loja parceira
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Marca</th>
              <th className="text-right font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Vendas do mês</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Repasse</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Mensalidade</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {completeBrands.map(b => {
              const ini = brandInitials[b.name] || { letters: b.name.slice(0, 2).toUpperCase(), color: '#6B7280' };
              const email = typeof brandEmails[b.name] === 'string' ? brandEmails[b.name] : '';
              const statusLabel = b.status === 'success' ? 'Ativo' : b.status === 'danger' ? 'Inadimplente' : b.status === 'warning' ? 'Ativo' : 'Pendente';
              return (
                <tr key={b.name} className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors cursor-pointer" onClick={() => setSelectedBrand(b.name)}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: ini.color }}>{ini.letters}</span>
                      <div>
                        <p className="font-subheading text-[14px] text-[--text-primary]">{b.name}</p>
                        <p className="font-caption text-[--text-tertiary]">{email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-right font-mono text-[14px]">R$ {b.vendasJun.toLocaleString('pt-BR')}</td>
                  <td className="py-4 pr-4"><Badge status={b.repasseStatus} label={b.repasse} showDot /></td>
                  <td className="py-4 pr-4"><Badge status={b.mensalidadeStatus} label={b.mensalidade} showDot /></td>
                  <td className="py-4"><Badge status={b.status} label={statusLabel} showDot /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BrandProfileDrawer brandName={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </div>
  );
}
