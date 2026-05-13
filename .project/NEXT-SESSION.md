# Next Session — Placeholder Pages Implementation Plan

## Context
The Flipper demo is a multi-page SaaS dashboard (React 19 + Vite 8 + Tailwind 4). Login was replaced with a setup wizard. The sidebar has two role modes: Financeiro (store) and Expositor (brand). There are 9 placeholder pages showing "Esta seção estará disponível em breve." that need to be built as premium interactive demo pages.

**Reference file**: `docs/reference-demo.html` (open with `python3 -m http.server` to compare)
**Data files**: `src/data/brands.ts`, `src/data/metrics.ts`, `src/data/sales.ts`
**Built pages to reference for patterns**: `DashboardPage.tsx`, `LojasPage.tsx`, `FechamentoPage.tsx`, `BrandHomePage.tsx`

**Known issue**: Tailwind 4's Vite plugin doesn't generate responsive utility classes (e.g. `sm:grid-cols-3`) for files in `src/pages/`. Workaround: use inline `style={{ gridTemplateColumns: "repeat(N, minmax(0, 1fr))" }}` for grids instead. Same for `bg-[--accent]` and similar arbitrary-value classes — use inline `style={{ background: '#0D9488' }}`.

---

## Financeiro Pages (5 pages)

### 1. Produtos/SKUs (`produtos`)
**What it shows**: Product catalog with SKU-to-brand mapping.
**Why it matters**: This is the core data layer — every sale links to a SKU, every SKU links to a brand. Unmapped SKUs block the closing.
**Design**:
- 4 metric cards: Produtos ativos (126), SKUs mapeados (123 / 97.6%), Sem parceira (3, danger), Atualizados hoje (18)
- Alert banner: "Bling sincronizado · última leitura hoje 14:32"
- Card: "SKUs sem loja parceira" — table with SKU, Produto, Origem, Valor travado, [Vincular] button. Interactive: clicking Vincular shows a modal to assign a brand.
- Card: "Produtos cadastrados" — table with SKU, Produto, Loja parceira (with avatar), Valor parceira, Preço venda, Status badge
- Action buttons: "+ Novo produto", "Importar CSV"
**Data needed**: New `src/data/products.ts` with ~8 products, 3 unmapped SKUs
**Interactions**: Vincular SKU modal, CSV import alert

### 2. Vendas (`vendas`)
**What it shows**: All sales imported from the POS, with split calculation per row.
**Why it matters**: This is the raw transactional data that drives everything — repasses, closing, NF-e.
**Design**:
- Sync banner: "ERP sincronizado · última leitura hoje 14:32" with OK badge
- Card: "Vendas — Junho 2025" — table with Data, Código/SKU (with brand name sub-cell), Produto, Valor cliente, Loja 50%, Repasse, Pgto previsto. Include a return row (negative values in red). Total row at bottom.
- Filters: unit selector (SP/RJ/Todas), date range
- Action buttons: "+ Lançamento manual", "Importar CSV"
**Data needed**: Expand `src/data/sales.ts` with multi-brand sales (not just Amira). ~10 rows mixing brands.
**Interactions**: Filter by unit, manual entry modal

### 3. Cobranças (`cobrancas`)
**What it shows**: Monthly billing for each brand's mensalidade.
**Why it matters**: Unpaid mensalidades trigger the protection cascade — this page is where the store tracks and chases payments.
**Design**:
- Alert banner: "Cobranças geradas automaticamente em 01/06/2025. Lembretes enviados para lojas parceiras em aberto."
- Card: "Mensalidades — Junho 2025" — table with Loja Parceira, Valor, Vencimento, Pagamento (date + method or "—"), Status badge (Pago/Pendente/Atrasado). ~4-6 rows.
- Action button: "Reenviar lembretes"
**Data needed**: Derive from `brands.ts` — mensalidade values already exist in drawer contracts
**Interactions**: Reenviar lembretes alert, click row to see payment detail

### 4. Repasses (`repasses`)
**What it shows**: Calculated payouts per brand for the month.
**Why it matters**: This is the money flow — how much each brand gets paid after the split.
**Design**:
- Alert banner (success): "Repasses de junho serão processados até 20/07/2025."
- Card: "Repasses — Junho 2025" — table with Loja parceira (avatar + name), Vendido cliente, Fica loja, Repasse, Status (Pendente/Bloqueado). Total row.
- Action button: "Enviar relatórios"
- Clickable rows: show payout detail modal (month, breakdown, payment status)
**Data needed**: Derive from brands — vendasJun * split = repasse. Already calculable.
**Interactions**: Row click → detail modal, enviar relatórios alert

### 5. NF-e (`nfe`)
**What it shows**: Invoice management — both received from brands and emitted by the store.
**Why it matters**: NF-e is a legal requirement in Brazil. The store emits NF-e for repasses; brands send NF-e for mensalidades.
**Design**:
- Two cards side by side (or stacked):
  - "NF-es recebidas das lojas parceiras" — table with Loja parceira (avatar), Referência, Valor, Recebida em, Status (Confirmada/Pendente/Bloqueado). Alert: "2 pendentes — Lua Cheia e Dona Sol"
  - "NF-es emitidas pela loja" — table with Número, Loja parceira, Tipo (Repasse/Mensalidade), Valor, Emitida em, Status. Sync note: "Emissão via Focus NF-e · XML e DANFE enviados por e-mail"
- Action button: "+ Emitir NF-e"
**Data needed**: New `src/data/nfe.ts` with ~6 NF-e records
**Interactions**: Emitir NF-e alert, download XML/DANFE simulation

---

## Expositor (Brand Portal) Pages (4 pages)

### 6. Mensalidade (`brand-mensalidade`)
**What it shows**: Brand's mensalidade payment history and current status.
**Why it matters**: The brand needs to know if they're current, and what happens if they're late.
**Design**:
- Current month card: "Mensalidade — Junho 2025" with valor (R$ 1.800), vencimento (dia 5), status (Paga em 07/06), payment method (Pix)
- Payment history table: Mês, Valor, Pago em, Método, Status — 6 months of history
- Info box: "Mensalidade em dia garante repasse e NF-e liberados."
**Data needed**: Derive from Amira's contract in brands.ts. Add payment history.
**Interactions**: Static — read-only view for the brand

### 7. Minhas vendas (`brand-vendas`)
**What it shows**: All of Amira's sales at Pinga, filterable by store and period.
**Why it matters**: This replaces the "cadê meu repasse?" WhatsApp message — the brand sees everything.
**Design**:
- Filter pills: Todas, SP, RJ, Últimos 7 dias (reuse pattern from old BrandPortal)
- Sales table: Data, Produto, SKU, Qtd, Valor, Loja — with fade animation on filter change
- Footer: "Mostrando X de Y vendas"
- Summary card: Total vendido, Itens vendidos, Ticket médio
**Data needed**: Already exists — `amiraSales` in sales.ts
**Interactions**: Filter switching with animated table transition

### 8. Repasses (`brand-repasses`)
**What it shows**: Brand's repasse history and current month status.
**Why it matters**: The brand wants to know when and how much they'll get paid.
**Design**:
- Current month card: "Repasse — Junho 2025" with calculation breakdown (Vendas R$ 5.840 → Split 50% → Repasse R$ 2.920), status (Pendente), previsão (20/07/2025)
- History table: Mês, Valor, Status, Pago em — 3-6 months
- Info box: "Repasse é calculado automaticamente sobre vendas confirmadas."
**Data needed**: Already exists — repasseHistory in BrandHomePage, contract data in brands.ts
**Interactions**: Static — read-only. Could add "Ver extrato" expandable.

### 9. Notas fiscais (`brand-nfe`)
**What it shows**: Brand's NF-e records — both received (mensalidade) and emitted (repasse).
**Why it matters**: Brands need their invoices for accounting.
**Design**:
- Card: "Notas fiscais" — table with Número, Tipo (Mensalidade/Repasse), Referência, Valor, Data, Status, [Baixar]
- Download simulation: click → loading → "NF-e_4587_Amira_jun2025.pdf" (reuse pattern from old BrandPortal)
**Data needed**: ~4 NF-e records for Amira
**Interactions**: Download button with loading animation

---

## Implementation Order (recommended)

**Batch 1 — Data layer** (~15 min)
Create `src/data/products.ts` and `src/data/nfe.ts` with hardcoded data. Expand `src/data/sales.ts` with multi-brand sales.

**Batch 2 — Financeiro pages** (~45 min)
Build in this order (each builds on data from the previous):
1. `VendasPage.tsx` — sales table with filters (most data already exists)
2. `ProdutosPage.tsx` — product catalog with SKU linking
3. `CobrancasPage.tsx` — billing table (derive from brands)
4. `RepassesPage.tsx` — payout table with detail modal
5. `NFePage.tsx` — dual-table invoice management

**Batch 3 — Brand portal pages** (~30 min)
Build in this order:
1. `BrandVendasPage.tsx` — filtered sales table (reuse amiraSales)
2. `BrandRepassesPage.tsx` — repasse history + breakdown
3. `BrandMensalidadePage.tsx` — payment history
4. `BrandNFePage.tsx` — invoice list with download

**Batch 4 — Wire up + test** (~15 min)
Update `App.tsx` renderPage switch. Type check. Screenshot-verify each page.

---

## Design Patterns to Follow

All patterns visible in `DashboardPage.tsx` and `FechamentoPage.tsx`:

- **Metric cards**: `metric-card` class, inline grid styles, CountUp for values
- **Tables**: full-width, uppercase 11px tracking headers, border-bottom rows, mono font for values
- **Badges**: `<Badge status="..." label="..." showDot />` component
- **Alert banners**: `alert-banner alert-banner-warning|success|danger` classes
- **Brand avatars**: colored circles with 2-letter initials
- **Action buttons**: `border border-[--border] rounded-lg font-label text-[12px]` for secondary, inline `style={{ background: '#0D9488' }}` for primary
- **Cards**: `card p-6` class with header row (title left, action button right)
- **Inline styles for colors**: always use `style={{ color: '#0D9488' }}` instead of `text-[--accent]` due to Tailwind 4 scanning issue
- **Grid layouts**: always use `style={{ gridTemplateColumns: "repeat(N, ...)" }}` instead of `grid-cols-N`

---

## Files to Create

```
src/data/products.ts      — product catalog data
src/data/nfe.ts           — invoice records data
src/pages/ProdutosPage.tsx
src/pages/VendasPage.tsx
src/pages/CobrancasPage.tsx
src/pages/RepassesPage.tsx
src/pages/NFePage.tsx
src/pages/BrandVendasPage.tsx
src/pages/BrandRepassesPage.tsx
src/pages/BrandMensalidadePage.tsx
src/pages/BrandNFePage.tsx
```

## Files to Modify

```
src/App.tsx               — add imports + renderPage cases for all 9 new pages
src/data/sales.ts         — expand with multi-brand sales data
```
