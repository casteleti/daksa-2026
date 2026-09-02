/**
 * Consent Mode v2 — fonte: 08-ANALYTICS-FORMS-PERF-A11Y-QA.md §1.1.
 * Default 'denied' para analytics_storage/ad_storage; GTM só carrega após consentimento
 * (ou requestIdleCallback se já consentido) — 08 §3.3.
 */

export type ConsentState = 'granted' | 'denied';

export interface ConsentSettings {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
}

export const CONSENT_STORAGE_KEY = 'daksa_consent'; // O1 resolvido (01 §8) — já é o nome certo
export const CONSENT_COOKIE_MAX_AGE_DAYS = 90; // 08 §1.3: cookie de 1ª parte, 90 dias

export const DEFAULT_CONSENT: ConsentSettings = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

/**
 * Gera o snippet inline de `gtag('consent', 'default', ...)` que precisa rodar
 * ANTES do GTM carregar (Base.astro injeta isto no <head>).
 */
export function consentDefaultScript(): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',${JSON.stringify(DEFAULT_CONSENT)});`;
}

export function readStoredConsent(): ConsentSettings | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentSettings) : null;
  } catch {
    return null;
  }
}

export function storeConsent(settings: ConsentSettings): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(settings));
}
