// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// NOTA DE IMPLEMENTAÇÃO (desvio documentado, ver docs/inputs.md):
// 02-STACK-INFRA-SEGURANCA.md §3 especifica `output: 'hybrid'`. Esse valor não
// existe mais na Astro atual (a partir da v5, 'static' já é híbrido por padrão:
// todas as rotas prerenderizam exceto as que exportam `prerender = false`).
// Usamos `output: 'static'` + `export const prerender = false` em src/pages/api/*
// — comportamento idêntico ao pretendido por D1/D2 (00 §1, 02 §1).
// O plano também referencia "Astro 5"; instalamos a última estável (7.x) pela
// mesma razão de não fixar em versão desatualizada — a arquitetura HTML-first +
// ilhas + View Transitions + Content Collections descrita no plano é idêntica.

export default defineConfig({
  // O5 resolvido (01 §8, 09 §3): substituição integral de daksa.com.br, apex (sem www),
  // DNS sob controle da Daksa. O site novo ainda não está no ar nesse domínio — isso é
  // Fase 5 (deploy) — mas a URL canônica já é a real para sitemap/canonical/JSON-LD.
  site: 'https://daksa.com.br',
  output: 'static',
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    preact(),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('/styleguide') &&
        !page.includes('/resultados/cases'),
    }),
  ],
  adapter: cloudflare({
    imageService: 'compile',
  }),
});
