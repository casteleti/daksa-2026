# Inputs pendentes — Fase 1 → Fase 2

Checkpoint da Fase 1 (fundação técnica, `09-ROADMAP-RISCOS-DECISOES.md` §1). Este arquivo
lista exatamente o que falta para eu (ou quem continuar a implementação) avançar sem
inventar dado ou decisão. Toda ocorrência no código está marcada com o comentário
`TODO:O<número>` correspondente à decisão aberta de `09 §3` — grep por `TODO:O` acha todas.

---

## 1. Decisões bloqueantes (O1, O5, O6) — ainda não resolvidas

Confirmado na Fase 0 (conversa anterior): **nenhuma das três foi resolvida.** Onde
esbarraram no código desta fase, usei placeholder e segui em frente, conforme instruído.

### O1 — Nome/arquitetura de marca

- `src/data/site.ts`: `name`/`legalName` = `'[MARCA]'`.
- `public/favicon.svg`: placeholder geométrico (grafite/âmbar), **não é o logo real**.
  Faltam: logo em SVG, favicon derivado, ícones (`public/icons/`), imagem OG padrão.
- `src/lib/schema.ts` (`organizationSchema`): sem `logo`.
- `wrangler.jsonc`: `name: "site-daksa"` — nome técnico do projeto no Cloudflare,
  provavelmente muda com O1.
- Nenhuma copy de página foi escrita ainda (Fase 2+), então `[MARCA]` não aparece em texto
  visível além dos exemplos de conteúdo — mas toda a copy-base de `01` usa o placeholder e
  precisa da resolução de O1 antes da Fase 2.

### O5 — Domínio, e-mail transacional, DNS/SSL

- `astro.config.mjs`: `site: 'https://example.invalid'` (placeholder inválido de propósito,
  para nunca colar em produção por engano).
- `src/data/site.ts`: `url`, `email` = placeholders.
- `public/robots.txt`: `Sitemap:` aponta para o domínio placeholder.
- `src/pages/api/lead.ts`: `RESEND_API_KEY` / `LEAD_NOTIFICATION_EMAIL` não configurados —
  endpoint roda em modo stub (loga e responde sucesso, não envia e-mail real).
- `wrangler.jsonc`: bindings comentados, aguardando providers/domínio.
- DNS/SSL/HSTS preload (`02 §4`) são passos manuais da Fase 5, fora do código.

### O6 — CRM de destino

- `src/pages/api/lead.ts`: `CRM_WEBHOOK_URL` não configurado — lead é validado, classificado
  por tier e logado, mas **não é enviado a CRM nenhum**. O ponto de integração está marcado
  (`TODO:O6`) com o formato de payload esperado (`08 §1.3`).
- `wrangler.jsonc`: bindings de D1 (fallback de lead) e Queues (retry) comentados —
  dependem de saber que CRM/infra o time vai operar (dogfooding, recomendação de `09 §3`).

**Sem resolver O1/O5/O6, a Fase 2 (home real + `/diagnostico` + Worker completo) não pode
fechar de verdade** — dá para construir a UI e a lógica, mas não testar o fluxo de lead
ponta a ponta como o checkpoint da Fase 2 exige (`09 §1`).

---

## 2. Decisões não-bloqueantes ainda pendentes

| #   | O que falta                                                           | Onde                                                                                                                                                                               | Bloqueia                                                                                                                                   |
| --- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| O2  | Confirmação final do menu com 2 segmentos (indústrias/distribuidoras) | Já implementado assim em `src/data/nav.ts`, seguindo D8 (`00 §1`)                                                                                                                  | Nada — D8 já fecha isso; O2 parece redundante com D8. Sinalizado na Fase 0, meu entendimento é que está fechado. Avisar se não for o caso. |
| O3  | Confirmação de não exibir preço                                       | Nenhum template criado ainda inclui preço; `serviceSchema()` já omite `price` por design (`schema.ts`)                                                                             | Idem — D7 já fecha isso                                                                                                                    |
| O4  | Fotografia (banco vs. sessão própria vs. sem foto)                    | Ainda não relevante — páginas de segmento são Fase 3                                                                                                                               | Fase 3                                                                                                                                     |
| O7  | Ano de fundação, marcos da história, nome/foto do fundador            | `src/data/site.ts` (`foundingYear: 2003` — placeholder do exemplo do próprio `04`, não confirmado), `src/content/timeline/fundacao.json`, `src/content/authors/exemplo-autor.json` | Fase 4                                                                                                                                     |
| O9  | URL real do LinkedIn da empresa                                       | `src/data/site.ts` (`social.linkedin`)                                                                                                                                             | Fase 1 (cosmético, não bloqueia build)                                                                                                     |
| O10 | Revisão jurídica de Privacidade/Termos                                | `src/content/legal/privacidade.mdx` (placeholder)                                                                                                                                  | Fase 4                                                                                                                                     |
| O11 | Confirmar que "permitir Google-Extended" está certo                   | Já aplicado em `public/robots.txt` (`07 §2` já chamava isso de decisão fechada)                                                                                                    | Nada — avisar se quiser bloquear                                                                                                           |

**Nota sobre O2/O3/O11:** `00 §1` (D7, D8) já trata essas decisões como fechadas, mas
`09 §3` as relista como abertas. Implementei seguindo D7/D8/07§2 (a leitura mais coerente
com o resto do plano). Se isso não refletir sua intenção, me avise antes da Fase 3.

---

## 3. Acessos e dados que só você pode fornecer (Fase 0 original, ainda pendente)

Da lista de `09 §1` Fase 0, não fornecida ainda:

- Acesso a GitHub (para eu abrir PRs de verdade em vez de só commitar localmente — a esta
  altura o repositório existe só localmente, `git init` feito, nenhum commit ainda).
- Acesso à conta Cloudflare (Pages/Workers, DNS, D1, Queues, Turnstile) — necessário para
  `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` no CI (`.github/workflows/ci.yml`, job
  `deploy`, hoje desligado via `vars.CLOUDFLARE_DEPLOY_ENABLED`).
- Acesso à propriedade GA4 (Fase 2).
- Acesso/decisão do CRM (O6, acima).
- Textos legais base e endereço/CNPJ, se for exibir (O5/O10).
- Conversas de validação com 2–3 contatos do ICP (reação ao H1, ao "Diagnóstico", ao
  formulário de 2 etapas) — ainda não feitas; H1 alternativos continuam em `01 §5.2`
  aguardando essa validação antes de eu fixar a copy da home na Fase 2.

---

## 4. Desvios técnicos documentados (spec vs. realidade da stack em 2026-09-02)

Nenhum destes reinterpreta decisão de negócio/design — são adaptações mecânicas a como as
ferramentas realmente funcionam hoje, todas comentadas no código no ponto exato onde
aparecem. Listados aqui para você revisar de uma vez:

1. **Astro 5 → Astro 7.2.10.** A doc especifica "Astro 5"; instalei a última estável. A
   arquitetura (HTML-first, ilhas, Content Collections, View Transitions) é idêntica; só o
   número da versão mudou. (`astro.config.mjs`)
2. **`output: 'hybrid'` não existe mais.** Substituído por `output: 'static'` +
   `export const prerender = false` por rota — comportamento idêntico ao pretendido por
   D1/D2. (`astro.config.mjs`, `src/pages/api/*.ts`)
3. **`Astro.locals.runtime.env` foi removido no Astro v6.** Bindings do Worker agora se
   acessam via `import { env } from 'cloudflare:workers'`. (`src/pages/api/lead.ts`,
   `src/env.d.ts`)
4. **`@astrojs/cloudflare` `platformProxy` não é mais uma opção válida** — removido da
   config; o dev local funciona via o plugin Vite da Cloudflare automaticamente.
5. **Rota `/_styleguide` renomeada para `/styleguide/`.** Astro exclui do roteamento
   qualquer arquivo/pasta de `src/pages/` que comece com `_` (convenção para colocar
   helpers dentro de `pages/` sem virar rota) — o arquivo original não gerava página
   nenhuma. Mesma intenção (QA interno, fora do menu, `noindex`, bloqueado em
   `robots.txt`). Atualizar qualquer referência futura a `/_styleguide` nos docs de
   planejamento para `/styleguide/`.
6. **Zod v4:** mantive `.string().email()` (chain, tecnicamente "deprecated") em vez do
   novo `z.email()` top-level — testei o `z.email()` e ele quebra a ordem
   trim→validação (rejeita e-mail com espaço nas pontas mesmo depois de `.trim()`); a
   forma antiga funciona corretamente. `.merge()` → `.extend()` (equivalente, sem o aviso
   de depreciação). (`src/lib/validation.ts`)
7. **`wrangler.jsonc` criado** (não estava nomeado em `02 §8`) — necessário para
   `astro dev`/`astro build` com o adapter Cloudflare funcionarem localmente. Bindings
   reais (D1, Queues) comentados, aguardando O6.
8. **Terminologia Cloudflare Pages vs. Workers:** `02` descreve "Cloudflare Pages"
   clássico; o adapter atual (`@astrojs/cloudflare` 14.x) se descreve como adapter para
   "Cloudflare Workers" (a Cloudflare vem unificando Pages em Workers com Static Assets).
   O fluxo real de deploy (Pages dashboard vs. `wrangler deploy`) precisa ser confirmado
   contra o produto Cloudflare atual na Fase 5, quando O5 for resolvido e o deploy real
   acontecer.
9. **`astro dev`/`astro preview` se autodaemonizam** em shell não-interativo nesta versão
   do Astro (retornam o controle imediatamente e continuam rodando em background,
   independente de flag `--background`). Isso quebra o `webServer` automático do
   Playwright — removido de `playwright.config.ts`; o servidor agora é subido e checado
   explicitamente (ver `.github/workflows/ci.yml`, job `e2e`).

---

## 5. Achados reais de QA corrigidos nesta fase

Rodei o CI localmente de ponta a ponta (não só escrevi os configs) — `astro check`,
ESLint, Prettier, Vitest (20 testes), Playwright (17 testes: E2E, a11y via axe-core,
responsivo em 8 viewports), Lighthouse CI (3 runs) e `check-budgets.mjs`. Achei e corrigi
bugs reais, não hipotéticos:

1. **Contraste insuficiente: texto sobre botão âmbar.** `--accent-fg` era `bone-50`;
   axe-core mediu 3,01:1 contra `amber-500` (abaixo de AA 4,5:1 para texto normal — a
   nota de `05 §2.1` sobre "bone-50 sobre amber-500 = 3,9:1" estava imprecisa; o valor
   real é mais baixo). Troquei para `ink-900` (5,10:1 medido, comfortavelmente acima de
   AA), exatamente a alternativa que o próprio design system já recomendava para texto
   pequeno sobre âmbar. (`src/styles/tokens.css`)
2. **Contraste de erro (`--c-err-500`) sobre fundo escuro = 3,35:1, abaixo de AA.**
   Sobre `bone-50` (tema claro) mede 4,83:1, ok. Como formulários vivem sempre em seção
   clara (`05 §5`), corrigi o artefato no meu próprio `/styleguide` (envolvido em
   `data-theme="light"`) em vez de mudar a cor — mas isso significa que **`--c-warn-500`
   e `--c-ok-500` também têm contraste insuficiente sobre `bone-50`** (2,19:1 e 3,56:1,
   medidos, ainda não usados em nenhum componente desta fase). Sinalizo para quem
   construir `Toast`/`ConsentBanner` na Fase 2: vai precisar de uma correção de cor ou
   confirmação consciente do risco antes de usar esses tokens em texto.
3. **Overflow horizontal real em 768px.** O header não implementava a faixa "48–64rem:
   nav completa compacta" de `06 §2` — só tinha desktop completo e mobile. Em exatamente
   768px, a nav completa não cabia (849px de conteúdo em 768px de viewport). Adicionei a
   faixa intermediária (gap/fonte menores) — sem copy de "labels curtos" ainda (isso é
   conteúdo, Fase 3/4), mitigado só via CSS por enquanto.
4. **`backdrop-filter` no header mobile.** `06 §3.9` pede opacidade sólida 96% em vez de
   blur em `< 48rem` (custo de GPU em low-end) — não estava implementado; corrigido.
5. **`npm audit --audit-level=high` (todas as dependências) acusa 10 vulnerabilidades (7
   high).** Investigado: **todas** vêm da árvore do `@lhci/cli` 0.15.1 (`tmp`/`uuid` via
   `inquirer`/`lighthouse`→`puppeteer-core`), uma ferramenta que só roda em CI e nunca
   chega ao bundle de produção. `npm audit --omit=dev` (só dependências de produção que
   realmente vão para o site/Worker) dá **0 vulnerabilidades**. Ajustei o gate do CI para
   `--omit=dev` (`.github/workflows/ci.yml`), que é a leitura mais fiel da intenção de
   `02 §5` ("supply chain" do que é servido, não da ferramentaria interna). `npm audit fix
--force` rebaixaria `@lhci/cli` para `0.1.0` — regressão maior que o risco real.
   Monitorar upstream (`@lhci/cli`/`lighthouse`) por uma correção futura.

---

## 6. Orçamento de fontes acima do limite (não resolvido, precisa de decisão sua)

`08 §3.2`: fontes total ≤ 140 KB. Real, gerado por `scripts/subset-fonts.sh`: **145 KB**
(Fraunces variável 71,9 KB + Inter variável 42,3 KB + Plex Mono 2 pesos 30,8 KB). Já
restringi os eixos variáveis (`wght` aos intervalos realmente usados) e o conjunto de
features OpenType ao mínimo — o que resta é o custo inerente da tabela `gvar` de uma
serifada decorativa variável (Fraunces) mesmo depois de cortada. `check-budgets.mjs`
reporta isso como **FAIL** no CI hoje. Três caminhos, sua escolha:

- (a) aceitar a folga de ~5 KB (3,5% acima) e ajustar o número em `budgets.json`;
- (b) abrir mão da Fraunces como variável e usar 2–3 instâncias estáticas (perde a
  interpolação de `opsz`/`wght`, contradiz "Fraunces (variable, opsz)" de `02 §3`);
- (c) manter como está e deixar o gate vermelho até decidir — não fiz a escolha por você.

---

## 7. Checklist do checkpoint da Fase 1 (`09 §1`)

- [x] Repositório com a estrutura de `02 §8` (`git init` feito; **nenhum commit ainda** —
      não commitei nada, à espera da sua confirmação, conforme instruído)
- [x] `tokens.css`, `layers.css`, fontes subset self-hosted (reais, geradas, ver §6 acima
      para o único ponto em aberto)
- [x] `Base.astro`, `Header`, `Footer`, `MobileNav`, `Breadcrumb`, `Button`, `Link`,
      `Field` — implementados e testados (E2E + axe)
- [x] `content.config.ts` com as 12 collections de `07 §6` e 1 item de exemplo cada,
      schemas validados por `astro check`
- [x] Middleware de headers de segurança + CSP (`report-only`) — `src/middleware.ts`
      (rotas SSR) + `public/_headers` (páginas estáticas, ver desvio #2 acima sobre por
      que precisam ser dois lugares)
- [x] `robots.txt`, sitemap (integração `@astrojs/sitemap`), `/api/healthz`
- [x] `/api/lead` como stub validado (Zod real, honeypot real, Turnstile real quando
      configurado, CRM/e-mail mockados e claramente marcados)
- [x] CI: `astro check`, lint, format, Vitest, build, budgets, Playwright (E2E + a11y +
      responsivo), Lighthouse CI, `npm audit` — todos rodados localmente de ponta a
      ponta, não só escritos
- [x] `/styleguide` (renomeado de `/_styleguide`, ver desvio #5), `noindex`
- [ ] **Preview publicado no Cloudflare Pages** — não fiz porque não tenho acesso à conta
      Cloudflare (§3 acima). O build local passa em todos os gates; falta só o deploy.

### Resultado dos gates (rodados nesta sessão)

| Gate                                      | Resultado                                                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `astro check`                             | 0 erros, 0 warnings                                                                                             |
| ESLint                                    | 0 erros, 0 warnings                                                                                             |
| Prettier                                  | 100% formatado                                                                                                  |
| Vitest                                    | 20/20 testes passando                                                                                           |
| `astro build`                             | build limpo, modo `static` com 2 rotas SSR (`/api/healthz`, `/api/lead`)                                        |
| `check-budgets.mjs`                       | JS/CSS/total: ok em todas as rotas · **fontes: FAIL (145 KB / 140 KB — ver §6)**                                |
| Playwright (Chromium)                     | 17/17 — E2E, axe (0 violações critical/serious), 8 viewports sem overflow horizontal                            |
| Lighthouse CI (mobile simulado, 3 runs)   | Performance 90–99 (mediana ≥ 95, gate passa) · Acessibilidade 100 · SEO 100 · Best practices 100                |
| `npm audit --audit-level=high --omit=dev` | 0 vulnerabilidades (dependências de produção) — ver §5 item 5 sobre as 7 high em devDependencies do `@lhci/cli` |

---

## 8. Não avancei para

- Copy real de nenhuma página (Fase 2+) — `src/pages/index.astro` é um placeholder
  estrutural deliberado.
- `/diagnostico`, `/contato`, páginas de serviço/segmento/tecnologia/insights — Fase 2–4.
- Ilhas Preact (`DiagnosticForm`, `LeakCalculator`, `SystemDiagramInteractive`) — nenhuma
  criada ainda; `@astrojs/preact` está instalado e configurado, pronto para a Fase 2.
- GA4/GTM/Consent Mode funcional — só o `consentDefaultScript()` inline em `Base.astro`
  (bloqueia `analytics_storage`/`ad_storage` por padrão); nenhum container GTM real.
- Keystatic (Fase 2 do CMS, `07 §7`).
- `scripts/generate-og.mjs` (geração de imagem OG 1200×630 por página, `07 §2`) — depende
  de haver título/página real para gerar; removido de `package.json` por ora (referenciava
  um arquivo inexistente), volta quando a Fase 3/4 tiver conteúdo para gerar OG de verdade.
- Nenhum commit git — trabalho está no working tree, aguardando sua revisão.
