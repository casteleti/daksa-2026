import { site } from '../data/site';
import { canonicalUrl } from './seo';

/**
 * Builders de JSON-LD por template — fonte: 07-SEO-GEO-CONTEUDO-CMS.md §5.
 * Regra: nunca `Review`/`AggregateRating`/`Event`/`Product`; nunca `offers` com preço (D7).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLd = Record<string, any>;

export function organizationSchema(): JsonLd {
  return {
    '@type': 'ProfessionalService',
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    // TODO:O1 logo real (SVG) — fase 0/4.
    // foundingDate: TODO:O7 — ano real de fundação.
    foundingDate: String(site.foundingYear),
    areaServed: 'BR',
    sameAs: [site.social.linkedin].filter((url) => !url.includes('TODO')),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: site.locale,
  };
}

/** Envolve 1+ schemas no @graph padrão, com @context único. Usar em Base.astro. */
export function jsonLdGraph(...nodes: JsonLd[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': nodes,
  });
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}): JsonLd {
  return {
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: canonicalUrl(input.path),
    provider: { '@type': 'ProfessionalService', name: site.name, url: site.url },
    areaServed: 'BR',
    // Nunca preço (D7) — só disponibilidade.
    offers: { '@type': 'Offer', availability: 'https://schema.org/InStock' },
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function definedTermSchema(
  setName: string,
  terms: Array<{ name: string; description: string }>,
): JsonLd {
  return {
    '@type': 'DefinedTermSet',
    name: setName,
    hasDefinedTerm: terms.map((term) => ({
      '@type': 'DefinedTerm',
      name: term.name,
      description: term.description,
    })),
  };
}
