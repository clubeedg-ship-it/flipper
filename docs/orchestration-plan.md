# Orchestration Plan — Flipper MVP to Client-Ready

> Created: 2026-05-13 20:33 UTC
> Target: Bold, professional, fully-working interactive demo at flipper.abbamarkt.nl
> Strategy: 3-agent pipeline sequenced by dependency, monitored by Rook

---

## Phase Map

```
Phase 0: QA AUDIT         ← flipper-qa agent (queued, waiting for rate limit)
    ↓ qa-report.md
Phase 1: BUG FIX          ← agent reads qa-report.md, fixes issues
    ↓ all fixes applied, tsc clean
Phase 2: POLISH PASS      ← agent adds missing spec features + visual refinements
    ↓ transitions, keyboard, animations, mobile
Phase 3: FINAL QA         ← agent re-runs full QA → final-report.md
    ↓ all green
Phase 4: SHIP             ← git commit, push, tag
```

---

## Phase 0 — QA Audit (IN PROGRESS)

**Agent**: `flipper-qa` (tmux, Opus 4.6 1M, medium effort)
**Input**: `docs/qa-plan.md` + `docs/demo-spec.md`
**Output**: `docs/qa-report.md`
**Status**: Queued — rate-limited, should auto-resume at 8:40pm UTC

**Monitoring**:
```bash
# Check if agent is making progress
tmux capture-pane -t flipper-qa -p -S -5
# Check if report file appeared
ls -la docs/qa-report.md
# Check process state
ps aux | grep "claude" | grep -v grep | wc -l
```

---

## Phase 1 — Bug Fix (triggered after qa-report.md exists)

**Agent**: New `flipper-fix` tmux session, Opus 4.6 1M, medium effort
**Input**: `docs/qa-report.md` — fix every FAIL item
**Rules**:
- Fix ONLY issues documented in qa-report.md
- Do NOT change design spec compliance
- `npx tsc --noEmit` gate after every file edit
- Do NOT introduce new features — pure bug fixing

**Expected scope**: Layout fixes, color corrections, broken interactions, missing data, broken animations

**Gate**: `npx tsc --noEmit` clean + dev server runs + browser reload shows fixes

---

## Phase 2 — Polish Pass (triggered after Phase 1 gates pass)

**Agent**: New `flipper-polish` tmux session, Opus 4.6 1M, medium effort
**Input**: `docs/demo-spec.md` + current source
**Deliverables**:

### P2.1 — Act Transition Animations (spec §1, "Navegação")
Currently: raw CSS scroll-snap with no transition.
Spec calls for: "fade-out do ato atual (200ms) + fade-in do próximo (300ms) com leve slide vertical de 30px"
- Cannot use Framer Motion for scroll-snap transitions (they're incompatible)
- Approach: CSS `scroll-snap-type` stays, add JavaScript scroll event listener that applies exit/enter classes, OR use `AnimatePresence` with a custom scroll manager
- Best approach for snap: keep snap, but add a JS observer that detects when an act is about to leave viewport and applies exit animation, and when new act enters, applies entrance animation
- Simpler fallback: use `view-timeline` CSS or `animation-timeline: view()` for scroll-driven animations at act boundaries

### P2.2 — Keyboard Navigation (spec §1)
Add global keydown listener in App.tsx:
- ↑ / ArrowUp: scroll to previous act (or wrap to last)
- ↓ / ArrowDown: scroll to next act (or wrap to first)
- Smooth scroll with snap

### P2.3 — Progress Dot Polish
- Verify `pulse-dot` animation is applied to active dot (CSS class exists in globals.css)
- Active dot should scale from 8px→10px
- Transition between act dots should be smooth (300ms)

### P2.4 — Glassmorphism Consistency
- All glass cards: verify `backdrop-filter: blur(16px)`, border, shadow
- Safari: verify `-webkit-backdrop-filter` is present (already in globals.css)
- Background behind glass cards should have enough visual texture to show the blur effect

### P2.5 — Animation Timing Audit
- Stagger delays: spec says 60ms for list items, 80ms for cards — verify consistency
- Count-up duration: spec says 800ms — verify
- Float animations: cards in chaos grid should each have unique timing (3-5s range)

### P2.6 — Mobile Responsive (minimum)
- Viewport at 375px width: all acts should be readable
- No horizontal overflow
- Drawer should go full-width on small screens (already `max-w-[90vw]`)
- Metric cards should stack vertically
- Font sizes should scale down
- Glass cards should maintain blur

### P2.7 — Edge Cases
- Very tall viewport (4K): acts shouldn't have excessive whitespace
- Very short viewport (<600px): content shouldn't clip
- Font loading: DM Sans, Inter, JetBrains Mono load via `display: swap` (already in index.html)
- Browser back button: should work
- Page refresh: should return to top

**Gate**: `npx tsc --noEmit` + dev server + browser walkthrough (all 5 acts, keyboard nav, mobile)

---

## Phase 3 — Final QA

**Agent**: New `flipper-final-qa` tmux session, Opus 4.6 1M, high effort
**Input**: Everything
**Output**: `docs/final-qa-report.md`

Re-run the full QA plan. Every check must be ✅. Any ❌ goes back to Phase 1.

**Additional checks**:
- Lighthouse: performance > 90, accessibility > 90
- No console errors (strict)
- All copy PT-BR verified against spec
- All numeric data verified against spec
- No unused code, no dead imports
- `npx tsc --noEmit` clean
- `npm run build` succeeds (production build test)

---

## Phase 4 — Ship

1. `git add -A` (after verifying no .playwright-mcp/ leaks)
2. `git commit -m "feat: complete Flipper interactive demo for Pinga Store"` with full body
3. `git push origin main`
4. Tag: `v1.0.0`
5. Verify production build: `npm run build && npm run preview`

---

## Monitoring Commands (run from this session)

```bash
# Quick status check
tmux list-sessions
ps aux | grep claude | grep -v grep | awk '{print $2, $8, $NF}'
ss -tlnp | grep 3005

# Check agent progress
tmux capture-pane -t flipper-qa -p -S -10   # QA agent
tmux capture-pane -t flipper-fix -p -S -10   # future fix agent
tmux capture-pane -t flipper-polish -p -S -10 # future polish agent

# File watchers
ls -lt docs/qa-report.md 2>/dev/null   # QA output
ls -lt src/**/*.tsx                     # latest source changes
npx tsc --noEmit                        # type gate
```

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Anthropic rate limits stall agents | High | Phases are sequential — each agent runs independently; I can execute any phase manually if needed |
| QA finds many bugs | Medium | Fix agent scoped to qa-report.md only; severe bugs get priority |
| Phase 2 animations break scroll-snap | Medium | Keep act transitions simple — CSS-only where possible; keyboard nav is JS-only |
| Mobile pass is too ambitious | Medium | Desktop-first spec — mobile just needs to not break, not look perfect |
| Agent produces spaghetti | Low | `tsc --noEmit` gate between every file edit; sequential phases prevent conflicts |
| Git conflicts | Very low | Only one agent editing at a time; phases are sequential |

---

## Success Criteria

After Phase 4, a first-time visitor to `flipper.abbamarkt.nl`:
1. Sees smooth loader → Hero (Act 1) 
2. Scrolling snaps naturally between acts
3. Can click dots or use keyboard to navigate
4. Every card, button, drawer responds to interaction
5. All data matches the spec
6. Zero console errors
7. Typography, colors, glassmorphism are consistent
8. The WhatsApp CTA works
9. It feels like a professional product demo, not a student project
