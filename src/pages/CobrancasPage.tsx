import { useState, useMemo } from 'react';
import { brands } from '../data/brands';
import Badge from '../components/ui/Badge';
import BrandProfileDrawer from '../components/ui/BrandProfileDrawer';
import type { BrandStatus, UnitFilter } from '../data/brands';

interface Cobranca {
  brand: string;
  avatar: { letters: string; color: string };
  valor: number;
  vencimento: string;
  pagamento: string;
  metodo: string;
  status: string;
  statusType: BrandStatus;
}

const cobrancas: Cobranca[] = brands
  .filter(b => b.drawer.contract.mensalidade > 0)
  .map(b => ({
    brand: b.name,
    avatar: {
      letters: b.name === 'Amira' ? 'AM' : b.name === 'Lua Cheia' ? 'LC' : b.name === 'Mar e Rio' ? 'MR' : b.name === 'Dona Sol' ? 'DS' : b.name === 'Casa Bruta' ? 'CB' : b.name === 'Brisa' ? 'BR' : 'BT',
      color: b.name === 'Amira' ? '#0D9488' : b.name === 'Lua Cheia' ? '#7C3AED' : b.name === 'Mar e Rio' ? '#2563EB' : b.name === 'Dona Sol' ? '#DC2626' : b.name === 'Casa Bruta' ? '#D97706' : b.name === 'Brisa' ? '#059669' : '#7C3AED',
    },
    valor: b.drawer.contract.mensalidade,
    vencimento: '05/06/2025',
    pagamento: b.drawer.june.mensalidadePaidDate ? b.drawer.june.mensalidadePaidDate : '—',
    metodo: b.mensalidadeStatus === 'success' ? 'Pix' : '—',
    status: b.mensalidadeStatus === 'success' ? 'Pago' : b.mensalidadeStatus === 'danger' ? 'Atrasado' : 'Pendente',
    statusType: b.mensalidadeStatus,
  }));

interface CobrancasPageProps {
  unitFilter?: UnitFilter;
}

export default function CobrancasPage({ unitFilter = 'Todas' }: CobrancasPageProps) {
  const [reminderSent, setReminderSent] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const filteredCobrancas = useMemo(() =>
    unitFilter === 'Todas' ? cobrancas : cobrancas.filter(c => {
      const brand = brands.find(b => b.name === c.brand);
      return brand && brand.location === unitFilter;
    }),
    [unitFilter]
  );
  const pendingCount = filteredCobrancas.filter(c => c.statusType !== 'success').length;

  const totalEsperado = filteredCobrancas.reduce((s, c) => s + c.valor, 0);
  const totalRecebido = filteredCobrancas.filter(c => c.statusType === 'success').reduce((s, c) => s + c.valor, 0);
  const totalAberto = totalEsperado - totalRecebido;

  return (
    <div className="content-max space-y-6">
      {/* KPIs */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[
          { label: 'Total esperado', value: `R$ ${totalEsperado.toLocaleString('pt-BR')}`, color: 'var(--text-primary)' },
          { label: 'Total recebido', value: `R$ ${totalRecebido.toLocaleString('pt-BR')}`, color: 'var(--success)' },
          { label: 'Em aberto', value: `R$ ${totalAberto.toLocaleString('pt-BR')}`, color: totalAberto > 0 ? 'var(--danger)' : 'var(--text-tertiary)' },
        ].map(k => (
          <div key={k.label} className="metric-card">
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-2">{k.label}</p>
            <p className="text-[24px] font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Alert — green tone for positive info */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Cobranças geradas automaticamente em 01/06/2025. Lembretes enviados para lojas parceiras em aberto.</span>
      </div>

      {reminderSent && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Lembretes reenviados para {pendingCount} lojas parceiras com pendência.</span>
        </div>
      )}

      {/* Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Mensalidades — Junho 2025</h3>
          <button
            onClick={() => setReminderSent(true)}
            className="px-4 py-2 rounded-lg font-label text-[12px] text-[--text-secondary] cursor-pointer border border-[--border] transition-colors hover:bg-[--bg-primary] bg-[--bg-content]"
          >
            Reenviar lembretes (massa)
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['LOJA PARCEIRA', 'VALOR', 'VENCIMENTO', 'PAGAMENTO', 'MÉTODO', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCobrancas.map(c => (
              <tr key={c.brand} className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors cursor-pointer" onClick={() => setSelectedBrand(c.brand)}>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: c.avatar.color }}>{c.avatar.letters}</span>
                    <span className="font-subheading text-[14px]">{c.brand}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {c.valor.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{c.vencimento}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{c.pagamento}</td>
                <td className="py-3.5 pr-4 font-body text-[13px] text-[--text-secondary]">{c.metodo}</td>
                <td className="py-3.5"><Badge status={c.statusType} label={c.status} showDot /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BrandProfileDrawer brandName={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </div>
  );
}
