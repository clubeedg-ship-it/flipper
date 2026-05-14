import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, unmappedSkus } from '../data/products';
import CountUp from '../components/ui/CountUp';
import Badge from '../components/ui/Badge';

export default function ProdutosPage() {
  const [linkedSkus, setLinkedSkus] = useState<string[]>([]);
  const [modalSku, setModalSku] = useState<string | null>(null);
  const [csvImported, setCsvImported] = useState(false);
  const [productAdded, setProductAdded] = useState(false);

  const unmappedCount = unmappedSkus.filter(s => !linkedSkus.includes(s.sku)).length;

  return (
    <div className="content-max space-y-6">
      {/* Metrics */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {[
          { label: 'PRODUTOS ATIVOS', value: 126, sub: 'No catálogo' },
          { label: 'SKUS MAPEADOS', value: 123, sub: `${((123 / 126) * 100).toFixed(1)}% do total` },
          { label: 'SEM PARCEIRA', value: unmappedCount, sub: unmappedCount > 0 ? 'Requer vínculo' : 'Todos vinculados', danger: unmappedCount > 0 },
          { label: 'ATUALIZADOS HOJE', value: 18, sub: 'Última leitura 14:32' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="metric-card"
          >
            <p className="font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] mb-3">{m.label}</p>
            <CountUp end={m.value} start className={`text-[28px] font-bold ${m.danger ? 'text-[--danger]' : 'text-[--text-primary]'}`} formatOptions={{ useGrouping: true }} />
            <p className="font-caption text-[--text-tertiary] mt-1.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Sync banner */}
      <div className="alert-banner alert-banner-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>ERP sincronizado · última leitura hoje 14:32</span>
      </div>

      {csvImported && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>CSV importado com sucesso — 12 produtos atualizados.</span>
        </div>
      )}

      {productAdded && (
        <div className="alert-banner alert-banner-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Produto cadastrado com sucesso.</span>
        </div>
      )}

      {/* Unmapped SKUs */}
      {unmappedCount > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-subheading text-[16px] text-[--text-primary]">SKUs sem loja parceira</h3>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[--danger]">
              <span className="w-2 h-2 rounded-full bg-[--danger]" />
              {unmappedCount} pendentes
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[--border]">
                {['SKU', 'PRODUTO', 'ORIGEM', 'VALOR TRAVADO', ''].map(h => (
                  <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {unmappedSkus.filter(s => !linkedSkus.includes(s.sku)).map(s => (
                <tr key={s.sku} className="border-b border-[--border] last:border-b-0">
                  <td className="py-3.5 pr-4 font-mono text-[13px]">{s.sku}</td>
                  <td className="py-3.5 pr-4 font-body text-[14px] text-[--text-primary]">{s.name}</td>
                  <td className="py-3.5 pr-4"><Badge status="neutral" label={s.origin} showDot={false} /></td>
                  <td className="py-3.5 pr-4 font-mono text-[14px] text-[--danger]">R$ {s.lockedValue.toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setModalSku(s.sku)}
                      className="px-4 py-1.5 rounded-lg font-label text-[12px] text-white cursor-pointer border-none transition-colors"
                      style={{ background: '#0D9488' }}
                    >
                      Vincular
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-subheading text-[16px] text-[--text-primary]">Produtos cadastrados</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setProductAdded(true)}
              className="px-4 py-2 border border-[--border] rounded-lg font-label text-[12px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]"
            >
              + Novo produto
            </button>
            <button
              onClick={() => setCsvImported(true)}
              className="px-4 py-2 border border-[--border] rounded-lg font-label text-[12px] text-[--text-primary] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]"
            >
              Importar CSV
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {['SKU', 'PRODUTO', 'LOJA PARCEIRA', 'VALOR PARCEIRA', 'PREÇO VENDA', 'STATUS'].map(h => (
                <th key={h} className="text-left font-label text-[11px] text-[--text-tertiary] uppercase tracking-[1px] py-3 pr-4 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.sku} className="border-b border-[--border] last:border-b-0 hover:bg-[--bg-primary]/50 transition-colors">
                <td className="py-3.5 pr-4 font-mono text-[13px]">{p.sku}</td>
                <td className="py-3.5 pr-4 font-body text-[14px] text-[--text-primary]">{p.name}</td>
                <td className="py-3.5 pr-4">
                  {p.brand && p.brandAvatar ? (
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: p.brandAvatar.color }}>{p.brandAvatar.letters}</span>
                      <span className="font-body text-[13px]">{p.brand}</span>
                    </div>
                  ) : (
                    <span className="text-[--text-tertiary]">—</span>
                  )}
                </td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {p.partnerValue.toLocaleString('pt-BR')}</td>
                <td className="py-3.5 pr-4 font-mono text-[14px]">R$ {p.salePrice.toLocaleString('pt-BR')}</td>
                <td className="py-3.5"><Badge status={p.status} label={p.status === 'success' ? 'Ativo' : 'Pendente'} showDot /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Link modal */}
      <AnimatePresence>
        {modalSku && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setModalSku(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-heading text-[18px] text-[--text-primary] mb-2">Vincular SKU</h3>
              <p className="font-caption text-[--text-tertiary] mb-6">
                Selecione a loja parceira para <span className="font-mono text-[13px] text-[--text-primary]">{modalSku}</span>
              </p>
              <div className="space-y-2 mb-6">
                {['Amira', 'Lua Cheia', 'Mar e Rio', 'Casa Bruta', 'Brisa'].map(b => (
                  <button
                    key={b}
                    onClick={() => { setLinkedSkus(prev => [...prev, modalSku]); setModalSku(null); }}
                    className="w-full text-left px-4 py-3 rounded-lg border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content] font-body text-[14px] text-[--text-primary]"
                  >
                    {b}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setModalSku(null)}
                className="w-full px-4 py-2 rounded-lg font-label text-[13px] text-[--text-secondary] border border-[--border] hover:bg-[--bg-primary] transition-colors cursor-pointer bg-[--bg-content]"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
