import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { diagnosticLeadSchema, classifyLeadTier, isFreeEmailDomain } from '../../lib/validation';

/**
 * `/api/lead` — recebe o formulário de Diagnóstico (01 §5.11, 08 §2.1).
 *
 * STUB DA FASE 1 (docs/inputs.md): valida de verdade (Zod, honeypot, Turnstile quando
 * configurado) e classifica o tier, mas NÃO integra com CRM real (O6) nem envia e-mail
 * transacional real (O5) — loga estruturado e responde sucesso mockado. Os dois pontos de
 * integração futura estão marcados abaixo com TODO:O5/TODO:O6. Fila/D1 de fallback (Cloudflare
 * Queues + D1, 02 §4) também entram só quando os bindings existirem — Fase 2 (09 §1).
 */
export const prerender = false;

const MAX_BODY_BYTES = 8192; // 02 §5

async function verifyTurnstile(token: string, secretKey: string | undefined, ip: string) {
  if (!secretKey) {
    // Dev/stub: sem secret configurado ainda (depende do domínio real, O5). Não bloqueia
    // localmente, mas nunca aceitar isto em produção — ver checklist de release (08 §5).
    console.warn('[lead] TURNSTILE_SECRET_KEY ausente — verificação pulada (modo stub).');
    return { success: true, stub: true };
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: secretKey, response: token, remoteip: ip }),
  });
  const result = (await response.json()) as { success: boolean };
  return { success: result.success, stub: false };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'payload_too_large' }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const parsed = diagnosticLeadSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('[lead] validação falhou', parsed.error.flatten());
    return json({ ok: false, error: 'validation_failed', issues: parsed.error.flatten() }, 422);
  }

  const lead = parsed.data;
  const ip = clientAddress ?? 'unknown';

  const turnstile = await verifyTurnstile(lead.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!turnstile.success) {
    console.warn('[lead] Turnstile rejeitado', { ip });
    return json({ ok: false, error: 'turnstile_failed' }, 403);
  }

  const tier = classifyLeadTier({
    segment: lead.segment,
    teamSize: lead.teamSize,
    role: lead.role,
  });
  const freeEmail = isFreeEmailDomain(lead.email);

  // Log estruturado por lead (02 §6): recebido → validado → CRM ok/fail → e-mail ok/fail.
  console.log(
    JSON.stringify({
      event: 'lead_received',
      tier,
      segment: lead.segment,
      teamSize: lead.teamSize,
      role: lead.role,
      freeEmailWarning: freeEmail,
      // PII (nome/e-mail/empresa) deliberadamente fora do log — 02 §5 "leads mascarados em log".
    }),
  );

  // TODO:O6 — enviar para o CRM real (webhook/API) assim que o CRM de destino for escolhido.
  // Formato esperado: POST env.CRM_WEBHOOK_URL com lead + atribuição + tier + page_slug +
  // timestamp; criar negócio no estágio "Diagnóstico solicitado" (08 §1.3).
  const crmResult = { ok: true, stub: true as const };

  // TODO:O5 — e-mail transacional (Resend/Postmark) com o texto de sucesso de 01 §5.11 +
  // notificação interna. env.RESEND_API_KEY / env.LEAD_NOTIFICATION_EMAIL.
  const emailResult = { ok: true, stub: true as const };

  console.log(JSON.stringify({ event: 'lead_processed', tier, crmResult, emailResult }));

  return json({
    ok: true,
    tier,
    // Sucesso in-place no cliente (01 §5.11); nenhum dado sensível ecoado de volta.
  });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
