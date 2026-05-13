# Flipper — Demo Interativa · Spec de Design

> Versão: 1.0 · 2026-05-13
> Audiência deste documento: implementador frontend
> Stack sugerida: Next.js + Framer Motion + Tailwind CSS

---

## 1. Visão Geral

### O que é
Uma experiência narrativa web, desktop-first, que apresenta o Flipper para a Pinga Store numa sequência de 5 atos. Não é uma dashboard navegável — é uma demo interativa com dados hardcoded, projetada para ser apresentada em videochamada e compartilhada via link (deve fazer sentido mesmo sem apresentador).

### Navegação: Híbrida Snap + Scroll
- **Entre atos**: snap de viewport inteira (scroll-snap-type: y mandatory). Cada ato ocupa no mínimo 100vh.
- **Dentro de atos**: scroll livre e fluido. Atos com múltiplas seções (2, 3, 4) expandem além de 100vh.
- **Progress indicator**: barra lateral direita com 5 dots, labels aparecendo on hover. Dot ativo pulsa suavemente. Clicável para saltar entre atos.
- **Keyboard**: setas ↑↓ navegam entre atos. Scroll wheel funciona naturalmente.
- **Transição entre atos**: fade-out do ato atual (200ms) + fade-in do próximo (300ms) com leve slide vertical de 30px.

### Interatividade: Sandbox Limitado
O usuário pode clicar em qualquer elemento que pareça interativo. Tudo responde com dados hardcoded. Não há fluxos quebrados — cada clique leva a um estado visual completo. Elementos interativos têm cursor pointer e hover state sutil (lift de 2px + shadow).

---

## 2. Design Tokens

### Cores

| Token | Hex | Uso |
|---|---|---|
| `--bg-primary` | `#FAFAFA` | Background principal |
| `--bg-secondary` | `#F3F4F6` | Cards, seções alternadas |
| `--bg-glass` | `rgba(255,255,255,0.72)` | Glassmorphism cards |
| `--glass-border` | `rgba(255,255,255,0.18)` | Borda de glass cards |
| `--glass-blur` | `backdrop-filter: blur(16px)` | Blur de glass cards |
| `--text-primary` | `#111111` | Headlines, valores |
| `--text-secondary` | `#6B7280` | Labels, descrições |
| `--text-tertiary` | `#9CA3AF` | Placeholders, hints |
| `--accent` | `#2563EB` | Links, ações primárias, progresso |
| `--accent-light` | `#DBEAFE` | Badge backgrounds, hover states |
| `--success` | `#16A34A` | Status OK, valores positivos |
| `--success-light` | `#DCFCE7` | Badge success background |
| `--warning` | `#F59E0B` | Pendente, atenção |
| `--warning-light` | `#FEF3C7` | Badge warning background |
| `--danger` | `#DC2626` | Inadimplente, bloqueio, erro |
| `--danger-light` | `#FEE2E2` | Badge danger background |
| `--border` | `#E5E7EB` | Bordas de cards e divisores |
| `--gradient-hero` | `linear-gradient(135deg, #FAFAFA 0%, #EFF6FF 50%, #F3F4F6 100%)` | Background do Ato 1 |
| `--gradient-cta` | `linear-gradient(135deg, #EFF6FF 0%, #FAFAFA 100%)` | Background do Ato 5 |

### Tipografia

| Token | Família | Peso | Tamanho | Line-height | Uso |
|---|---|---|---|---|---|
| `--font-display` | DM Sans | 700 | 56px | 1.1 | Headline de ato |
| `--font-heading` | DM Sans | 700 | 32px | 1.2 | Títulos de seção |
| `--font-subheading` | DM Sans | 600 | 20px | 1.3 | Subtítulos, card headers |
| `--font-body` | Inter | 400 | 15px | 1.6 | Texto corrido |
| `--font-label` | Inter | 500 | 13px | 1.4 | Labels de campo, badges |
| `--font-caption` | Inter | 400 | 12px | 1.4 | Timestamps, hints |
| `--font-mono` | JetBrains Mono | 500 | 15px | 1.4 | Valores financeiros (R$) |
| `--font-mono-lg` | JetBrains Mono | 700 | 40px | 1.1 | Métricas grandes |

### Spacing e Layout

| Token | Valor |
|---|---|
| `--radius-sm` | 6px |
| `--radius-md` | 12px |
| `--radius-lg` | 16px |
| `--radius-xl` | 24px |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)` |
| `--shadow-hover` | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` |
| `--shadow-glass` | `0 8px 32px rgba(0,0,0,0.06)` |
| `--content-max` | 1120px |
| `--spacing-section` | 80px |
| `--spacing-cards` | 24px |

### Motion

| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Padrão para entradas |
| `--ease-spring` | `type: "spring", stiffness: 300, damping: 30` | Elementos interativos |
| `--duration-fast` | 200ms | Hover, micro-interações |
| `--duration-normal` | 350ms | Entradas de elementos |
| `--duration-slow` | 500ms | Transições de ato, modais |
| `--stagger` | 60ms | Delay entre itens de lista |

---

## 3. Componentes Globais

### Progress Indicator (lateral direito)
- Posição: fixed, right 24px, center vertical
- 5 dots: 8px de diâmetro, `--border` inativo, `--accent` ativo
- Dot ativo: escala para 10px + pulse animation (opacity 0.4→1→0.4 em 2s, loop)
- Hover em qualquer dot: label do ato aparece à esquerda (tooltip), fade-in 150ms
- Labels: "O Problema", "Visão Geral", "Portal da Marca", "Proteção Automática", "Próximos Passos"
- Z-index: 50
- Clicável: scroll suave até o ato correspondente

### Flipper Logo
- Posição: fixed, top 24px, left 32px
- Texto "flipper" em `--font-display` 20px, `--text-primary`
- Z-index: 50
- Clicável: scroll to top

### Contexto Badge (top right)
- Posição: fixed, top 24px, right 80px
- Glass card pequeno: "Demo · Pinga Store · Jun 2025"
- `--font-label`, `--text-secondary`
- Z-index: 50

---

## 4. Ato 1 — "O Problema"

### Layout
- Altura: 100vh, snap obrigatório
- Background: `--gradient-hero`
- Conteúdo centralizado vertical e horizontalmente, max-width 800px

### Conteúdo

**Headline** (--font-display, 56px):
```
Planilha, WhatsApp, e-mail.
Repetir todo mês.
```

**Subline** (--font-body, 18px, --text-secondary, max-width 520px, center):
```
A gestão financeira de consignações ainda funciona assim na maioria das lojas multimarca. A Pinga gerencia mais de 30 marcas com esse fluxo. E funciona — até que não funciona mais.
```

### Elemento Visual: "Chaos Grid"
Abaixo da subline, 40px de espaçamento. Grid de 3 colunas com 6 glass cards (2 linhas × 3 colunas) representando fragmentos do caos operacional. Cada card: 200×120px, `--bg-glass`, `--radius-md`.

| Card | Conteúdo | Ícone |
|---|---|---|
| 1 | "Vendas_JUN_v3_FINAL(2).xlsx" | ícone de spreadsheet |
| 2 | "Oi, cadê meu repasse?" — 14:32 | ícone de chat bubble |
| 3 | "NF 4521 — REJEITADA" | ícone de documento com X |
| 4 | "Re: Re: Re: Fechamento junho" | ícone de email |
| 5 | "Marca X ligou de novo" — Post-it | ícone de sticky note |
| 6 | "Conferir planilha marca Y e Z" | ícone de checklist |

**Motion dos cards**:
- Entrada: stagger de 80ms, cada card desliza de baixo (translateY 20px → 0) com fade-in, `--duration-normal`, `--ease-out`
- Idle: os cards flutuam sutilmente em padrão aleatório (translateY ±4px, rotate ±1deg) com duração de 3-5s cada, assíncrono entre eles. Sensação de "bagunça viva".
- São ligeiramente rotacionados (-3deg a 3deg) e sobrepostos nas bordas.

### Transição para Ato 2
**Frase de transição** (aparece 60px abaixo do grid, --font-subheading, --text-secondary):
```
E se existisse um lugar só pra isso?
```
Fade-in quando a frase entra no viewport. Ao rolar mais, inicia o snap para o Ato 2.

**Seta indicativa**: chevron-down animado (bounce suave, 1.5s loop), centralizado, 40px abaixo da frase de transição. `--text-tertiary`.

---

## 5. Ato 2 — "A Visão Geral" · Aha #1

> "O fechamento que levava 2 dias leva 45 minutos."

### Layout
- Altura: auto (conteúdo determina), mínimo 100vh, snap no topo
- Background: `--bg-primary`
- Padding top: 80px

### Seção 2A — Headline do Ato

**Tag** (--font-label, --accent, uppercase, letter-spacing 1.5px):
```
PAINEL FINANCEIRO
```

**Headline** (--font-display, 48px):
```
Tudo num lugar só.
```

**Subline** (--font-body, 17px, --text-secondary, max-width 500px):
```
Dashboard da Pinga — Junho 2025. Os números, o status de cada marca, o que precisa da sua atenção. Explore.
```

### Seção 2B — Métricas principais

Row de 4 metric cards, gap 24px, max-width `--content-max`.

Cada card: glass card, padding 28px, `--radius-lg`.

| Métrica | Valor | Variação | Detalhe |
|---|---|---|---|
| Vendas brutas | R$ 34.200 | +12% vs mai | 312 itens vendidos |
| Repasse marcas | R$ 15.800 | — | 6 de 8 marcas processadas |
| Mensalidades | R$ 12.400 | R$ 3.200 em aberto | 2 pendentes |
| Margem loja | R$ 18.400 | 53,8% | Após repasses |

**Motion das métricas**:
- Entrada scroll-triggered: cards fazem stagger (60ms), slide-up 20px + fade
- Valores numéricos (R$): count-up animation de 0 até o valor final, duração 800ms, `--ease-out`
- O valor "R$ 3.200 em aberto" pulsa em `--warning` uma vez ao finalizar o count-up
- Variação "+12%": aparece com delay de 200ms após o valor, badge `--success-light` com texto `--success`

**Interatividade**: cada card é clicável. Ao clicar, um tooltip/popover aparece abaixo do card com breakdown. Exemplo para "Vendas brutas":
```
SP (Jardins): R$ 22.100 (64,6%)
RJ (Leblon): R$ 12.100 (35,4%)
```
Popover: glass card, `--shadow-glass`, slide-down 8px + fade, 200ms. Clique fora fecha.

### Seção 2C — Status das Marcas

**Subtítulo** (--font-heading, 24px):
```
Marcas parceiras
```
**Descrição** (--font-body, --text-secondary):
```
8 marcas ativas na Pinga · Junho 2025
```

Tabela/lista interativa. Cada linha é um row card (hover: `--shadow-hover`, lift 2px).

| Marca | Mensalidade | Vendas jun | Repasse | NF-e | Status |
|---|---|---|---|---|---|
| Amira | ✅ Paga | R$ 5.840 | ⏳ Pendente | ⏳ Aguardando | `--warning` |
| Lua Cheia | ⚠️ Pendente | R$ 4.210 | ⏳ Pendente | — | `--warning` |
| Mar e Rio | ✅ Paga | R$ 6.320 | ✅ R$ 2.890 | ✅ Emitida | `--success` |
| Dona Sol | 🔴 Inadimplente | R$ 2.180 | 🔒 Bloqueado | 🔒 Bloqueada | `--danger` |
| Casa Bruta | ✅ Paga | R$ 4.950 | ✅ R$ 2.260 | ✅ Emitida | `--success` |
| Brisa | ✅ Paga | R$ 3.780 | ✅ R$ 1.730 | ✅ Emitida | `--success` |
| Bruta | ✅ Paga | R$ 5.120 | ✅ R$ 2.340 | ✅ Emitida | `--success` |
| Terra Mãe | — Sem contrato | R$ 1.800 | — | — | `--text-tertiary` |

**Badges de status**:
- ✅ = pill `--success-light` + texto `--success`
- ⏳ = pill `--warning-light` + texto `--warning`
- 🔴/🔒 = pill `--danger-light` + texto `--danger`
- — = texto `--text-tertiary`

**Interatividade ao clicar uma linha**:
Abre um painel lateral (drawer) à direita, 420px wide, slide-in de right, 350ms `--ease-out`. Glass background, shadow pesada. Conteúdo do drawer para cada marca:

**Drawer de marca (exemplo: Amira)**:
```
Amira
Joias artesanais · Ativa desde mar/2024

Contrato
  Split: 50/50
  Mensalidade: R$ 1.800/mês
  Vencimento: dia 5

Junho 2025
  Vendas brutas:     R$ 5.840
  Repasse (50%):     R$ 2.920
  Mensalidade:       ✅ Paga em 03/jun
  NF-e repasse:      ⏳ Aguardando emissão
  NF-e mensalidade:  ✅ #4587

Ações
  [Emitir NF-e repasse]   ← botão primário
  [Ver histórico]         ← botão secundário
```

Clicar "Emitir NF-e repasse" mostra micro-animação: spinner 500ms → check verde + texto muda para "✅ Emitida #4612". O status da linha na tabela principal também atualiza.

Clicar "Ver histórico" mostra mini-timeline dos últimos 3 meses (abr, mai, jun) com barras horizontais de valor.

Botão fechar (X) no topo direito do drawer. ESC também fecha.

### Seção 2D — Checklist de Fechamento

Card destaque, borda left 4px `--accent`, padding 32px, `--radius-lg`.

**Título do card** (--font-subheading):
```
Fechamento · Junho 2025
```

**Status geral** (--font-label):
```
5 de 8 itens concluídos
```

**Progress bar**: 62,5% preenchida, `--accent`, height 6px, `--radius-sm`, animação de preenchimento 600ms.

**Checklist**:

| # | Item | Status | Interativo? |
|---|---|---|---|
| 1 | Sync de vendas (Bling) | ✅ Concluído 01/jul 09:12 | Não |
| 2 | Vincular SKUs pendentes | ⚠️ 3 SKUs sem marca | **Sim** |
| 3 | Conferir splits por marca | ✅ Concluído 01/jul 10:30 | Não |
| 4 | Cobrar mensalidades pendentes | ⚠️ 2 pendentes | **Sim** |
| 5 | Calcular repasses | ✅ Concluído automaticamente | Não |
| 6 | Emitir NF-e de repasse | ⏳ 3 de 6 emitidas | **Sim** |
| 7 | Receber NF-e das marcas | ⏳ 4 de 6 recebidas | Não |
| 8 | Fechar mês | 🔒 Bloqueado (itens pendentes) | Não |

**Interação — Item 2 (SKUs pendentes)**:
Ao clicar, expande inline (accordion, slide-down 300ms) mostrando:

```
SKUs sem marca vinculada

SKU           Produto                 Sugestão        Ação
BRC-1042      Bolsa Trançada P        Casa Bruta      [Vincular]
AMR-0087      Brinco Cascata          Amira           [Vincular]
LCH-0223      Tiara Crescente         Lua Cheia       [Vincular]

                                      [Vincular todos]
```

Clicar "Vincular todos": os 3 itens recebem check animado (stagger 120ms), o item 2 da checklist muda para "✅ Concluído" com animação de strike-through → rewrite. A progress bar atualiza para 75% (6/8). Satisfying.

**Interação — Item 4 (Mensalidades pendentes)**:
Ao clicar, expande mostrando:
```
Mensalidades pendentes

Marca         Valor       Vencimento    Status          Ação
Lua Cheia     R$ 1.400    05/jun        7 dias atraso   [Enviar cobrança]
Dona Sol      R$ 1.800    05/jun        7 dias atraso   [Enviar cobrança]

                                        [Cobrar todas]
```

Clicar "Cobrar todas": ícone de envio animado → "✅ Cobrança enviada via Pix". Itens atualizam. O checklist item 4 atualiza para "✅ Cobranças enviadas".

**Frase-âncora** (aparece abaixo do checklist quando ≥6 itens estão concluídos):

*--font-subheading, --text-secondary, italic:*
```
"Você abre, vê o que falta, resolve e fecha."
```
Fade-in suave, 500ms.

---

## 6. Ato 3 — "A Marca Enxerga" · Aha #2

> "A marca vê as vendas dela em tempo real — e para de te cobrar no WhatsApp."

### Transição: Morph de Perspectiva

Esta é a transição mais importante da demo. Usa morphing de elementos para comunicar "mesmo sistema, outra perspectiva".

**Sequência (duração total: 1200ms)**:

1. **Label de transição** (0–400ms): Uma faixa horizontal aparece no centro da tela com texto:
   ```
   Agora veja como a Amira enxerga o Flipper.
   ```
   `--font-subheading`, 20px, `--text-secondary`. Fade-in + slide-up leve. Background: glass pill, centralizada.

2. **Morph** (400–1000ms): Os elementos do Ato 2 que estavam visíveis fazem fade-out suavemente. A cor de fundo faz uma transição quase imperceptível para um tom levemente mais quente (`#FAFAF8`). Os novos elementos do portal da marca fazem fade-in com slide-up staggered.

3. **Badge de contexto** (1000–1200ms): No topo da tela, uma pill badge aparece:
   ```
   👁 Visão da marca: Amira · Joias artesanais
   ```
   `--accent-light` background, `--accent` texto. Persiste durante todo o Ato 3. Indica claramente que estamos vendo outro perfil.

### Layout
- Altura: auto, mínimo 100vh
- Background: `#FAFAF8` (levemente mais quente que o painel financeiro — diferenciação sutil)
- Padding top: 100px (espaço para a badge de contexto)

### Seção 3A — Boas-vindas da Marca

**Headline** (--font-heading, 32px):
```
Olá, Amira.
```

**Subline** (--font-body, --text-secondary):
```
Seu resumo na Pinga · Junho 2025
```

### Seção 3B — Métricas da Marca

Row de 3 metric cards, layout similar ao Ato 2 mas com 3 colunas.

| Métrica | Valor | Detalhe |
|---|---|---|
| Minhas vendas | R$ 5.840 | 47 itens · SP e RJ |
| Meu repasse | R$ 2.920 | Previsão · Split 50/50 |
| Mensalidade | ✅ Paga | R$ 1.800 · Venc. dia 5 |

**Motion**: count-up nos valores, stagger nos cards. Idêntico ao Ato 2.

**Interatividade**: card "Minhas vendas" é clicável, abre breakdown:
```
SP (Jardins):  R$ 3.840  (34 itens)
RJ (Leblon):   R$ 2.000  (13 itens)
```

### Seção 3C — Minhas Vendas (detalhe)

**Subtítulo** (--font-heading, 24px):
```
Vendas do mês
```

**Filtros** (row de pills, interativos):
```
[Todas]  [SP]  [RJ]  [Últimos 7 dias]
```
Pill ativa: `--accent`, texto branco. Inativas: `--bg-secondary`, `--text-secondary`. Clicar alterna o filtro e a tabela abaixo atualiza com fade (200ms).

**Tabela de vendas**:

| Data | Produto | SKU | Qtd | Valor | Loja |
|---|---|---|---|---|---|
| 28/jun | Brinco Cascata Ouro | AMR-0087 | 1 | R$ 420 | SP |
| 27/jun | Colar Mandala P | AMR-0034 | 2 | R$ 680 | SP |
| 27/jun | Anel Trançado | AMR-0091 | 1 | R$ 190 | RJ |
| 26/jun | Brinco Cascata Prata | AMR-0088 | 3 | R$ 870 | SP |
| 25/jun | Pulseira Gota | AMR-0102 | 1 | R$ 310 | RJ |
| 24/jun | Colar Mandala G | AMR-0035 | 1 | R$ 520 | SP |
| 23/jun | Anel Trançado | AMR-0091 | 2 | R$ 380 | SP |
| 22/jun | Brinco Cascata Ouro | AMR-0087 | 1 | R$ 420 | RJ |
| 20/jun | Bracelete Onda | AMR-0110 | 1 | R$ 290 | SP |
| 18/jun | Colar Mandala P | AMR-0034 | 1 | R$ 340 | SP |

Mostrar 10 linhas. Abaixo: "Mostrando 10 de 47 vendas" em `--text-tertiary`.

**Filtro "RJ"** (quando clicado, mostra apenas):

| Data | Produto | SKU | Qtd | Valor | Loja |
|---|---|---|---|---|---|
| 27/jun | Anel Trançado | AMR-0091 | 1 | R$ 190 | RJ |
| 22/jun | Brinco Cascata Ouro | AMR-0087 | 1 | R$ 420 | RJ |
| 25/jun | Pulseira Gota | AMR-0102 | 1 | R$ 310 | RJ |

"Mostrando 3 de 13 vendas"

### Seção 3D — Repasse e NF-e

Card com 2 colunas lado a lado.

**Coluna esquerda — Repasse**:
```
Repasse previsto
R$ 2.920

Status: ⏳ Aguardando NF-e da loja
Split: 50/50 (contrato vigente)
Base: R$ 5.840 em vendas

Histórico
  Mai/2025   R$ 2.650   ✅ Pago em 08/jun
  Abr/2025   R$ 3.100   ✅ Pago em 07/mai
  Mar/2025   R$ 2.200   ✅ Pago em 08/abr
```

**Coluna direita — Notas Fiscais**:
```
NF-e do mês

#4587  Mensalidade jun     R$ 1.800   ✅ Emitida
#—     Repasse jun         R$ 2.920   ⏳ Pendente

[Baixar NF-e #4587]   ← botão secundário
```

Clicar "Baixar NF-e": simula download (loading 500ms → "✅ NF-e_4587_Amira_jun2025.pdf").

### Frase-âncora

Centralizada, abaixo da seção 3D, 80px de espaçamento:

*--font-subheading, 20px, --text-secondary, italic:*
```
"Cada marca tem o painel dela. Transparência que fideliza."
```

---

## 7. Ato 4 — "O Sistema Protege" · Aha #3

> "Mensalidade atrasada? O repasse trava sozinho."

### Transição
A badge de contexto muda com morph:
```
👁 Visão da marca: Amira → 👁 Visão da loja: Pinga
```
Morph text + cor volta para `--bg-primary`. Duração: 600ms.

### Layout
- Altura: auto, mínimo 100vh
- Background: `--bg-primary`
- Padding top: 80px

### Seção 4A — Setup do Cenário

**Tag** (--font-label, --danger, uppercase):
```
PROTEÇÃO FINANCEIRA
```

**Headline** (--font-display, 48px):
```
Suas regras, aplicadas automaticamente.
```

**Subline** (--font-body, 17px, --text-secondary, max-width 520px):
```
A Dona Sol está com a mensalidade atrasada. Veja o que o Flipper faz — e o que a marca vê.
```

### Seção 4B — Cascata de Bloqueios

Este é o momento visual mais impactante. Layout: diagrama vertical de causa→efeito com 4 nós conectados por linhas.

**Diagrama de cascata** (vertical, centralizado, max-width 480px):

```
┌─────────────────────────────────┐
│  ⚠️  Mensalidade atrasada       │
│  Dona Sol · R$ 1.800            │
│  Vencimento: 05/jun · 7 dias   │
└──────────────┬──────────────────┘
               │ (linha pontilhada animada, --danger)
               ▼
┌─────────────────────────────────┐
│  🔒  Repasse bloqueado          │
│  R$ 990 retido                  │
│  "Repasse só libera com         │
│   mensalidade em dia"           │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  🔒  NF-e bloqueada             │
│  Emissão suspensa               │
│  "NF-e de repasse requer        │
│   repasse liberado"             │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  ⛔  Fechamento impedido         │
│  Dona Sol impede o fechamento   │
│  do mês de Junho                │
└─────────────────────────────────┘
```

**Motion da cascata**:
- Cada nó aparece em sequência, stagger de 400ms
- A linha entre os nós é desenhada progressivamente (stroke-dasharray animation, 300ms)
- Nó 1: slide-in + fade, borda `--warning`
- Nós 2-4: slide-in + fade, borda `--danger`
- Ao completar, uma leve pulsação vermelha percorre toda a cascata de cima a baixo (1 vez)
- A animação é scroll-triggered — começa quando a seção entra no viewport

### Seção 4C — Visão Dual: Loja × Marca

**Subtítulo** (--font-heading):
```
O que cada lado vê
```

**Layout: 2 cards lado a lado** (50/50 width), gap 24px.

**Card esquerdo — "Painel Pinga (loja)"**:
- Header: pill badge "Financeiro da loja", `--accent-light`
- Conteúdo:
```
Dona Sol — Inadimplente

Mensalidade jun:    🔴 Atrasada (7 dias)
Repasse jun:        🔒 R$ 990 retido
NF-e:               🔒 Bloqueada
Fechamento:         ⛔ Impedido por Dona Sol

Ações disponíveis:
  [Enviar cobrança]
  [Registrar pagamento manual]
  [Isentar bloqueio]
```

**Card direito — "Portal Dona Sol (marca)"**:
- Header: pill badge "Visão da marca", `--warning-light`
- Conteúdo:
```
Olá, Dona Sol.

⚠️ Você tem uma pendência.

Mensalidade jun:    🔴 R$ 1.800 em aberto
Repasse:            🔒 Retido até regularização
NF-e:               🔒 Aguardando liberação

Para regularizar:
  [Pagar mensalidade]   ← Pix, R$ 1.800
```

**Interatividade**:

Cenário A — Clicar "Registrar pagamento manual" (card loja):
1. Micro-modal aparece: "Confirmar pagamento da Dona Sol? R$ 1.800"
   - [Confirmar] [Cancelar]
2. Ao confirmar: cascata **reverte** com animação:
   - Nó 1 muda de ⚠️ para ✅, borda `--success`, 300ms
   - Linha 1→2 fica verde, 200ms
   - Nó 2: 🔒→✅ "Repasse liberado — R$ 990", 300ms
   - Nó 3: 🔒→✅ "NF-e desbloqueada", 300ms
   - Nó 4: ⛔→✅ "Fechamento liberado", 300ms
   - Total da animação de reversão: ~1600ms com stagger
3. Os dois cards (loja e marca) também atualizam em paralelo, tudo ficando verde.

Cenário B — Clicar "Pagar mensalidade" (card marca):
Mesmo resultado visual. Mostra que qualquer lado pode resolver.

Cenário C — Clicar "Isentar bloqueio" (card loja):
Modal: "Isentar bloqueio para Dona Sol em Junho 2025? O repasse será liberado mesmo com mensalidade pendente."
- [Isentar] [Cancelar]
Ao isentar: nós 2-4 ficam verdes, mas nó 1 fica amarelo com "⚠️ Mensalidade pendente (isenta)".

### Frase-âncora

Centralizada, abaixo da seção:

*--font-subheading, 20px, --text-secondary, italic:*
```
"Sem conversa difícil. O sistema aplica as regras que você definiu."
```

---

## 8. Ato 5 — "Próximos Passos"

### Layout
- Altura: 100vh, snap obrigatório
- Background: `--gradient-cta`
- Conteúdo centralizado vertical e horizontalmente

### Conteúdo

**Tag** (--font-label, --accent, uppercase):
```
FLIPPER
```

**Headline** (--font-display, 48px):
```
A camada financeira
que faltava.
```

**Subline** (--font-body, 17px, --text-secondary, max-width 460px, center):
```
O Flipper não é ERP, PDV nem marketplace.
É o que conecta o sistema de vendas da Pinga às marcas que expõem nela.
```

### Feature Roadmap (compacto)

3 cards em row, glass, ícone + texto curto. Representam o que vem a seguir (sem prometer datas).

| Feature | Descrição |
|---|---|
| Relatórios avançados | Análise por marca, período, categoria. Exportação PDF. |
| App da marca | Portal mobile nativo para marcas parceiras. |
| Integrações | Tiny, Omie, Nuvemshop — conecte qualquer sistema. |

Motion: stagger de cards, idêntico ao Ato 1.

### CTA

Abaixo dos cards, 60px de espaçamento:

**Frase** (--font-heading, 28px):
```
Quer ver o Flipper com os dados da Pinga?
```

**Botão primário** (--accent, texto branco, padding 16px 40px, --radius-lg, font-size 17px, font-weight 600):
```
Conversar no WhatsApp
```
Link: `https://wa.me/31634367169` (abre WhatsApp web/app com o número +31 6 34367169)

Hover do botão: scale 1.02, `--shadow-hover`, 200ms.

Abaixo do botão, 16px:

**Texto secundário** (--font-caption, --text-tertiary):
```
Resposta em até 24h · Sem compromisso
```

### Rodapé mínimo

Bottom da tela, padding 24px:

```
flipper · 2025
```
`--font-caption`, `--text-tertiary`, center.

---

## 9. Estados e Edge Cases

### Primeiro carregamento
- Loader: logo "flipper" no centro da tela, fade-in 300ms, permanece 800ms, fade-out para Ato 1.
- Preload de fontes (DM Sans 600/700, Inter 400/500, JetBrains Mono 500/700) antes de mostrar conteúdo.

### Navegação via progress dots
- Clicar em qualquer dot: scroll suave até o ato correspondente (duration proporcional à distância, max 800ms).
- Se o usuário pula do Ato 1 direto para o Ato 4, as animações scroll-triggered dos atos intermediários ainda executam quando/se forem visitados depois.

### Redimensionamento de janela
- Content max: 1120px, centralizado
- Abaixo de 1024px: os cards de 4 colunas viram 2×2 grid. Tabelas ganham scroll horizontal.
- Abaixo de 768px: layout single column. Cards empilhados. Tabelas com scroll horizontal. Cascata do Ato 4 reduz width. A demo funciona mas não é otimizada.

### Performance
- Animações com `will-change: transform, opacity` nos elementos que animam.
- IntersectionObserver para trigger de animações — não rodar animações fora do viewport.
- Count-up de números: usar requestAnimationFrame, não setInterval.
- Preload de ícones como SVG inline.

---

## 10. Inventário de Ícones

Todos SVG inline, 20×20px default, stroke-width 1.5, `currentColor`.

| Ícone | Usado em |
|---|---|
| spreadsheet (grid) | Ato 1, card 1 |
| chat-bubble | Ato 1, card 2 |
| document-x | Ato 1, card 3 |
| mail | Ato 1, card 4 |
| sticky-note | Ato 1, card 5 |
| checklist | Ato 1, card 6 |
| chevron-down | Ato 1, transição |
| check-circle | Status ✅ em todo o app |
| clock | Status ⏳ |
| alert-triangle | Status ⚠️ |
| lock | Status 🔒 |
| x-circle | Status 🔴 |
| ban | Status ⛔ |
| download | Botão de download NF-e |
| send | Botão de enviar cobrança |
| external-link | Links de ação |
| filter | Pills de filtro |
| arrow-up-right | Variação positiva |
| whatsapp | Botão CTA final |

Sugestão: usar Lucide Icons (lucide.dev) como biblioteca base — já tem todos estes ícones, MIT license, tree-shakeable.

---

## 11. Notas para o Implementador

1. **Framework**: Next.js App Router (static export). Nenhum backend necessário — tudo é hardcoded. `next export` gera HTML/CSS/JS estático que pode ser hospedado em qualquer CDN (Vercel, Cloudflare Pages, etc).

2. **Scroll-snap**: Usar CSS `scroll-snap-type: y mandatory` no container principal. Cada ato é um `scroll-snap-align: start`. Dentro de cada ato, o scroll é livre.

3. **Framer Motion**: Usar `motion.div` com `whileInView` para animações scroll-triggered. `useInView` hook com `once: true` para que animações não re-executem ao revisitar.

4. **Count-up**: Implementar com `useSpring` do Framer Motion ou lib `react-countup`. Formatar com `Intl.NumberFormat('pt-BR')` para separador de milhar e formato R$.

5. **Dados**: Criar um arquivo `data/demo.ts` com toda a estrutura de dados tipada (marcas, vendas, métricas). Os componentes consomem este arquivo — não espalhar strings hardcoded pelos componentes.

6. **Glassmorphism**: `background: var(--bg-glass)`, `backdrop-filter: blur(16px)`, `border: 1px solid var(--glass-border)`, `box-shadow: var(--shadow-glass)`. Testar em Chrome e Safari (Safari pode precisar de `-webkit-backdrop-filter`).

7. **Estado interativo**: Usar `useState` local em cada componente interativo. Não precisa de estado global — não é um app real. O estado "resolução de cascata" do Ato 4 pode ser um único `useState<'blocked' | 'resolved' | 'exempt'>`.

8. **Drawer**: Usar `AnimatePresence` + `motion.div` com `initial={{ x: 420 }}` → `animate={{ x: 0 }}`. Overlay com `motion.div` + `onClick` para fechar. Trap focus dentro do drawer quando aberto.

9. **WhatsApp link**: O número é +31 6 34367169. O link é `https://wa.me/31634367169` (sem espaços, sem + na URL). Não incluir mensagem pré-preenchida no link — deixar o usuário escrever.

10. **Fontes**: Carregar via `next/font` (Google Fonts). DM Sans: 600, 700. Inter: 400, 500. JetBrains Mono: 500, 700. Usar `display: swap` para evitar FOIT.

11. **SEO/Meta**: Título da página: "Flipper · Pinga Store". Descrição: "Gestão financeira de consignações — demo interativa." Og:image: screenshot do Ato 2 (gerar depois de pronto).

12. **Acessibilidade mínima**: Todos os botões com labels descritivos. Drawer com `role="dialog"` e `aria-label`. Progress dots com `aria-label` do nome do ato. Contraste de texto sobre glass cards deve passar WCAG AA (testar `--text-secondary` sobre `--bg-glass`).

---

## 12. Resumo da Estrutura

```
Ato 1 — "O Problema"                    100vh, snap
  └─ Hero + Chaos Grid

Ato 2 — "A Visão Geral" (Aha #1)        auto (tall), snap top
  ├─ 2A: Headline
  ├─ 2B: 4 Métricas (interativas)
  ├─ 2C: Tabela de marcas (drawer)
  ├─ 2D: Checklist fechamento (sandbox)
  └─ Frase-âncora

Ato 3 — "A Marca Enxerga" (Aha #2)      auto, snap top
  ├─ Transição morph
  ├─ 3A: Boas-vindas
  ├─ 3B: 3 Métricas
  ├─ 3C: Tabela de vendas (filtros)
  ├─ 3D: Repasse + NF-e
  └─ Frase-âncora

Ato 4 — "O Sistema Protege" (Aha #3)    auto, snap top
  ├─ 4A: Setup
  ├─ 4B: Cascata de bloqueios (animada)
  ├─ 4C: Visão dual (interativa)
  └─ Frase-âncora

Ato 5 — "Próximos Passos"               100vh, snap
  ├─ Headline + posicionamento
  ├─ 3 Feature cards
  └─ CTA WhatsApp
```

Total estimado: ~5 viewports de conteúdo. Tempo de experiência: 3-5 minutos explorando, 1-2 minutos passando direto.
