import { defineMiddleware } from 'astro:middleware';

/**
 * Middleware de headers de segurança — fonte: 02-STACK-INFRA-SEGURANCA.md §5.
 *
 * Só roda para rotas SSR (`export const prerender = false`, hoje só src/pages/api/*)
 * — com `output: 'static'` (ver astro.config.mjs), páginas prerenderizadas são servidas
 * como arquivos estáticos pelo Cloudflare Pages e não passam pelo Worker/middleware;
 * os mesmos headers para essas páginas vivem em public/_headers.
 *
 * CSP em report-only por enquanto (R9, 09 §2). O nonce abaixo fica pronto para o dia em
 * que alguma rota SSR passar a renderizar HTML (nenhuma ainda — /api/* só retorna JSON).
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const nonce = crypto.randomUUID();
  context.locals.cspNonce = nonce;

  const response = await next();
  const headers = new Response(response.body, response);

  headers.headers.set('X-Content-Type-Options', 'nosniff');
  headers.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.headers.set('X-Frame-Options', 'DENY');
  headers.headers.set(
    'Content-Security-Policy-Report-Only',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
  );

  if (context.url.pathname.startsWith('/api/')) {
    headers.headers.set('Cache-Control', 'no-store');
  }

  return headers;
});
