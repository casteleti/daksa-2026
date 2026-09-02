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
  // site: 'https://TODO-O5.example' — domínio final depende de O5 (09 §3).
  // Placeholder para não quebrar sitemap/canonical em build; substituir no deploy.
  site: 'https://example.invalid',
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
