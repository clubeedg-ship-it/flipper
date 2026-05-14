# Feedback — Thay (client friend) — 2026-05-14

Source: https://docs.google.com/document/d/1YHtI_c2HaAn6aM7M36dOLCmwUJDe2Y51ghKGJWY7BiI

## Part 1: Full system description (Guia 1)
Complete spec of what Flipper should be — 2 profiles, 9 financeiro screens, 5 expositor screens, blocking logic, automations, imports.

## Part 2: Page-by-page feedback

### Dashboard
- Add white background
- Vencimento: show "05/07" not "dia 5"
- Brand profile must allow ACTIONS not just info display
- Brand drawer bg should be white

### Repasses Modal (biggest feedback item)
Three-state modal on row click:
- **Pendente**: payment form (date, method Pix/TED/Dinheiro, upload comprovante, "Confirmar pagamento" green button, "Baixar extrato" secondary)
- **Pago**: read-only summary with green alert, download extrato + comprovante buttons
- **Bloqueado**: amber alert explaining inadimplência, no form
- Modal should open from BOTH: table row click AND "Registrar repasse" button in brand profile
- Prefers full-screen modal with X to close, not small overlay

### Vendas
- REMOVE SP/RJ filter pills — use only the header "Todas as unidades" dropdown
- REMOVE "+ Lançamento manual" and "Importar CSV" buttons (everything syncs from POS/ERP/ecommerce)
- Maybe add a "refresh sync" option instead
- SIMULATE unit switching to show per-unit sales
- ADD filters: by brand, by type (Venda/Devolução), by period

### Cobranças
(Referenced but no specific changes listed beyond what's in Guia 1)

### Repasses Page
- ADD KPI strip at top: total a repassar, total pago, total pendente, total bloqueado
- REMOVE total from table footer (moves to KPIs)
- KEEP row click → repasse modal
- ADD "enviar comprovante" button inside modal after confirming payment
- ADD "já pago" visual indicator in table rows with date + method visible
- ADD "Pendências anteriores" section below current month (only shows if old repasses unpaid)
- REPLACE bulk "Enviar relatórios" with per-brand action inside modal
- ADD blocked brand explanation with link: "Mensalidade em atraso · Regularizar em Cobranças"

### NF-e
- ADD "Notificar" button on pending rows (sends email reminder)
- SEPARATE "Pendente" from "Bloqueada" in alert (different problems)
- ADD NF-e number + chave de acesso on received NF-es
- ADD 3-month history on received NF-es (currently only shows current month)
- ADD 3 KPI cards at top: confirmadas, pendentes, valor em aberto
- ADD subtitles clarifying direction of each table
- ADD modal on "+ Emitir NF-e" with brand/period selection
- Make confirmed rows clickable to view/download XML+DANFE

### Fechamento
- SEPARATE current month (in progress) from previous month (closed) visually
- ADD links in checklist blockers → navigate to resolution page
- ADD "Concluir fechamento" button (disabled while blockers exist)
- UPDATE mensalidades KPI to show who's pending: "R$1.500 de R$2.800 · Lua Cheia e Marca D pendentes"
- REPLACE bulk "Emitir NF-es" with per-row emit button + secondary bulk action
- ADD specificity to pending status: "Aguardando NF-e da marca" not just "Pendente"
- ADD month navigation (arrows/selector) to view previous closings
