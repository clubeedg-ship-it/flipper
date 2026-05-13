# QUEUE

## Phase 1 — QA Audit

| id | lane | title | status | deps | next_action |
|---|---|---|---|---|---|
| Q1.1 | qa | Playwright walkthrough of all 5 acts | todo | — | spawn agent with docs/qa-plan.md → docs/qa-report.md |
| Q1.2 | qa | Console error check | todo | Q1.1 | — |
| Q1.3 | qa | Mobile viewport (375px) sanity check | todo | Q1.1 | — |

## Phase 2 — Visual Polish

| id | lane | title | status | deps | next_action |
|---|---|---|---|---|---|
| P2.1 | frontend | Act transition animations (fade+slide per spec §1) | todo | — | JS observer + framer-motion exit/enter |
| P2.2 | frontend | Keyboard navigation (↑↓ between acts) | todo | — | global keydown listener in App.tsx |
| P2.3 | frontend | Progress dot pulse verification | todo | — | verify pulse-dot keyframe applies to active dot |
| P2.4 | frontend | Glassmorphism consistency audit | todo | — | all glass cards: blur 16px, border, shadow |
| P2.5 | frontend | Animation timing audit (stagger, count-up, float) | todo | — | verify spec values: 60/80ms stagger, 800ms count-up |
| P2.6 | frontend | Mobile responsive pass | todo | — | 375px: no overflow, cards stack, fonts scale |
| P2.7 | frontend | "Product demo" feel improvement (not splash page) | todo | client feedback | reduce hero height, surface product UI earlier |

## Phase 3 — Ship

| id | lane | title | status | deps | next_action |
|---|---|---|---|---|---|
| S3.1 | git | Commit all source files | todo | Q1.1, P2.* | git add -A && git commit |
| S3.2 | git | Push to origin/main | todo | S3.1 | git push origin main |
| S3.3 | git | Tag v1.0.0 | todo | S3.2 | git tag v1.0.0 && git push --tags |
| S3.4 | build | Production build test (npm run build) | todo | S3.1 | verify dist/ output |
