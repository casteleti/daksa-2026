# 05 — DESIGN SYSTEM

Conceito: **"sala de controle industrial + inteligência + precisão"**. Sóbrio, denso onde há dado, arejado onde há argumento. Um único elemento memorável por página (na home, o diagrama vivo). Todo o resto é disciplina.

---

## 1. Como evitar o clichê de "design gerado" com esta paleta

A direção fixada pelo brief (fundo quase-preto, serifada de display, acento terroso, mono para dados) coincide com padrões que hoje sinalizam página gerada por IA. O brief vence, mas as seguintes regras impedem que a execução caia no template:

1. **Mono só em dados reais** (logs, indicadores). Nunca em labels, eyebrows, navegação ou botões, nem em prazo/duração — prazo é rótulo, não dado, e usa `PipeTag` (`§2.2`, `§3`).
2. **Sem eyebrow em caixa alta** acima de títulos. Contexto vem no próprio H2 ou em uma linha em sentence case.
3. **Sem seta (→) em links e botões.** O verbo já diz o que acontece.
4. **Sem grid de cards idênticos.** Cada seção tem a forma do seu conteúdo: escada, tabela, lista editorial, blocos assimétricos.
5. **Sem gradiente como decoração.** Fundos são sólidos. Profundidade vem de contraste de fundo (grafite ↔ branco-osso), não de sombra difusa.
6. **Sem "acento em uma palavra" no H1.** Títulos inteiros na mesma cor.
7. **Raio de borda por hierarquia**, não um valor único: 0 em blocos estruturais, 4 px em inputs/cards, 999 px só em badges.
8. **Sombra quase inexistente.** Elevação por borda e fundo; sombra apenas em dropdown/dialog.
9. **Fotografia real e específica** (indústria/distribuição), não abstrações.
10. **Um momento de motion.** Não reveal em cada seção com stagger.

---

## 2. Foundation

### 2.1 Cor (tokens semânticos sobre primitivos)

```css
:root {
  /* primitivos */
  --c-graphite-900: #14181D;
  --c-navy-950:     #0D1520;
  --c-bone-50:      #F5F4F0;
  --c-bone-100:     #ECEAE4;
  --c-lead-700:     #3A3F47;
  --c-lead-500:     #6B7079;
  --c-ash-300:      #B8BCC2;
  --c-ash-200:      #D5D8DC;
  --c-ink-900:      #1A1D21;
  --c-amber-500:    #C97A3D;
  --c-amber-600:    #B26A32;   /* hover */
  --c-amber-200:    #F0D9C6;   /* fundo de estado sutil sobre claro */
  --c-ok-500:       #3F8F6B;   /* apenas estados de sistema */
  --c-warn-500:     #C9A23D;
  --c-err-500:      #B8453A;

  /* semânticos — tema escuro (padrão de seções de destaque) */
  --bg:            var(--c-graphite-900);
  --bg-elev:       var(--c-navy-950);
  --fg:            var(--c-bone-50);
  --fg-muted:      var(--c-ash-300);
  --line:          color-mix(in oklab, var(--c-ash-300) 24%, transparent);
  --accent:        var(--c-amber-500);
  --accent-hover:  var(--c-amber-600);
  --accent-fg:     var(--c-bone-50);
  --focus:         var(--c-amber-500);
}

[data-theme="light"] {
  --bg:            var(--c-bone-50);
  --bg-elev:       #FFFFFF;
  --fg:            var(--c-ink-900);
  --fg-muted:      var(--c-lead-700);
  --line:          var(--c-ash-200);
}
```

Regras: âmbar ≤ 10% da área visível; nunca como fundo de seção; só CTA primário, valores em destaque, estado ativo/foco, nó "supervisão", linha ativa da escada. Estados de sistema (ok/warn/err) só em formulário e logs.

**Contraste verificado (WCAG AA):** bone-50 sobre graphite-900 = 15,6:1 · ash-300 sobre graphite-900 = 8,9:1 · ink-900 sobre bone-50 = 15,2:1 · lead-700 sobre bone-50 = 8,1:1 · bone-50 sobre amber-500 = 3,9:1 (**texto de botão ≥ 18,66 px ou bold ≥ 14 px** — ok para CTA; para texto pequeno sobre âmbar usar ink-900: 6,2:1) · amber-500 sobre graphite-900 = 5,0:1 (ok para texto ≥ 14 px).

### 2.2 Tipografia

Quatro famílias, cada uma com um papel exclusivo e não intercambiável — duas famílias soavam simplistas para a variedade de vozes que o site precisa (editorial, técnica, de dado, e agora industrial/instrumentação, reforçada pelo conceito de Estanqueidade em `01 §6`).

| Papel | Família | Pesos | Uso |
|---|---|---|---|
| Display | **Fraunces** (variable, opsz) | 500–700, **itálico 500** | H1, H2, títulos de seção |
| Display editorial | **Fraunces itálico** | 500 | Uso estrito: citações reais (`<blockquote>`), a linha de abertura de "Como pensamos" (`01 §5.9`), e **no máximo uma palavra** de ênfase dentro de um título — nunca a frase inteira, nunca em CTA ou botão. Não é decoração; marca uma mudança de registro (de afirmação para reflexão) |
| Texto | **Inter** (variable) | 400, 500, 600 | corpo, H3–H6, nav, botões, formulários |
| Dados | **IBM Plex Mono** | 400, 500 | valores, logs, indicadores — nunca labels |
| Rótulo técnico/instrumentação | **Oswald** (condensed) | 500, 600 | Uso estrito e isolado: `PipeTag`/badges de prazo ("5 dias", "60 dias"), numerais de manômetro/indicador visual, tags de estado ("exemplo ilustrativo"). **Única família com permissão de caixa alta no site** — replica a estética de placa estampada de válvula/tanque industrial (`01 §6`). Nunca em corpo de texto, títulos, nav ou botões |

Fallback stacks: `Fraunces, "Iowan Old Style", Georgia, serif` · `Inter, "Segoe UI", Roboto, system-ui, sans-serif` · `"IBM Plex Mono", "SF Mono", Menlo, monospace` · `Oswald, "Arial Narrow", sans-serif`. `size-adjust` nos fallbacks para reduzir CLS.

**Regra de disciplina:** a quarta família (Oswald) só existe dentro do componente `PipeTag`/`Gauge` (ver `§3`). Se aparecer em qualquer outro lugar do site, é erro de implementação, não variação de estilo.

```css
:root {
  --font-display: Fraunces, "Iowan Old Style", Georgia, serif;
  --font-text:    Inter, "Segoe UI", Roboto, system-ui, sans-serif;
  --font-mono:    "IBM Plex Mono", "SF Mono", Menlo, monospace;
  --font-label:   Oswald, "Arial Narrow", sans-serif; /* só em PipeTag/Gauge — 05 §2.2 */

  --fs-100: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);  /* 13–14 legendas */
  --fs-200: clamp(0.9375rem, 0.9rem + 0.2vw, 1rem);        /* 15–16 meta */
  --fs-300: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);       /* 16–18 corpo */
  --fs-400: clamp(1.125rem, 1.05rem + 0.4vw, 1.3125rem);   /* 18–21 lead */
  --fs-500: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);      /* 20–28 H3 */
  --fs-600: clamp(1.75rem, 1.35rem + 1.5vw, 2.75rem);      /* 28–44 H2 */
  --fs-700: clamp(2.25rem, 1.5rem + 3vw, 4.5rem);          /* 36–72 H1 */

  --lh-tight: 1.1;  --lh-snug: 1.25;  --lh-body: 1.55;  --lh-loose: 1.7;
  --ls-display: -0.015em;  --ls-body: 0;  --ls-mono: 0;

  --measure-body: 65ch;  --measure-display: 22ch;  --measure-lead: 48ch;
}
h1 { font: 600 var(--fs-700)/var(--lh-tight) var(--font-display); letter-spacing: var(--ls-display); max-inline-size: var(--measure-display); font-variation-settings: "opsz" 144; }
h2 { font: 600 var(--fs-600)/var(--lh-snug) var(--font-display); max-inline-size: 28ch; }
h3 { font: 600 var(--fs-500)/var(--lh-snug) var(--font-text); }
p  { font: 400 var(--fs-300)/var(--lh-body) var(--font-text); max-inline-size: var(--measure-body); }
.lead { font-size: var(--fs-400); max-inline-size: var(--measure-lead); }
.data { font: 500 var(--fs-300)/1.4 var(--font-mono); font-variant-numeric: tabular-nums; }
```

Regras: corpo nunca < 16 px; linha 45–75 caracteres; H1 com `text-wrap: balance`; parágrafos com `text-wrap: pretty`; hierarquia por tamanho e peso, não por cor.

### 2.3 Espaçamento e layout

```css
:root {
  --sp-1: 0.25rem; --sp-2: 0.5rem; --sp-3: 0.75rem; --sp-4: 1rem; --sp-5: 1.25rem;
  --sp-6: 1.5rem; --sp-8: 2rem; --sp-10: 2.5rem; --sp-12: 3rem; --sp-16: 4rem;
  --sp-section: clamp(3.5rem, 8vw, 7.5rem);      /* entre seções */
  --sp-block:   clamp(1.5rem, 3vw, 2.5rem);       /* dentro de seção */
  --gap:        clamp(0.75rem, 2vw, 1.5rem);

  --container-max: 76rem;    /* 1216px */
  --container-pad: clamp(1rem, 4vw, 2.5rem);
  --content-max:   65ch;
  --grid-cols: 12;
}
.container { inline-size: min(100% - 2 * var(--container-pad), var(--container-max)); margin-inline: auto; }
.grid { display: grid; grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr)); gap: var(--gap); }
```

Container breakpoints (componentes): `@container (min-width: 32rem)`, `(min-width: 48rem)`, `(min-width: 60rem)`. Media queries globais apenas: `48rem` (troca de navegação), `64rem` (grid 12 col ativo), `90rem` (limita medidas).

### 2.4 Raio, borda, sombra, elevação, opacidade, z-index

```css
:root {
  --r-0: 0; --r-1: 4px; --r-2: 8px; --r-pill: 999px;
  --bw-1: 1px; --bw-2: 1.5px;
  --shadow-dropdown: 0 8px 24px -8px rgb(0 0 0 / .45);
  --shadow-dialog:   0 24px 48px -16px rgb(0 0 0 / .6);
  --op-muted: .72; --op-disabled: .45;
  --z-base: 0; --z-sticky: 10; --z-dropdown: 20; --z-drawer: 30; --z-dialog: 40; --z-toast: 50;
}
```

Uso: cards/inputs `--r-1`; imagens `--r-1`; badges `--r-pill`; blocos de seção `--r-0`; botões `--r-1`.

### 2.5 Ícones e glifos

- Estilo: monolineares, 1,5 px, cantos levemente arredondados, 24 px base, cor `currentColor`.
- Fonte: conjunto próprio (SVG inline, sprite) de ~24 glifos: relógio, fio cortado, funis, carteira, gráfico, seta-fluxo, nó, supervisão (olho + check), cadeado, integração (dois blocos ligados), documento, chat, telefone, e-mail, LinkedIn, menu, fechar, expandir, externo, check, alerta, **válvula, manômetro, gota (vazamento), junta/tubo**. Os quatro últimos entram por conta da camada conceitual de Estanqueidade (`01 §6`) — mesmo estilo monolinear, nunca ilustrativos.
- Proibido: ícones de robô, cérebro, chip, raio "mágico", estrelas de IA.

### 2.6 Motion tokens

```css
:root {
  --dur-1: 120ms; --dur-2: 200ms; --dur-3: 400ms; --dur-4: 600ms;
  --ease-out: cubic-bezier(.2,.7,.2,1); --ease-in-out: cubic-bezier(.4,0,.2,1); --ease-linear: linear;
}
@media (prefers-reduced-motion: reduce) { :root { --dur-1: 0ms; --dur-2: 0ms; --dur-3: 0ms; --dur-4: 0ms; } }
```

### 2.7 Touch e foco

- Alvo mínimo 44 × 44 px (48 recomendado); espaçamento ≥ 8 px entre alvos.
- Foco: `outline: 2px solid var(--focus); outline-offset: 3px;` via `:focus-visible`. Nunca `outline: none` sem substituto.

---

## 3. Componentes

Cada componente: variantes · estados (default, hover, focus, active, disabled, loading, error) · mobile · reduced motion · acessibilidade. Implementação em `.astro` salvo indicação de ilha.

| Componente | Variantes | Estados/Notas | Mobile | A11y |
|---|---|---|---|---|
| **Button** | primary (âmbar sólido), secondary (borda 1,5 px fg), ghost (texto sublinhado), size md/lg | hover: `--accent-hover` / borda âmbar; active: translateY(1px); disabled: `--op-disabled`, sem pointer; loading: spinner 16 px + texto mantido; sem ícone de seta | 100% largura em `< 32rem` dentro de formulários e CTA final; altura ≥ 48 px | `<button>`/`<a>` corretos; `aria-busy` em loading |
| **Link** | inline (sublinhado 1 px, offset 3 px), nav, footer, external (glifo externo) | hover: sublinhado âmbar; visited: igual | alvo ≥ 44 px em nav/footer | texto descritivo, nunca "clique aqui" |
| **Header/Navbar** | desktop (sticky, altura 64 px, fundo com blur 8 px e opacidade 92% sobre grafite), reduzido (página /diagnostico) | scroll: sombra de linha inferior aparece; dropdown por hover/click/teclado | vira barra de 56 px: logo · botão Diagnóstico (compacto) · botão Menu | landmarks `<header>`, `<nav aria-label>`, skip link antes |
| **Dropdown (desktop)** | O que fazemos (5), Para quem (2), Sobre (2) | abre em hover (200 ms delay) e click; fecha em Esc/click fora; setas navegam | não existe (drawer) | `aria-expanded`, `aria-controls`, foco gerenciado |
| **MobileNav (drawer)** | lateral direita, 88% largura, fundo grafite | abre por botão; fecha por X, Esc, swipe para direita (com botão alternativo), click no overlay; corpo `inert` atrás; grupos em `<details>` | é o componente | `<dialog>` nativo com `showModal()`; foco no primeiro item; retorno de foco ao trigger |
| **Breadcrumb** | — | truncar no meio em mobile (mantém primeiro e último) | scroll horizontal com fade nas bordas se necessário | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| **Hero** | home, serviço, segmento, técnico | — | ver 04 | H1 único |
| **SystemDiagram** | vivo (home), estático (serviço), interativo (implantação; ilha) | hover/tap em nó: tooltip; teclado: Tab entre nós | vertical simplificado | SVG com `<title>`, `role="img"`, `aria-describedby` com descrição textual completa oculta; nós interativos como `<button>` sobrepostos |
| **PipelineFlow (IA linear)** | 6 nós | reveal sequencial uma vez | 2 linhas ou vertical | `<ol>` semântico escondido visualmente + SVG decorativo |
| **Ladder (escada)** | horizontal/vertical por container | hover eleva; linha desenha uma vez | vertical | `<ol>`; links |
| **Card** | problem (glifo + texto), segment (foto + overlay), service, insight (editorial, sem imagem), tech | hover: borda âmbar (problem), overlay 50% (segment); nunca sombra | layout horizontal via container query quando ≥ 32rem | card inteiro clicável só quando há um link único; título é o link |
| **Stat / Indicator** | inline (valor mono + label), painel (3 indicadores) | valores sintéticos SEMPRE com rótulo "exemplo ilustrativo" | empilhados | `<dl>` |
| **MetricTable** | 3 colunas (antes/durante/depois) | definição por `<details>` inline | 3 grupos empilhados via container query | `<table>` com `<caption>`, `<th scope>` |
| **Tabs (agentes)** | 4 | setas, Home/End; painel troca sem reload | vira Accordion | padrão WAI-ARIA Tabs |
| **Accordion** | FAQ, agentes mobile, contexto em /diagnostico | `<details>`/`<summary>` nativo; animação de altura com `grid-template-rows` 0fr→1fr | — | nativo |
| **Timeline / Stepper** | 5 dias, semanas, 60 dias, história | horizontal/vertical por container; passo atual (quando aplicável) em âmbar | vertical | `<ol>` |
| **Table (humano × IA)** | 3 colunas | — | cards por linha (`display: block` + `data-label`) | `<th scope>` |
| **Badge / Tag** | tag de insight, "exemplo ilustrativo", prazo | pill, borda 1 px, sem fundo âmbar | — | texto |
| **Quote** | citação de princípio | Fraunces itálico, sem aspas gigantes decorativas | — | `<blockquote>` só se for citação real |
| **Testimonial** | — | **não usar em v1** (sem depoimento real) | — | — |
| **Form / Field** | text, email, select, radio group, textarea | label visível acima; hint abaixo; erro abaixo em `--c-err-500` com glifo; foco âmbar; `inputmode`/`autocomplete` corretos; validação ao blur ou após 1ª tentativa | inputs 100%, altura 48 px, botão sticky acima do teclado | `aria-describedby` para hint/erro; `aria-invalid`; `<fieldset>` em grupos |
| **DiagnosticForm (ilha)** | 2 etapas | progresso "Etapa 1 de 2"; volta preserva dados; loading no envio; sucesso substitui formulário (não redireciona) e dispara evento | idem Field | foco vai ao título da etapa ao trocar; `aria-live="polite"` para mensagens |
| **LeakCalculator (ilha)** | inputs: oportunidades/mês, ticket médio (R$), conversão (%) → resultado "1 ponto de conversão = R$ X/mês" e "pipeline em risco" | cálculo instantâneo; formatação BRL; resultado com rótulo "estimativa a partir dos seus números" | resultado sticky inferior enquanto edita | `<output aria-live="polite">` |
| **Dialog** | consentimento (não modal, banner inferior), vídeo futuro | `<dialog>` nativo | full-screen em < 32rem | foco/Esc/retorno |
| **Toast** | erro de envio, cópia | 5 s, pausa em hover/foco, fechável | inferior, acima da safe area | `role="status"` |
| **ConsentBanner** | inferior, 2 botões iguais (Aceitar / Rejeitar) + "Preferências" | nunca modal bloqueante; nunca botão de rejeitar escondido | idem | teclado |
| **Footer** | 4 col → 2 col → 1 col por container | — | grupos em `<details>` opcional | `<footer>`, `<nav aria-label="Rodapé">` |
| **Skip link** | — | visível em foco | — | primeiro elemento focável |
| **CodeLog (log ilustrativo)** | 3 linhas mono | "digita" em CSS; rótulo | — | `aria-hidden` no efeito; texto real acessível |
| **PipeTag** | badge de prazo ("5 dias", "60 dias", "mensal") | `font-family: var(--font-label)`, caixa alta, peso 600, fundo transparente, borda 1px, `letter-spacing: 0.04em` — única exceção de caixa alta do site (`05 §2.2`) | mesmo tamanho, não encolhe abaixo de 11px | texto real, não decorativo |
| **Gauge (manômetro)** | indicador circular com ponteiro, usado como alternativa ao `Stat` inline quando o dado é único e central (ex.: hero, `04 §1`) | numeral central em `var(--font-label)`; rótulo abaixo em Inter sentence case; ponteiro em âmbar; sempre rotulado "exemplo ilustrativo" quando sintético (`00` guardrail) | vira `Stat` simples (sem SVG de mostrador) em telas < 22rem para evitar detalhe ilegível | `role="img"` com `aria-label` descrevendo o valor por extenso |

---

## 4. Imagética — critérios operacionais

**Fotografia (prioridade):** linha de produção, armazém/expedição, balcão/separação de pedidos, pessoa em contexto industrial (com EPI, sem pose), sala comercial real com telas (sem close em logos de software). Tratamento: dessaturação −25%, temperatura fria (−8), contraste +10, overlay grafite 50–60% quando houver texto. Formato: AVIF/WebP, 3 tamanhos (640/1280/1920), `aspect-ratio` fixo por uso (16/9 hero de segmento; 4/5 retrato; 3/2 cards).

**Se banco de imagens (O4):** critérios de rejeição — sorrisos para a câmera, aperto de mão, post-it, tablet apontado, escritório de vidro genérico, qualquer imagem com "IA" visual. Preferir bancos com fotografia industrial documental.

**Dashboards e artefatos:** sempre produzidos por nós, com dados sintéticos rotulados; estilo do próprio design system (mono para valores, grafite/bone, âmbar em 1 indicador no máximo).

**Diagramas:** SVG próprio, linhas 1,5 px, nós retangulares com raio 4 px, texto em Inter, sem 3D, sem sombra, sem gradiente.

**Retratos:** fundo neutro, luz natural, meio-corpo, sem braços cruzados, sem sorriso forçado; tratamento igual ao das fotos.

**Proibido (lista do brief + adições):** robô humanoide, cérebro digital, mão em holograma, rede neural, circuito brilhante, neon, gradiente roxo/azul, reunião corporativa artificial, post-it, ícones de robô, "estrelas de IA", globo com linhas, cidade futurista.

---

## 5. Tema por seção (mapa)

| Página/Seção | Tema |
|---|---|
| Header, Hero, Problema, Agentes, Como pensamos, CTA final, Footer | escuro |
| Faixa de contexto, Escada, O que medimos, Insights, corpo de artigos, formulários | claro |
| Páginas de serviço/segmento/tecnologia | hero escuro, corpo claro, CTA final escuro |
| /diagnostico | claro (formulário legível), header reduzido escuro |

Alternância cria ritmo sem gradiente. Nunca duas seções escuras consecutivas com mais de 1 tela de altura combinada.

---

## 6. Documentação

`docs/design-tokens.md` gerado a partir de `tokens.css`; Storybook opcional em fase 2 (Astro + Preact via `@storybook/preact-vite`). Em v1, página interna `/_styleguide` (noindex, só em preview) renderiza todos os componentes e estados para QA visual.
