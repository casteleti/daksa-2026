# 02 — STACK, INFRAESTRUTURA, SEGURANÇA, OBSERVABILIDADE, CI/CD E ESTRUTURA DE CÓDIGO

Legenda: **[EV]** evidência documentada · **[REC]** recomendação · **[HIP]** hipótese a medir · **[DEC]** decisão arquitetural

---

## 1. Natureza do produto (define tudo)

Site institucional B2B de conteúdo, com **três superfícies interativas pequenas**: formulário de diagnóstico (2 etapas), calculadora de vazamento (inputs → número), visualização do sistema comercial (diagrama interativo). Sem área logada, sem catálogo, sem busca complexa, sem tempo real.

Consequência **[DEC]**: arquitetura **HTML-first + ilhas**. Site público maximiza cache, SEO, HTML estável e JS mínimo. Não há motivo para SaaS-grade hydration.

---

## 2. Comparação de stack

### Stack recomendado — Astro 5 + TypeScript + CSS nativo + ilhas Preact

| Critério | Avaliação |
|---|---|
| Performance | Zero JS por padrão em componentes `.astro`; hidratação só com `client:*` por ilha. LCP/INP melhores possíveis para conteúdo **[EV: docs Astro]** |
| SEO | HTML completo no servidor/build; metadata por rota; links reais; sitemap e RSS integrados |
| GEO | Idem SEO — páginas indexáveis e com snippet elegível são o requisito documentado pelo Google **[EV]** |
| Acessibilidade | HTML semântico nativo; nada depende de runtime |
| Complexidade | Baixa. Um framework, um build, sem App Router/cache semantics |
| DX | Excelente para conteúdo (Content Collections tipadas, MDX, View Transitions nativas) |
| Estabilidade | Astro 5 estável; ecossistema maduro |
| Manutenção | Baixa — poucas dependências, sem lock-in de runtime |
| Segurança | Superfície mínima: output estático + 2–3 endpoints server |
| CMS | Content Collections (Git) nativo; Keystatic como UI; qualquer headless via loader |
| APIs | Endpoints server (`src/pages/api/*`) via adapter Cloudflare, só onde necessário (hybrid output) |
| i18n futura | Roteamento i18n nativo no Astro |
| Motion | View Transitions API nativa; CSS; Motion dentro das ilhas |
| WebGL | Possível via ilha, não usado em v1 |
| Escalabilidade | Estático na edge escala sem limite |
| Observabilidade | web-vitals + Sentry via script leve; logs de Workers |
| Hosting | Cloudflare Pages/Vercel/Netlify — todos com adapter oficial |
| Custo | Zero a dezenas de reais/mês |

**Limitações/riscos:** menos natural para SPA complexa (irrelevante aqui); disciplina necessária nas fronteiras entre ilhas (compartilhar estado entre ilhas exige nanostores); equipe precisa saber CSS de verdade (sem Tailwind como muleta).

### Alternativa #2 — Next.js 15 (App Router, RSC) + React

Vantagens: ecossistema React máximo, contratação fácil, RSC reduz JS. Limitações: hidrata mais do que o necessário num site de conteúdo; complexidade de cache/App Router desproporcional; acoplamento a Vercel para melhor DX; bundle base maior. SEO equivalente se disciplinado. **Escolher se** a equipe for exclusivamente React e houver plano concreto de área logada (portal do cliente) em < 12 meses.

### Alternativa #3 — SvelteKit

Vantagens: runtime mínimo, DX ótima, prerender seletivo. Limitações: ecossistema/hiring menores; navegação subsequente tende a CSR por padrão (configurável); menos integração de conteúdo tipado que Astro. **Escolher se** a equipe já for Svelte.

Descartados com justificativa: Nuxt (mais runtime, sem vantagem aqui), Qwik (ecossistema pequeno, ganho não justifica risco), Angular (peso enterprise sem necessidade), CSR puro (mata SEO/LCP), WordPress/tradicional (segurança, performance, acoplamento de tema).

### Veredito **[DEC]**

**Astro 5.** Único stack em que a arquitetura ideal (HTML-first, ilhas, View Transitions, conteúdo tipado) é o caminho padrão, não uma disciplina a impor.

---

## 3. Stack completo

| Camada | Escolha | Nota |
|---|---|---|
| Framework | Astro 5, `output: 'hybrid'` (estático por padrão; SSR só em `/api/*`) | |
| Linguagem | TypeScript strict | `astro check` no CI |
| UI de ilhas | **Preact** via `@astrojs/preact` (compat React) | ~4 KB vs ~40 KB React. Ilhas: `DiagnosticForm`, `LeakCalculator`, `SystemDiagram`, `MobileNav` (se necessário; preferir `<details>`/`popover` nativo) |
| Estado entre ilhas | nanostores (só se necessário) | |
| CSS | CSS nativo: custom properties (tokens), `@layer`, container queries, `clamp()`, nesting, `:has()`. Scoped styles do Astro por componente + `src/styles/global.css` | **Sem Tailwind** [DEC]: design system próprio exige tokens semânticos; utilities compile-time não agregam aqui |
| Conteúdo | Astro Content Collections + MDX (`src/content/*`) com schemas Zod | Cases, insights, autores, segmentos, FAQs, métricas |
| CMS editorial | **Keystatic** (Git-based, UI local/cloud, preview) | Fase 2. Fase 1 edita Markdown direto |
| Fontes | Self-hosted, subset latin, `font-display: swap`, variable fonts, preload das 2 críticas | Fraunces (variable) · Inter (variable) · IBM Plex Mono (2 pesos) |
| Imagens | `astro:assets` (Sharp): AVIF/WebP, `srcset`, `sizes`, `loading=lazy` exceto LCP | Densidades 1x/2x; largura máx. 2000 px |
| Motion | CSS transitions/animations; View Transitions API (`<ClientRouter />`); **Motion** (`motion/mini`, ~2,5 KB) só nas ilhas | GSAP/Rive/Lottie/Three fora de v1 |
| Formulários | HTML nativo + progressive enhancement (ilha Preact para etapas/validação) → `POST /api/lead` (Cloudflare Worker via adapter) | Funciona sem JS (fallback single-step) |
| Anti-spam | Cloudflare Turnstile (invisível) + honeypot + rate limit no Worker | |
| Envio de lead | Worker → CRM (webhook/API) + e-mail transacional (Resend ou Postmark) + backup em Cloudflare KV/D1 | Retry com fila (Cloudflare Queues) se CRM falhar |
| Analytics | GA4 via GTM (web container) + Consent Mode v2; `web-vitals` → GA4 | Server-side GTM: fase 3 [HIP] |
| Erros | Sentry (browser, sample 20%) + Sentry no Worker | |
| Uptime | Cloudflare Health Checks ou Better Uptime | |
| Hosting | **Cloudflare Pages** + Workers + DNS + WAF + CDN + Turnstile + KV/D1/Queues | Alternativa: Vercel (se Next). Netlify equivalente, menos edge |
| Repositório | GitHub, branch protection, Conventional Commits | |
| CI/CD | GitHub Actions (quality gates) → Cloudflare Pages (preview por PR, produção por `main`) | |
| Testes | Vitest (unit) · Playwright (E2E + visual regression + axe) · Lighthouse CI · `astro check` | |
| Segurança de deps | Dependabot + `npm audit` no CI + lockfile obrigatório | |

---

## 4. Infraestrutura e deploy

### Comparação **[REC]**

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **Cloudflare Pages + Workers** | Edge global (330+ cidades), WAF/DDoS/Turnstile inclusos, rollback atômico, previews, KV/D1/Queues no mesmo lugar, custo mínimo | DX de Workers exige atenção a APIs Node não suportadas | **Escolhido** |
| Vercel | Melhor DX com Next; previews; analytics | Acoplamento; custo cresce; menos controle de edge/WAF | Alternativa se Next |
| Netlify | Simples, forms nativos | Menos edge/segurança; forms nativos limitam CRM routing | Não |
| Hetzner + Docker | Controle total, barato | Operação manual: SSL, CDN, WAF, backups, deploy | Não para site estático |
| AWS (S3+CloudFront+Lambda) | Controle | Complexidade desproporcional | Não |

### Ambientes

- `production` — `main`, domínio final, cache agressivo
- `preview` — cada PR, URL única, `noindex` via header + robots
- `staging` — branch `staging`, domínio `staging.[dominio]`, protegido por Cloudflare Access (login), `noindex`

### Cache

- HTML: `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400` (edge) — purge no deploy
- Assets com hash: `max-age=31536000, immutable`
- `/api/*`: `no-store`

### DNS/SSL

Cloudflare DNS, SSL Full (strict), HSTS preload após 30 dias de estabilidade, redirect `www` → apex (ou vice-versa, decidir em O5), redirect http → https.

### Rollback

Cloudflare Pages mantém deploys anteriores; rollback = promover deploy anterior (1 clique/CLI). Runbook em `docs/runbooks/rollback.md`.

### Backups

Conteúdo vive no Git (backup implícito). Leads: CRM (fonte) + cópia em D1 com retenção 90 dias + e-mail. Export mensal do D1 para armazenamento frio.

---

## 5. Segurança

| Controle | Implementação |
|---|---|
| HTTPS | Forçado; HSTS `max-age=63072000; includeSubDomains; preload` |
| CSP | `default-src 'self'; script-src 'self' 'nonce-…' https://www.googletagmanager.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' (avaliar nonce); img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.sentry.io; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` — nonce gerado no Worker para páginas SSR; para estáticas usar hash de scripts inline |
| Headers | `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` · `X-Frame-Options: DENY` (redundante à CSP) |
| CORS | `/api/*` aceita apenas origem própria |
| Input | Validação com Zod no Worker (mesmos schemas do front); sanitização; limite de tamanho; rejeição de e-mails descartáveis/gratuitos como aviso (não bloqueio) |
| CSRF | Origin/Referer check + Turnstile; sem cookies de sessão em v1 |
| Rate limit | Cloudflare Rate Limiting em `/api/lead` (5 req/min/IP) + WAF managed rules |
| Segredos | Cloudflare secrets (env); nunca no repositório; rotação semestral |
| Supply chain | Lockfile, Dependabot, `npm audit --audit-level=high` bloqueante, `provenance` quando disponível |
| CMS auth | Keystatic via GitHub OAuth; Cloudflare Access na rota `/keystatic` em produção |
| Logs | Worker logs (Logpush opcional) sem PII em claro; leads mascarados em log |
| Demos de agentes | Qualquer demo futura roda contra dados sintéticos em sandbox separado; nunca contra CRM real |
| LGPD | Consentimento granular (Consent Mode v2), política de privacidade, base legal do formulário = execução de diligências pré-contratuais, retenção declarada, canal de solicitação de dados |

---

## 6. Observabilidade

| Sinal | Ferramenta | Alerta |
|---|---|---|
| Web Vitals de campo (LCP/INP/CLS/TTFB) | `web-vitals` → GA4 evento `web_vitals`; painel Looker Studio | p75 acima da meta por 3 dias |
| Erros front | Sentry browser (sample 20%, release tag) | Novo erro em produção |
| Erros Worker | Sentry (Toucan) | Qualquer 5xx em `/api/lead` |
| Entrega de lead | Log estruturado por lead: recebido → validado → CRM ok/fail → e-mail ok/fail | Falha de CRM > 0 em 1 h |
| Uptime | Health check `/healthz` a cada 1 min de 3 regiões | 2 falhas consecutivas |
| Sintético | Lighthouse CI em cada PR + cron semanal em produção | Regressão de budget |
| Search | Search Console + Bing Webmaster; relatório semanal | Queda de indexação/CWV |

---

## 7. CI/CD e quality gates

Pipeline (GitHub Actions) em cada PR e em `main`:

1. `npm ci` (lockfile) → 2. `astro check` (types) → 3. `eslint` + `prettier --check` → 4. `vitest run` → 5. `astro build` → 6. **bundle budget** (script compara tamanho de JS/CSS por rota com `budgets.json`) → 7. Playwright E2E (fluxos críticos: home, diagnóstico, contato, 404) → 8. Playwright + axe (0 violações critical/serious) → 9. Lighthouse CI (perf ≥ 95, a11y = 100, SEO = 100, best-practices ≥ 95 em mobile simulado) → 10. `npm audit --audit-level=high` → 11. Deploy preview (PR) / produção (`main`)

**Bloqueia deploy:** qualquer falha em 2, 3, 4, 5, 6, 7, 8, 10; Lighthouse abaixo do piso. Visual regression é warning em PR, bloqueante em release.

---

## 8. Estrutura de código (planejada, não criada)

```
/
├── astro.config.mjs            # hybrid, adapter cloudflare, preact, sitemap, mdx
├── package.json
├── tsconfig.json               # strict
├── budgets.json                # budgets por rota
├── lighthouserc.json
├── playwright.config.ts
├── keystatic.config.ts         # fase 2
├── public/
│   ├── fonts/                  # woff2 subset
│   ├── favicon.svg, icons/, og/
│   └── robots.txt
├── src/
│   ├── content.config.ts       # schemas Zod das collections
│   ├── content/
│   │   ├── insights/*.mdx
│   │   ├── cases/*.mdx          # vazio no lançamento
│   │   ├── authors/*.json
│   │   ├── segments/*.mdx       # industrias, distribuidoras
│   │   ├── services/*.mdx       # diagnostico, implantacao, estabilizacao, operacao
│   │   ├── faqs/*.json
│   │   └── metrics/*.json       # o que medimos
│   ├── layouts/
│   │   ├── Base.astro          # html, head, SEO, schema, skip link, header, footer
│   │   ├── Page.astro
│   │   ├── Article.astro
│   │   └── Service.astro
│   ├── components/
│   │   ├── ui/                 # Button, Link, Card, Stat, Badge, Accordion, Tabs, Dialog, Toast...
│   │   ├── nav/                # Header, MegaMenu, MobileNav, Footer, Breadcrumb
│   │   ├── sections/           # Hero, ProblemGrid, Ladder, Method, Agents, Segments, Proof, Vision, InsightsTeaser, FinalCTA
│   │   ├── viz/                # SystemDiagram (SVG + ilha), PipelineFlow, MetricTable
│   │   ├── islands/            # DiagnosticForm.tsx, LeakCalculator.tsx, SystemDiagramInteractive.tsx
│   │   └── seo/                # Head.astro, JsonLd.astro, OpenGraph.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── o-que-fazemos/{index,diagnostico-de-receita,implantacao,estabilizacao,operacao-continua,como-funciona}.astro
│   │   ├── para-quem/{index,industrias,distribuidoras-e-atacadistas}.astro
│   │   ├── resultados/{index,cases/index,cases/[slug]}.astro
│   │   ├── sobre/{index,nossa-historia,como-pensamos}.astro
│   │   ├── insights/{index,[slug],tag/[tag]}.astro
│   │   ├── diagnostico/index.astro        # página de conversão primária
│   │   ├── contato.astro
│   │   ├── tecnologia/{index,arquitetura,integracoes,governanca-de-ia,seguranca-e-lgpd}.astro
│   │   ├── privacidade.astro, termos.astro, 404.astro
│   │   ├── rss.xml.ts, sitemap (integração)
│   │   └── api/{lead,contact,healthz}.ts   # SSR
│   ├── styles/
│   │   ├── tokens.css          # :root custom properties
│   │   ├── layers.css          # @layer reset, base, tokens, components, utilities
│   │   ├── reset.css, base.css, typography.css, motion.css, utilities.css
│   ├── lib/
│   │   ├── seo.ts, schema.ts, analytics.ts, consent.ts, validation.ts (Zod compartilhado), format.ts
│   ├── data/
│   │   └── nav.ts, site.ts (nome, domínio, redes, endereço)
│   └── middleware.ts           # headers de segurança, nonce
├── tests/
│   ├── unit/, e2e/, a11y/, visual/
├── scripts/
│   └── check-budgets.mjs, subset-fonts.sh, generate-og.mjs
└── docs/
    ├── ADR/ (decisões), runbooks/, content-guide.md, design-tokens.md
```

Regras: sem abstração prematura; componentes de seção recebem conteúdo por props tipadas; nada de "utils" genérico; um componente por arquivo; ilhas com sufixo `.tsx` e `client:visible`/`client:idle` explícito.
