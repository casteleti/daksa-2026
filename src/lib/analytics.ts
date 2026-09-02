/**
 * Taxonomia de eventos — fonte: 08-ANALYTICS-FORMS-PERF-A11Y-QA.md §1.2.
 * snake_case; parâmetros padronizados: location, page_type, page_slug.
 * `trackEvent` é o único ponto de saída para GA4 — nenhum componente chama
 * `dataLayer.push` diretamente, para manter a taxonomia auditável num só lugar.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

export interface AnalyticsEvent {
  name: string;
  params?: EventParams;
}

/** Nomes de evento válidos — fonte: 08 §1.2. Mantido em sync manualmente com a tabela. */
export const EVENTS = {
  navClick: 'nav_click',
  ctaClick: 'cta_click',
  scrollDepth: 'scroll_depth',
  serviceCardClick: 'service_card_click',
  ladderStepClick: 'ladder_step_click',
  segmentClick: 'segment_click',
  agentTabChange: 'agent_tab_change',
  agentCardOpen: 'agent_card_open',
  diagramNodeOpen: 'diagram_node_open',
  metricDefinitionOpen: 'metric_definition_open',
  faqOpen: 'faq_open',
  techPageView: 'tech_page_view',
  insightView: 'insight_view',
  insightCardClick: 'insight_card_click',
  calculatorStart: 'calculator_start',
  calculatorComplete: 'calculator_complete',
  formView: 'form_view',
  formStart: 'form_start',
  formStep: 'form_step',
  formError: 'form_error',
  formSubmit: 'form_submit',
  leadQualified: 'lead_qualified',
  contactClick: 'contact_click',
  consentUpdate: 'consent_update',
  webVitals: 'web_vitals',
  error404: 'error_404',
} as const;

/**
 * Empurra um evento para o dataLayer (GTM). Não faz nada em SSR/build.
 * GTM só é carregado após consentimento (consent.ts) — eventos antes disso
 * ficam no dataLayer e são processados quando o container carregar.
 */
export function trackEvent(name: (typeof EVENTS)[keyof typeof EVENTS], params?: EventParams): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...params });
}
