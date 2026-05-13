# STATE

repo: clubeedg-ship-it/flipper
branch: main
phase: visual-polish — Phase 2 in progress
url: https://flipper.abbamarkt.nl

runtime:
  dev: npm run dev → localhost:3005 (Vite, host: 0.0.0.0)
  tunnel: Cloudflare → 192.168.0.222:3005

completed:
  - P0: Data layer (brands, metrics, sales) ✓
  - P1: UI primitives (GlassCard, MetricCard, Badge, CountUp, SectionTransition, useInView) ✓
  - P2: App shell (loader, progress dots, IntersectionObserver, logo, context badge) ✓
  - P3: Act 1 Hero (chaos grid, floating cards, chevron) ✓
  - P4: Act 2 Dashboard (metrics, brand table, drawer, checklist sandbox) ✓
  - P5: Act 3 Brand Portal (Amira perspective, filterable sales, repasse, NF-e) ✓
  - P6: Act 4 BlockChain (cascade, dual view, modals, state machine) ✓
  - P7: Act 5 Closing (headline, roadmap, WhatsApp CTA) ✓
  - Fix: Tailwind padding (removed unlayered `* { padding: 0 }` conflicting with Tailwind 4 @layer) ✓
  - Fix: Build errors (JSX namespace, unused params, useRef types) ✓
  - Fix: Vite host + allowedHosts for Cloudflare Tunnel ✓
  - Cleanup: removed dead lucide-react dep, unused imports, gitignored .playwright-mcp/ ✓
  - P2.7: Product demo feel — app toolbar with nav tabs for Acts 2-4 ✓
  - P2.2: Keyboard navigation (↑↓ arrows between acts) ✓
  - P2.3: Progress dot pulse verified (10px active, 8px inactive, 2s opacity pulse) ✓
  - P2.4: Glassmorphism consistency audit — all glass elements use .glass class ✓
  - P2.5: Animation timing audit — all timings match spec values ✓
  - P2.6: Mobile responsive (hide toolbar + progress dots on mobile, responsive badge positioning) ✓
  - Production build clean ✓

blockers:
  - None. Demo is functional.

pending:
  - QA audit (Playwright walkthrough) — qa-plan.md written, not executed
  - Git: uncommitted Phase 2 changes — needs commit + push

truths:
  - spec (docs/demo-spec.md) is READ-ONLY — never edit
  - all copy is PT-BR, all data is hardcoded
  - no backend, no API calls, no external images
  - Tailwind 4 uses @layer utilities — unlayered CSS beats layered regardless of specificity
  - Vite config needs host: '0.0.0.0' + allowedHosts for tunnel access
  - lucide-react was installed but never used — removed
  - App toolbar appears for Acts 2-4 (desktop only), standalone logo/badge for Acts 1/5

retrieval:
  project_context: CLAUDE.md
  state: .project/STATE.md
  queue: .project/QUEUE.md
  spec: docs/demo-spec.md (READ-ONLY)
  qa_plan: docs/qa-plan.md
