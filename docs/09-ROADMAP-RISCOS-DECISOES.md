# 09 — ROADMAP DE IMPLEMENTAÇÃO, RISCOS, DECISÕES ABERTAS E GATE

---

## 1. Roadmap de implementação (para o Claude Code)

Cada fase termina com um checkpoint verificável. Nenhuma fase começa sem a anterior aprovada. Estimativas em dias úteis de trabalho assistido.

### Fase 0 — Pré-requisitos humanos (antes de qualquer código)
- Resolver O1 (marca), O5 (domínio/e-mail), O6 (CRM).
- Fornecer: logo (SVG), ano de fundação, nome/foto do fundador, endereço/CNPJ (se exibir), textos legais base, acesso ao GitHub/Cloudflare/GA4/CRM.
- Conversas de validação com 2–3 contatos do ICP: reação ao H1, ao "Diagnóstico" como porta de entrada, ao formulário de 2 etapas. Ajustar 01 §5.2 se necessário.
**Checkpoint:** `docs/inputs.md` preenchido; zero placeholders críticos.

### Fase 1 — Fundação técnica (3–4 dias)
1. Repositório, Astro 5 + TS strict + Preact + MDX + sitemap + adapter Cloudflare (hybrid).
2. `tokens.css`, `layers.css`, reset, base, typography, motion; fontes subset self-hosted.
3. `Base.astro` (head, SEO, JSON-LD base, skip link, consent placeholder), `Header`, `Footer`, `MobileNav`, `Breadcrumb`, `Button`, `Link`, `Field`.
4. `content.config.ts` com todas as collections e 1 item de exemplo por collection.
5. Middleware de headers de segurança; `_redirects`; `robots.txt`; `/healthz`.
6. CI: check, lint, test, build, budgets, Playwright smoke, axe, Lighthouse CI; deploy preview.
7. `/_styleguide` (noindex).
**Checkpoint:** preview publicado com home vazia + styleguide; CI verde; Lighthouse ≥ 95; axe 0.

### Fase 2 — Home e conversão (4–5 dias)
1. Seções da home (04) com copy real (01).
2. `SystemDiagram` (SVG vivo + versão vertical) e `PipelineFlow`; motion do hero; reduced motion.
3. `Ladder`, `Card` (problem/segment), `Tabs`/`Accordion` (agentes), `MetricTable`, `CodeLog`.
4. `/diagnostico` com `DiagnosticForm` (ilha + fallback), Worker `/api/lead` (Zod, Turnstile, honeypot, rate limit, CRM, e-mail, D1, fila), `/contato`.
5. GA4/GTM + Consent Mode + taxonomia de eventos (08 §1.2) + `web-vitals`.
6. E2E do fluxo de lead ponta a ponta em preview com CRM de teste.
**Checkpoint:** lead de teste chega ao CRM com atribuição; eventos no DebugView; budgets ok; visual aprovado pelo fundador em desktop e mobile real.

### Fase 3 — Páginas de serviço, segmento e método (4–5 dias)
1. Layout `Service.astro`; 4 páginas de serviço + hub; `LeakCalculator` em Diagnóstico; `SystemDiagramInteractive` em Implantação.
2. `Como funciona` com tabela humano × IA, agentes, `DefinedTerm`.
3. `Para quem` hub + 2 segmentos (fotos conforme O4).
4. `Resultados` com exemplo anonimizado rotulado.
5. FAQs por página + schema.
**Checkpoint:** todas as rotas P0 com SEO script verde, Rich Results válidos, links internos completos, sem órfãs.

### Fase 4 — Sobre, Tecnologia, Insights, legal (3–4 dias)
1. Sobre hub, Nossa história (timeline com marcos reais), Como pensamos.
2. Tecnologia hub + 4 páginas (conteúdo técnico revisado pelo especialista).
3. Insights: lista, artigo, tag, RSS, OG gerado; 3 artigos iniciais (pilar "vazamento de receita" + 2).
4. Privacidade, Termos (revisão jurídica), 404, `/acessibilidade` (opcional).
5. Cases: template pronto, rota oculta, noindex.
**Checkpoint:** inventário 03 §3 completo; conteúdo revisado; placeholders = 0.

### Fase 5 — Lançamento (2 dias)
1. Checklist de release (08 §5).
2. DNS, SSL, HSTS (sem preload ainda), redirects do site antigo (se houver — mapa de URLs antigas → novas, 301).
3. Search Console, Bing, IndexNow, GA4 produção, Sentry produção, uptime.
4. Monitoramento intensivo 72 h.
**Checkpoint:** site em produção; CWV de campo coletando; primeiro lead real ou lead de teste em produção.

### Fase 6 — Pós-lançamento (contínuo)
- Semana 2: Keystatic; ajustes de copy a partir de conversas reais.
- Mês 1: primeiro relatório (leads, tier, origem, CWV, GSC).
- Mês 2: CRO hipótese 1; declaração de acessibilidade; HSTS preload.
- Mês 3+: primeiro case real (se autorizado) → ativar `/resultados/cases`; benchmark anonimizado (GEO); avaliar Clarity, newsletter, `/en`.

Total estimado até lançamento: **16–20 dias úteis** de implementação + tempo de conteúdo/fotografia/jurídico em paralelo.

---

## 2. Riscos e trade-offs

| # | Risco | Prob. | Impacto | Mitigação | Prioridade |
|---|---|---|---|---|---|
| R1 | Copy da home não ressoa com o ICP (headline, "diagnóstico", vocabulário) | Média | Alto | Fase 0: 2–3 conversas; H1 alternativos prontos; CRO na fase 6 | P1 |
| R2 | Site premium lançado antes de validar preço/ICP; retrabalho de posicionamento | Média | Alto | Conteúdo em collections (troca sem refatorar); não exibir preço; segmentos como dados | P1 |
| R3 | Zero cases enfraquece conversão | Alta | Médio | Prova substituta (método, métricas, 23 anos, exemplo rotulado); ativar cases assim que houver | P1 |
| R4 | Direção visual cai no clichê de "design gerado" | Média | Médio | Regras 05 §1; revisão visual humana em fase 2; um momento memorável, resto disciplinado | P1 |
| R5 | Fotografia de banco genérica destrói a especificidade | Média | Médio | Critérios 05 §4; preferir sessão própria (O4); sem foto é melhor que foto errada | P2 |
| R6 | Formulário de 2 etapas reduz volume | Média | Médio | Fallback single-step; CRO hipótese 3; medir tier vs. volume | P2 |
| R7 | Worker/CRM falha e perde lead | Baixa | Alto | D1 + fila + e-mail; alerta; teste E2E em produção | P1 |
| R8 | Performance degradada por motion do hero em low-end | Média | Médio | Loop em CSS; pausa fora da viewport; budget de main thread; reduzir a 1 evento | P2 |
| R9 | CSP quebra GTM/Turnstile | Média | Médio | Report-only 2 semanas; nonce; testes de headers | P2 |
| R10 | Conteúdo técnico (Tecnologia) promete mais do que a operação entrega | Média | Alto | Revisão pelo especialista técnico; linguagem de capacidade atual, não roadmap | P1 |
| R11 | Dependência do fundador para conteúdo e revisão atrasa fases 3–4 | Alta | Médio | Conteúdo em paralelo desde a fase 1; templates de insight | P2 |
| R12 | Schema não corresponde ao visível (penalidade) | Baixa | Médio | Validação no CI; sem Review/Rating | P3 |
| R13 | Site antigo (23 anos) tem URLs/backlinks que serão perdidos | Alta | Médio | Mapa de redirects 301 antes do lançamento; GSC do domínio antigo | P1 |
| R14 | "Amplitude" volta a entrar por conteúdo (insights sobre automação genérica) | Média | Médio | Content-guide com escopo; tags fechadas; revisão de PR | P2 |

**Trade-offs assumidos:**
- Astro sem Tailwind = mais CSS manual, mais consistência e menos peso. Aceito.
- Preact em vez de React = ecossistema menor nas ilhas; ilhas são pequenas. Aceito.
- Git-based CMS = editoria precisa de PR/Keystatic; sem roles complexos. Aceito para 1–2 editores.
- Sem WebGL/3D = menos "uau"; mais rápido e coerente com a marca. Aceito.
- Sem calendário no formulário = mais fricção para tier A; mais qualificação. Revisar na fase 6.
- Não exibir preço = menos autoqualificação por preço; mais leads C. Mitigado pelo tier.
- Permitir crawlers de treino de IA = perda de controle sobre uso do conteúdo; ganho de visibilidade. Aceito para conteúdo institucional.

**Decisões perigosas a evitar (registro):** cards idênticos com sombra; gradiente roxo/azul; contador animado; depoimento inventado; logos de "clientes"; mega menu com 20 itens; "Soluções de IA" como pilar; chat widget de terceiros na home; pop-up de saída; vídeo autoplay; `client:load` em ilhas; Tailwind sem tokens; `noindex` esquecido em produção; schema com preço.

---

## 3. Decisões abertas (exigem intervenção humana)

| # | Decisão | Opções | Recomendação | Bloqueia |
|---|---|---|---|---|
| **O1** | Nome e arquitetura de marca | (a) marca-mãe de 23 anos como nome do site; (b) unidade nomeada "[Marca] Operação Comercial"; (c) marca nova | **(b)** — usa a confiança da marca-mãe e sinaliza oferta nova; domínio da marca-mãe com seção ou subdomínio | Fase 1 |
| **O2** | ICP no menu | 2 segmentos vs. 4 | **2** (indústrias, distribuidoras) | Fase 3 |
| **O3** | Exibir preço | não / faixa / "a partir de" | **não** em v1; revisar após 5 diagnósticos | Fase 3 |
| **O4** | Fotografia | banco licenciado / sessão própria / sem foto (tipografia + diagramas) | **sessão própria** se viável em 3 semanas; senão **sem foto** no lançamento (segmentos com fundo grafite + glifo) — melhor que banco genérico | Fase 3 |
| **O5** | Domínio, www/apex, e-mail de envio (SPF/DKIM/DMARC), provedor transacional | — | Resend ou Postmark; apex canônico | Fase 1 |
| **O6** | CRM de destino e campos | — | o CRM que a própria operação usará (dogfooding) | Fase 2 |
| O7 | Ano de fundação, marcos da história, nome/foto do fundador | — | dados reais | Fase 4 |
| O8 | Redirects do site atual | mapa de URLs | inventário via GSC + crawl | Fase 5 |
| O9 | LinkedIn e outros `sameAs` | — | só LinkedIn em v1 | Fase 1 |
| O10 | Textos legais (privacidade, termos) | — | revisão jurídica | Fase 4 |
| O11 | Google-Extended (treino de IA) permitir? | permitir / bloquear | permitir | Fase 1 |

---

## 4. Checklist do que será criado na próxima fase (implementação)

- [ ] Repositório com estrutura de 02 §8
- [ ] `tokens.css`, `layers.css`, fontes subset
- [ ] Layouts: Base, Page, Service, Article
- [ ] Componentes de 05 §3 (com `/_styleguide`)
- [ ] Collections e schemas de 07 §6 com conteúdo inicial
- [ ] 29 rotas de 03 §3 (26 indexáveis)
- [ ] Ilhas: DiagnosticForm, LeakCalculator, SystemDiagramInteractive
- [ ] Worker `/api/lead`, `/api/contact`, `/healthz` + D1 + fila
- [ ] Middleware de segurança + CSP
- [ ] GTM/GA4/Consent/web-vitals/Sentry
- [ ] JSON-LD por template + validação
- [ ] robots, sitemap, redirects, IndexNow
- [ ] Testes: unit, integration, E2E, a11y, visual, perf, SEO script
- [ ] CI/CD com gates
- [ ] Docs: ADRs, runbooks (deploy, rollback, incidente de lead), content-guide, utm-standard, inputs

---

## PLANNING COMPLETE

1. **Decisões arquiteturais finais:** D1–D13 (00 §1); princípios 1–14 (00 §2).
2. **Stack:** Astro 5 · TypeScript strict · CSS nativo com tokens/layers/container queries · ilhas Preact · Content Collections + Keystatic · Cloudflare Pages/Workers/D1/Queues/Turnstile · GA4+GTM+Consent Mode · Sentry · Playwright/Vitest/axe/Lighthouse CI.
3. **Árvore do site:** 03 §2 (26 páginas indexáveis; Diagnóstico como conversão primária; Tecnologia como profundidade; Cases oculto até existir).
4. **Design system:** 05 (tokens, tipografia fluida, componentes com estados, imagética, regras anticlichê).
5. **UX/mobile:** 03 §6 (jornadas), 06 §2–3 (comportamento por componente, mobile próprio, fallbacks).
6. **SEO/GEO:** 07 (técnico, entidades, hubs/clusters, citabilidade, schema por template, crawlers de IA).
7. **Performance:** 08 §3 (metas 2,0 s / 150 ms / 0,05; budgets por rota; técnicas).
8. **Riscos:** 09 §2 (R1–R14; P1: copy não validada, preço/ICP, sem cases, clichê visual, lead perdido, promessa técnica, redirects).
9. **Roadmap:** 09 §1 (fases 0–6; 16–20 dias úteis até lançamento).
10. **Checklist da próxima fase:** 09 §4.

**A implementação só começa após validação explícita deste planejamento e resolução de O1, O5 e O6.**
