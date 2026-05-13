# FIX-PLAN — Flipper Demo Cleanup

> Generated: 2026-05-13 20:05 UTC
> Repo: /home/adminuser/flipper
> Target: client-ready browser demo at localhost:3005

## Context

The full 5-act implementation is done. Playwright tests confirm all DOM renders, zero console errors, `tsc --noEmit` passes. This plan covers fixes needed before client delivery — nothing functional is broken, but there are cleanup items and one missing feature (scroll-snap) that prevents the intended scroll-snap experience from working.

---

## BLOCKERS — Demo won't work as intended

### B1. Scroll-snap not functional
**Problem**: All `<section>` elements have `snap-start` class but NO container has `scroll-snap-type: y mandatory`. This means all 5 acts render in a single scrolling page — the snap experience doesn't work.
**Fix**: Add scroll-snap CSS to the scroll container. Options:
- Add to `globals.css`: `html { scroll-snap-type: y mandatory; }` 
- Or wrap `<main>` in App.tsx with a scroll-snap container div
- Also need `overflow-y: auto` and `height: 100vh` on the snap container

**⚠️ Critical**: After fixing scroll-snap, verify that the `useInView` hooks still fire correctly. The IntersectionObserver is used in multiple components (App.tsx progress dots, Dashboard metrics, BrandPortal section). With scroll-snap, the root is the viewport by default — should work, but verify.

### B2. CountUp renders "R$ 0" before animation fires  
**Problem**: `MetricCard` shows "R$ 0" briefly before the count-up animation starts (visible in Playwright snapshots). The CountUp component sets `current=0` when `start=false` (inView not yet true).
**Fix**: Instead of showing 0, show the formatted value immediately when start is false, OR don't render CountUp until start becomes true (show formatted string as initial value, then swap to CountUp when inView triggers).

---

## CLEAN CODE — Remove cruft before client sees it

### C1. Unused import: `CountUp` in Dashboard.tsx
**File**: `src/components/Dashboard.tsx`, line 9
**Problem**: `import CountUp from './ui/CountUp';` — CountUp is NEVER rendered in Dashboard.tsx (metrics use MetricCard which uses CountUp internally; checklist uses NumberFormat via toLocaleString).
**Fix**: Delete the import line.

### C2. Dead dependency: `lucide-react`
**Problem**: `lucide-react@^1.14.0` in `package.json` and `node_modules` — never imported in any component. All icons are inline SVGs. This is ~200KB of unused deps.
**Fix**: Remove from package.json and reinstall (`npm uninstall lucide-react`). Spec recommended Lucide but agent chose inline SVGs — both approaches are fine; inline SVGs are actually lighter since there's no icon library to bundle.

### C3. `.playwright-mcp/` not gitignored
**Problem**: Test artifacts (console logs, screenshots, YML snapshots) in `.playwright-mcp/` — these should never be committed.
**Fix**: Add `.playwright-mcp/` to `.gitignore`.

### C4. setTimeout without cleanup (×5)
**Files**: `Dashboard.tsx` (lines with `setTimeout(..., 400/500/300)`) ×4, `BrandPortal.tsx` (line with `setTimeout(..., 500)`) ×1
**Problem**: Multiple `setTimeout` calls inside event handlers without tracking the timer IDs. If the component unmounts before the timeout fires, state updates on unmounted components are possible (React 18+ suppresses warnings but it's not clean).
**Fix**: Either (a) store timer refs and clear in useEffect cleanup, or (b) accept this is benign since these are short timers (300-500ms) that fire during user interactions (SKU linking, NF-e emit, download simulation). **Recommendation**: option (b) — the timers are all <500ms and fire during active user interaction; adding cleanup refs adds complexity without practical benefit. Just document the reasoning.

### C5. `as string` cast in Hero.tsx
**File**: `src/components/Hero.tsx`
**Problem**: CSS custom properties require type assertion: `['--float-y' as string]`. This is a TypeScript limitation with CSS custom properties, not a real issue.
**Fix**: None needed. Document that this is standard practice for dynamic CSS custom properties in React/TypeScript.

---

## VERIFICATION CHECKLIST

After fixes, verify:
- [ ] `tsc --noEmit` passes (zero errors)
- [ ] `npm run dev` starts without errors on port 3005 (or kills whatever occupies it first)
- [ ] Browser: scroll-snap works — scrolling snaps between acts
- [ ] Browser: progress dots update as acts snap into view
- [ ] Browser: count-up animations fire when act scrolls into view
- [ ] Browser: Act 2 brand table → click row → drawer opens
- [ ] Browser: Act 2 checklist → expand items → SKU linking / cobrança works
- [ ] Browser: Act 3 filters work (Todas/SP/RJ/Últimos 7 dias) with smooth table transition
- [ ] Browser: Act 4 cascade → click "Registrar pagamento" → cascade resolves
- [ ] Browser: Act 4 → click "Isentar bloqueio" → exempt state works
- [ ] Browser: Act 5 WhatsApp CTA button links to `https://wa.me/31634367169`
- [ ] Browser: zero console errors (ignoring React DevTools info message)
- [ ] Browser: all text is PT-BR, no lorem ipsum, no placeholder copy
- [ ] git: commit all fixes with descriptive message
```

## EXECUTION ORDER

1. Fix B1 (scroll-snap) — this changes page layout, do first
2. Fix B2 (CountUp initial value) — visual improvement
3. Fix C1 (unused import)
4. Fix C2 (dead dep)
5. Fix C3 (gitignore)
6. Verify C4 (setTimeout — document, don't fix unless practical)
7. Verify C5 (as string — document, don't fix)
8. Run verification checklist
9. `npx tsc --noEmit` (gate)
10. Start dev server, do browser verification
