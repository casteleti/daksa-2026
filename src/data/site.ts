/**
 * Dados globais do site. Campos marcados TODO:O# dependem de decisões abertas
 * em 09-ROADMAP-RISCOS-DECISOES.md §3 — ver docs/inputs.md.
 */
export const site = {
  /** TODO:O1 — nome/arquitetura de marca ainda não definida. */
  name: '[MARCA]',
  legalName: '[MARCA]',
  tagline: 'Operação comercial. Resultado, não relatório.',
  /** TODO:O5 — domínio final. Placeholder inválido de propósito para não colar em produção. */
  url: 'https://example.invalid',
  /** TODO:O5 — e-mail de contato/envio (SPF/DKIM/DMARC, Resend ou Postmark). */
  email: '[email]',
  /** TODO:O7 — ano real de fundação (01 §1 cita "23 anos"; 04 usa "desde 2003" como exemplo a ajustar). */
  foundingYear: 2003,
  /** TODO:O9 — apenas LinkedIn em v1. URL real pendente. */
  social: {
    linkedin: 'https://www.linkedin.com/company/TODO-O9',
  },
  locale: 'pt-BR',
  themeColor: {
    light: '#f5f4f0',
    dark: '#14181d',
  },
} as const;
