# Flipper V3 Gap Analysis

Reference file: `docs/flipper-v3-reference.html` (downloaded 2026-05-14)
Current parity: ~40%

## What V3 Has That We Don't

### Tier 1 — High Impact, Feasible for Demo

1. **Pix QR code + Boleto on Mensalidade** — Partner can generate Pix QR or Boleto to pay mensalidade. Auto-confirm on receipt.
2. **SKU reconciliation modal** — When linking unmapped SKUs, show origin (Bling/PDV), auto-recalculate blocked sales, confirm with audit log.
3. **Repayment composition detail** — Click repasse row → breakdown: eligible sales count, returns, blocks, extract download.
4. **Brand profile expansion** — Full metrics (4 cards), collapsible contract & access section, access history (last login, invite status), re-send invite.
5. **Unit filter wired to data** — SP/RJ/Todas actually filters metrics and tables (not just header label).
6. **Monthly closing checklist with step states** — Checklist where each step is ✓/✗/! with action buttons to resolve blockers.
7. **Payment method capture** — Cobranças records Pix/TED/Dinheiro/Boleto with date.
8. **Report & extract downloads** — "Baixar extrato" buttons on repasses, closing, NF-e pages.

### Tier 2 — Backend-Dependent (Simulate for Demo)

9. **Automatic billing generation** — Cobranças auto-generated on 1st of month, reminders auto-sent.
10. **ERP/Bling sync indicators** — Real sync status with last-read timestamp, item count, error handling.
11. **NF-e auto-issuance via Focus NF-e** — Month close triggers NF-e, auto-emails XML + DANFE.
12. **Partner NF-e upload workflow** — File upload with email trigger notification.
13. **Webhook auto-confirm payments** — Pix receipt triggers auto-confirmation.

### Tier 3 — New Pages/Sections

14. **Perfil da Marca as full page** — Standalone brand profile (not just drawer) with: sales metrics, repayment history, contract details, access logs, invite management.
15. **Bulk operations** — Bulk report email, bulk reminder send, bulk NF-e issuance.
16. **Audit trail** — Contract changes, payment proofs, access history per brand.

## Design Patterns Worth Adopting

- **Collapsible `<details>` sections** for secondary info (contracts, access logs)
- **Status-colored card borders** (amber for pending, not just badges)
- **Sync note component** — light box with status badge + timestamp
- **Modal state branching** — single modal shows different UI based on data state
- **Numbered task list** with mini descriptions + action buttons
- **Quick filter buttons** (horizontal pill group) over dropdowns

## V3 Color System

```
Primary green: #1A7A4A (tints: light #E8F5EE, mid #2EA865, dark #0F5233)
Warning amber: #D4860A (light #FEF3DC)
Error red: #C53030 (light #FEE8E8)
Ink scale: #111410, #3A3D38, #6B6F69, #9FA39D
Surface: #FAFAF8 / #FFFFFF
Border: #E8EAE5 / #D4D8CF
```

## V3 Typography

- DM Sans (300-600 weight) for all text
- DM Mono for codes, money, SKUs
- Metric labels: 11px uppercase, letter-spacing 0.05em

## Priority Implementation Order

For the demo, focus on Tier 1 items that make the biggest visual/interaction difference:

1. Wire unit filter to actual data (SP/RJ changes metrics + tables)
2. Repayment composition detail modal (click row → full breakdown)
3. Pix QR code simulation on brand Mensalidade
4. Report/extract download buttons (simulated file download)
5. Brand profile as standalone page (expand current drawer)
6. Payment method capture on Cobranças
7. Collapsible contract sections
8. Status-colored card borders for pending items
