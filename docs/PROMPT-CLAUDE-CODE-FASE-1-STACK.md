# PROMPT — FASE 1: FUNDAÇÃO TÉCNICA (configurar o stack)

Contexto: você já leu e compreendeu os 10 arquivos de `planejamento-site/`. Agora vamos executar a **Fase 1** do roadmap (`09-ROADMAP-RISCOS-DECISOES.md`, seção 1): fundação técnica. Esta fase NÃO inclui conteúdo real, formulário conectado a CRM real, nem domínio de produção — essas partes dependem de decisões ainda abertas (O1, O5, O6 em `09 §3`), que não foram resolvidas ainda. Onde este prompt esbarrar nelas, use stub/placeholder documentado e siga em frente, sem travar o restante do trabalho.

## O que fazer, nesta ordem

1. **Repositório e projeto base**
   - Inicializar Astro 5 com `output: 'hybrid'`, TypeScript strict, adapter Cloudflare (`@astrojs/cloudflare`).
   - Adicionar `@astrojs/preact`, `@astrojs/mdx`, `@astrojs/sitemap`.
   - Estrutura de pastas exatamente como especificada em `02-STACK-INFRA-SEGURANCA.md`, seção 8.
   - `.gitignore`, `.editorconfig`, Conventional Commits documentado em `docs/`.

2. **CSS e tokens**
   - Criar `src/styles/tokens.css`, `layers.css`, `reset.css`, `base.css`, `typography.css`, `motion.css`, `utilities.css` com os valores exatos definidos em `05-DESIGN-SYSTEM.md` (cores, tipografia fluida, espaçamento, raio, sombra, z-index, motion tokens).
   - Baixar/configurar fontes self-hosted (Fraunces, Inter, IBM Plex Mono) com subset latin, `font-display: swap`, `size-adjust` nos fallbacks, conforme `08 §3.3`.
   - Confirmar os contrastes listados em `05 §2.1` com uma checagem automatizada simples (script ou teste).

3. **Layouts e componentes-base**
   - `src/layouts/Base.astro`: head, meta SEO base, JSON-LD `WebSite`+`Organization` (com campos placeholder claramente marcados onde faltar dado de O1/O7), skip link, `<ClientRouter />` (View Transitions), tema por seção conforme `05 §5`.
   - `Header`, `Footer`, `MobileNav` (via `<dialog>`), `Breadcrumb` — comportamento responsivo de `06 §2`.
   - Componentes de UI base: `Button`, `Link`, `Field` — variantes e estados de `05 §3`.
   - Página `/_styleguide` (noindex) renderizando cada componente e seus estados, para QA visual.

4. **Conteúdo (estrutura, não conteúdo final)**
   - `src/content.config.ts` com todas as collections e schemas Zod de `07 §6`.
   - Um item de exemplo por collection (dados fictícios claramente marcados como exemplo), só para validar os schemas — não é o conteúdo real que vem na Fase 3–4.

5. **Segurança e infraestrutura mínima**
   - Middleware de headers de segurança e CSP conforme `02 §5` (CSP em modo `report-only` por enquanto).
   - `robots.txt` e `sitemap` conforme `07 §2` (incluindo `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` permitidos).
   - `/api/healthz` simples.
   - **Não** implementar ainda `/api/lead` completo com CRM real — criar o endpoint com validação Zod e resposta mockada (log local), deixando claro no código onde a integração de CRM (O6) e o envio de e-mail (O5) entram depois.

6. **CI/CD**
   - GitHub Actions com os gates de `02 §7`: install, `astro check`, lint/format, `vitest`, `astro build`, checagem de budget (`budgets.json` de `08 §3.2`), Playwright smoke (home carrega, sem erros de console), axe (0 critical/serious), Lighthouse CI (metas de `08 §3.1`), `npm audit`.
   - Deploy automático de preview no Cloudflare Pages a cada PR (produção fica para a Fase 5 — não configurar domínio final agora).

7. **Documentação**
   - `docs/inputs.md` listando exatamente quais decisões e dados ainda faltam (O1, O5, O6, O7, O9, O10, O11 de `09 §3`) para eu preencher antes da Fase 2 em diante.
   - `docs/design-tokens.md` gerado a partir de `tokens.css`.

## Regras

- Siga exatamente os valores e nomes definidos nos arquivos de planejamento — não invente tokens, nomes de componentes ou estrutura alternativa.
- Não escreva copy de página nenhuma ainda (isso é Fase 2 em diante); o conteúdo desta fase é só estrutural/placeholder.
- Não crie `/api/lead` funcional de verdade nem configure domínio de produção — isso depende de O5/O6.
- Sempre que precisar de um dado que não está nos arquivos (chave de API, domínio, nome de marca), use um placeholder óbvio (`Daksa`, `TODO:O5`, `TODO:O6`) e registre em `docs/inputs.md`.

## Ao final

Rode o checklist do checkpoint da Fase 1 (`09 §1`): preview publicado com home vazia (só estrutura/tokens) + `/_styleguide`, CI verde, Lighthouse ≥ 95, axe 0 violações. Reporte o que passou, o que falhou, e a lista final de `docs/inputs.md`. Não avance para a Fase 2 sem minha confirmação.
