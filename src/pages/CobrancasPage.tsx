import { useState, useMemo } from 'react';
import { brands } from '../data/brands';
import Badge from '../components/ui/Badge';
import CobrancaModal, { type CobrancaModalData } from '../components/ui/CobrancaModal';
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
  comprovante?: { fileName: string; sentAt: string };
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
    // Hardcoded: Lua Cheia sent a comprovante that's awaiting financeiro review
    comprovante: b.name === 'Lua Cheia' ? { fileName: 'comprovante-lua-cheia-jun.pdf', sentAt: '08/06/2025' } : undefined,
  }));

interface CobrancasPageProps {
  unitFilter?: UnitFilter;
  onNavigate?: (page: string) => void;
}

type PeriodPattern = 'pago-em-dia' | 'pago-com-atraso' | 'inadimplente' | 'sem-historico';

interface HistoryRow {
  brand: string;
  avatar: { letters: string; color: string };
  months: { label: string; status: 'paid-on-time' | 'paid-late' | 'unpaid' | 'na' }[];
  pattern: PeriodPattern;
}

const months = ['Junho 2025', 'Maio 2025', 'Abril 2025', 'Março 2025'];

export default function CobrancasPage({ unitFilter = 'Todas', onNavigate }: CobrancasPageProps) {
  const [reminderSent, setReminderSent] = useState(false);
  const [selectedCobranca, setSelectedCobranca] = useState<CobrancaModalData | null>(null);
  const [period, setPeriod] = useState(months[0]);

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

  // Build deterministic 3-month history per brand from current month status
  const history: HistoryRow[] = useMemo(() => filteredCobrancas.map(c => {
    let pattern: PeriodPattern = 'pago-em-dia';
    if (c.statusType === 'danger') pattern = 'inadimplente';
    else if (c.statusType === 'warning') pattern = 'pago-com-atraso';
    return {
      brand: c.brand,
      avatar: c.avatar,
      pattern,
      months: [
        { label: 'Mai/2025', status: pattern === 'inadimplente' ? 'paid-late' : 'paid-on-time' },
        { label: 'Abr/2025', status: pattern === 'inadimplente' ? 'paid-late' : 'paid-on-time' },
        { label: 'Mar/2025', status: pattern === 'inadimplente' ? 'paid-on-time' : 'paid-on-time' },
      ],
    };
  }), [filteredCobrancas]);

  const patternLabel = (p: PeriodPattern) =>
    p === 'pago-em-dia' ? 'Sempre em dia' :
    p === 'pago-com-atraso' ? 'Costuma atrasar' :
    p === 'inadimplente' ? 'Inadimplência recorrente' : 'Sem histórico';

  const patternColor = (p: PeriodPattern) =>
    p === 'pago-em-dia' ? 'var(--success)' :
    p === 'pago-com-atraso' ? 'var(--warning)' :
    p === 'inadimplente' ? 'var(--danger)' : 'var(--text-tertiary)';

  return (
    <div className="content-max space-y-6">
      {/* Period nav */}
      <div className="filter-bar justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const i = months.indexOf(period);
              if (i < months.length - 1) setPeriod(months[i + 1]);
            }}
            disabled={period === months[months.length - 1]}
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
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
          <button
            onClick={() => {
              const i = months.indexOf(period);
              if (i > 0) setPeriod(months[i - 1]);
            }}
            disabled={period === months[0]}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border border-[--border] text-[--text-secondary] hover:bg-[--bg-primary] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--bg-content-solid)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <p className="font-caption text-[--text-tertiary]">
          {filteredCobrancas.length} mensalidades · {period}
        </p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid-3">
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
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Mensalidades — {period}</h3>
          <button
            onClick={() => setReminderSent(true)}
            className="px-4 py-2 rounded-lg font-label text-[12px] text-[--text-secondary] cursor-pointer border border-[--border] transition-colors hover:bg-[--bg-primary]"
            style={{ background: 'var(--bg-content-solid)' }}
          >
            Reenviar lembretes (massa)
          </button>
        </div>
        <div className="table-scroll">
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
              <tr
                key={c.brand}
                className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCobranca(c)}
              >
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: c.avatar.color }}>{c.avatar.letters}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-subheading text-[14px]">{c.brand}</span>
                      {c.comprovante && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(13,148,136,0.12)', color: '#0D9488' }} title="Comprovante recebido">
                          Comprovante
                        </span>
                      )}
                    </div>
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
      </div>

      {/* 3-month payment history */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-subheading text-[16px] text-[--text-primary]">Histórico de pagamentos — últimos 3 meses</h3>
            <p className="font-caption text-[--text-tertiary] mt-1">Padrão de cada loja parceira</p>
          </div>
        </div>
        <div className="space-y-1">
          {history.map(h => (
            <div key={h.brand} className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-[--bg-primary]/50 transition-colors">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: h.avatar.color }}>{h.avatar.letters}</span>
              <span className="font-subheading text-[14px] w-32 shrink-0">{h.brand}</span>
              <div className="flex items-center gap-1.5">
                {h.months.map(m => {
                  const fill =
                    m.status === 'paid-on-time' ? 'var(--success)' :
                    m.status === 'paid-late' ? 'var(--warning)' :
                    m.status === 'unpaid' ? 'var(--danger)' : 'var(--bg-primary)';
                  return (
                    <span key={m.label} className="flex flex-col items-center gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ background: fill }} />
                      <span className="font-caption text-[10px] text-[--text-tertiary]">{m.label.split('/')[0]}</span>
                    </span>
                  );
                })}
              </div>
              <span className="ml-auto font-label text-[12px]" style={{ color: patternColor(h.pattern) }}>
                {patternLabel(h.pattern)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <CobrancaModal data={selectedCobranca} onClose={() => setSelectedCobranca(null)} onNavigate={onNavigate} />
    </div>
  );
}
