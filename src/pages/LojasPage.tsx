import { useState } from 'react';
import { brands } from '../data/brands';
import Badge from '../components/ui/Badge';

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

  const filtered = brands.filter(b => {
    if (filter === 'Ativos') return b.status === 'success';
    if (filter === 'Inadimplentes') return b.status === 'danger';
    if (filter === 'Pendentes') return b.status === 'warning' || b.status === 'neutral';
    return true;
  });

  return (
    <div className="content-max space-y-6">
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

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Lojas parceiras</h3>
          <button className="px-4 py-2 bg-[--accent] hover:bg-[--accent-hover] text-white rounded-lg font-label text-[13px] transition-colors cursor-pointer border-none">
            + Nova loja parceira
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Marca</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Modelo</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4">Mensalidade</th>
              <th className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const ini = brandInitials[b.name] || { letters: b.name.slice(0, 2).toUpperCase(), color: '#6B7280' };
              const email = typeof brandEmails[b.name] === 'string' ? brandEmails[b.name] : '';
              const modelo = b.mensalidadeStatus === 'neutral' ? 'Sem contrato' : 'Consignação';
              const statusLabel = b.status === 'success' ? 'Ativo' : b.status === 'danger' ? 'Inadimplente' : b.status === 'warning' ? 'Ativo' : 'Pendente';
              return (
                <tr key={b.name} className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors cursor-pointer">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: ini.color }}>{ini.letters}</span>
                      <div>
                        <p className="font-subheading text-[14px] text-[--text-primary]">{b.name}</p>
                        <p className="font-caption text-[--text-tertiary]">{email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4"><Badge status={b.mensalidadeStatus === 'neutral' ? 'neutral' : 'success'} label={modelo} showDot /></td>
                  <td className="py-4 pr-4"><Badge status={b.mensalidadeStatus} label={b.mensalidade} showDot /></td>
                  <td className="py-4"><Badge status={b.status} label={statusLabel} showDot /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
