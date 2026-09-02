import { site } from '../data/site';

/** Regras de metadata — fonte: 01 §6.3, 07 §2. */
export const SEO_LIMITS = {
  titleMax: 60,
  descriptionMin: 140,
  descriptionMax: 155,
} as const;

export interface PageSeo {
  title: string;
  description: string;
  /** Caminho absoluto começando por '/', com trailing slash (astro.config.mjs). */
  path: string;
  noindex?: boolean;
  ogImage?: string;
}

export function canonicalUrl(path: string): string {
  const base = site.url.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/**
 * Valida os limites de title/description em dev (astro check / testes unit) —
 * não bloqueia build sozinho; o script SEO pós-build (08 §5, "script SEO") é quem
 * bloqueia CI. Aqui é só um assist de autoria.
 */
export function validateSeo(seo: Pick<PageSeo, 'title' | 'description'>): string[] {
  const problems: string[] = [];
  if (seo.title.length === 0 || seo.title.length > SEO_LIMITS.titleMax) {
    problems.push(`title deve ter 1–${SEO_LIMITS.titleMax} caracteres (tem ${seo.title.length})`);
  }
  if (
    seo.description.length < SEO_LIMITS.descriptionMin ||
    seo.description.length > SEO_LIMITS.descriptionMax
  ) {
    problems.push(
      `description deve ter ${SEO_LIMITS.descriptionMin}–${SEO_LIMITS.descriptionMax} caracteres (tem ${seo.description.length})`,
    );
  }
  if (/!/.test(seo.title) || /!/.test(seo.description)) {
    problems.push('sem exclamação em title/description (01 §4)');
  }
  return problems;
}
