# 08 — ANALYTICS E CRO · FORMULÁRIOS · PERFORMANCE · ACESSIBILIDADE · QA

---

## 1. Analytics e conversão

### 1.1 Stack
GA4 (propriedade própria) via GTM web container; Consent Mode v2 (default `denied` para `analytics_storage` e `ad_storage`; GA4 em modo cookieless até consentimento — modelagem de conversões habilitada); `web-vitals` → evento `web_vitals`; Sentry separado. Server-side GTM: fase 3 se houver mídia paga relevante.

### 1.2 Taxonomia de eventos (snake_case; parâmetros padronizados: `location`, `page_type`, `page_slug`)

| Evento | Quando | Parâmetros | Conversão? |
|---|---|---|---|
| `page_view` | automático (+ `page_type`) | page_type, page_slug | — |
| `nav_click` | clique em item do header/footer/drawer | item, group, location(header/footer/drawer) | — |
| `cta_click` | qualquer CTA de diagnóstico ou contato | cta(diagnostico/contato/como-funciona), location(hero/hub-final/sticky/service/segment/final) | — |
| `scroll_depth` | 25/50/75/90 | percent | — |
| `service_card_click` | escada/hub | service | — |
| `ladder_step_click` | home escada | step | — |
| `segment_click` | home/hub para quem | segment | — |
| `agent_tab_change` / `agent_card_open` | agentes | agent | — |
| `diagram_node_open` | SystemDiagram interativo | node, page_slug | — |
| `metric_definition_open` | MetricTable | metric | — |
| `faq_open` | qualquer FAQ | question_id | — |
| `tech_page_view` | páginas /tecnologia | page_slug | — (sinal de persona TI) |
| `insight_view` | artigo | slug, tag[0], author | — |
| `insight_card_click` | lista/home | slug | — |
| `calculator_start` | 1º input | — | — |
| `calculator_complete` | 3 inputs válidos | leak_bucket(<10k/10–50k/50–200k/>200k) — nunca valor exato | — |
| `form_view` | formulário na viewport | form(diagnostico/contato) | — |
| `form_start` | 1º campo focado | form | — |
| `form_step` | avanço/retorno | form, step, direction | — |
| `form_error` | erro de validação | form, field, error_type | — |
| `form_submit` | envio aceito pelo Worker | form | **Sim** (`generate_lead`) |
| `lead_qualified` | Worker classifica | tier(A/B/C) por segmento+time+cargo | **Sim** (conversão principal = tier A/B) |
| `contact_click` | clique em e-mail/WhatsApp/telefone | channel | Sim (secundária) |
| `consent_update` | banner | analytics(true/false), ads | — |
| `web_vitals` | CWV | metric, value, rating, page_slug | — |
| `error_404` | 404 | referrer, path | — |

Não rastrear: hover de cards, movimento de mouse, tempo por seção, cliques em texto. Sem heatmap em v1 (avaliar Microsoft Clarity na fase 2 com consentimento).

### 1.3 Atribuição e CRM
- UTMs padronizadas (`docs/utm-standard.md`): `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`; construtor interno.
- First-touch e last-touch capturados em cookie próprio de 1ª parte (90 dias, consentido) e enviados como campos ocultos no lead: `first_source`, `first_medium`, `first_campaign`, `first_landing`, `last_*`, `referrer`, `gclid`/`fbclid` se existirem, `utm_source=chatgpt.com`/`perplexity.ai` preservados (GEO).
- Worker envia ao CRM (O6): campos do formulário + atribuição + `lead_tier` + `page_slug` + timestamp; cria negócio no estágio "Diagnóstico solicitado"; proprietário = fundador (roteamento único em v1).
- Confirmação: e-mail transacional ao lead (texto 01 §5.11) + notificação interna (e-mail/WhatsApp via API) com resumo e tier.
- Lifecycle: `lead → diagnóstico agendado → diagnóstico entregue → implantação → operação` mantido no CRM, não no site.

### 1.4 Programa de CRO (fase 2+)
Hipóteses iniciais (medir contra baseline de 60 dias):
1. H1 alternativo B ("Quanto do seu pipeline está parado agora?") vs. atual → taxa `hero_cta_primary_click`.
2. Calculadora na home (abaixo do Problema) vs. só na página de serviço → `form_start`.
3. Formulário 1 etapa vs. 2 etapas → `form_submit` × qualidade (`lead_tier`).
Ferramenta: sem terceiros em v1; variantes por build (Cloudflare split por cookie) para evitar flicker e cloaking; nunca servir conteúdo diferente ao Googlebot.

---

## 2. Formulários

### 2.1 Diagnóstico (primário) — 2 etapas
- Etapa 1: nome (text, `autocomplete=name`), e-mail corporativo (`email`; aviso se domínio gratuito, não bloqueia), empresa (`organization`), cargo (select: Dono/CEO · Diretor comercial · Gerente comercial/vendas · Marketing · TI · Outro).
- Etapa 2: segmento (radio: Indústria · Distribuidora/atacadista · Outro), tamanho do time comercial (radio: até 5 · 6–15 · 16–40 · 40+), CRM em uso (text com `datalist`: Ploomes, HubSpot, Pipedrive, RD Station CRM, Salesforce, Mercos, Bitrix24, Planilha, Nenhum), "O que mais incomoda hoje?" (textarea opcional, 500 caracteres).
- Qualificação (Worker): tier A = segmento ∈ {indústria, distribuidora} ∧ time ≥ 6 ∧ cargo ∈ {dono, diretor}; B = segmento ok ∧ (time ≥ 6 ∨ cargo diretor); C = demais. Todos recebem resposta; C recebe roteamento para conteúdo + contato.
- Proteção: Turnstile invisível; honeypot (`website` oculto); rate limit; validação Zod idêntica no cliente e no Worker; tamanho máx. 8 KB.
- LGPD: texto de finalidade abaixo do botão; link para política; sem checkbox de marketing em v1 (não há newsletter); base legal: diligências pré-contratuais.
- Confirmação: sucesso in-place + e-mail.
- Calendário: **não** em v1 (qualificar antes de expor agenda). Fase 2: link de agenda no e-mail de confirmação para tier A.

### 2.2 Contato (secundário) — 1 etapa
nome, e-mail, empresa, mensagem (obrigatória, 1000 caracteres). Mesma proteção.

### 2.3 Estados e erros
Ver 05 §3 (Field) e 01 §5.11. Erro de rede: toast + dados preservados + retry. Erro do Worker: 500 → toast com e-mail alternativo; lead salvo em D1 mesmo se CRM falhar (fila de retry).

---

## 3. Performance

### 3.1 Metas
| Métrica | Campo (p75, mobile) | Meta interna | Lab (Lighthouse mobile) |
|---|---|---|---|
| LCP | ≤ 2,5 s | **≤ 2,0 s** | ≤ 1,8 s |
| INP | ≤ 200 ms | **≤ 150 ms** | — |
| CLS | ≤ 0,1 | **≤ 0,05** | ≤ 0,05 |
| TTFB | ≤ 800 ms | ≤ 400 ms (edge) | — |
| Performance score | — | — | ≥ 95 |

### 3.2 Budgets por rota (`budgets.json`, bloqueante no CI)
| Recurso | Home | Serviço/Segmento | Insight | /diagnostico |
|---|---|---|---|---|
| JS próprio (gz) | ≤ 60 KB | ≤ 45 KB | ≤ 25 KB | ≤ 50 KB |
| CSS (gz) | ≤ 30 KB | ≤ 30 KB | ≤ 25 KB | ≤ 25 KB |
| Fontes (total, woff2) | ≤ 140 KB (3 famílias subset, 2 preload) | idem | idem | idem |
| Imagens acima da dobra | ≤ 150 KB | ≤ 200 KB (foto hero) | 0 | 0 |
| SVG hero inline | ≤ 20 KB | — | — | — |
| Terceiros | GTM+GA4 ≤ 90 KB (após consentimento), Turnstile (só em páginas com form), Sentry ≤ 30 KB | | | |
| Requests iniciais | ≤ 25 | ≤ 25 | ≤ 20 | ≤ 20 |
| Peso total inicial | ≤ 500 KB | ≤ 550 KB | ≤ 350 KB | ≤ 400 KB |

### 3.3 Técnicas
- Critical CSS inline por rota (Astro faz por padrão para estilos de componente); resto em um arquivo com hash.
- `<link rel="preload">` para Fraunces e Inter (subset latin, variable); Plex Mono `font-display: swap` sem preload; `size-adjust` nos fallbacks.
- `preconnect` só para `googletagmanager.com` após consentimento (dinâmico).
- Imagens: `astro:assets`, AVIF → WebP → JPEG; `loading="lazy"` + `decoding="async"` exceto LCP; `fetchpriority="high"` na LCP.
- Ilhas: `client:visible` (diagrama interativo, calculadora), `client:idle` (formulário), nunca `client:load`.
- `content-visibility: auto` em seções abaixo da dobra com `contain-intrinsic-size`.
- Speculation Rules (`prerender` moderado para links do header) **[HIP]** — progressive enhancement.
- View Transitions com `transition:persist` no header para evitar re-render.
- Terceiros: GTM carrega após consentimento ou após `requestIdleCallback` se consentimento já dado; Sentry lazy; Turnstile só em páginas de formulário e só quando o formulário entra na viewport.
- Sem `backdrop-filter` em mobile; sem fontes de ícones; SVG sprite.
- Cache/edge em 02 §4.

### 3.4 Lab vs. campo
Lab (Lighthouse CI, dispositivo simulado Moto G Power, 4G lento) para regressões em PR. Campo (web-vitals → GA4, p75 por page_type e dispositivo) para decisões. CrUX quando houver volume. Alertas em 02 §6.

---

## 4. Acessibilidade — WCAG 2.2 AA

| Área | Requisito | Implementação |
|---|---|---|
| Contraste | 4,5:1 texto, 3:1 grande/UI | tokens verificados (05 §2.1); teste automatizado por página |
| Teclado | tudo operável; ordem lógica; sem armadilha | Tab order = DOM; `<dialog>` para drawer; tabs WAI-ARIA |
| Foco | visível (2.4.7), não obscurecido (2.4.11) | `:focus-visible` âmbar; header sticky não cobre foco (`scroll-padding-top`) |
| Headings | um H1; hierarquia sem saltos | lint de build |
| Semântica | landmarks `header/nav/main/footer/aside`; listas reais; tabelas com cabeçalhos | componentes |
| Skip link | primeiro focável | `Base.astro` |
| Labels | visíveis; `for/id`; grupos em `fieldset/legend` | Field |
| Erros | identificados, descritos, sugestão (3.3.1/3.3.3); sem redigitação (3.3.7) | Field; etapas preservam dados |
| ARIA | só quando HTML não basta | revisão em PR |
| Alt | descritivo; decorativas `alt=""` | content-guide |
| Motion | `prefers-reduced-motion`; nada pisca > 3 Hz | motion.css |
| Zoom/reflow | 200% sem perda; 320 px sem scroll horizontal (1.4.10) | testes Playwright em 320 px |
| Alvos | ≥ 24 × 24 (2.5.8) — adotamos 44 | tokens |
| Arrastar | alternativa sem arrasto (2.5.7) | drawer tem botão; sem sliders |
| Autenticação | n/a | — |
| Ajuda consistente (3.2.6) | contato no mesmo lugar em todas as páginas (footer) | Footer |
| Leitores de tela | testar NVDA+Firefox, VoiceOver+Safari iOS | checklist de release |
| Texto | `lang`, sem justificado, espaçamento ajustável (1.4.12) | base.css |
| Vídeo/áudio | n/a v1 | — |

Declaração de acessibilidade em `/acessibilidade` (fase 2) com canal de contato.

---

## 5. QA e testes

| Tipo | Ferramenta | Escopo | Gate |
|---|---|---|---|
| Unit | Vitest | `lib/*` (validation, schema, format, seo), lógica da calculadora, classificação de tier | bloqueante |
| Integration | Vitest + Miniflare | Worker `/api/lead`: validação, Turnstile mock, CRM mock, D1 fallback, rate limit | bloqueante |
| E2E | Playwright | Home (render, CTAs), /diagnostico (fluxo completo com e-mail de teste), /contato, navegação drawer, 404, View Transitions, sem-JS (contexto com JS off) | bloqueante |
| A11y | Playwright + axe-core; testes manuais de teclado; NVDA/VoiceOver em release | todas as rotas do build; 0 critical/serious | bloqueante |
| Visual regression | Playwright screenshots (3 viewports × tema) | componentes em `/_styleguide` + home + serviço + diagnostico | warning em PR, bloqueante em release |
| Performance | Lighthouse CI (3 runs, mobile) + budgets script | rotas P0 | bloqueante |
| SEO | script pós-build: 1 H1, title/description, canonical, JSON-LD válido, sem links quebrados, sem órfãs, robots/sitemap coerentes | todas | bloqueante |
| Segurança | `npm audit`, headers check (Playwright lê headers), CSP report-only 2 semanas → enforce | — | bloqueante (audit) |
| Responsivo | Playwright viewports 320/375/393/412/768/1024/1280/1536 + landscape 844×390 | rotas P0 | bloqueante (sem overflow horizontal) |
| Browsers | Playwright: Chromium, WebKit, Firefox; BrowserStack (fase de release): Safari iOS 16/17, Chrome Android, Samsung Internet, Edge | rotas P0 | release |
| Dispositivos reais | iPhone (SE + recente), Android low-end, iPad | checklist manual de release | release |
| Conteúdo | checklist de PR (lead, links, tom, alt) | por PR de conteúdo | revisão |

### Checklist de release (resumo; completo em `docs/runbooks/release.md`)
1. CI verde · 2. Visual regression aprovado · 3. axe 0 violações + teste manual teclado/leitor · 4. Lighthouse ≥ 95 mobile em P0 · 5. Rich Results Test em serviço, como funciona, insight · 6. Formulário testado em produção com lead de teste → CRM → e-mail → D1 · 7. Headers/CSP verificados · 8. Search Console: sitemap enviado, URL inspection da home · 9. Bing Webmaster + IndexNow · 10. GA4 DebugView: eventos críticos · 11. Consentimento: rejeitar bloqueia GA · 12. 404 e redirects · 13. Backup/rollback testado · 14. Placeholders `Daksa` etc. = 0 (grep no build).
