/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

/**
 * Bindings/secrets do Worker de produção — fonte: 02-STACK-INFRA-SEGURANCA.md §3, §5.
 * Todos pendentes de O5 (e-mail/domínio) e O6 (CRM); em dev ficam undefined e o endpoint
 * cai no modo mock (ver src/pages/api/lead.ts).
 *
 * `Astro.locals.runtime.env` foi removido a partir do Astro v6 — bindings agora se acessam
 * via `import { env } from 'cloudflare:workers'` (ver src/pages/api/lead.ts). Este projeto
 * ainda não declara bindings reais em wrangler.jsonc (D1/Queues/KV são Fase 2), então não há
 * `wrangler types` gerado ainda; este shim cobre o necessário até lá.
 */
declare module 'cloudflare:workers' {
  interface CloudflareEnv {
    TURNSTILE_SECRET_KEY?: string;
    CRM_WEBHOOK_URL?: string; // TODO:O6
    RESEND_API_KEY?: string; // TODO:O5 (ou Postmark)
    LEAD_NOTIFICATION_EMAIL?: string; // TODO:O5
  }
  export const env: CloudflareEnv;
}

declare namespace App {
  interface Locals {
    cspNonce: string;
  }
}
