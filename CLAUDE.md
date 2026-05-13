# CLAUDE.md — Flipper Interactive Demo

## What this is
Interactive narrative web demo presenting Flipper's consignment financial management features. 5-act scroll-snap experience built for Pinga Store (São Paulo multi-brand retail gallery). Desktop-first, hardcoded data, designed for video-call presentation and link sharing. No backend.

## Stack
- React 19 + TypeScript + Vite 8
- Tailwind CSS 4 + `@tailwindcss/vite`
- Framer Motion 12 (animations)
- Inline SVGs (no icon library — lucide was removed)
- Google Fonts: DM Sans (headings), Inter (body), JetBrains Mono (values)

## URLs
- Dev: `http://localhost:3005` / `https://flipper.abbamarkt.nl` (Cloudflare Tunnel → 192.168.0.222:3005)
- Repo: `github.com/clubeedg-ship-it/flipper.git`

## Architecture

### Narrative structure
5-act scroll-snap narrative with hybrid snap + free scroll:
- **Act 1** (100vh snap): Hero + problem statement + chaos grid
- **Act 2** (auto height, snap top): Dashboard — metrics, brand table, drawer, checklist sandbox
- **Act 3** (auto height, snap top): Brand portal — Amira perspective, sales table, repasse/NF-e
- **Act 4** (auto height, snap top): Protection cascade — Dona Sol blocked → resolved/exempt dual view
- **Act 5** (100vh snap): CTA + roadmap + WhatsApp link

### Key decisions
- **Vite, not Next.js**: Static SPA, no SSR needed. Spec recommended Next.js but agent chose Vite.
- **Tailwind 4 with Vite plugin**: No tailwind.config.js — config is CSS-based via `@import "tailwindcss"`.
- **Hardcoded data**: Everything in `src/data/` — no API calls, no backend.
- **Interactive sandbox**: All clickable elements resolve to hardcoded states. No broken flows.
- **No `* { padding: 0 }` reset**: Tailwind 4 preflight handles reset inside `@layer base`. An unlayered `*` reset in globals.css would nuke ALL spacing utilities.

### CSS layer discipline
DO NOT add unlayered CSS rules that override Tailwind utilities. Tailwind 4 wraps utilities in `@layer utilities` — per CSS cascade, unlayered rules ALWAYS beat layered rules regardless of specificity. If you need a global reset, use `@layer base { ... }`.

### Source map
| File | Purpose |
|---|---|
| `src/App.tsx` | Root — loader, progress dots, IntersectionObserver, all 5 acts |
| `src/main.tsx` | React entry |
| `src/styles/globals.css` | Design tokens, font classes, glass utility, keyframes, Tailwind import |
| `src/data/brands.ts` | 8 brands + drawer data (contract, history, June numbers) |
| `src/data/metrics.ts` | Dashboard metrics, checklist, Amira metrics, roadmap features |
| `src/data/sales.ts` | Amira sales table, pending SKUs, pending mensalidades |
| `src/hooks/useInView.ts` | IntersectionObserver hook with optional once/continuous mode |
| `src/components/ui/GlassCard.tsx` | Reusable glassmorphism card (whileInView, hover lift) |
| `src/components/ui/MetricCard.tsx` | Metric card with CountUp + dropdown breakdown popover |
| `src/components/ui/Badge.tsx` | Status badge (success/warning/danger/neutral) |
| `src/components/ui/CountUp.tsx` | Custom rAF count-up animation with easeOut cubic |
| `src/components/ui/SectionTransition.tsx` | Scroll-triggered fade-in wrapper |
| `src/components/Hero.tsx` | Act 1 — chaos grid with floating glass cards |
| `src/components/Dashboard.tsx` | Act 2 — metrics, brand table, drawer, checklist sandbox |
| `src/components/BrandPortal.tsx` | Act 3 — Amira portal, filterable sales, repasse, NF-e |
| `src/components/BlockChain.tsx` | Act 4 — cascade, dual view, modals, state machine |
| `src/components/Closing.tsx` | Act 5 — headline, roadmap, WhatsApp CTA |
| `docs/demo-spec.md` | Complete 12-section UX/UI spec (READ-ONLY) |
| `docs/qa-plan.md` | QA audit plan — per-act checklist |
| `docs/tailwind-fix.md` | Root cause doc for padding bug |
| `docs/orchestration-plan.md` | Multi-agent pipeline plan |

## CLI quick reference

```bash
# Dev
cd ~/flipper && npm run dev    # → localhost:3005

# Type check (BUILD mode — stricter than --noEmit)
npx tsc -b

# Build
npm run build

# Check what's running
ss -tlnp | grep 3005
```

## Design tokens (from globals.css)

- **Accent**: #2563EB (blue) — actions, progress
- **Success**: #16A34A (green) — OK, paid
- **Warning**: #F59E0B (amber) — pending, attention
- **Danger**: #DC2626 (red) — blocked, inadimplente
- **Glass**: `background: rgba(255,255,255,0.72)`, `backdrop-filter: blur(16px)`, border + shadow
- **Fonts**: DM Sans 700 (display/headings), Inter 400/500 (body/labels), JetBrains Mono 500/700 (values)

## Vite config
```ts
server: { port: 3005, host: '0.0.0.0', allowedHosts: ['flipper.abbamarkt.nl', 'localhost'] }
```

## Spec is READ-ONLY
`docs/demo-spec.md` is the contract. Never edit it. All copy, numbers, and interactions must match the spec exactly. All text is PT-BR.

## Do not
- Add API calls, fetch, or any backend dependency
- Use external images or stock photos
- Use Lorem Ipsum anywhere
- Add dark mode
- Add `* { padding: 0; margin: 0 }` in unlayered CSS (Tailwind 4 preflight handles it)
- Edit `docs/demo-spec.md`
- Introduce new dependencies without strong justification
- Use `@ts-ignore` or `as any` type escapes

>>> EXTREMELY IMPORTANT <<<

NO HACKS. If you hit a wall, fix the underlying issue properly or report honestly that it can't be done. Do not introduce workarounds, monkey patches, or duct tape.

Core values:
- Clean, maintainable code over speed
- Design spec compliance over creative freedom
- TypeScript correctness over convenience
- Honesty above everything
