# QA Audit — Flipper Demo Visual & UX Report

> Target: `https://flipper.abbamarkt.nl`
> Spec: `docs/demo-spec.md` (12-section design document)
> Method: Playwright MCP — full interactive walkthrough with screenshots
> Output: Markdown report at `~/flipper/docs/qa-report.md`

## Your Job

You are a QA auditor. Open the Flipper demo in the browser using Playwright MCP and systematically verify every section. Your ONLY goal is to document what's working and what's not. DO NOT fix anything — just report.

## Pre-Flight

1. `cd ~/flipper` — confirm you're in the right repo
2. Read `docs/demo-spec.md` — you need to know what the design calls for
3. `browser_navigate → https://flipper.abbamarkt.nl`
4. Wait for full page load (HMR settled, fonts loaded, React hydrated)
5. `browser_screenshot → initial_view.png` (save for report)

## Audit Protocol — Per Act

For EACH act, run through this checklist:

### Act 1 — "O Problema"
- [ ] Take full-page screenshot
- [ ] Verify headline text matches spec: "Planilha, WhatsApp, e-mail. Repetir todo mês."
- [ ] Verify subline copy matches spec (Pinga, 30 marcas)
- [ ] Chaos grid: 6 glass cards visible? Correct order (spreadsheet, chat, doc-x, mail, sticky, checklist)?
- [ ] Cards have slight rotation + floating animation?
- [ ] Transition phrase "E se existisse um lugar só pra isso?" visible?
- [ ] Bouncing chevron indicator visible?
- [ ] Background gradient covers full 100vh
- [ ] Logo "flipper" fixed top-left
- [ ] Context badge "Demo · Pinga Store · Jun 2025" fixed top-right
- [ ] Scroll down → snaps to Act 2

### Act 2 — "A Visão Geral"
- [ ] Take full-page screenshot (may need multiple — it's tall)
- [ ] "PAINEL FINANCEIRO" tag visible with blue color
- [ ] Headline: "Tudo num lugar só."
- [ ] 4 metric cards in a row: Vendas brutas, Repasse marcas, Mensalidades, Margem loja
- [ ] Metric values show correct currency (NOT R$ 0 — should show R$ 34.200 etc.)
- [ ] "+12% vs mai" badge is green
- [ ] Warning on "R$ 3.200 em aberto" is amber/yellow
- [ ] Click a metric card → breakdown popover appears
- [ ] "Marcas parceiras" table: 8 rows, correct columns
- [ ] Status badges colored correctly (green/amber/red/grey)
- [ ] Click a brand row → drawer opens from right (420px)
- [ ] Drawer: brand name, description, contract, June data, history
- [ ] Drawer: ESC key closes it
- [ ] "Emitir NF-e repasse" button → spinner → checkmark animation
- [ ] Checklist card: "Fechamento · Junho 2025"
- [ ] Progress bar: correct percentage
- [ ] Expand checklist items → interactive sandbox works
- [ ] Anchor phrase visible: "Você abre, vê o que falta..."

### Act 3 — "Portal da Marca"
- [ ] Take full-page screenshot
- [ ] "Agora veja como a Amira enxerga o Flipper." transition text visible
- [ ] "Olá, Amira." heading
- [ ] 3 Amira metric cards: Minhas vendas, Meu repasse, Mensalidade
- [ ] Sales table with filter pills: Todas, SP, RJ, Últimos 7 dias
- [ ] Click each filter → table transitions smoothly (AnimatePresence)
- [ ] Filter count correct (e.g., SP shows 7 of 34)
- [ ] Repasse card: R$ 2.920, status, split, history
- [ ] NF-e card: #4587, download button → loading → "NF-e_4587_Amira_jun2025.pdf"
- [ ] Anchor phrase: "Cada marca tem o painel dela..."

### Act 4 — "Proteção Automática"
- [ ] Take full-page screenshot
- [ ] "PROTEÇÃO FINANCEIRA" tag in red
- [ ] Headline: "Suas regras, aplicadas automaticamente."
- [ ] Cascade: 4 nodes visible with connecting lines
- [ ] Nodes have colored left borders (amber → red → red → red)
- [ ] "O que cada lado vê" section: 2 cards side by side
- [ ] Left card: "Financeiro da loja" (blue badge)
- [ ] Right card: "Visão da marca" (amber badge)
- [ ] Click "Registrar pagamento manual" → modal appears
- [ ] Confirm payment → cascade resolves (all nodes turn green ✅)
- [ ] Reload page, this time click "Isentar bloqueio" → exempt state
- [ ] Modal: "Isentar bloqueio" → confirm → exempt state shows ⚠️+✅
- [ ] Anchor phrase: "Sem conversa difícil..."

### Act 5 — "Próximos Passos"
- [ ] Take full-page screenshot
- [ ] "FLIPPER" tag in blue
- [ ] Headline: "A camada financeira que faltava."
- [ ] 3 feature cards: Relatórios avançados, App da marca, Integrações
- [ ] Each card has icon + title + description
- [ ] WhatsApp CTA button: "Conversar no WhatsApp"
- [ ] Link: `https://wa.me/31634367169`
- [ ] Footer: "flipper · 2025"

## Global Audit

- [ ] Progress dots (right side): 5 dots, active one pulses, hover shows label
- [ ] Click dot → scrolls to correct act
- [ ] Logo click → scrolls to top
- [ ] Glassmorphism: all glass cards have blur + border + shadow
- [ ] Typography: DM Sans for headings, Inter for body, JetBrains Mono for values
- [ ] Colors: check spec tokens — accent #2563EB, success #16A34A, warning #F59E0B, danger #DC2626
- [ ] No hardcoded visible issues: no broken images, no overflow, no text clipping
- [ ] All copy is PT-BR (no English leakage, no lorem ipsum)
- [ ] Console: zero errors (React DevTools info message is fine)
- [ ] Mobile: if Playwright supports viewport resize, test at 375px width

## Deliverable

Write the full report to `~/flipper/docs/qa-report.md` with this structure:

```markdown
# QA Report — Flipper Demo

**Date**: YYYY-MM-DD HH:MM UTC
**URL tested**: https://flipper.abbamarkt.nl
**Spec**: docs/demo-spec.md v1.0
**Method**: Playwright MCP interactive walkthrough

## Summary
- Total acts: 5
- Checks passed: X/Y
- Blockers: N
- Warnings: N

## Per-Act Results

### Act 1 — "O Problema"
| Check | Status | Notes |
|---|---|---|
| Headline match | ✅ | |
| Chaos grid 6 cards | ✅ | |
... (every check from the checklist above)

### Act 2 — "A Visão Geral"
...

### Global Audit
...

## Screenshots
- Act 1: [path]
- Act 2: [path]
...

## Issues Found
1. **[Severity] Description** — location, expected vs actual, screenshot ref
2. ...

## Verdict
[One paragraph summary: is this client-ready? what needs attention?]
```

## Rules

- NEVER edit source files — you are QA, not dev
- Take screenshots liberally — at least 1 per act, more for interactive states
- Be precise in issue descriptions: cite the spec section, the DOM location, the expected vs actual
- If something looks "off" but works, flag it as a WARNING, not a FAIL
- Console errors are FAIL unless proven harmless
- Read the spec BEFORE testing so you know what to look for
- Report what's correct too, not just problems — the client wants to know what's done right
