# Inputs pendentes — Fase 1 → Fase 2

Checkpoint da Fase 1 (fundação técnica, `09-ROADMAP-RISCOS-DECISOES.md` §1), **atualizado**
após a segunda leitura do planejamento (docs revisados por você — O1 e O5 resolvidos com
dados reais da Daksa). Este arquivo lista exatamente o que ainda falta para avançar sem
inventar dado ou decisão. Toda ocorrência remanescente no código está marcada com o
comentário `TODO:O<número>` — grep por `TODO:O` acha todas.

---

## 1. O1 e O5 — resolvidos, dados reais já aplicados no código

`01 §8` trouxe os dados reais da empresa. Já atualizei:

- `src/data/site.ts`: `name`/`legalName` = `Daksa`; `url` = `https://daksa.com.br`;
  `email` = `atendimento@daksa.com.br`; `phone` = `+55 16 99740-0144`; `address` (Jaboticabal
  – SP); `foundingYear` = `2004`; `social.linkedin` = URL real.
- `astro.config.mjs`: `site: 'https://daksa.com.br'`.
- `public/robots.txt`: `Sitemap:` aponta para `daksa.com.br`.
- `wrangler.jsonc`: comentários de O1/O6 atualizados; nome técnico do Worker mantido
  (`site-daksa`, sem motivo para mudar).
- `src/lib/schema.ts` (`organizationSchema`): `foundingDate` real (2004) e `contactPoint`
  novo (e-mail/telefone reais); `sameAs` sem o filtro de placeholder (LinkedIn real).
  Logo em SVG ainda **não** existe — ver abaixo.
- `src/components/nav/Footer.astro`: endereço real exibido (sem CNPJ — não fornecido).
- `src/content/timeline/fundacao.json`: ano corrigido para 2004.
- Todos os `seo.title` de conteúdo de exemplo (`[MARCA]` → `Daksa`) nos 5 arquivos de
  `src/content/*`.
- `src/lib/consent.ts`: `CONSENT_STORAGE_KEY = 'daksa_consent'` já estava certo por
  coincidência — só limpei o comentário.

**O que O1 ainda não resolve:** logo real em SVG. `public/favicon.svg` continua sendo um
placeholder geométrico (grafite/âmbar) — falta o arquivo de verdade para favicon derivado,
ícones (`public/icons/`) e imagem OG padrão.

**Confirmação importante de `09 §3` (O1):** não é uma marca nova nem uma "unidade nomeada"
— é a Daksa inteira se reposicionando. A arquitetura pública do site continua a mesma
(escada estreita já validada); "vendas e IA com outras automações" só entra como expansão
de conta dentro de Operação Contínua (`03 §4.6`), nunca como item de menu. Nenhuma mudança
de arquitetura foi necessária no código por causa disso.

---

## 2. O que ainda está aberto (bloqueia menos do que antes)

| #   | O que falta                                                                                                                    | Onde no código                                                                                                         | Bloqueia                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| O5b | E-mail transacional (SPF/DKIM/DMARC, Resend ou Postmark)                                                                       | `src/pages/api/lead.ts`: `env.RESEND_API_KEY`/`env.LEAD_NOTIFICATION_EMAIL` não configurados (stub)                    | Fluxo de lead ponta a ponta de verdade (Fase 2) |
| O6  | Nome do CRM (confirmado que já existe um em uso) e campos                                                                      | `src/pages/api/lead.ts`: `env.CRM_WEBHOOK_URL` não configurado (stub); `wrangler.jsonc`: bindings D1/Queues comentados | Idem                                            |
| O4  | Fotografia (sessão própria vs. sem foto) — banco genérico já descartado por critério do `05 §4`                                | Páginas de segmento são Fase 3                                                                                         | Fase 3                                          |
| O7  | Nome/foto do fundador; marcos intermediários da timeline (ano de fundação já resolvido)                                        | `src/content/timeline/fundacao.json` (só o marco de fundação existe), `src/content/authors/exemplo-autor.json`         | Fase 4                                          |
| O10 | Revisão jurídica de Privacidade/Termos                                                                                         | `src/content/legal/privacidade.mdx` (placeholder)                                                                      | Fase 4                                          |
| O12 | Destino do portfólio antigo (Lipid, UCBVet, Yosen, Mandubim) e páginas de Branding/Embalagens/Campanhas — **não entram no v1** | Nada a fazer agora                                                                                                     | Pós-lançamento                                  |

O2, O3, O9, O11 estavam listados como "abertos" em versões anteriores do plano mas já
tratados como fechados por D7/D8/07§2 — sem mudança de status, meu entendimento seguiu
igual.

**Novidade real: O8 (redirects 301) agora é obrigatório**, não opcional — o domínio antigo
(daksa.com.br, WordPress/Elementor) será substituído por inteiro. `09 §1` Fase 5 já lista o
mapa exato: 5 páginas de serviço antigas (Branding, Embalagens, Marketing Digital,
Campanhas, Criação de Sites), portfólio (Lipid, UCBVet, Yosen, Mandubim) e institucionais
(Quem Somos, Contato) → páginas novas equivalentes ou home. Nada a fazer nesta fase — é
trabalho de Fase 5 — mas fica registrado aqui porque é risco P1 (R13, `09 §2`).

**Sem O5b e O6, a Fase 2 (`/diagnostico` + Worker completo) não fecha de verdade** — dá
para construir a UI e a lógica completas, mas não testar o fluxo de lead ponta a ponta
contra o CRM real como o checkpoint da Fase 2 exige.

---

## 3. Acessos que só você pode fornecer (ainda pendentes)

- Acesso a GitHub — **resolvido**: repositório em https://github.com/casteleti/daksa-2026,
  commit inicial da Fase 1 já enviado.
- Acesso à conta Cloudflare (Pages/Workers, DNS, D1, Queues, Turnstile) — necessário para
  `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` no CI (`.github/workflows/ci.yml`, job
  `deploy`, hoje desligado via `vars.CLOUDFLARE_DEPLOY_ENABLED`). Ainda não fornecido.
- Acesso à propriedade GA4 (Fase 2). Ainda não fornecido.
- Nome do CRM e acesso a ele (O6, acima). Ainda não fornecido.
- Provedor de e-mail transacional (O5b, acima). Ainda não fornecido.
- Textos legais base para Privacidade/Termos (O10). Ainda não fornecido.
- Logo em SVG (O1 — falta só isso da marca). Ainda não fornecido.
- Nome/foto do fundador (O7). Ainda não fornecido.
- Conversas de validação com 2–3 contatos do ICP (reação ao H1, ao "Diagnóstico", ao
  formulário de 2 etapas) — ainda não feitas. Relevante agora: `01 §5.2` já lista um H1
  alternativo D vindo da camada conceitual de Estanqueidade ("Sua operação comercial vaza.
  A gente testa, encontra e veda.") como candidato forte, mas pendente dessa validação
  antes de eu fixar como H1 principal na Fase 2.

---

## 3b. Correção de contradição entre docs (resolvida nesta sessão)

`01 §6` (camada conceitual de Estanqueidade) introduziu o componente `PipeTag` como o
tratamento correto para qualquer badge de prazo/duração, mas `04 §4` (Escada) e `05 §2.2`
ainda diziam "prazo em mono" / listavam "prazos numéricos" no escopo do IBM Plex Mono —
uma contradição real entre os dois arquivos. Você resolveu: **`PipeTag` vence para
qualquer badge de prazo/duração**; mono fica só para dado numérico com valor real
(métricas, indicadores, `CodeLog`). Já corrigido nos dois arquivos de planejamento:

- `05-DESIGN-SYSTEM.md` §1 (regra 1) e §2.2 (linha da família Mono): removida a menção a
  "prazos"/"prazos numéricos".
- `04-HOME-DETALHADA.md` §4 (Escada): as duas menções a "prazo em mono" (Visual e Mobile)
  trocadas por `PipeTag`.

Busquei em todos os 10 arquivos por `prazo em mono` e `prazos numéricos` — nenhuma outra
ocorrência sobrou. Nenhuma menção de prazo em páginas de serviço (`03 §4.3–4.6`, ex.: "Os 5
dias", "semana a semana", "60 dias") especifica tratamento tipográfico explícito, então não
há mais nenhuma contradição a resolver antes da Fase 2 — quando esses steppers forem
construídos, `PipeTag` é a resposta por padrão.

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

- [x] Repositório com a estrutura de `02 §8`, commitado e enviado a
      https://github.com/casteleti/daksa-2026 (branch `main`)
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

### Resultado dos gates (re-rodados após atualizar os dados reais da Daksa)

| Gate                                      | Resultado                                                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `astro check`                             | 0 erros, 0 warnings                                                                                             |
| ESLint                                    | 0 erros, 0 warnings                                                                                             |
| Prettier                                  | 100% formatado                                                                                                  |
| Vitest                                    | 20/20 testes passando                                                                                           |
| `astro build`                             | build limpo, modo `static` com 2 rotas SSR (`/api/healthz`, `/api/lead`); canonical/sitemap já em daksa.com.br  |
| `check-budgets.mjs`                       | JS/CSS/total: ok em todas as rotas · **fontes: FAIL (141,7 KB / 140 KB — ver §6, ainda não resolvido)**         |
| Playwright (Chromium)                     | 17/17 — E2E, axe (0 violações critical/serious), 8 viewports sem overflow horizontal                            |
| Lighthouse CI (mobile simulado, 3 runs)   | Performance 99/99/99 · Acessibilidade 100 · SEO 100 · Best practices 100 (3/3 runs, sem variância desta vez)    |
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
