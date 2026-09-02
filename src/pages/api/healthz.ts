import type { APIRoute } from 'astro';

/** Health check — fonte: 02-STACK-INFRA-SEGURANCA.md §6 (uptime, 1x/min de 3 regiões). */
export const prerender = false;

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
