# Site institucional — [MARCA]

Consultoria de operação comercial B2B. A especificação completa (negócio, arquitetura,
design system, SEO/GEO, performance, roadmap) está em `docs/` — leia
`docs/00-INDICE-E-SUMARIO-EXECUTIVO.md` primeiro. **Esses arquivos são a fonte de
verdade**; qualquer contradição entre eles e o código é um bug no código.

Status atual e o que falta antes da Fase 2: `docs/inputs.md`.

## Stack

Astro 7 (estático por padrão, `prerender = false` só em `src/pages/api/*`) + TypeScript
strict + CSS nativo (tokens, `@layer`, container queries) + ilhas Preact + Content
Collections + adapter Cloudflare. Sem Tailwind — design system próprio em
`src/styles/tokens.css`.

## Comandos

| Comando                   | Ação                                                        |
| :------------------------ | :---------------------------------------------------------- |
| `npm install`             | Instala dependências                                        |
| `npm run dev`             | Sobe o dev server (ver nota abaixo sobre modo background)   |
| `npm run build`           | Build de produção em `./dist/`                              |
| `npm run preview`         | Serve o build local (idem, ver nota abaixo)                 |
| `npm run check`           | `astro check` (tipos + schemas de conteúdo)                 |
| `npm run lint` / `format` | ESLint / Prettier                                           |
| `npm run test`            | Testes unitários (Vitest, `src/lib/*`)                      |
| `npm run test:e2e`        | Playwright — precisa do preview já rodando (ver abaixo)     |
| `npm run test:a11y`       | Playwright + axe-core, 0 violações critical/serious         |
| `npm run budgets`         | Checa `dist/` contra `budgets.json` (08 §3.2)               |
| `npm run lhci`            | Lighthouse CI (precisa de Chrome — ver `lighthouserc.json`) |
| `npm run subset-fonts`    | Regenera `public/fonts/*.woff2` (subset latin, ver script)  |

### `astro dev` / `astro preview` em shell não-interativo

Nesta versão do Astro, `astro dev` e `astro preview` se autodaemonizam quando não há TTY
interativo (rodam em background e devolvem o controle na hora). Isso quebra o
gerenciamento automático de servidor do Playwright — por isso `playwright.config.ts` não
tem `webServer`. Para rodar E2E localmente:

```sh
npm run build
npx astro preview --port 4321
# espere responder, então:
npm run test:e2e
npx astro preview stop
```

O CI (`.github/workflows/ci.yml`) já faz isso automaticamente.

## O que ainda não existe

Ver `docs/inputs.md` — resumo: decisões de negócio O1 (marca)/O5 (domínio)/O6 (CRM) não
resolvidas; conteúdo real de página é Fase 2+ do roadmap (`docs/09-...md` §1); `/api/lead`
é um stub validado (Zod, honeypot, Turnstile quando configurado) sem CRM/e-mail reais
ainda.
