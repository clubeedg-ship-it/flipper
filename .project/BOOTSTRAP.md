# Session Bootstrap — Flipper Demo

## What you're building
Interactive SaaS dashboard demo for Flipper (consignment financial management for multi-brand retail stores). React 19 + Vite 8 + Tailwind 4. No backend — all data hardcoded. Live at https://flipper.abbamarkt.nl.

## Where we are
The app shell is complete: setup wizard → sidebar dashboard with 6 working pages + 9 placeholder pages. Your job is to build those 9 pages.

## Read these files in order
1. `.project/NEXT-SESSION.md` — full implementation plan with design, data, interactions for each page
2. `.project/STATE.md` — current state, blockers, truths
3. `.project/QUEUE.md` — task queue with batches

## Critical gotcha
Tailwind 4's Vite plugin doesn't generate utility classes for files in `src/pages/`. **Do not use** `grid-cols-N`, `bg-[--accent]`, `text-[--accent]`, or any arbitrary-value Tailwind classes. Use inline styles instead:
```tsx
// BAD — won't render
className="grid grid-cols-4 gap-5"
className="bg-[--accent] text-white"

// GOOD — always works
className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
className="text-white" style={{ background: '#0D9488' }}
```

## Design system quick ref
- Accent: `#0D9488` (teal), hover: `#0F766E`
- Background: `var(--bg-primary)` = `#FAF9F7`, cards: `var(--bg-content)` = `#FFFFFF`
- Card: `className="card p-6"` (class defined in globals.css)
- Metric: `className="metric-card"` with inline grid
- Alert: `className="alert-banner alert-banner-warning|success|danger"`
- Badge: `<Badge status="success|warning|danger|neutral" label="..." showDot />`
- Brand avatar: colored circle with 2-letter initials, e.g. `{ letters: 'AM', color: '#0D9488' }`
- Table headers: `font-label text-[11px] uppercase tracking-[1px]` + `style={{ color: 'var(--text-tertiary)' }}`
- Mono values: `className="font-mono text-[14px]"`

## Existing pages to copy patterns from
- `src/pages/DashboardPage.tsx` — metrics, alert banners, action queue, brand table
- `src/pages/FechamentoPage.tsx` — metrics row, checklist cards, closing table with action buttons
- `src/pages/LojasPage.tsx` — filter pills, full brand table with avatars
- `src/pages/BrandHomePage.tsx` — success banner, metrics, resumo breakdown, sales list

## Execution plan
1. Create data files: `src/data/products.ts`, `src/data/nfe.ts`, expand `src/data/sales.ts`
2. Build 5 financeiro pages: Vendas → Produtos → Cobranças → Repasses → NF-e
3. Build 4 brand portal pages: BrandVendas → BrandRepasses → BrandMensalidade → BrandNFe
4. Wire all into `src/App.tsx` renderPage switch
5. `npx tsc -b` + `npm run build` + screenshot-verify each page
6. Commit + push

## Language
All UI copy in PT-BR. No emojis — monochrome SVG icons only.

## Don't
- Edit `docs/demo-spec.md` (legacy, READ-ONLY)
- Add npm dependencies
- Use `@ts-ignore` or `as any`
- Use Tailwind arbitrary-value classes in page files (see gotcha above)
