# STATE

repo: clubeedg-ship-it/flipper
branch: main
phase: placeholder-pages — 9 pages to build
url: https://flipper.abbamarkt.nl

runtime:
  dev: npm run dev → localhost:3005 (Vite, host: 0.0.0.0)
  tunnel: Cloudflare → 192.168.0.222:3005

completed:
  - Data layer (brands, metrics, sales) ✓
  - UI primitives (Badge, CountUp, Sidebar, Login, SetupWizard) ✓
  - Rebuild: scroll narrative → SaaS dashboard with sidebar ✓
  - Login screen → replaced with setup wizard (3 steps: intro, language, perspective) ✓
  - Account popover with role switching ✓
  - DemoPage v2: sticky pill nav, inline platform components, callouts ✓
  - DashboardPage: metrics, alert banners, action queue, brand table, bottom cards ✓
  - LojasPage: brand list with filters, avatars, status badges ✓
  - FechamentoPage: metrics, checklist cards, closing table ✓
  - BrandHomePage: success banner, metrics, resumo, sales, repasse history ✓
  - Emoji removal: all replaced with monochrome SVGs ✓
  - Color scheme: teal accent, warm cream background ✓
  - Demo tools research document ✓
  - Reference demo HTML saved ✓

blockers:
  - Tailwind 4 Vite plugin doesn't generate utility classes for new files in src/pages/
    Workaround: use inline styles for grid layouts and accent colors

pending:
  - 9 placeholder pages to implement (see NEXT-SESSION.md for full plan)
  - Data files to create: products.ts, nfe.ts
  - Data files to expand: sales.ts (multi-brand)

truths:
  - All copy is PT-BR, all data is hardcoded
  - No backend, no API calls
  - Tailwind 4 arbitrary-value classes (bg-[--accent], grid-cols-N) don't work in src/pages/ — use inline styles
  - App starts with SetupWizard → Dashboard (or brand-home based on role)
  - Role switching via account popover in sidebar footer
  - Demo guide page is first sidebar item with star icon

retrieval:
  project_context: CLAUDE.md
  state: .project/STATE.md
  queue: .project/QUEUE.md
  next_session: .project/NEXT-SESSION.md
  reference: docs/reference-demo.html
  research: docs/demo-tools-research.md
