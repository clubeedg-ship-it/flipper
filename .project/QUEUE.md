# QUEUE

## Phase 1 — QA Audit

| id | lane | title | status | deps | next_action |
|---|---|---|---|---|---|
| Q1.1 | qa | Playwright walkthrough of all 5 acts | todo | — | spawn agent with docs/qa-plan.md → docs/qa-report.md |
| Q1.2 | qa | Console error check | done | Q1.1 | — |
| Q1.3 | qa | Mobile viewport (375px) sanity check | todo | Q1.1 | — |

## Phase 2 — Visual Polish

| id | lane | title | status | deps | next_action |
|---|---|---|---|---|---|
| P2.1 | frontend | Act transition animations (fade+slide per spec §1) | verified | — | scroll-snap provides clean transitions; SectionTransition handles per-element fade-in |
| P2.2 | frontend | Keyboard navigation (↑↓ between acts) | done | — | added global keydown listener in App.tsx |
| P2.3 | frontend | Progress dot pulse verification | done | — | verified: 10px active (pulse 2s), 8px inactive |
| P2.4 | frontend | Glassmorphism consistency audit | done | — | all glass elements consistent (.glass class) |
| P2.5 | frontend | Animation timing audit (stagger, count-up, float) | done | — | all timings match spec: 60ms stagger, 800ms count-up, 3-5s float |
| P2.6 | frontend | Mobile responsive pass | done | — | toolbar/dots hidden on mobile, badge repositioned |
| P2.7 | frontend | "Product demo" feel improvement (not splash page) | done | client feedback | app toolbar with nav tabs for Acts 2-4 |

## Phase 3 — Ship

| id | lane | title | status | deps | next_action |
|---|---|---|---|---|---|
| S3.1 | git | Commit all source files | todo | P2.* | git add + git commit |
| S3.2 | git | Push to origin/main | todo | S3.1 | git push origin main |
| S3.3 | git | Tag v1.0.0 | todo | S3.2 | git tag v1.0.0 && git push --tags |
| S3.4 | build | Production build test (npm run build) | done | — | verified: clean build, 378KB JS gzipped 114KB |
