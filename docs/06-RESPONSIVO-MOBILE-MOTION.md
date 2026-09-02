# 06 — ESTRATÉGIA RESPONSIVA, MOBILE PRÓPRIO E MOTION

---

## 1. Filosofia responsiva

**Quebre por conteúdo e por contêiner, não por dispositivo.** Componentes decidem seu layout pelo espaço do pai (`@container`); a página decide apenas três coisas por media query: (a) tipo de navegação (`< 48rem` drawer), (b) grid de 12 colunas ativo (`≥ 64rem`), (c) limites em ultrawide (`≥ 90rem`).

Tokens fluidos (`clamp()`) para tipografia, espaçamento e gaps eliminam saltos. Unidades `dvh`/`svh` em qualquer altura de viewport. Propriedades lógicas (`inline`/`block`) em todo o CSS para i18n futura.

Arquitetura CSS: `@layer reset, base, tokens, components, utilities` — especificidade previsível; componentes com escopo Astro; utilities mínimas (`.container`, `.grid`, `.visually-hidden`, `.stack`, `.cluster`, `.prose`).

---

## 2. Comportamento por componente (desktop → tablet → mobile)

| Componente | ≥ 64rem | 48–64rem | < 48rem |
|---|---|---|---|
| Header | nav completa + CTA | nav completa compacta (labels curtos) | logo + CTA compacto + botão menu; drawer |
| Hero home | 7/5 texto/diagrama | 6/6 | empilhado; diagrama vertical simplificado |
| Problema | 3 + 2 blocos | 2 col | lista horizontal glifo+texto |
| Escada | horizontal 4 | horizontal 4 (texto reduzido) | vertical com linha lateral |
| Agentes | tabs + 2 col | tabs + 1 col | acordeão |
| Para quem | 2 col fotos | 2 col | empilhado |
| MetricTable | tabela | tabela | 3 grupos empilhados |
| Como pensamos | 5/7 | empilhado | empilhado |
| Insights | 3 col | 2 col | lista |
| Footer | 4 col | 2 col | 1 col (grupos `<details>`) |
| SystemDiagram (implantação) | horizontal com painel lateral | horizontal, painel abaixo | lista vertical de nós expansíveis |
| Tabela humano × IA | tabela | tabela | cards por linha |
| Timeline/Stepper | horizontal | horizontal | vertical |
| /diagnostico | 2 col (contexto / form sticky) | 2 col | form primeiro; contexto em acordeão |
| Calculadora | inline com resultado ao lado | inline, resultado abaixo | inputs + resultado sticky inferior |

Regra: nenhuma tabela com scroll horizontal obrigatório; nenhuma imagem com texto embutido; nenhum conteúdo só em hover.

---

## 3. Mobile-first real — plano de interação

### 3.1 Navegação
- Barra superior 56 px, sticky, com **CTA "Diagnóstico" sempre visível** (zona do polegar: canto inferior é melhor, mas a barra inferior seria excessiva para site institucional; compromisso: CTA na barra superior + **CTA sticky inferior nas páginas de serviço/segmento quando o CTA final sai da viewport**, respeitando `env(safe-area-inset-bottom)`).
- Drawer lateral direito (`<dialog>`), grupos em `<details>` abertos por padrão para "O que fazemos"; item "Solicitar diagnóstico" fixo no rodapé do drawer.
- Gestos: swipe para direita fecha o drawer (via Pointer Events, `touch-action: pan-y`), sempre com botão X alternativo.
- Sem mega menu; sem hover.

### 3.2 Thumb zones
- CTAs primários: dentro do terço inferior da tela quando sticky; largura 100%; altura 52 px.
- Elementos de leitura (links de artigo, breadcrumb) podem ficar no topo.
- Nada crítico no canto superior esquerdo (alcance difícil com uma mão).

### 3.3 Scroll e expansão de conteúdo
- Progressive disclosure: FAQ, agentes, contexto do diagnóstico e detalhes de métrica em `<details>`.
- Sem scroll hijacking, sem parallax, sem scroll snap em conteúdo (apenas em carrossel se existir — não existe em v1).
- `scroll-margin-top` em âncoras para compensar header sticky.

### 3.4 Cards, acordeões, drawers, sheets
- Cards viram linhas (glifo esquerda, texto direita) — mais denso, menos "app".
- Acordeões nativos; animação de abertura por `grid-template-rows`.
- Sheets inferiores: **apenas** para definição de métrica em MetricTable (tap abre sheet com definição), preferindo `<details>` inline quando o texto é curto.
- Drawer: só navegação.

### 3.5 Tabelas, dashboards, gráficos, diagramas
- Tabelas: `display: block` com `data-label` por célula (`td::before { content: attr(data-label) }`) e agrupamento por linha.
- Indicadores: `<dl>` empilhado.
- Diagramas: versão vertical em SVG separado (não escalar o horizontal); nós tocáveis ≥ 44 px; descrição textual sempre presente.
- Gráficos: não há em v1 (sem dados reais para plotar).

### 3.6 Formulários
- `type`/`inputmode`/`autocomplete` corretos (email → `email`/`email`; empresa → `organization`; cargo → `organization-title`; telefone não pedido em v1).
- Botão de envio nunca coberto pelo teclado: `min-height: 100dvh` no container + `scrollIntoView({block:'center'})` no foco do último campo; em iOS Safari usar `visualViewport` para reposicionar CTA sticky.
- Validação ao `blur` ou após primeira tentativa; erro inline; foco vai ao primeiro erro; dados preservados.
- Etapas: "Etapa 1 de 2" em texto (não só barra); voltar mantém valores.
- Sucesso in-place com `aria-live`.

### 3.7 Tipografia, imagens, vídeo
- Corpo 16–17 px; H1 36–44 px; medida ≤ 65ch.
- Imagens com `sizes` corretos (`(max-width: 48rem) 100vw, 50vw`); `aspect-ratio` reservado; `fetchpriority="high"` só na LCP (se for imagem).
- Vídeo: nenhum em v1. Se futuro: poster + `preload="none"` + legendas.

### 3.8 Visualizações de IA
- Diagrama linear (DADO → … → RESULTADO): 2 linhas de 3 ou vertical; texto sempre em HTML.
- Log ilustrativo: 3 linhas mono, sem overflow (largura de linha ≤ 36ch).

### 3.9 Devices e condições
- Testar em: iPhone SE (375), iPhone 15 (393), Pixel 8 (412), Galaxy A-series (360, low-end), iPad (768/1024), landscape em telefone (altura 360–430 — header não pode ocupar > 20%).
- Safari iOS: `dvh`, `-webkit-` prefixos em `backdrop-filter`, sem `100vh`, `<dialog>` polyfill desnecessário (Safari ≥ 15.4), `View Transitions` com fallback.
- Chrome Android low-end: budget de JS ≤ 80 KB; sem `backdrop-filter` em superfícies grandes (custo de GPU) — usar opacidade sólida 96% no header em `@media (max-width: 48rem)`.
- Slow 4G: fontes com `swap`; SVG do hero inline < 20 KB; nenhuma ilha carrega antes de `client:visible`/`client:idle`.
- Bateria: loop do diagrama pausa fora da viewport (`IntersectionObserver` alterna classe) e sob `prefers-reduced-motion`.
- Feedback tátil: `navigator.vibrate(8)` no envio bem-sucedido do formulário, se suportado — opcional, sem dependência.

### 3.10 Fallbacks
- Sem JS: navegação por `<details>` no lugar do drawer; formulário single-step; calculadora oculta (com texto "Solicite o diagnóstico para calcularmos com você"); diagrama estático.
- Sem View Transitions: navegação normal.
- Sem container queries (< 1% em 2026): layout mobile-first funcional por padrão.

---

## 4. Plano de motion

Princípio: **motion explica, orienta ou responde**. Um momento orquestrado por página (home: hero). Todo o resto: micro (≤ 200 ms) e reativo.

### 4.1 Ferramenta por tipo de interação **[DEC]**

| Tipo | Ferramenta | Por quê |
|---|---|---|
| Hover/focus/active de botões, links, cards | CSS transitions | custo zero |
| Abrir/fechar acordeão, drawer, dialog | CSS (grid rows / transform) | nativo, sem JS |
| Transição entre páginas | **View Transitions API** via `<ClientRouter />` do Astro (crossfade 180 ms; header persistente com `transition:persist`) | nativo, sem biblioteca; fallback automático |
| Reveal de seção ao entrar na viewport | `IntersectionObserver` + classe + CSS (opacity, 200 ms, uma vez) | leve; sem stagger |
| Diagrama do hero "ligando" e loop de eventos | CSS animations + SVG (`stroke-dashoffset`, `offset-path`/`animateMotion`) | zero JS; pausável por classe |
| Sequência de nós (IA linear) | CSS `animation-delay` por nó | idem |
| Log "digitando" | CSS `steps()` + `width` | idem |
| Tabs (troca de painel) | CSS opacity 120 ms | |
| Diagrama interativo (implantação): abrir nó, destacar caminho | **Motion (`motion/mini`)** dentro da ilha Preact — `animate()` em atributos SVG e `spring` leve | único lugar com física/sequência sob controle de estado |
| Formulário: troca de etapa, erro | CSS + `animate()` mini para deslocamento 8 px | |
| Toast | CSS | |
| Contadores animados | **não usar** (sem números reais) | |
| Scroll storytelling | **não usar em v1** | sem narrativa que justifique; risco de performance |
| Magnetic buttons, cursor custom | **não usar** | contradiz sobriedade |
| GSAP / Rive / Lottie / Three / R3F / shaders | **fora de v1** | sem função narrativa; custo em mobile |

### 4.2 Inventário de motion por página

| Onde | O que | Duração | Gatilho | Reduced motion |
|---|---|---|---|---|
| Home hero | fade texto; desenhar conexões; acender nós; loop de eventos | 1,2 s total; loop 8 s | load | tudo estático, nós acesos |
| Home Problema/Escada/Agentes/Medimos | reveal de seção (opacity) | 200 ms | viewport | sem reveal |
| Home Escada | linha desenha | 400 ms | viewport | estática |
| Home Agentes | nós acendem em sequência; log digita ao trocar tab | 360 ms; 400 ms | viewport; tab | estáticos |
| Todas | hover/focus | 120–200 ms | interação | mantidos (não são movimento) |
| Todas | transição de página (crossfade) | 180 ms | navegação | sem crossfade |
| Header mobile | drawer desliza | 240 ms `--ease-out` | botão | aparece sem deslizar |
| Acordeões | altura 0fr→1fr | 200 ms | click | instantâneo |
| Implantação | diagrama: destacar caminho ao abrir nó | 300 ms | tap/click/tecla | instantâneo |
| Diagnóstico form | etapa entra (fade + 8 px) | 200 ms | avançar/voltar | fade só |
| Calculadora | resultado atualiza (sem animação de número) | — | input | — |

### 4.3 Regras
- `prefers-reduced-motion: reduce` zera durações e remove loops; conteúdo idêntico.
- Nenhuma animação bloqueia interação ou atrasa LCP; animações do hero começam após `DOMContentLoaded` com `will-change` apenas durante execução.
- Animar só `transform`, `opacity`, `stroke-dashoffset`, `offset-distance`; nunca `height`/`top`/`box-shadow` (exceto acordeão via grid).
- Orçamento: main thread livre ≥ 90% durante o loop do hero (medir com Performance panel); se falhar, reduzir a 1 evento por ciclo.
- Motion tokens únicos (05 §2.6); sem valores mágicos.

### 4.4 Como o motion explica (mapeamento)

- Diagrama vivo → "o sistema funciona continuamente, sem esperar humano" (mensagem central).
- Nós acendendo em sequência → "há uma ordem: dado → … → supervisão → resultado".
- Linha da escada desenhando → "é um caminho, começa pequeno".
- Log digitando → "isso é registro, não mágica".
- Destaque de caminho no diagrama interativo → "esta é a rota da oportunidade quando X acontece".
Se um motion não tem linha nesta tabela, não existe.
