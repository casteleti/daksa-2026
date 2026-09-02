import { z } from 'zod';

/**
 * Schemas Zod compartilhados entre cliente (DiagnosticForm/ContactForm) e Worker
 * (`/api/lead`, `/api/contact`) — fonte: 01 §5.11, 08 §2.
 * Mesmo schema nos dois lados: 02 §5 ("Validação com Zod no Worker, mesmos schemas do front").
 */

const CARGOS = [
  'Dono/CEO',
  'Diretor comercial',
  'Gerente comercial/vendas',
  'Marketing',
  'TI',
  'Outro',
] as const;

const SEGMENTOS = ['Indústria', 'Distribuidora/atacadista', 'Outro'] as const;

const TAMANHOS_TIME = ['até 5', '6–15', '16–40', '40+'] as const;

// Domínios de e-mail gratuitos comuns — 08 §2.1: "aviso se domínio gratuito, não bloqueia".
export const FREE_EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.com.br',
  'icloud.com',
  'live.com',
  'bol.com.br',
  'uol.com.br',
];

export function isFreeEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && FREE_EMAIL_DOMAINS.includes(domain);
}

/** Etapa 1 do formulário de Diagnóstico — 01 §5.11. */
export const diagnosticStep1Schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  company: z.string().trim().min(2).max(160),
  role: z.enum(CARGOS),
});

/** Etapa 2 — 01 §5.11. */
export const diagnosticStep2Schema = z.object({
  segment: z.enum(SEGMENTOS),
  teamSize: z.enum(TAMANHOS_TIME),
  crm: z.string().trim().max(80).optional().default(''),
  painPoint: z.string().trim().max(500).optional().default(''),
});

/** Payload completo enviado ao Worker — honeypot incluso (02 §5). */
export const diagnosticLeadSchema = diagnosticStep1Schema
  .extend(diagnosticStep2Schema.shape)
  .extend({
    // honeypot: deve chegar vazio; se preenchido, é bot.
    website: z.string().max(0).optional().default(''),
    // atribuição (08 §1.3) — todos opcionais, capturados de cookie de 1ª parte.
    utm_source: z.string().max(120).optional(),
    utm_medium: z.string().max(120).optional(),
    utm_campaign: z.string().max(120).optional(),
    utm_content: z.string().max(120).optional(),
    utm_term: z.string().max(120).optional(),
    first_source: z.string().max(120).optional(),
    first_medium: z.string().max(120).optional(),
    first_campaign: z.string().max(120).optional(),
    first_landing: z.string().max(300).optional(),
    referrer: z.string().max(300).optional(),
    gclid: z.string().max(200).optional(),
    fbclid: z.string().max(200).optional(),
    page_slug: z.string().max(200).optional(),
    turnstileToken: z.string().min(1, 'Turnstile ausente'),
  })
  .refine((data) => JSON.stringify(data).length <= 8192, {
    message: 'payload excede 8 KB (02 §5)',
  });

export type DiagnosticLead = z.infer<typeof diagnosticLeadSchema>;

/** Contato — 08 §2.2. */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  company: z.string().trim().max(160).optional().default(''),
  message: z.string().trim().min(1).max(1000),
  website: z.string().max(0).optional().default(''), // honeypot
  turnstileToken: z.string().min(1, 'Turnstile ausente'),
});

export type ContactLead = z.infer<typeof contactSchema>;

/**
 * Classificação de tier — fonte: 08 §2.1.
 * A = segmento válido ∧ time ≥ 6 ∧ cargo ∈ {dono, diretor}
 * B = segmento válido ∧ (time ≥ 6 ∨ cargo diretor)
 * C = demais
 */
export type LeadTier = 'A' | 'B' | 'C';

export function classifyLeadTier(input: {
  segment: (typeof SEGMENTOS)[number];
  teamSize: (typeof TAMANHOS_TIME)[number];
  role: (typeof CARGOS)[number];
}): LeadTier {
  const validSegment =
    input.segment === 'Indústria' || input.segment === 'Distribuidora/atacadista';
  const bigTeam =
    input.teamSize === '6–15' || input.teamSize === '16–40' || input.teamSize === '40+';
  const decisionRole = input.role === 'Dono/CEO' || input.role === 'Diretor comercial';

  if (!validSegment) return 'C';
  if (bigTeam && decisionRole) return 'A';
  if (bigTeam || decisionRole) return 'B';
  return 'C';
}
